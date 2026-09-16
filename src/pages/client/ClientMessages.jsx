import { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import ChatHeader from "../../components/messaging/ChatHeader";
import ChatWindow from "../../components/messaging/ChatWindow";
import MessageInput from "../../components/messaging/MessageInput";

import { useAuth } from "../../context/AuthContext";
import { useMessaging } from "../../hooks/useMessaging";

export default function ClientMessages() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const {
    conversations,
    activeConversationId,
    messagesByConversation,
    loading,
    loadingMessages,
    sending,
    sendMessage,
    editMessage,
    deleteMessage,
    selectConversation,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers,
  } = useMessaging();

  const currentConversation = useMemo(() => {
    return conversations[0] || null;
  }, [conversations]);

  useEffect(() => {
    if (
      user?.type === "client" &&
      currentConversation &&
      activeConversationId !== currentConversation._id
    ) {
      selectConversation(currentConversation);
    }
  }, [
    currentConversation,
    activeConversationId,
    user?.type,
    selectConversation,
  ]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4fc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#7658c9]" />

          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#817693]">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.type !== "client") {
    return <Navigate to="/login" replace />;
  }

  const conversationMessages = activeConversationId
    ? messagesByConversation[activeConversationId] || []
    : [];

  const conversationTyping = activeConversationId
    ? typingUsers[activeConversationId]
    : null;

  const modelOnline = onlineUsers["model:admin"] ?? false;

  const handleSend = async (text, file) => {
    if (!activeConversationId) return;

    await sendMessage(activeConversationId, text, file);
  };

  const handleTyping = (isActive) => {
    if (!activeConversationId) return;

    if (isActive) {
      startTyping(activeConversationId);
    } else {
      stopTyping(activeConversationId);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f7f4fc]">
      <section className="flex h-full w-full flex-col overflow-hidden bg-[#f7f4fc]">

        {/* HEADER */}
        <div className="shrink-0 border-b border-[#e7e1f0] bg-white">
          <ChatHeader
            modelName={currentConversation?.model?.name || "Model"}
            modelImage={currentConversation?.model?.profileImage || null}
            online={modelOnline}
            onBack={() => window.history.back()}
          />
        </div>

        {/* LOADING */}
        {loading || loadingMessages ? (
          <div className="flex flex-1 items-center justify-center bg-[#f7f4fc]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#7658c9]" />

              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#948ba3]">
                Loading conversation
              </p>
            </div>
          </div>
        ) : activeConversationId ? (
          <>
            {/* CHAT */}
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f7f4fc]">
              <ChatWindow
                messages={conversationMessages}
                currentUserType="client"
                typingVisible={Boolean(conversationTyping)}
                typingLabel={`${
                  currentConversation?.model?.name || "Model"
                } is typing...`}
                onEditMessage={editMessage}
                onDeleteMessage={deleteMessage}
              />
            </div>

            {/* INPUT */}
            <div className="shrink-0 border-t border-[#e7e1f0] bg-white">
              <MessageInput
                onSend={handleSend}
                onTyping={handleTyping}
                disabled={sending || !activeConversationId}
                placeholder="Type a message"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#f7f4fc]">
            <div className="px-6 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9fb] text-[#7658c9]">
                <span className="text-xl font-semibold">A</span>
              </div>

              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#a098aa]">
                Private messages
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#30283a]">
                Your conversation
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#91899d]">
                Your private conversation with the model will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}