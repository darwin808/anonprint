import Image from "next/image";

export function Payment() {
  return (
    <section id="payment" className="py-20 bg-black text-white">
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Info */}
        <div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-4">
            Pay via GCash / Maya
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Scan the QR code with your GCash or Maya app. Take a
            screenshot of your receipt — you&apos;ll upload it with your order.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Scan QR with GCash or Maya",
              "Screenshot your payment receipt",
              "Upload it with your order below",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-9 h-9 bg-green text-black font-mono font-bold text-sm shrink-0 border-2 border-black">
                  {i + 1}
                </span>
                <span className="text-[0.95rem] text-gray-200">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR */}
        <div className="flex justify-center">
          <div className="text-center">
            <div className="border-[3px] border-green p-3 mx-auto mb-4 bg-white inline-block">
              <Image
                src="/qr.jpg"
                alt="Payment QR Code — Scan with GCash or Maya"
                width={240}
                height={240}
                className="block"
              />
            </div>
            <p className="text-xs text-gray-300 uppercase tracking-[2px] font-mono">
              GCash / Maya via InstaPay
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
