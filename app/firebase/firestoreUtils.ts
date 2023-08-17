import { doc } from "firebase/firestore";
import { db } from "./firebaseApp"; // Import your Firestore instance

export async function getUserDocRef(userId: string) {
  return await doc(db, "users", userId);
}
