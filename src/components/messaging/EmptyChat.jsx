export default function EmptyChat({
  title = "Select a conversation",
  description = "Choose a conversation to start messaging.",
}) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-transparent p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9f8] text-[#7658c9]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7658c9]" />
        </div>

        <h3 className="text-base font-semibold text-[#403747]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#9890a2]">
          {description}
        </p>
      </div>
    </div>
  );
}