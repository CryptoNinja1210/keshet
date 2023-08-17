export interface MessageProps {
    "role": string;
    "content": string;
    "key": number;
  };

  export enum Creator {
    user = 0,
    assistant = 1
  };