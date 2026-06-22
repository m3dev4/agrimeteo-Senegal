const SunCard = ({ image, time, label, icon: Icon }) => (
  <div
    className="
    relative
    h-24
    rounded-2xl
    overflow-hidden
    border border-white/10
"
  >
    <img
      src={image}
      alt=""
      className="
        absolute
        w-full
        h-full
        object-cover
        opacity-30
"
    />

    <div
      className="
        absolute
        inset-0
        bg-black/40
    "
    />

    <div
      className="
        relative
        z-10
        h-full
        flex
        flex-col
        justify-center
        items-center
    "
    >
      <Icon size={18} />

      <p className="font-bold mt-1">{time}</p>

      <span className="text-xs text-white/60">{label}</span>
    </div>
  </div>
);

export default SunCard;
