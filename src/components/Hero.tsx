export function Hero() {
  return (
    <header className="pt-36 pb-20 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg pointer-events-none" />
      <div className="max-w-[1140px] mx-auto px-6 relative">
        <div className="inline-block font-mono text-xs tracking-[3px] text-green border-2 border-green px-5 py-2 mb-8">
          NO ACCOUNTS. NO TRACKING. NO BS.
        </div>

        <h1 className="font-sans font-black text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] mb-6 uppercase tracking-tighter">
          Print Anonymous
          <br />
          <span className="text-green">Files Online</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-[540px] mb-10 leading-relaxed">
          Upload your document. We print it. Deliver it to your door.
          <br />
          <strong className="text-green">
            Your files are deleted after printing.
          </strong>
        </p>

        <div className="flex gap-4 flex-wrap mb-16">
          <a
            href="#order"
            className="inline-block font-mono text-base font-bold px-10 py-[18px] bg-green text-black border-brutal uppercase tracking-[1px] hover-brutal hover-brutal-green"
          >
            Send Your Files
          </a>
          <a
            href="#how"
            className="inline-block font-mono text-base font-bold px-10 py-[18px] bg-transparent text-white border-[3px] border-gray-600 uppercase tracking-[1px] hover-brutal hover:border-green hover:text-green"
          >
            How It Works
          </a>
        </div>

        <div className="flex gap-12 pt-10 border-t border-white/10 flex-wrap">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-green">
              24hr
            </span>
            <span className="text-xs text-gray-600 uppercase tracking-[1px] mt-1">
              File Deletion
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-green">0</span>
            <span className="text-xs text-gray-600 uppercase tracking-[1px] mt-1">
              Data Stored
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-green">
              Metro Manila
            </span>
            <span className="text-xs text-gray-600 uppercase tracking-[1px] mt-1">
              Delivery Area
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
