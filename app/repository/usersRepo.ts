import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../interfaces";
import { promises } from "dns";
import { useSelector } from "react-redux";
import { selectSubscription, selectUserUid } from "../redux";

class UserRepository {
  async getUserDoc(user: any): Promise<User> {
    const userDocRef = doc(db, "users", user.uid);
  
    const userDoc = await getDoc(userDocRef);
    const data= userDoc.data() as User;
    if (userDoc.exists()) {
      const userData : User = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        provider: data.provider,
        isSubscribed: data.isSubscribed
      };
      console.log(userData);
      return userData;
    } else {
      return this.createUserDoc(user);
    }
  }
  

  async createUserDoc(user: any): Promise<User> {
    const userDocRef = doc(db, "users", user.uid);
  
    const userDocData = {
      email: user.email,
      displayName: user.displayName,
      provider: user.providerId,
      uid: user.uid,
      isSubscribed: false // Default to false if the user document doesn't exist yet
    };
  
    await setDoc(userDocRef, userDocData, {merge:true});

    return userDocData;
  }

  async updateSubscriptionInDb(uid: string, newSubscribeState: boolean): Promise<void> {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {isSubscribed: newSubscribeState});
  }
  
  async updateUser(user: User): Promise<User> {
    console.log("enetring updateuser");
    const userDocRef = doc(db, "users", user.uid);
    console.log("retrieved doc");
    await updateDoc(userDocRef, {isSubscribed: user.isSubscribed});
    console.log(user + "from db")
    return this.getUserDoc(user);
  }
  
}

export const userRepository = new UserRepository();
