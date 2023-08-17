//documents loaders for differents files formats
import {DirectoryLoader} from "langchain/document_loaders/fs/directory";
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {CSVLoader} from "langchain/document_loaders/fs/csv";
export {DirectoryLoader} from "langchain/document_loaders/fs/directory";
export {JSONLoader} from "langchain/document_loaders/fs/json";
export {TextLoader} from "langchain/document_loaders/fs/text";
export {PDFLoader} from "langchain/document_loaders/fs/pdf";
export {CSVLoader} from "langchain/document_loaders/fs/csv";


export interface LoaderConfig {
    [key: string]: (path: string) => JSONLoader | TextLoader | CSVLoader | PDFLoader;
    ".json": (path: string) => JSONLoader;
    ".text": (path: string) => TextLoader;
    ".csv": (path: string) => CSVLoader;
    ".pdf": (path: string) => PDFLoader;
  }