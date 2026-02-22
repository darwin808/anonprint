"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import { ratelimit } from "@/lib/ratelimit";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export type OrderResult = {
  success: boolean;
  error?: string;
  orderId?: string;
};

export async function submitOrder(formData: FormData): Promise<OrderResult> {
  try {
    // --- Honeypot check ---
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      // Return fake success to avoid tipping off bots
      return { success: true, orderId: `AP-${Date.now().toString(36).toUpperCase()}` };
    }

    // --- Rate limit check ---
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    const { success: allowed } = await ratelimit.limit(ip);
    if (!allowed) {
      return { success: false, error: "Too many submissions. Please wait a few minutes." };
    }

    // --- reCAPTCHA check ---
    const recaptchaToken = formData.get("g-recaptcha-response") as string;
    if (!recaptchaToken || !(await verifyRecaptchaToken(recaptchaToken))) {
      return { success: false, error: "Please complete the verification." };
    }

    const email = formData.get("email") as string;
    const printType = formData.get("print_type") as string;
    const paperSize = formData.get("paper_size") as string;
    const copies = parseInt(formData.get("copies") as string) || 1;
    const pages = parseInt(formData.get("pages") as string) || 1;
    const deliveryArea = formData.get("delivery_area") as string;
    const instructions = formData.get("instructions") as string;
    const address = formData.get("address") as string;
    const contactNumber = formData.get("contact_number") as string;
    const amountPaid = parseInt(formData.get("amount_paid") as string) || 0;
    const document = formData.get("document") as File | null;
    const receipt = formData.get("receipt") as File | null;

    // Validate required fields
    if (!email || !printType || !paperSize || !address || !contactNumber || !amountPaid || !deliveryArea || pages < 1) {
      return { success: false, error: "Missing required fields" };
    }

    if (amountPaid < 200) {
      return { success: false, error: "Minimum order is ₱200" };
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (!document || document.size === 0) {
      return { success: false, error: "Document is required" };
    }

    if (document.size > MAX_FILE_SIZE) {
      return { success: false, error: "Document too large — max 10MB" };
    }

    if (!receipt || receipt.size === 0) {
      return { success: false, error: "Payment receipt is required" };
    }

    if (receipt.size > MAX_FILE_SIZE) {
      return { success: false, error: "Receipt too large — max 10MB" };
    }

    // Generate unique order ID
    const orderId = `AP-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Upload document to Supabase Storage
    const docExt = document.name.split(".").pop() || "pdf";
    const docPath = `documents/${orderId}/${timestamp}.${docExt}`;
    const docBuffer = Buffer.from(await document.arrayBuffer());

    const { error: docError } = await supabase.storage
      .from("orders")
      .upload(docPath, docBuffer, {
        contentType: document.type,
        upsert: false,
      });

    if (docError) {
      console.error("Document upload error:", docError);
      return { success: false, error: "Failed to upload document. Please try again." };
    }

    // Upload receipt to Supabase Storage
    const receiptExt = receipt.name.split(".").pop() || "jpg";
    const receiptPath = `receipts/${orderId}/${timestamp}.${receiptExt}`;
    const receiptBuffer = Buffer.from(await receipt.arrayBuffer());

    const { error: receiptError } = await supabase.storage
      .from("orders")
      .upload(receiptPath, receiptBuffer, {
        contentType: receipt.type,
        upsert: false,
      });

    if (receiptError) {
      console.error("Receipt upload error:", receiptError);
      return { success: false, error: "Failed to upload receipt. Please try again." };
    }

    // Get public URLs
    const { data: docUrlData } = supabase.storage
      .from("orders")
      .getPublicUrl(docPath);

    const { data: receiptUrlData } = supabase.storage
      .from("orders")
      .getPublicUrl(receiptPath);

    // Save order to database
    const { error: dbError } = await supabase.from("orders").insert({
      order_id: orderId,
      email,
      print_type: printType,
      paper_size: paperSize,
      copies,
      pages,
      delivery_area: deliveryArea,
      instructions: instructions || null,
      address,
      contact_number: contactNumber,
      document_url: docUrlData.publicUrl,
      document_name: document.name,
      receipt_url: receiptUrlData.publicUrl,
      amount_paid: amountPaid,
      status: "pending",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return { success: false, error: "Failed to save order. Please try again." };
    }

    // Send emails via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const notifyEmail = process.env.NOTIFY_EMAIL || email;

        // 1. Notify you (the owner) — includes customer email so you can reply
        await resend.emails.send({
          from: "AnonPrint <onboarding@resend.dev>",
          to: notifyEmail,
          replyTo: email,
          subject: `🖨️ New Order: ${orderId}`,
          html: `
            <div style="font-family:monospace;max-width:600px;">
              <h2 style="color:#00cc33;">New Order: ${orderId}</h2>
              <hr/>
              <p><strong>Customer Email:</strong> ${email}</p>
              <p><strong>Print:</strong> ${printType === "bw" ? "Black & White" : "Full Color"} | ${paperSize.toUpperCase()} | ${pages} pages | ${copies} copies</p>
              <p><strong>Amount Paid:</strong> ₱${amountPaid}</p>
              <p><strong>Delivery Area:</strong> ${deliveryArea}</p>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Contact:</strong> ${contactNumber}</p>
              <p><strong>Instructions:</strong> ${instructions || "None"}</p>
              <hr/>
              <p><strong>Document:</strong> <a href="${docUrlData.publicUrl}">${document.name}</a></p>
              <p><strong>Receipt:</strong> <a href="${receiptUrlData.publicUrl}">View Receipt</a></p>
              <hr/>
              <p style="color:#888;font-size:12px;">Reply to this email to contact the customer directly.</p>
            </div>
          `,
        });

        // 2. Confirmation to customer
        await resend.emails.send({
          from: "AnonPrint <onboarding@resend.dev>",
          to: email,
          replyTo: notifyEmail,
          subject: `Order Confirmed: ${orderId}`,
          html: `
            <div style="font-family:monospace;max-width:600px;color:#fafaf9;background:#0a0a0a;padding:32px;">
              <h2 style="color:#00ff41;margin:0 0 8px;">Order Confirmed</h2>
              <p style="color:#00ff41;font-size:18px;font-weight:bold;margin:0 0 24px;">${orderId}</p>

              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Print Type</td><td style="padding:8px 0;color:#fafaf9;border-bottom:1px solid #333;text-align:right;">${printType === "bw" ? "Black & White" : "Full Color"}</td></tr>
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Paper Size</td><td style="padding:8px 0;color:#fafaf9;border-bottom:1px solid #333;text-align:right;">${paperSize.toUpperCase()}</td></tr>
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Pages</td><td style="padding:8px 0;color:#fafaf9;border-bottom:1px solid #333;text-align:right;">${pages}</td></tr>
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Copies</td><td style="padding:8px 0;color:#fafaf9;border-bottom:1px solid #333;text-align:right;">${copies}</td></tr>
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Delivery Area</td><td style="padding:8px 0;color:#fafaf9;border-bottom:1px solid #333;text-align:right;">${deliveryArea}</td></tr>
                <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #333;">Amount Paid</td><td style="padding:8px 0;color:#00ff41;border-bottom:1px solid #333;text-align:right;font-weight:bold;">₱${amountPaid}</td></tr>
              </table>

              <p style="color:#c4c4be;font-size:14px;line-height:1.6;">
                We&apos;re verifying your payment and will start printing shortly.
                You&apos;ll receive your Lalamove tracking link via email once your order is dispatched.
              </p>

              <div style="margin-top:24px;padding:16px;border:1px solid #00cc33;background:#0a3d1a;">
                <p style="color:#00ff41;font-size:12px;margin:0;">
                  🔒 Your files will be permanently deleted within 24 hours after delivery. We don&apos;t store your data.
                </p>
              </div>

              <p style="color:#555;font-size:11px;margin-top:24px;">
                Reply to this email if you have questions about your order.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        // Don't fail the order if email fails
        console.error("Email notification error:", emailError);
      }
    }

    return { success: true, orderId };
  } catch (err) {
    console.error("Order submission error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
