export default function UnreadBadge({
  count = 0,
}) {
  if (!count) return null;

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#7658c9] px-1.5 py-0.5 text-[9px] font-semibold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}