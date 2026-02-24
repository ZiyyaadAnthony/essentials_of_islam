import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
export async function fetchPaths() {
  const q = query(collection(db, "paths"), orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}


