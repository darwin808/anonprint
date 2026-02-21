const items = [
  "No name required",
  "No account needed",
  "Files deleted after printing",
  "Zero data stored",
];

export function TrustBar() {
  return (
    <section className="bg-green border-y-[3px] border-black py-4" aria-label="Trust signals">
      <div className="max-w-[1140px] mx-auto px-6 flex justify-center gap-10 flex-wrap">
        {items.map((item) => (
          <span
            key={item}
            className="font-mono text-sm font-bold text-black uppercase tracking-[1px] whitespace-nowrap"
          >
            ✦ {item}
          </span>
        ))}
      </div>
    </section>
  );
}
