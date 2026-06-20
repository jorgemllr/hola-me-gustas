"use client";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center pt-safe mt-3 pb-2 px-6 z-10 relative">
      {/* Decorative line */}
      <div className="flex items-center gap-3 mb-1">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#F5C518]/40" />
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#8e8e93]">
          plan del sábado
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#F5C518]/40" />
      </div>

      {/* Main title */}
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #F5C518 50%, #d4a017 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(245, 197, 24, 0.35))",
        }}
      >
        hola, me gustas
      </h1>

      {/* Subtitle */}
      <p className="text-xs text-[#8e8e93] mt-1 tracking-wide">
        desliza para planear ✨
      </p>
    </header>
  );
}
