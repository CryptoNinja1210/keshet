import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req:NextApiRequest,res:NextApiResponse){
    res.status(200).json({message:`hello there`});
}


// const apiKey = process.env.OPENAI_API_KEY;
// const client = axios.create({
//     headers: {
//         Authorization: "Bearer " +apiKey,
//     },
// });

// const params = {
//     prompt: "This is a test",
//     model:  "text-davinci-003",
//     max_tokens: 10,
//     temperature: 0,
// };

// function testOpenAi(){
//     client.post("https://api.openai.com/v1/chat/completions", params)
//     .then((response) => {
//         console.log(response.data.coices[0].text);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }


