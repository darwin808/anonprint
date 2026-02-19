const plans = [
  {
    name: "Black & White",
    price: "₱5",
    unit: "/page",
    features: [
      "A4 / Short / Long",
      "Standard 80gsm paper",
      "Single or double-sided",
      "Great for documents & reports",
    ],
  },
  {
    name: "Full Color",
    price: "₱12",
    unit: "/page",
    featured: true,
    features: [
      "A4 / Short / Long",
      "Vibrant color output",
      "Single or double-sided",
      "Great for presentations & flyers",
    ],
  },
  {
    name: "Photo Print",
    price: "₱20",
    unit: "/piece",
    features: [
      "4R / A4 sizes",
      "Glossy or matte finish",
      "High-resolution output",
      "Great for photos & artwork",
    ],
  },
];

const addons = [
  { name: "Spiral Binding", price: "₱40" },
  { name: "Lamination (A4)", price: "₱25" },
  { name: "Staple Binding", price: "₱10" },
  { name: "Folder", price: "₱15" },
];

const deliveryTiers = [
  { distance: "Within 10km", price: "₱60" },
  { distance: "10km — 20km", price: "₱100" },
  { distance: "20km+", price: "Based on Lalamove rate" },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          Pricing
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Transparent. No hidden fees. Minimum order ₱200.
        </p>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`border-brutal bg-white hover-brutal ${plan.featured ? "border-green hover-brutal-green" : ""}`}
            >
              {plan.featured && (
                <div className="bg-green text-black font-mono text-xs font-bold tracking-[2px] text-center py-1.5">
                  POPULAR
                </div>
              )}
              <div className="p-8 border-b-[3px] border-black">
                <h3 className="text-xl uppercase font-bold mb-2">
                  {plan.name}
                </h3>
                <div className="font-mono text-4xl font-bold">
                  {plan.price}
                  <span className="text-base text-gray-600">{plan.unit}</span>
                </div>
              </div>
              <ul className="p-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="py-2 text-sm text-gray-600 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-green-dark font-bold">✓ </span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Addons */}
        <div className="border-brutal p-8 bg-gray-100 mb-6">
          <h3 className="text-xl uppercase font-bold mb-5">Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {addons.map((a) => (
              <div
                key={a.name}
                className="flex justify-between items-center px-4 py-3 border-2 border-black bg-white"
              >
                <span className="font-semibold text-sm">{a.name}</span>
                <span className="font-mono font-bold text-green-dark">
                  {a.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="border-brutal p-8 bg-black text-white">
          <h3 className="text-xl uppercase font-bold mb-5">
            🚚 Delivery Fee
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {deliveryTiers.map((t) => (
              <div
                key={t.distance}
                className="border-2 border-green/30 p-5 text-center"
              >
                <span className="block text-sm text-gray-300 font-mono mb-2">
                  {t.distance}
                </span>
                <span className="block font-mono text-2xl font-bold text-green">
                  {t.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-300">
            Delivery via Lalamove motorcycle courier. Same-day delivery for
            orders before 2:00 PM.
          </p>
        </div>
      </div>
    </section>
  );
}
