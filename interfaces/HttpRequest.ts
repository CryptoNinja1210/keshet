import { NextApiRequest } from "next";
import { Message } from "./Message";

export interface RequestBody {
    messages: Message[],
    counter: number;
  }
  
  export interface GenerateNextApiRequest extends NextApiRequest {
    body: RequestBody;
  }