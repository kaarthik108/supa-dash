import { ToolDefinition } from "@/lib/tool-definition";
import { OpenAIStream } from "ai";
import { clsx, type ClassValue } from "clsx";
import type OpenAI from "openai";
import { twMerge } from "tailwind-merge";
import zodToJsonSchema from "zod-to-json-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

export function groupByField(
  data: any[],
  groupField: string,
  valueField: string
): { month: string; value: number | null }[] {
  const groupedData: { [key: string]: number } = {};

  data.forEach((item) => {
    const groupValue = item[groupField];
    const value = item[valueField];

    if (groupValue && typeof value === "number") {
      const formattedGroupValue = formatDate(groupValue.toString());
      if (formattedGroupValue !== "Invalid Date") {
        if (groupedData[formattedGroupValue]) {
          groupedData[formattedGroupValue] += value;
        } else {
          groupedData[formattedGroupValue] = value;
        }
      }
    }
  });

  const result = Object.entries(groupedData).map(([month, value]) => ({
    month,
    value: value || null,
  }));

  result.sort((a, b) => {
    const monthA = new Date(a.month);
    const monthB = new Date(b.month);
    return monthA.getTime() - monthB.getTime();
  });

  return result;
}

function formatDate(dateString: string) {
  const dateParts = dateString.split(".");
  if (dateParts.length !== 3) {
    return "Invalid Date";
  }

  const [day, month, year] = dateParts;
  const formattedDate = new Date(`${month}.${day}.${year}`);

  if (isNaN(formattedDate.getTime())) {
    return "Invalid Date";
  }

  const formattedMonth = formattedDate.toLocaleString("default", {
    month: "short",
  });
  const formattedYear = formattedDate.getFullYear().toString().slice(-2);
  return `${formattedMonth} ${formattedYear}`;
}

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion<
  T extends Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    "functions"
  > & {
    functions: ToolDefinition<any, any>[];
  }
>(openai: OpenAI, params: T) {
  let text = "";
  let hasFunction = false;

  type FunctionNames = T["functions"] extends Array<any>
    ? T["functions"][number]["name"]
    : never;

  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<
              string,
              unknown
            >,
          })),
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;
            onFunctionCall[
              functionCallPayload.name as keyof typeof onFunctionCall
            ]?.(functionCallPayload.arguments as Record<string, any>);
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: (
      name: FunctionNames,
      callback: (args: any) => void | Promise<void>
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
