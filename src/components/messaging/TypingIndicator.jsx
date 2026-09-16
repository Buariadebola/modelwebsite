import { motion } from "framer-motion";

export default function TypingIndicator({
  label = "Typing...",
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#e6e0ec] bg-white px-3.5 py-2.5 shadow-sm">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-[#7658c9]"
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: dot * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <span className="text-[9px] text-[#9991a3]">
        {label}
      </span>
    </div>
  );
}