import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

function Chat() {
  const messages = [
    {
      id: 1,
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
    {
      id: 2,
      role: "user",
      content: "I need help",
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle> Chat</CardTitle>
        <CardDescription>
          Chat with our AI assistant to get help on your queries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full pr-4">
          {messages.map((message) => {
            return (
              <div key={message.id} className="flex gap-3 text-sm mb-4">
                {message.role === "user" && (
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                {message.role === "assistant" && (
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <p className="w-full text-primary">
                  <span className="block font-bold">
                    {message.role === "user" ? "User" : "Bot"}
                  </span>
                  {message.content}
                </p>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form className="w-full flex gap-2">
          <Input
            placeholder="Type your message here"
            // value={input}
            // onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default Chat;
