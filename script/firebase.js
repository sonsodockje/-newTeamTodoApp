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
  browserLocalPersistence,
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
const auth = getAuth();

getUserStateAndTodos();

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
      const user = userCredential.user;
      createModal("회원가입 성공");

      //                                                              모달 숨기고, 아이콘 보여주고, 회원가입 레이아웃 숨기고,
      signupMd.classList.add("none");
      nav_icon.classList.remove("none");

      //                                                              유저의 프로필 정보를 수정합니다.
      updateProfile(auth.currentUser, {
        displayName: displayName,
      })
        .then(() => {
          console.log("✨ 사용자의 이름을 추가했어요.");
        })
        .catch((error) => {
          console.log("updateProfile 에러 : ", error);
        });

      //   유저의 정보를 파이어베이스 데이터 베이스에 저장합니다.
      uploadUserInfo(displayName, email, user.uid);
      //   기본 할일 항목을 만듭니다.
      uploadUserTodo(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      createModal(errorMessage);
    });
}

//         회원가입 이후 사용자 정보 db 에 저장
export async function uploadUserInfo(displayName, email, uid) {
  try {
    const docTodosRef = await addDoc(collection(db, "users"), {
      displayName: displayName,
      email: email,
      uid: uid,
      code: [],
    });
  } catch (e) {
    console.error("☝️ 회원가입 후 사용자 정보를 저장하지 못하였습니다.: ", e);
  }
}

//       회원가입 이후 오늘 할 일, 오늘 할 일 컬렉션 생성
export async function uploadUserTodo(uid) {
  const userTodosdocTodosRef = doc(db, "todos", uid);
  await setDoc(userTodosdocTodosRef, {
    topics: ["오늘 할 일"],
  });

  await addDoc(collection(db, "todos", uid, "오늘 할 일"), {
    text: "오늘의 할 일을 적어주세요.",
  });
}

// **************************  로그인  ********************************

export function login(email, password) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const loginMd = document.querySelector(".login-wrap");

      const userDefaultDiv = document.querySelector(".user-wrap-logout");
      const test = document.querySelector(".default-card");
      const userInfoDiv = document.querySelector(".user-wrap-login");
      const auth = getAuth();

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("로그인됨 : ", user);

          loginMd.classList.add("none");
          userDefaultDiv.classList.add("none");
          // userInfoDiv.classList.remove("none");

          getUserStateAndTodos();
          test.classList.add("none");
        })
        .catch((error) => {
          const errorMessage = error.message;
          createModal("로그인 함수 에러 : ", errorMessage);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log("로그인 지속성 오류", errorMessage);
    });
}

// **************************  읽어 오기  ********************************

export function getUserStateAndTodos() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    getDocument(uid);
  } else {
    console.log("getUserStateAndTodos else 상태임.");
  }
}

//                    특정 "문서" 가져오는 코드 -> 유저의 topics 리스트만
export async function getDocument(uid) {
  const docTodosRef = doc(db, "todos", uid);
  const docSnap = await getDoc(docTodosRef);
  const todoWrap = document.querySelector(".todos-wrap");

  if (docSnap.exists()) {
    docSnap.data().topics.forEach((item) => {
      {
        const className = item.replace(/ /g, "");
        const 템플릿 = `<div class="todo-card-wrap" >
                        <div class="todo-card-header">
                          <span class="todo-card-title">${item}</span>
                          <button class="opened_btn">
                            <span class="material-symbols-outlined">
                              menu
                            </span>
                          </button>
                        </div>
                        <div class="todo-card-todolist" >
                            <ul id="${className}-ul">
                            </ul>
                        </div>
                        <div class="todo-card-input-area">
                          <input type="text" id="${className}_todo_input">
                          <button class="todo_send" id="${className}_send">저장</button>
                        </div>
                      </div>`;

        todoWrap.innerHTML += 템플릿;
        getTopicTodos(uid, item, className);
      }
    });
  } else {
    console.log("No such document!");
  }
}

//          문서의 컬렉션으로 접근하여 읽어오는것.
export async function getTopicTodos(uid, item, className) {
  const ul = document.querySelector(`#${className}-ul`);
  const querySnapshot = await getDocs(collection(db, "todos", uid, item));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " 주제는 ", item, "=> ", doc.data());
    const 템플릿 = ` <li>
                      <button class="todo-card-todolist-btn false">
                        <span class="material-symbols-outlined">
                          radio_button_unchecked
                        </span>
                      </button>
                      <span>${doc.data().text}</span>
                    </li>`;
    ul.innerHTML += 템플릿;
  });
}

// **************************  오늘 할 일 쓰기  *************************

// var todo_input = document.querySelector("#오늘할일_todo_input");
// var todo_input_send = document.querySelector("#오늘할일_send");
// todo_input_send.addEventListener("click", updateTodo(todo_input.value));

export async function updateTodo(inputText) {
  const auth = getAuth();
  console.log(auth);
  try {
    await addDoc(collection(db, "todos", auth.uid, "오늘 할 일"), {
      text: inputText,
      time: new Date(),
    });
  } catch (e) {
    console.error("☝️ 뭐가 문제야: ", e);
  }
}
// **************************  아래로 기타  ***************************

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
