import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyChat from "./EmptyChat";

export default function ChatWindow({
  messages = [],
  currentUserType,
  typingLabel,
  typingVisible,
  onEditMessage,
  onDeleteMessage,
}) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const element = endOfMessagesRef.current;

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, typingVisible]);

  if (!messages.length) {
    return (
      <div className="flex h-full flex-col justify-center bg-[#f7f4fc]">
        <EmptyChat
          title="Start a conversation"
          description="Send a message to begin your conversation."
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#f7f4fc] px-3 py-5 sm:px-6">

      {/* SOFT PURPLE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[380px] w-[380px] rounded-full bg-[#dcd3f4]/30 blur-[120px]" />

        <div className="absolute -right-40 bottom-10 h-[380px] w-[380px] rounded-full bg-[#e9e2fa]/50 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-2.5">
        {messages.map((message) => (
          <motion.div
            key={message._id}
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.16,
            }}
          >
            <MessageBubble
              message={message}
              isOwnMessage={
                message.senderType === currentUserType
              }
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          </motion.div>
        ))}

        {typingVisible && (
          <TypingIndicator label={typingLabel} />
        )}
      </div>

      <div ref={endOfMessagesRef} />
    </div>
  );
}