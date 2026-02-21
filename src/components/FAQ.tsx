const faqs = [
  {
    q: "Do you know my name or identity?",
    a: "No. We never ask for your name. You're just an order number to us. The only info we need is an email (for tracking), your document, delivery address, and contact number (for the courier).",
  },
  {
    q: "What happens to my files after printing?",
    a: "All uploaded files are permanently deleted within 24 hours after your order is printed and delivered. We do not store, share, or backup your documents. Ever.",
  },
  {
    q: "What about my delivery address and number?",
    a: "Your address and contact number are shared with the Lalamove courier for delivery only. We do not save this information after your order is fulfilled.",
  },
  {
    q: "What file formats do you accept?",
    a: "We accept PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, and PNG. For best results, send your files as PDF.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We deliver across Metro Manila via Lalamove courier. Delivery fee starts at ₱60 within 10km from Rizal. Areas beyond 20km are charged based on the actual Lalamove rate.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders placed before 2:00 PM are eligible for same-day delivery. Typical delivery time is 1-3 hours depending on location and courier availability.",
  },
  {
    q: "What's the minimum order?",
    a: "Minimum order is ₱200 (excluding delivery fee).",
  },
  {
    q: "Can I request binding, lamination, or other extras?",
    a: "Yes! Just mention it in the Special Instructions field when you submit your order. We'll accommodate what we can and confirm via email.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-black text-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-[720px] mx-auto flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="border-brutal bg-gray-800 transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_var(--color-green-dark)]"
            >
              <summary className="px-6 py-5 font-bold cursor-pointer flex justify-between items-center">
                <span>{faq.q}</span>
                <span className="font-mono text-xl text-green shrink-0 ml-4">
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm text-gray-300 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
