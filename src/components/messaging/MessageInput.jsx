import {
  Paperclip,
  SendHorizonal,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function MessageInput({
  onSend,
  onTyping,
  disabled,
  placeholder = "Type a message",
}) {
  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] =
    useState(null);
  const [previewUrl, setPreviewUrl] =
    useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert(
        "Please select an image or video."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    event.target.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    event = null
  ) => {
    event?.preventDefault();

    const trimmedText =
      value.trim();

    if (
      !trimmedText &&
      !selectedFile
    ) {
      return;
    }

    try {
      await onSend(
        trimmedText,
        selectedFile
      );

      setValue("");
      setSelectedFile(null);

      onTyping?.(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
      return;
    }

    onTyping?.(
      Boolean(event.target.value.trim())
    );
  };

  const handleChange = (event) => {
    const nextValue =
      event.target.value;

    setValue(nextValue);

    onTyping?.(
      Boolean(nextValue.trim())
    );
  };

  const isImage =
    selectedFile?.type?.startsWith(
      "image/"
    );

  return (
    <div className="bg-white px-3 py-3 sm:px-5">
      {/* PREVIEW */}
      {selectedFile && previewUrl && (
        <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3 rounded-2xl border border-[#e4dced] bg-[#faf8fd] p-2.5">
          {isImage ? (
            <img
              src={previewUrl}
              alt="Selected"
              className="h-16 w-16 rounded-xl object-cover"
            />
          ) : (
            <video
              src={previewUrl}
              className="h-16 w-16 rounded-xl object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#403747]">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#9b92a4]">
              {isImage ? "Image" : "Video"}
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#8e8498] transition hover:bg-[#eee9f8] hover:text-[#7658c9]"
            aria-label="Remove attachment"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* COMPOSER */}
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl bg-[#f3f0f8] p-1.5">

        {/* ATTACH */}
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#81778d] transition hover:bg-[#e9e3f2] hover:text-[#7658c9] disabled:opacity-40"
          aria-label="Attach image or video"
        >
          <Paperclip
            size={19}
            strokeWidth={1.8}
          />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* TEXT */}
        <textarea
          aria-label="Message input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#30283a] outline-none placeholder:text-[#9c94a5] disabled:cursor-not-allowed"
          placeholder={placeholder}
        />

        {/* SEND */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            disabled ||
            (!value.trim() &&
              !selectedFile)
          }
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7658c9] text-white shadow-[0_5px_15px_rgba(118,88,201,0.22)] transition hover:bg-[#694bb9] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizonal
            size={17}
            strokeWidth={1.9}
          />
        </button>
      </div>
    </div>
  );
}