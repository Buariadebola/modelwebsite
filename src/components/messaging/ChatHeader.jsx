import { ArrowLeft, LogOut } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function ChatHeader({
  online,
  onBack,
  modelImage,
  modelName,
  title,
  subtitle,
}) {
  const { logout } = useAuth();

  const displayName = modelName || title || "Model";

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between bg-white px-4 sm:px-6">

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#746a82] transition hover:bg-[#f1edfa] hover:text-[#7658c9]"
            aria-label="Go back"
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
          </button>
        )}

        {/* PROFILE */}
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#eee9fb] text-[#7658c9]">
            {modelImage ? (
              <img
                src={modelImage}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-[28px]" />
            )}
          </div>

          {online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>

        {/* NAME */}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#30283a]">
            {displayName}
          </p>

          <p className="mt-0.5 text-[10px] text-[#8f879b]">
            {subtitle || (online ? "online" : "offline")}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full bg-[#f3f0fa] px-3 py-1.5 sm:flex">
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-emerald-500" : "bg-[#b9b2c2]"
            }`}
          />

          <span className="text-[10px] font-medium text-[#746b80]">
            {online ? "Online" : "Offline"}
          </span>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#8b8295] transition hover:bg-[#f5effc] hover:text-[#7658c9]"
          aria-label="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}