"use client"
import { AppDispatch, loginFailure, loginRequest, loginSuccess } from ".././redux";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginUser } from ".././redux"; // Import loginUser thunk
import { auth } from "./firebaseApp";

const SignInButton = () => {

  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch<AppDispatch>(); // Use typed useDispatch

  const signIn = async () => {
    // dispatch(loginRequest());
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const sanitizedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          providerId: user.providerId
        }
        // Dispatch the loginUser thunk with the user object
        await dispatch(loginUser(sanitizedUser));
        console.log(`login success for user :  ${user.displayName}`);
      } catch (error : any  ) {
        dispatch(loginFailure)
        console.log('Failed to sign in:', error);
    }
  };

  return (
    <>
      <button onClick={signIn}>Sign in</button>
    </>
  )
}

export default SignInButton;
