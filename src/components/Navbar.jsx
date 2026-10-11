import React, { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Work", href: "#work" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/10 bg-white/80 px-5 py-3 backdrop-blur-xl">

        {/* Logo */}
        <a
          href="#home"
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition-transform duration-300 group-hover:rotate-12">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight">
              Manikandan
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/45">
              Frontend Developer
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-sm text-black/60 transition-colors duration-300 hover:text-black"
            >
              {link.name}

              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 scale-0 rounded-full bg-black transition-transform duration-300 group-hover:scale-100" />
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-4 md:flex">

          {/* Availability */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>

            <span className="text-xs text-black/55">
              Available for work
            </span>
          </div>

          {/* Resume */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-black/80"
          >
            Resume

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-black/10 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          isOpen
            ? "max-h-[500px] p-5 opacity-100"
            : "max-h-0 border-transparent p-0 opacity-0"
        }`}
      >
        <div className="flex flex-col">

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-black/5 py-4 text-lg font-medium transition-colors hover:text-black/50"
            >
              {link.name}
            </a>
          ))}

          <div className="mt-5 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-black/50">
                Available for work
              </span>
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              Resume
              <ArrowUpRight size={15} />
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}
