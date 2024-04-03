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

export function Chat() {
  const messages = [
    { id: 1, role: "assistant", content: "Hello! How can I help you today?" },
    { id: 2, role: "user", content: "I need help" },
  ];

  return (
    <Card className="shadow-md flex flex-col h-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Chat with our AI assistant to get help on your queries
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 pr-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 text-sm">
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
          ))}
        </div>
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
