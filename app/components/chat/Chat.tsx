"use client"
import useState  from 'react-usestateref';
import { MessageProps,Creator } from '../../interfaces';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSubscription } from '@/app/redux';

const url = '/api/homeophaticBot';

 export const Chat = () => {
   const router = useRouter();
  const [messages, setMessages, messageRef] = useState<MessageProps[]>([]);
  const isSubscribed = useSelector(selectSubscription);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter, counterRef] = useState(0);

  useEffect(() => {
      if(!isSubscribed){
        router.push('/subscription');
      }
  }, [isSubscribed, router])

//deactivated to save the prompt cost
  // useEffect(() => {
  //   callApi(`you are a homeophatic doctor who has all the information
  //   availiable about homephatic and remedies.
  //   act like im youre patient, like a real homeophatic doctor will act,
  //   in youre first prompt introduce yourself,
  //   youre goal is to find to best remedy,
  //   you have a maximum of 8 questions
  //   use as many follow up question as needed but ask only one single question at each prompt.
  //   start by introducing yourself.
  //   if you are being asked about something different then homeophatic then you will response just like that : "invalid prompt",
  //   if your are being asked who you then you answer as i dicate you.
  //   you will not give any information about yourslelf, open ai, gpt or anything else beside homeophatic consultant. `)
  // }, [])

  const callApi = async (input: string) => {
    setLoading(true);
    setCounter(counterRef.current + 1);
    const myMessage: MessageProps = {
      "role": Creator[Creator.user],
      "content": input,
      "key": counterRef.current
    };
    setMessages([...messageRef.current, myMessage]);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messageRef.current.map(({ key, ...rest }) => rest),
          counter: counterRef.current
      })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCounter(counterRef.current + 1);
      const botMessage: MessageProps = {
        "role": Creator[Creator.assistant],
        "content": data.text,
        "key": counterRef.current
      };
      setMessages([...messageRef.current, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setLoading(false);
      alert('Something went wrong');
    }
  };

  return (
    <main className="relative max-w-2xl mx-auto">
      <div className='sticky top-0 w-fll pt-10 px-4'>
      <ChatInput onSend={(input: string) => callApi(input)} disabled={loading || !isSubscribed}/>
      </div>
      <div className='mt-10 px-4'>
        {messageRef.current.map((msg: MessageProps) => ( msg.key > 1 &&
          <ChatMessage key={msg.key} content={msg.content} role={msg.role}/>
        ))}
        {messages.length === 0 && <p className='text-center text-gray-400'>I am at youre service</p>}
      </div>
        <iframe
          style={{border: 'none'}}
          srcDoc="
            <body>
              <script src='https://cdn.botpress.cloud/webchat/v0/inject.js'></script>
              <script>
                window.botpressWebChat.init({
                    'composerPlaceholder': 'Chat with bot',
                    'botConversationDescription': 'This chatbot was built surprisingly fast with Botpress',
                    'botName': 'Name',
                    'botId': 'f87c4530-e481-49dd-8841-236d83aa1389',
                    'hostUrl': 'https://cdn.botpress.cloud/webchat/v0',
                    'messagingUrl': 'https://messaging.botpress.cloud',
                    'clientId': 'f87c4530-e481-49dd-8841-236d83aa1389',
                    'enableConversationDeletion': true,
                    'showPoweredBy': true,
                    'className': 'webchatIframe',
                    'containerWidth': '100%25',
                    'layoutWidth': '100%25',
                    'hideWidget': true,
                    'showCloseButton': false,
                    'disableAnimations': true,
                    'closeOnEscape': false,
                    'showConversationsButton': false,
                    'enableTranscriptDownload': false,
                    'stylesheet':'https://webchat-styler-css.botpress.app/prod/code/3fcd3e4e-d5bc-4bf5-8699-14b621b3ada2/v31782/style.css'
                });
              window.botpressWebChat.onEvent(function () { window.botpressWebChat.sendEvent({ type: 'show' }) }, ['LIFECYCLE.LOADED']);
              </script>
            </body>
          "
          width={'100%'}
          height={700}
        >
      </iframe>
    </main>
  );
};
