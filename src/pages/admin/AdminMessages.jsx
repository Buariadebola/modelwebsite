import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, MenuIcon } from "lucide-react";

import ChatHeader from "../../components/messaging/ChatHeader";
import ChatWindow from "../../components/messaging/ChatWindow";
import ConversationList from "../../components/messaging/ConversationList";
import MessageInput from "../../components/messaging/MessageInput";

import { useAuth } from "../../context/AuthContext";
import { useMessaging } from "../../hooks/useMessaging";

export default function AdminMessages() {

  const [showSidebar, setShowSidebar] = useState(false);
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

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
    unreadCounts,
    socketConnected,
  } = useMessaging();

  useEffect(() => {
    if (
      user?.type === "model" &&
      conversations.length &&
      !activeConversationId
    ) {
      selectConversation(conversations[0]);
    }
  }, [
    conversations,
    activeConversationId,
    user?.type,
    selectConversation,
  ]);

  const handleSidebar = () => {
    setShowSidebar(!showSidebar)
  } 

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation._id ===
          activeConversationId
      ) ||
      conversations[0] ||
      null,
    [
      conversations,
      activeConversationId,
    ]
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4fc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#7658c9]" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#938a9e]">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    user?.type !== "model"
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  const selectedMessages =
    selectedConversation
      ? messagesByConversation[
          selectedConversation._id
        ] || []
      : [];

  const selectedTyping =
    selectedConversation
      ? typingUsers[
          selectedConversation._id
        ]
      : null;

  const selectedPeerKey =
    selectedConversation?.client?._id
      ? `client:${selectedConversation.client._id}`
      : null;

  const selectedPeerOnline =
    selectedPeerKey
      ? onlineUsers[
          selectedPeerKey
        ] ?? false
      : false;

  const handleSend = async (
    text,
    file
  ) => {
    if (!selectedConversation)
      return;

    await sendMessage(
      selectedConversation._id,
      text,
      file
    );
  };

  const handleTyping = (
    isActive
  ) => {
    if (!selectedConversation)
      return;

    if (isActive) {
      startTyping(
        selectedConversation._id
      );
    } else {
      stopTyping(
        selectedConversation._id
      );
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f7f4fc]">

      <section className="relative mx-auto flex h-full w-full overflow-hidden bg-white">
        <button onClick={handleSidebar} className="absolute hidden not-sm:block sm:hidden p-2 top-1 right-1 bg-purple-500/40 rounded-sm text-purple-600"><MenuIcon size={16} /></button>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-[320px] shrink-0 border-r border-[#e6e0ec] bg-white lg:flex lg:hidden lg:flex-col xl:w-[360px]">
          <ConversationList
            conversations={
              conversations
            }
            activeConversationId={
              activeConversationId
            }
            onSelect={
              selectConversation
            }
            unreadCounts={
              unreadCounts
            }
            onlineUsers={
              onlineUsers
            }
            isModelView
          />
        </aside>
        
        {/* MOBILE SIDEBAR */}
        {showSidebar && (
          <aside className="hidden absolute left-0 top-0 h-screen w-[320px] shrink-0 border-r border-[#e6e0ec] bg-white lg:flex lg:flex-col not-sm:block sm:hidden xl:w-[360px]">
            <ConversationList
              conversations={
                conversations
              }
              activeConversationId={
                activeConversationId
              }
              onSelect={
                selectConversation
              }
              unreadCounts={
                unreadCounts
              }
              onlineUsers={
                onlineUsers
              }
              isModelView
            />
          </aside>
        )}
        

        {/* CHAT */}
        <div
          className={`flex min-w-0 flex-1 flex-col bg-[#f7f4fc] ${
            selectedConversation
              ? "flex"
              : "hidden lg:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              {/* HEADER */}
              <div className="shrink-0 border-b border-[#e6e0ec] bg-white">
                <ChatHeader
                  title={
                    selectedConversation
                      .client?.name ||
                    "Client"
                  }
                  subtitle={
                    socketConnected
                      ? selectedPeerOnline
                        ? "online"
                        : "offline"
                      : "connecting..."
                  }
                  online={
                    selectedPeerOnline
                  }
                  onBack={() => {
                    if (
                      window.innerWidth <
                      1024
                    ) {
                      window.history.back();
                    }
                  }}
                />
              </div>

              {/* LOADING */}
              {loading ||
              loadingMessages ? (
                <div className="flex flex-1 items-center justify-center bg-[#f7f4fc]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-[#7658c9]" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9991a3]">
                      Loading conversation
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* MESSAGES */}
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <ChatWindow
                      messages={
                        selectedMessages
                      }
                      currentUserType="model"
                      typingVisible={Boolean(
                        selectedTyping
                      )}
                      typingLabel={`${
                        selectedConversation
                          .client?.name ||
                        "Client"
                      } is typing...`}
                      onEditMessage={
                        editMessage
                      }
                      onDeleteMessage={
                        deleteMessage
                      }
                    />
                  </div>

                  {/* COMPOSER */}
                  <div className="shrink-0 border-t border-[#e6e0ec] bg-white">
                    <MessageInput
                      onSend={handleSend}
                      onTyping={
                        handleTyping
                      }
                      disabled={
                        sending ||
                        !selectedConversation
                      }
                      placeholder="Type a message"
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#f7f4fc]">
              <div className="px-6 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9f8] text-[#7658c9]">
                  <span className="text-xl font-semibold">
                    A
                  </span>
                </div>

                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#a098a8]">
                  Private messages
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#302a34]">
                  Select a conversation
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#918995]">
                  Choose a client from
                  your inbox to view your
                  correspondence.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}