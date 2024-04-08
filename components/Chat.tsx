"use client";
import { AI } from "@/app/action";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { UserMessage } from "@/components/message";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { useActions, useUIState } from "ai/rsc";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export function Chat() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <Card className="shadow-2xl flex flex-col h-full w-full items-center justify-center">
      <CardHeader className="flex w-full">
        <div className="flex justify-between items-start w-full">
          <CardTitle>Chat</CardTitle>
          <Button
            variant={"outline"}
            onClick={() => {
              setMessages([]);
            }}
          >
            Reset
          </Button>
        </div>
        <CardDescription>
          Chat with our AI assistant to get help on your queries
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[745px] w-full mb-2 mt-2 justify-center">
        {messages.length ? (
          <ChatList messages={messages} />
        ) : (
          <EmptyScreen
            submitMessage={async (message) => {
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{message}</UserMessage>,
                },
              ]);
              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          />
        )}
      </CardContent>
      <CardFooter className="flex w-full">
        <form
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            const value = inputValue.trim();
            setInputValue("");
            if (!value) return;
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: Date.now(),
                display: <UserMessage>{value}</UserMessage>,
              },
            ]);
            try {
              const responseMessage = await submitUserMessage(value);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            } catch (error) {
              console.error(error);
            }
          }}
          className="flex gap-2 w-full"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Send a message..."
            className="flex-1 min-h-[44px] resize-none rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            autoFocus={false}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputValue === ""}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
