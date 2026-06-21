import { useState } from "react";
import { Bell, Search, Sun, Droplets, CloudSun } from "lucide-react";
import { useWeatherContext } from "../../context/WeatherContext";

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { userWeather } = useWeatherContext();

  const temp =
    userWeather?.main.temp !== undefined
      ? `${Math.round(userWeather?.main.temp)}°`
      : " ---";
  const humidity =
    userWeather?.main?.humidity !== undefined
      ? `${Math.round(userWeather?.main.humidity)}%`
      : " ---";

  return (
    <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6 bg-white border-b border-[#E2E8F0] select-none">
      <div className="flex items-center gap-3">
        <div className="block md:hidden text-[#15803D] bg-[#15803D]/10 p-2 rounded-xl">
          <CloudSun className="h-6 w-6" />
        </div>

        {/* TEXTES DE L'APPLICATION (Masqués sur mobile, visibles sur PC) */}
        <div className="hidden md:flex flex-col min-w-[200px]">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-[#0F172A]">
              AgriClim Sénégal
            </h1>
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#B45309] text-white font-bold uppercase tracking-wider">
              En Direct
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium">
            Plateforme de Résilience Agricole
          </p>
        </div>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative w-full max-w-xs sm:max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Rechercher..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`h-10 w-full rounded-xl bg-[#F8FAFC] border pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none ${
              isSearchFocused
                ? "border-[#15803D] bg-white ring-4 ring-[#15803D]/5 shadow-sm"
                : "border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          />
        </div>
      </div>

      {/* ACTIONS DE DROITE */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* BLOC MÉTÉO (Masqué sur mobile, visible sur grand écran uniquement) */}
        <div className="hidden items-center gap-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-1.5 lg:flex">
          <div className="flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-[#D97706]" />
            <span className="text-sm font-bold text-[#0F172A]">{temp}</span>
          </div>
          <span className="h-4 w-px bg-[#E2E8F0]" />
          <div className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-[#0284C7]" />
            <span className="text-sm font-semibold text-[#64748B]">
              {humidity}
            </span>
          </div>
        </div>

        {/* CLOCHE DE NOTIFICATION */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]">
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#DC2626]" />
        </button>

        <span className="h-6 w-px bg-[#E2E8F0] hidden sm:block" />

        {/* DRAPEAU SÉNÉGAL */}
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-base">
          <span>🇸🇳</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
