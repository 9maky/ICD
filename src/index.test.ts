import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

jest.mock('@langchain/openai', () => {
    return {
      OpenAI: jest.fn().mockImplementation(() => {
        return {
          call: jest.fn().mockResolvedValue({
            id: 'test-id',
            object: 'text.completion',
            created: 1234567890,
            model: 'gpt-4-turbo',
            choices: [
              {
                text: 'test response',
                index: 0,
                logprobs: null,
                finish_reason: 'stop'
              }
            ]
          })
        };
      })
    };
  });

describe('OpenAI API call', () => {
  it('should call OpenAI API and output response', async () => {

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

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
      id: 'test-id',
      object: 'text.completion',
      created: 1234567890,
      model: 'gpt-4-turbo',
      choices: [
        {
          text: 'test response',
          index: 0,
          logprobs: null,
          finish_reason: 'stop'
        }
      ]
    }));

    const response = await chain.run();

    expect(response).toEqual('test response');
  });
});