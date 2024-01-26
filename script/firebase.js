// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBquOi8RjipStQUXrQiKAxo1kfhNELRSQo",
  authDomain: "todo-nado.firebaseapp.com",
  projectId: "todo-nado",
  storageBucket: "todo-nado.appspot.com",
  messagingSenderId: "1037836607269",
  appId: "1:1037836607269:web:6cf9cd484d25a789d304cc",
  measurementId: "G-KQK2SD3VXF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function readDb() {
  //db에 데이터 쓰기 샘플코드
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
