import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const openAI = new OpenAI({
  apiKey: 'api_here',
  model: 'gpt-4-turbo'
});

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
  source: "source",
});

const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    "Answer the users question as best as possible.\n{format_instructions}\n{question}"
  ),
  openAI,
  parser,
]);

console.log(parser.getFormatInstructions());

async function fetchResponse(question: string) {
  try {
    const response = await chain.invoke({
      question: question,
      format_instructions: parser.getFormatInstructions(),
    });

    console.log("Response:", response);
  } catch (error) {
    console.error('Error fetching response:', error);
  }
}

fetchResponse("What is the capital of France?");
