import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { Chart } from "@/components/llm-charts";
import AreaSkeleton from "@/components/llm-charts/AreaSkeleton";
import { BotCard, BotMessage } from "@/components/message";
import { spinner } from "@/components/ui/spinner";
import { runQuery } from "@/lib/db";
import { runOpenAICompletion, sleep } from "@/lib/utils";
import { FQueryResponse } from "@/lib/validation";
import { Code } from "bright";
import { format as sql_format } from "sql-formatter";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});
type OpenAIQueryResponse = z.infer<typeof FQueryResponse>;
export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}
async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const completion = runOpenAICompletion(openai, {
    model: "gpt-4-0125-preview",
    stream: true,
    messages: [
      {
        role: "system",
        content: `
You are a friendly AI assistant. You can help users with their queries and provide information about the two datasets.

dataset 1 is about campaign - 
sample data \n
CampaignID	StartDate	EndDate	Budget	Platform	ContentID	ContentType	AudienceType	Impressions	Clicks	NewSubscriptions	Subscription Cost	Revenue													
1000	07.01.2023	22.02.2023	5904.29	Instagram	74308	Movie	Families	80886	1909	870	10	8700													

\n
dataset 2 is about Subscribers -
Sample data \n
SubscriberID	CampaignID	SubscriptionDate	Age	Gender	Location	AudienceType	Satisfaction	SubscriptionDays	EngagementRate	ViewingTime
S00001	1000	19.01.2023	60	Male	Asia	Families	Very Satisfied	376	3	3008

These are the two tables that you can use to answer user queries, which is stored in postgresql supabase database. Preserve case for the column names.

create table
  public.campaign (
    "CampaignID" bigint not null,
    "StartDate" text null,
    "EndDate" text null,
    "Budget" double precision null,
    "Platform" text null,
    "ContentID" bigint null,
    "ContentType" text null,
    "AudienceType" text null,
    "Impressions" bigint null,
    "Clicks" bigint null,
    "NewSubscriptions" bigint null,
    "Subscription Cost" bigint null,
    "Revenue" bigint null,
    constraint campaign_pkey primary key ("CampaignID")
  ) tablespace pg_default;

create table
  public.subscriber (
    "SubscriberID" text not null,
    "CampaignID" bigint null,
    "SubscriptionDate" text null,
    "Age" bigint null,
    "Gender" text null,
    "Location" text null,
    "AudienceType" text null,
    "Satisfaction" text null,
    "SubscriptionDays" bigint null,
    "EngagementRate" bigint null,
    "ViewingTime" bigint null,
    constraint subscriber_pkey primary key ("SubscriberID"),
    constraint public_subscriber_CampaignID_fkey foreign key ("CampaignID") references campaign ("CampaignID")
  ) tablespace pg_default;

You can only read data and make analysis, you cannot write or update data at any cost.


Messages inside [] means that it's a UI element or a user event. For example:
- "[Showing Subscribers growth over time card- using line chart]" means that the UI is showing a card with the title "Subscribers growth over time".
- "[Showing number of subscribers over time (monthly) card- using line chart]" means that the UI is showing a card with the title "Number of subscribers over time".
- "[Results for query: query with format: format and title: title and description: description. with data" means that a chart/table/number card is shown to that user.
`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: "query_data",
        description:
          "Query the data from the snowflake database and return the results.",
        parameters: FQueryResponse,
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    //  console.log(content);

    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall("show_products", async ({ products }) => {
    console.log(products);
    reply.update(<BotCard>Loading products...</BotCard>);

    reply.done(
      <BotCard>
        {/* <Products products={products} /> */}
        <div>Products: {products}</div>
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "show_products",
        content: JSON.stringify(products),
      },
    ]);
  });

  completion.onFunctionCall(
    "query_data",
    async (input: OpenAIQueryResponse) => {
      reply.update(
        <BotMessage className="">
          <AreaSkeleton />
        </BotMessage>
      );
      const { format, title, timeField, categories, index, yaxis, size } =
        input;
      // console.log("Received timeField:", timeField);
      // console.log("Received format:", format);
      // console.log("Received title:", title);
      // console.log("Received categories:", categories);
      // console.log("Received index:", index);
      // console.log("Received yaxis:", yaxis);
      // console.log("Received size:", size);
      let query = input.query;

      const format_query = sql_format(query, { language: "sql" });
      console.log("Formatted query:", format_query);
      const res = await runQuery(format_query);
      console.log("Query results:", res);
      // const res = testquery;
      const compatibleQueryResult: QueryResult = {
        columns: res.columns,
        data: res.data,
      };

      reply.done(
        <BotCard>
          <div className="">
            <Chart
              chartType={format}
              queryResult={compatibleQueryResult}
              title={title}
              timeField={timeField}
              categories={categories}
              index={index}
              yaxis={yaxis}
              size={size}
            />
            <div className="py-4 whitespace-pre-line">
              <Code lang="sql">{format_query}</Code>
            </div>
          </div>
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "query_data",
          content: `[Snowflake query results for code: ${query} and chart format: ${format} with categories: ${categories} and data ${res.columns} ${res.data}]`,
        },
      ]);
    }
  );
  return {
    id: Date.now(),
    display: reply.value,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
