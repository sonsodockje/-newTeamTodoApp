// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
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

userState();

// db에 데이터 쓰는 샘플코드
export async function readDb() {
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

// 회원가입하는 코드
export function singup() {
  const auth = getAuth();
  const email = "lit0goguma@gmail.com";
  const password = "0000";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("성공");
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

// 로그인 하는 코드
export function login() {
  const auth = getAuth();
  const email = "thisisid@gmail.com";
  const password = "thisispw";
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("로그인됨");
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

// 로그인 후 사용자 데이터 가져오기(현재 로그인한 사용자 가져오기)
// 로그 아웃 전까지 유지? 되는? 듯 하는? 그런? 거?
export function userState() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("로그인 중인 상태 : ", uid);
    } else {
      // User is signed out
      // ...
      console.log("로그인 필요한 상태");
    }
  });
}

// 이메일 인증 메일 보내기
export function emailVerification() {
  const auth = getAuth();
  auth.languageCode = "it";
  sendEmailVerification(auth.currentUser).then(() => {
    // Email verification sent!
    // ...
  });
}

// 로그아웃
// export function logout() {
//   const onSignOut = async () => {
//     try {
//       const auth = getAuth(app);
//       await signOut(auth);
//       toast.success("로그아웃 되었습니다.");
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error?.code);
//     }
//   };
// }
