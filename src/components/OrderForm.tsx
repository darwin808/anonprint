"use client";

import {
  useState,
  useRef,
  useCallback,
  type FormEvent,
  type DragEvent,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { submitOrder } from "@/app/actions/submitOrder";

// -- Validation rules --
type FieldErrors = Record<string, string>;

const ACCEPTED_DOC_TYPES = [
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png",
];
const ACCEPTED_RECEIPT_TYPES = [".jpg", ".jpeg", ".png", ".pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PH_PHONE_REGEX = /^09\d{9}$/;

function validateField(name: string, value: string, file?: File | null): string {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email is required for tracking updates";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return "";
    case "document":
      if (!file) return "Please upload your document";
      if (file.size > MAX_FILE_SIZE) return "File too large — max 10MB";
      if (!ACCEPTED_DOC_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext)))
        return "Unsupported format — use PDF, DOC, PPT, JPG, or PNG";
      return "";
    case "print_type":
      if (!value) return "Select B&W or Color";
      return "";
    case "paper_size":
      if (!value) return "Select a paper size";
      return "";
    case "copies":
      if (!value || parseInt(value) < 1) return "At least 1 copy required";
      return "";
    case "address":
      if (!value.trim()) return "Delivery address is required";
      if (value.trim().length < 10) return "Please enter a complete address";
      return "";
    case "contact_number":
      if (!value.trim()) return "Contact number is required";
      if (!PH_PHONE_REGEX.test(value.replace(/\s/g, "")))
        return "Enter a valid PH number (09XX XXX XXXX)";
      return "";
    case "receipt":
      if (!file) return "Please upload your payment receipt";
      if (file.size > MAX_FILE_SIZE) return "File too large — max 10MB";
      if (!ACCEPTED_RECEIPT_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext)))
        return "Use JPG, PNG, or PDF only";
      return "";
    case "amount_paid":
      if (!value) return "Amount is required";
      if (parseInt(value) < 200) return "Minimum order is ₱200";
      return "";
    default:
      return "";
  }
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="error-msg mt-1.5 font-mono text-xs font-bold text-[#ef4444] flex items-center gap-1.5">
      <span className="inline-flex items-center justify-center w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold shrink-0">
        !
      </span>
      {msg}
    </p>
  );
}

function ValidMark() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-dark font-bold text-sm pointer-events-none">
      ✓
    </span>
  );
}

function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5 block">
      <span className="text-green-dark">🔒</span>
      {children}
    </small>
  );
}

export function OrderForm() {
  const [docName, setDocName] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [docDragOver, setDocDragOver] = useState(false);
  const [receiptDragOver, setReceiptDragOver] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const docFileRef = useRef<File | null>(null);
  const receiptFileRef = useRef<File | null>(null);

  const markTouched = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateSingle = useCallback(
    (name: string, value: string, file?: File | null) => {
      const error = validateField(name, value, file);
      setErrors((prev) => ({ ...prev, [name]: error }));
      return error;
    },
    []
  );

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    markTouched(name);
    validateSingle(name, value);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (touched[name]) {
      validateSingle(name, value);
    }
  }

  function handleDocChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    docFileRef.current = file;
    setDocName(file?.name || "");
    markTouched("document");
    validateSingle("document", "", file);
  }

  function handleReceiptChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    receiptFileRef.current = file;
    setReceiptName(file?.name || "");
    markTouched("receipt");
    validateSingle("receipt", "", file);
  }

  function validateAll(): boolean {
    const form = formRef.current;
    if (!form) return false;

    const fieldsToValidate: { name: string; value: string; file?: File | null }[] = [
      { name: "email", value: (form.elements.namedItem("email") as HTMLInputElement)?.value || "" },
      { name: "document", value: "", file: docFileRef.current },
      { name: "print_type", value: (form.elements.namedItem("print_type") as HTMLSelectElement)?.value || "" },
      { name: "paper_size", value: (form.elements.namedItem("paper_size") as HTMLSelectElement)?.value || "" },
      { name: "copies", value: (form.elements.namedItem("copies") as HTMLInputElement)?.value || "" },
      { name: "address", value: (form.elements.namedItem("address") as HTMLTextAreaElement)?.value || "" },
      { name: "contact_number", value: (form.elements.namedItem("contact_number") as HTMLInputElement)?.value || "" },
      { name: "receipt", value: "", file: receiptFileRef.current },
      { name: "amount_paid", value: (form.elements.namedItem("amount_paid") as HTMLInputElement)?.value || "" },
    ];

    const newErrors: FieldErrors = {};
    const newTouched: Record<string, boolean> = {};

    for (const field of fieldsToValidate) {
      newTouched[field.name] = true;
      const error = validateField(field.name, field.value, field.file);
      if (error) newErrors[field.name] = error;
    }

    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, ...newTouched }));

    if (Object.keys(newErrors).length > 0) {
      const shakes: Record<string, boolean> = {};
      for (const name of Object.keys(newErrors)) {
        shakes[name] = true;
      }
      setShakeFields(shakes);
      setTimeout(() => setShakeFields({}), 500);

      const firstErrorField = fieldsToValidate.find((f) => newErrors[f.name]);
      if (firstErrorField) {
        const el =
          form.elements.namedItem(firstErrorField.name) ||
          form.querySelector(`[name="${firstErrorField.name}"]`);
        if (el && "closest" in el) {
          const fieldset = (el as HTMLElement).closest("fieldset");
          fieldset?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      return false;
    }

    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitOrder(formData);

      if (result.success) {
        formRef.current?.reset();
        setDocName("");
        setReceiptName("");
        docFileRef.current = null;
        receiptFileRef.current = null;
        setErrors({});
        setTouched({});
        setOrderId(result.orderId || null);
        setSubmitted(true);
      } else {
        alert(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function fieldState(name: string) {
    if (!touched[name]) return "";
    if (errors[name]) return "field-error";
    return "field-valid";
  }

  function fieldShake(name: string) {
    return shakeFields[name] ? "shake" : "";
  }

  const inputBase =
    "font-mono text-sm p-3 border-brutal bg-white text-black outline-none w-full transition-all duration-150 focus:border-green-dark focus:shadow-brutal-sm";

  return (
    <section id="order" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          Submit Your Order
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Upload your file, pick your options, attach payment receipt. That&apos;s it.
        </p>
        <p className="text-sm text-gray-300 bg-black border-brutal px-4 py-3 mb-12 inline-block font-mono">
          🔒 We don&apos;t ask your name. You&apos;re anonymous to us.
        </p>

        <form
          ref={formRef}
          className="max-w-[720px] mx-auto"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* ===== Contact ===== */}
          <fieldset className="border-brutal p-8 mb-6 bg-white">
            <legend className="font-mono text-sm font-bold uppercase tracking-[2px] px-3 bg-green text-black border-2 border-black">
              Contact
            </legend>
            <div className={`${fieldState("email")} ${fieldShake("email")}`}>
              <label htmlFor="email" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className={inputBase}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.email && !errors.email && <ValidMark />}
              </div>
              <ErrorMsg msg={touched.email ? errors.email : undefined} />
              {!errors.email && (
                <PrivacyNote>Only used for tracking updates. Deleted after delivery.</PrivacyNote>
              )}
            </div>
          </fieldset>

          {/* ===== Document ===== */}
          <fieldset className="border-brutal p-8 mb-6 bg-white">
            <legend className="font-mono text-sm font-bold uppercase tracking-[2px] px-3 bg-green text-black border-2 border-black">
              Document
            </legend>
            <div className={`${fieldState("document")} ${fieldShake("document")}`}>
              <label className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Upload Your Document *
              </label>
              <div
                className={`file-drop-zone relative border-[3px] border-dashed p-10 text-center cursor-pointer transition-colors ${
                  docDragOver
                    ? "border-green bg-green/10"
                    : "border-black bg-gray-100 hover:bg-green/5 hover:border-green-dark"
                }`}
                onDragOver={(e) => {
                  handleDragOver(e);
                  setDocDragOver(true);
                }}
                onDragLeave={() => setDocDragOver(false)}
                onDrop={() => setDocDragOver(false)}
              >
                <input
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleDocChange}
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <span className="text-3xl">{docName && !errors.document ? "✅" : "📄"}</span>
                  {docName ? (
                    <span className="font-mono text-sm text-green-dark font-bold">
                      {docName}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        Drop your file here or{" "}
                        <strong className="text-green-dark">click to browse</strong>
                      </span>
                      <span className="font-mono text-xs text-gray-300 uppercase tracking-[1px]">
                        PDF, DOC, DOCX, PPT, JPG, PNG — Max 10MB
                      </span>
                    </>
                  )}
                </div>
              </div>
              <ErrorMsg msg={touched.document ? errors.document : undefined} />
              {!errors.document && (
                <PrivacyNote>Permanently deleted within 24hrs after printing.</PrivacyNote>
              )}
            </div>
          </fieldset>

          {/* ===== Print Details ===== */}
          <fieldset className="border-brutal p-8 mb-6 bg-white">
            <legend className="font-mono text-sm font-bold uppercase tracking-[2px] px-3 bg-green text-black border-2 border-black">
              Print Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div className={`${fieldState("print_type")} ${fieldShake("print_type")}`}>
                <label htmlFor="printType" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                  Print Type *
                </label>
                <select
                  id="printType"
                  name="print_type"
                  defaultValue=""
                  className={`${inputBase} pr-10`}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="bw">B&amp;W — ₱5/page</option>
                  <option value="color">Color — ₱12/page</option>
                </select>
                <ErrorMsg msg={touched.print_type ? errors.print_type : undefined} />
              </div>
              <div className={`${fieldState("paper_size")} ${fieldShake("paper_size")}`}>
                <label htmlFor="paperSize" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                  Paper Size *
                </label>
                <select
                  id="paperSize"
                  name="paper_size"
                  defaultValue=""
                  className={`${inputBase} pr-10`}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="short">Short (Letter)</option>
                  <option value="long">Long (Legal)</option>
                  <option value="a4">A4</option>
                </select>
                <ErrorMsg msg={touched.paper_size ? errors.paper_size : undefined} />
              </div>
              <div className={`${fieldState("copies")} ${fieldShake("copies")}`}>
                <label htmlFor="copies" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                  Copies *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="copies"
                    name="copies"
                    min={1}
                    defaultValue={1}
                    className={inputBase}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.copies && !errors.copies && <ValidMark />}
                </div>
                <ErrorMsg msg={touched.copies ? errors.copies : undefined} />
              </div>
            </div>

            <div>
              <label htmlFor="instructions" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows={3}
                placeholder="e.g., double-sided, print pages 1-10 only, landscape, binding needed, etc."
                className={`${inputBase} resize-y min-h-[80px]`}
              />
              <small className="text-xs text-gray-600 mt-1.5 block">
                Anything extra — just tell us here.
              </small>
            </div>
          </fieldset>

          {/* ===== Delivery ===== */}
          <fieldset className="border-brutal p-8 mb-6 bg-white">
            <legend className="font-mono text-sm font-bold uppercase tracking-[2px] px-3 bg-green text-black border-2 border-black">
              Delivery
            </legend>
            <div className={`mb-5 ${fieldState("address")} ${fieldShake("address")}`}>
              <label htmlFor="address" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Delivery Address *
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Complete address (street, barangay, city)"
                className={`${inputBase} resize-y`}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <ErrorMsg msg={touched.address ? errors.address : undefined} />
              {!errors.address && (
                <PrivacyNote>Shared with Lalamove courier only. Not stored.</PrivacyNote>
              )}
            </div>
            <div className={`${fieldState("contact_number")} ${fieldShake("contact_number")}`}>
              <label htmlFor="contactNum" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="contactNum"
                  name="contact_number"
                  placeholder="09XX XXX XXXX"
                  maxLength={11}
                  className={inputBase}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.contact_number && !errors.contact_number && <ValidMark />}
              </div>
              <ErrorMsg msg={touched.contact_number ? errors.contact_number : undefined} />
              {!errors.contact_number && (
                <PrivacyNote>For the courier only. Not stored after delivery.</PrivacyNote>
              )}
            </div>
          </fieldset>

          {/* ===== Payment Receipt ===== */}
          <fieldset className="border-brutal p-8 mb-6 bg-white">
            <legend className="font-mono text-sm font-bold uppercase tracking-[2px] px-3 bg-green text-black border-2 border-black">
              Payment
            </legend>
            <div className={`mb-5 ${fieldState("receipt")} ${fieldShake("receipt")}`}>
              <label className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Upload Payment Screenshot *
              </label>
              <div
                className={`file-drop-zone relative border-[3px] border-dashed p-10 text-center cursor-pointer transition-colors ${
                  receiptDragOver
                    ? "border-green bg-green/10"
                    : "border-black bg-gray-100 hover:bg-green/5 hover:border-green-dark"
                }`}
                onDragOver={(e) => {
                  handleDragOver(e);
                  setReceiptDragOver(true);
                }}
                onDragLeave={() => setReceiptDragOver(false)}
                onDrop={() => setReceiptDragOver(false)}
              >
                <input
                  type="file"
                  name="receipt"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleReceiptChange}
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <span className="text-3xl">{receiptName && !errors.receipt ? "✅" : "🧾"}</span>
                  {receiptName ? (
                    <span className="font-mono text-sm text-green-dark font-bold">
                      {receiptName}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        Drop your receipt here or{" "}
                        <strong className="text-green-dark">click to browse</strong>
                      </span>
                      <span className="font-mono text-xs text-gray-300 uppercase tracking-[1px]">
                        JPG, PNG, PDF — Max 10MB
                      </span>
                    </>
                  )}
                </div>
              </div>
              <ErrorMsg msg={touched.receipt ? errors.receipt : undefined} />
              <PrivacyNote>GCash/Maya handles your payment. We never see your payment details.</PrivacyNote>
            </div>
            <div className={`${fieldState("amount_paid")} ${fieldShake("amount_paid")}`}>
              <label htmlFor="amountPaid" className="block font-bold text-sm uppercase tracking-[1px] mb-2">
                Amount Paid (₱) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amountPaid"
                  name="amount_paid"
                  min={200}
                  placeholder="200"
                  className={inputBase}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.amount_paid && !errors.amount_paid && <ValidMark />}
              </div>
              <ErrorMsg msg={touched.amount_paid ? errors.amount_paid : undefined} />
            </div>
          </fieldset>

          {/* Disclaimer */}
          <div className="border-2 border-green-dark bg-green-dim px-6 py-5 mb-6">
            <p className="text-sm text-green leading-relaxed">
              🔒 <strong className="text-white">Your privacy is guaranteed.</strong>{" "}
              We don&apos;t ask your name. Files are permanently deleted within 24 hours.
              Your address and number are only shared with the courier and never stored.
            </p>
          </div>

          {/* Error summary */}
          {Object.keys(errors).filter((k) => touched[k] && errors[k]).length > 0 && (
            <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 px-6 py-4 mb-6 error-msg">
              <p className="font-mono text-sm font-bold text-[#ef4444] mb-2">
                Please fix the following:
              </p>
              <ul className="list-disc list-inside text-sm text-[#ef4444] space-y-1">
                {Object.entries(errors)
                  .filter(([k, v]) => touched[k] && v)
                  .map(([k, v]) => (
                    <li key={k}>{v}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full font-mono text-lg font-bold py-5 bg-green text-black border-brutal uppercase tracking-[1px] hover-brutal hover-brutal-green cursor-pointer ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Submitting..." : "Submit Order →"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999] p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSubmitted(false);
          }}
        >
          <div className="bg-black border-[3px] border-green p-12 max-w-[480px] w-full text-center shadow-[8px_8px_0_var(--color-green-dark)]">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="font-mono text-xl text-green mb-3 uppercase">
              Order Received
            </h3>
            {orderId && (
              <p className="font-mono text-sm text-yellow bg-black border-2 border-yellow/30 px-4 py-2 mb-4 inline-block">
                Order ID: {orderId}
              </p>
            )}
            <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-3">
              We&apos;ll verify your payment and start printing.
              Check your email for tracking updates.
            </p>
            <p className="text-xs text-gray-600 mb-6 font-mono">
              🔒 Your files will be deleted within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="font-mono bg-green text-black border-[3px] border-black px-8 py-3 font-bold text-sm cursor-pointer uppercase tracking-[1px] hover-brutal"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
