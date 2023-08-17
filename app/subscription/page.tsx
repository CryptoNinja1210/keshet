"use client"
import { selectSubscription, updateSubscription,selectUserUid, AppDispatch } from "../redux";
import { useDispatch, useSelector } from "react-redux";
import { handleSubscribe,handleUnSubscribe } from "./logic";
import { selectUser } from "../redux/authSlice";


const Page = () => {
  const isSubscribed = useSelector(selectSubscription);
  const userUid = useSelector(selectUserUid);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const clickSubscribe = () => {
    handleSubscribe(userUid!, dispatch, user!);
  }

  const clickUnsubscribe = () => {
    handleUnSubscribe(userUid!, dispatch, user!);
  }

  return (
    <div >
      {isSubscribed ? (
        <button onClick={clickUnsubscribe}>
          unsubscribe
        </button>
      ) : (
        <button onClick={clickSubscribe}>
          subscribe
        </button>
      )}
    </div>
  );
};

export default Page;