export function ChatList({ messages }: { messages: any[] }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div
      className="relative mx-auto max-w-2xl p-4 sm:px-8 md:px-16 lg:px-4"
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
