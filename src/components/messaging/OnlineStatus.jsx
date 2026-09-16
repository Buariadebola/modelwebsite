export default function OnlineStatus({
  online,
  label = "Online",
}) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-[#938a9e]">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          online
            ? "bg-emerald-500"
            : "bg-[#c3bdc9]"
        }`}
        aria-label={
          online ? "Online" : "Offline"
        }
      />

      <span>
        {online ? label : "Offline"}
      </span>
    </div>
  );
}