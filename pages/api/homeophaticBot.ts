import { NextApiResponse } from "next";
import { GenerateNextApiRequest } from "@/interfaces/HttpRequest";

//import loaders and loader interface
import {DirectoryLoader,TextLoader,JSONLoader,CSVLoader,PDFLoader,LoaderConfig} from "@/interfaces/LoaderConfig";

//import interfaces
import type {MessageRole} from '@/interfaces/Message'
import {Message} from "@/interfaces/Message";

//open ai llm and other elated modules
import { OpenAI } from "langchain/llms/openai";
import {RetrievalQAChain} from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import {BufferMemory} from 'langchain/memory';
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

// Import Tiktoken for token counting
import { Tiktoken } from "@dqbd/tiktoken/lite";
import { load } from "@dqbd/tiktoken/load";
import registry from "@dqbd/tiktoken/registry.json" assert { type: "json" };
import models from "@dqbd/tiktoken/model_to_encoding.json" assert { type: "json" };
import { calculationModel } from "@/interfaces/CalculationModel";


//Import dotenv for loading environment variables and fs for file system operations
import readline from "readline";
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import { text } from "stream/consumers";
dotenv.config({path: "./.env.local"});

const promptTemplate = `You are a homeopathic doctor who has all the information
available about homeopathy and remedies.
Act like I'm your patient, like a real homeopathic doctor will act,
In your first prompt introduce yourself,
Your goal is to find the best remedy,
You have a maximum of 8 questions
Use as many follow-up questions as needed but ask only one single question at each prompt.
Start by introducing yourself.
If you are being asked about something different then homeopathic then you will response just like that : "invalid prompt",
If you are being asked who you then you answer as I dictate you.
You will not give any information about yourself, open ai, gpt or anything else beside homeopathic consultant."`;


type ResponseData ={
  text: string;
}


interface Document {
  pageContent: string | string[];
}

//initazllize memory
const memory = new BufferMemory({
  memoryKey: "chat_history",
  inputKey: "question", // The key for the input to the chain
  outputKey: "text", // The key for the final conversational output of the chain
  returnMessages: true, // If the chat model should return the messages
});



//Initialize the document loader with supported file formats
const loader = new DirectoryLoader("./pages/api/documents", {
    ".json": (path: string) => new JSONLoader(path),
    ".text": (path: string) => new TextLoader(path),
    ".csv": (path: string) => new CSVLoader(path),
    ".pdf": (path: string) => new PDFLoader(path),
} as LoaderConfig);

//Load documents from the specified directory
async function loadDocuments() {
  console.log("loading documents");
  const docs = await loader.load();
  console.log("documents have been loaded successfully");
  return docs;
}

//efine a function to calculate the cost of tokenizing the documents
async function calculateCost(): Promise<number> {
    const modelName = "text-embedding-ada-002";
    const modelKey = models[modelName];
    interface Registry {
      [key: string]: any;
    }
    const modelRegistry: Registry = registry;
    const model = await load(modelRegistry[modelKey]) as calculationModel;
    const encoder = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    );
    const docs = await loadDocuments();
    const tokens = encoder.encode(JSON.stringify(docs));
    const tokenCount = tokens.length;
    const ratePerThousandTokens = 0.0004;
    const cost = (tokenCount / 1000) * ratePerThousandTokens;
    encoder.free();
    return cost;
}

const VECTOR_STORE_PATH = "Documents.index";

//Define a function to normalize the content of the documents
function normalizeDocuments(docs: Document[]): string[] {
    return docs.map((doc) => {
      if (typeof doc.pageContent === "string") {
        return doc.pageContent;
      } else if (Array.isArray(doc.pageContent)) {
        return doc.pageContent.join("\n");
      }
      throw new Error(`Unexpected doc.pageContent type: ${typeof doc.pageContent}`);
    });
  }

  const maxAllowedRequests = 17;

  export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>) {
    const { messages, counter } = req.body;
    if (counter > maxAllowedRequests){
      res.status(429).json({ text: "You have exceeded the maximum number of requests" });
            return;
    }
    const result = await run(messages);
    res.status(200).json({text: result.text})
  }

//main function to run the process
export const run = async (messages: Message[]): Promise<any> => {
// Call the new function and store the returned promise
const docsPromise: Promise<Document[]> = loadDocuments();
const docs = await docsPromise;

  //calculate the cost
  console.log("calculatin cost...");
  const cost = await calculateCost();
  console.log(cost);
  const acceptableCost = 3;

  //choose the range
  if (cost <= acceptableCost) {
    // rest of the code
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo"
    });

    let vectorStore;
    // 13. Check if an existing vector store is available
    console.log("Checking for existing vector store...");
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      // 14. Load the existing vector store
      console.log("Loading existing vector store...");
      vectorStore = await HNSWLib.load(
        VECTOR_STORE_PATH,
        new OpenAIEmbeddings()
      );
      console.log("Vector store loaded.");
    } else {
      // 15. Create a new vector store if one does not exist
      console.log("Creating new vector store...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const normalizedDocs = normalizeDocuments(docs);
      const splitDocs = await textSplitter.createDocuments(normalizedDocs);

      // 16. Generate the vector store from the documents
      vectorStore = await HNSWLib.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings()
      );
      // 17. Save the vector store to the specified path
      await vectorStore.save(VECTOR_STORE_PATH);

      console.log("Vector store created.");
    };

     // 18. Create a retrieval chain using the language model and vector store
     console.log("Creating conversational retrieval chain...");
     const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(),
      { memory,questionGeneratorChainOptions : {template: promptTemplate} },
       );
     let chatHistory = "";

     const result = await chain.call({ question: messages[messages.length -1].content, chat_history: chatHistory });
     return result;
    } else {
    // 20. If the cost exceeds the limit, skip the embedding process
    console.log(`The cost of embedding exceeds ${acceptableCost}$. Skipping embeddings.`);
  };
};
