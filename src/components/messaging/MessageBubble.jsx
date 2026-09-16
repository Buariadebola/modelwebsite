import { useState } from "react";
import { formatClockTime } from "../../utils/messageHelpers";

export default function MessageBubble({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");
  const [saving, setSaving] = useState(false);

  const isImage = message.messageType === "image";
  const isVideo = message.messageType === "video";

  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();

    if (!trimmedText) return;

    try {
      setSaving(true);

      await onEdit(
        message._id || message.id,
        trimmedText
      );

      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this message?"
    );

    if (!confirmed) return;

    try {
      await onDelete(
        message._id || message.id
      );

      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div
      className={`group flex w-full ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          relative
          max-w-[82%]
          overflow-visible
          shadow-sm
          sm:max-w-[70%]
          ${
            isOwnMessage
              ? "rounded-2xl rounded-br-md bg-[#7658c9] text-white"
              : "rounded-2xl rounded-bl-md border border-[#e8e2ef] bg-white text-[#352d3e]"
          }
        `}
      >
        {/* DELETED */}
        {message.deleted ? (
          <div className="px-4 py-3">
            <p
              className={`text-[13px] italic ${
                isOwnMessage
                  ? "text-white/65"
                  : "text-[#9c94a5]"
              }`}
            >
              This message was deleted
            </p>
          </div>
        ) : (
          <>
            {/* MENU */}
            {isOwnMessage && (
              <div className="absolute right-1.5 top-1.5 z-30">
                <button
                  type="button"
                  onClick={() =>
                    setShowMenu((current) => !current)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-white/75 transition hover:bg-black/20 hover:text-white"
                  aria-label="Message options"
                >
                  <span className="text-[16px] leading-none">
                    ⋮
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 z-50 w-28 overflow-hidden rounded-xl border border-[#e5deec] bg-white shadow-xl">
                    {message.messageType === "text" && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditText(message.text || "");
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="block w-full px-3 py-2.5 text-left text-xs text-[#51485c] transition hover:bg-[#f5f1fa]"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="block w-full px-3 py-2.5 text-left text-xs text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MEDIA */}
            {(isImage || isVideo) &&
              message.mediaUrl && (
                <div className="overflow-hidden rounded-t-2xl">
                  {isImage ? (
                    <img
                      src={message.mediaUrl}
                      alt="Shared media"
                      className="block max-h-[420px] w-full max-w-[420px] cursor-pointer object-cover"
                      onClick={() =>
                        window.open(
                          message.mediaUrl,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    />
                  ) : (
                    <video
                      src={message.mediaUrl}
                      controls
                      playsInline
                      className="block max-h-[420px] w-full max-w-[480px]"
                    />
                  )}
                </div>
              )}

            {/* EDIT */}
            {isEditing ? (
              <div className="min-w-[220px] p-3">
                <textarea
                  value={editText}
                  onChange={(event) =>
                    setEditText(event.target.value)
                  }
                  autoFocus
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#ddd4e8] bg-[#faf8fd] px-3 py-2 text-sm text-[#30283a] outline-none focus:border-[#7658c9]"
                />

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(message.text || "");
                    }}
                    disabled={saving}
                    className="px-3 py-1.5 text-xs text-[#81788c] hover:text-[#30283a]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={
                      saving || !editText.trim()
                    }
                    className="rounded-lg bg-[#7658c9] px-3 py-1.5 text-xs text-white transition hover:bg-[#684bb7] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              message.text && (
                <p
                  className={`
                    whitespace-pre-wrap
                    break-words
                    px-3.5
                    pb-1
                    pt-2.5
                    text-[14px]
                    leading-[1.45]
                    ${
                      isOwnMessage
                        ? "pr-9"
                        : "pr-3.5"
                    }
                  `}
                >
                  {message.text}
                </p>
              )
            )}

            {/* TIME */}
            <div
              className={`
                flex
                items-center
                justify-end
                gap-1
                px-3.5
                pb-2
                pt-0.5
                text-[9px]
                ${
                  isOwnMessage
                    ? "text-white/65"
                    : "text-[#a098a7]"
                }
              `}
            >
              {message.edited && (
                <span>Edited</span>
              )}

              <span>
                {formatClockTime(message.createdAt)}
              </span>

              {isOwnMessage && (
                <span
                  aria-label={
                    message.read
                      ? "Message read"
                      : "Message sent"
                  }
                  className={
                    message.read
                      ? "text-[#d9d0ff]"
                      : "text-white/60"
                  }
                >
                  {message.read ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}