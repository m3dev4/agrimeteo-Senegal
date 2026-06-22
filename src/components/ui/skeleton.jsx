const WeatherSkeleton = () => {
  return (
    <div
      className="
      h-full w-80
      bg-[#1D2430]/70
      backdrop-blur-xl
      text-white
      border border-white/10
      rounded-l-3xl
      shadow-2xl
      p-5
      animate-pulse
      "
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-full" />

        <div className="space-y-2">
          <div className="h-5 w-32 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      </div>

      <div className="h-px bg-white/10 my-5" />

      <div className="bg-white/5 rounded-3xl p-5 h-32">
        <div className="h-12 w-28 bg-white/10 rounded" />
        <div className="mt-3 h-4 w-20 bg-white/10 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="h-28 bg-white/5 rounded-2xl" />
        <div className="h-28 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
};

export default WeatherSkeleton;