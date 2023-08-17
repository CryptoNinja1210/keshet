import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, selectSubscription, selectUserUid } from "../redux";
import { selectUser, updateSubscription, updateUser } from "../redux/authSlice";
import { User } from "../interfaces";

export const handleSubscribe = async( userUid:string, dispatch :AppDispatch, user: User) => {
    try {
      const updatedUser : User = {...user!};
      updatedUser.isSubscribed = true;

      // Update Firestore document
      const returnedUser = await dispatch(updateUser(updatedUser));

      // Update Redux state with the updated user from the database
      dispatch(updateSubscription(returnedUser.payload as User));
    } catch (error) {
      console.log(error);
    }
  }

  export const handleUnSubscribe = async( userUid:string, dispatch :AppDispatch, user: User) => {
    try {
      const updatedUser : User = {...user!};
      updatedUser.isSubscribed = false;

      // Update Firestore document
      const returnedUser = await dispatch(updateUser(updatedUser));

      // Update Redux state with the updated user from the database
      dispatch(updateSubscription(returnedUser.payload as User));
    } catch (error) {
      console.log(error);
    }
  }