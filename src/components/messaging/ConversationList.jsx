import ConversationItem from "./ConversationItem";
import EmptyChat from "./EmptyChat";

export default function ConversationList({
  conversations = [],
  activeConversationId,
  onSelect,
  unreadCounts = {},
  onlineUsers = {},
  isModelView,
}) {
  if (!conversations.length) {
    return (
      <aside className="flex h-full flex-col bg-white">
        <div className="border-b border-[#e8e2ef] px-5 py-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#968da1]">
            Private inbox
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#30283a]">
            Messages
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <EmptyChat
            title="No conversations"
            description={
              isModelView
                ? "Client conversations will appear here."
                : "Your conversations will appear here."
            }
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col bg-white">
      {/* HEADER */}
      <div className="shrink-0 border-b border-[#e8e2ef] px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#968da1]">
              Private inbox
            </p>

            <h2 className="mt-1 text-xl font-semibold leading-none text-[#30283a]">
              {isModelView
                ? "Clients"
                : "Messages"}
            </h2>
          </div>

          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#eee9f8] px-2 text-[10px] font-semibold text-[#7658c9]">
            {conversations.length}
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.map(
          (conversation) => {
            const conversationId =
              conversation._id;

            const peerKey = isModelView
              ? `client:${
                  conversation.client?._id ||
                  conversation.client
                }`
              : "model:admin";

            const peerOnline =
              onlineUsers[peerKey] ?? false;

            return (
              <ConversationItem
                key={conversationId}
                conversation={conversation}
                active={
                  activeConversationId ===
                  conversationId
                }
                onSelect={() =>
                  onSelect(conversation)
                }
                unreadCount={
                  unreadCounts[
                    conversationId
                  ] || 0
                }
                online={peerOnline}
                isModelView={isModelView}
              />
            );
          }
        )}
      </div>
    </aside>
  );
}