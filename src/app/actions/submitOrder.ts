"use server";

import { supabase } from "@/lib/supabase";

export type OrderResult = {
  success: boolean;
  error?: string;
  orderId?: string;
};

export async function submitOrder(formData: FormData): Promise<OrderResult> {
  try {
    const email = formData.get("email") as string;
    const printType = formData.get("print_type") as string;
    const paperSize = formData.get("paper_size") as string;
    const copies = parseInt(formData.get("copies") as string) || 1;
    const instructions = formData.get("instructions") as string;
    const address = formData.get("address") as string;
    const contactNumber = formData.get("contact_number") as string;
    const amountPaid = parseInt(formData.get("amount_paid") as string) || 0;
    const document = formData.get("document") as File | null;
    const receipt = formData.get("receipt") as File | null;

    // Validate required fields
    if (!email || !printType || !paperSize || !address || !contactNumber || !amountPaid) {
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

    // Send email notification (optional — via Resend)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const notifyEmail = process.env.NOTIFY_EMAIL || email;

        await resend.emails.send({
          from: "AnonPrint <onboarding@resend.dev>",
          to: notifyEmail,
          subject: `New Order: ${orderId}`,
          html: `
            <h2>New Order: ${orderId}</h2>
            <p><strong>Print:</strong> ${printType} | ${paperSize} | ${copies} copies</p>
            <p><strong>Amount:</strong> ₱${amountPaid}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Contact:</strong> ${contactNumber}</p>
            <p><strong>Instructions:</strong> ${instructions || "None"}</p>
            <p><strong>Document:</strong> <a href="${docUrlData.publicUrl}">${document.name}</a></p>
            <p><strong>Receipt:</strong> <a href="${receiptUrlData.publicUrl}">View</a></p>
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
