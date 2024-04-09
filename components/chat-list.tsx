export function ChatList({ messages }: { messages: any[] }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div
      className="relative mx-auto max-w-2xl p-4 sm:px-4 md:px-4 lg:px-10"
      id="chat"
    >
      {messages.map((message, index) => (
        <div key={index} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
}
