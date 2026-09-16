import { formatConversationStamp } from "../../utils/messageHelpers";
import UnreadBadge from "./UnreadBadge";

export default function ConversationItem({
  conversation,
  active,
  onSelect,
  isModelView,
  unreadCount = 0,
  online,
}) {
  const peer = isModelView
    ? conversation.client
    : {
        name:
          conversation.model?.name ||
          "Model",
      };

  const lastMessage =
    conversation.lastMessage?.text ||
    (conversation.lastMessage?.messageType ===
    "image"
      ? "Photo"
      : conversation.lastMessage?.messageType ===
        "video"
      ? "Video"
      : "Start a conversation");

  const initials =
    peer?.name
      ?.split(" ")
      .slice(0, 2)
      .map((part) =>
        part[0]?.toUpperCase()
      )
      .join("") || "A";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 px-4 py-3 text-left transition ${
        active
          ? "bg-[#eee9f8]"
          : "hover:bg-[#f7f4fb]"
      }`}
    >
      {/* ACTIVE LINE */}
      {active && (
        <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#7658c9]" />
      )}

      {/* AVATAR */}
      <div className="relative shrink-0">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${
            active
              ? "bg-[#7658c9] text-white"
              : "bg-[#eee9f8] text-[#7658c9]"
          }`}
        >
          {initials}
        </div>

        {online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      {/* INFO */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-[13px] font-semibold ${
              active
                ? "text-[#4e3a78]"
                : "text-[#403747]"
            }`}
          >
            {peer?.name}
          </p>

          <span
            className={`shrink-0 text-[9px] ${
              unreadCount > 0
                ? "font-medium text-[#7658c9]"
                : "text-[#a39baa]"
            }`}
          >
            {conversation.lastMessageAt
              ? formatConversationStamp(
                  conversation.lastMessageAt
                )
              : ""}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={`truncate text-[11px] leading-5 ${
              unreadCount > 0
                ? "font-medium text-[#594b68]"
                : "text-[#9b93a2]"
            }`}
          >
            {lastMessage}
          </p>

          <UnreadBadge count={unreadCount} />
        </div>
      </div>
    </button>
  );
}