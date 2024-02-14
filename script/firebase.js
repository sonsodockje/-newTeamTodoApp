// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { createModal } from "./app.js";
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
getUserStateAndTodos();
const test = document.querySelector(".test");
const notLogin = document.querySelector(".user-wrap-logout");
const auth = getAuth();

// 특정 "문서" 가져오는 코드
export async function getDocument(uid) {
  const docRef = doc(db, "todos", uid);
  const docSnap = await getDoc(docRef);
  const todoWrap = document.querySelector(".todos-wrap");

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data().topics);
    docSnap.data().topics.forEach((item) => {
      {
        const 템플릿 = `<div class="todo-card-wrap ">
                        <div class="todo-card-header">
                          <span class="todo-card-title">${item}</span>
                          <button class="opened_btn">
                            <span class="material-symbols-outlined">
                              menu
                            </span>
                          </button>
                        </div>
                      </div>`;

        todoWrap.innerHTML += 템플릿;

        getTopicTodos(uid, item);
      }
    });
  } else {
    console.log("No such document!");
  }
}

export async function getTopicTodos(uid, item) {
  const querySnapshot = await getDocs(collection(db, "todos", uid, item));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " 주제는 ", item, "=> ", doc.data());
  });
}

// 로그인한 회원의 유아이디를 매개변수로 전달하면
// 문서를 가져올때 유아이디를 검색하여 사용자의 투두만 가져오게 됨.

// **************************  회원가입  ********************************

export function singup(input_email, input_pw, name) {
  const auth = getAuth();
  const email = input_email;
  const password = input_pw;
  const displayName = name;
  const signupMd = document.querySelector(".signup-wrap");
  const nav_icon = document.querySelector(".icon-bar");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 회원가입을 성공하면 아래를 합니다.
      const user = userCredential.user;
      console.log("회원가입 성공 : ", user);
      createModal("회원가입 성공");

      // 모달 숨기고, 아이콘 보여주고, 회원가입 레이아웃 숨기고,
      signupMd.classList.add("none");
      nav_icon.classList.remove("none");

      // 유저의 프로필 정보를 수정합니다.
      updateProfile(auth.currentUser, {
        displayName: displayName,
      })
        .then(() => {
          console.log("이름넣기 완", auth.currentUser);
        })
        .catch((error) => {
          console.log(error);
        });

      // 유저의 정보를 파이어베이스 데이터 베이스에 저장합니다.
      uploadUserInfo(displayName, email, user.uid);
      // 기본 할일 항목을 만듭니다.
      uploadUserTodo(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      createModal(errorMessage);
    });
}

// 회원가입시 사용자 정보 db 에 저장
export async function uploadUserInfo(displayName, email, uid) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      displayName: displayName,
      email: email,
      uid: uid,
      code: [],
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    createModal(e);
  }
}

// 회원가입시 기본 필드 생성
export async function uploadUserTodo(uid) {
  const userDocRef = doc(db, "todos", uid);
  await setDoc(userDocRef, {
    topics: ["오늘 할 일"],
  });
  await setDoc(userDocRef, {
    test: "test",
  });
}

// 로그인 하는 코드
export function login(email, password) {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      const loginMd = document.querySelector(".login-wrap");
      const auth = getAuth();
      // const email = "Tesddfgdfgfdgfghghjhghjghjst1@gmail.com";
      // const password = "test0000";
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("로그인됨 : ", user);
          // 로컬스토리지에 user.uid 저장
          //
          getUserStateAndTodos();
          loginMd.classList.add("none");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          console.log("로그인 함수 에러");
          createModal(errorMessage);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("로그인 지속성 오류", errorMessage);
    });
}

// 로그인 후 사용자 데이터 가져오기(현재 로그인한 사용자 가져오기)
// 로그 아웃 전까지 유지? 되는? 듯 하는? 그런? 거?

export function getUserStateAndTodos() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    console.log("로그인됨 ", user);

    // - [O] 디폴트 투두 지우기
    // - [O] 로그인창 지우기
    test.style.display = "none";
    notLogin.style.display = "none";

    // - [O] 사용자 디비 불러옴.
    getDocument(uid);

    // - [ ] 우측 상단아이콘 띄우기.
  } else {
    // - [ ] 로그인, 회원가입 오른쪽편 띄움.
  }
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

export function logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("로그웃완료");
    }) // logout successful
    .catch((error) => {
      console.log(error);
    }); // logout fail
}
