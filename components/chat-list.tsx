export function ChatList({ messages }: { messages: any[] }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6" id="chat">
      {messages.map((message, index) => (
        <div key={index} className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 mr-3"></div>
          <div className="flex-1 mr-3">{message.display}</div>
        </div>
      ))}
    </div>
  );
}
