import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "What is the total subscriptions? show as number card",
    message: "What is the total subscriptions? show as number card",
  },
  {
    heading: "Give me number of subscriptions over time? using line chart",
    message: "Give me number of subscriptions over time? using line chart",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="px-4 py-6">
      <div className="rounded-lg border bg-background p-6">
        <h1 className="mb-2 text-lg font-semibold">Chat based store</h1>
        <p className="mb-4 text-muted-foreground">
          This is a demo of a chat based store. You can ask questions or try
          purchasing a product.
        </p>
        <p className="mb-4 text-muted-foreground">Try an example:</p>
        <div className="space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
