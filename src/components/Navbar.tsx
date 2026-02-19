"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b-[3px] border-black">
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between h-16">
        <a
          href="#"
          className="font-mono font-bold text-green tracking-[2px] flex items-center gap-1"
        >
          <span className="text-lg">[■]</span> ANONPRINT
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li>
            <a
              href="#how"
              className="font-mono text-sm text-gray-300 tracking-[1px] uppercase hover:text-green transition-colors"
            >
              How It Works
            </a>
          </li>
          <li>
            <a
              href="#pricing"
              className="font-mono text-sm text-gray-300 tracking-[1px] uppercase hover:text-green transition-colors"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#order"
              className="font-mono text-sm font-bold bg-green text-black px-5 py-2 border-2 border-black hover-brutal uppercase tracking-[1px]"
            >
              Order Now
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`block w-7 h-[3px] bg-green transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-7 h-[3px] bg-green transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-7 h-[3px] bg-green transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-b-[3px] border-black px-6 pb-6 flex flex-col gap-5">
          <a
            href="#how"
            onClick={() => setOpen(false)}
            className="font-mono text-sm text-gray-300 tracking-[1px] uppercase hover:text-green"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="font-mono text-sm text-gray-300 tracking-[1px] uppercase hover:text-green"
          >
            Pricing
          </a>
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className="font-mono text-sm font-bold bg-green text-black px-5 py-2 border-2 border-black text-center uppercase tracking-[1px]"
          >
            Order Now
          </a>
        </div>
      )}
    </nav>
  );
}
