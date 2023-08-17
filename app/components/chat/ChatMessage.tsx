import Image from "next/image";
// import userImg from '/user-img.png'
// import botImg from '/bot-img.jpg'
const userImg = '/user-img.jpg';
const botImg = '/bot-img.png';
import { MessageProps,Creator } from "../../interfaces";


 export const ChatMessage = ({ content, role }: MessageProps) => {
    return(
    <>
      {
        role === Creator[Creator.user] && (
          <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
            <Image height={40} src={userImg} alt="User" width={40} />
            <p className="text-gray-700">{content}</p>
          </div>
        )}
      {
        role === Creator[Creator.assistant] && (
          <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
            <Image height={40} src={botImg} alt="User" width={40} />
            <p className="text-gray-700">{content}</p>
          </div>
        )}
    </>
    )
  };

