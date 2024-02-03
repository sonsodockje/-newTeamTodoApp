// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
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

// 특정 "문서" 가져오는 코드
async function getDocument(uid) {
  const docRef = doc(db, "todos", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    /// 하위 컬렉션의 모든 문서 가져오기
    // 여기를 반복문으로 돌려야됨.
    const querySnapshot = await getDocs(
      collection(db, "todos", uid, "오늘 할 일")
    );
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } else {
    console.log("No such document!");
  }
}
getDocument("EivH5GMe2APglKbS0V1AXNRV4Kv1");
// 회원가입하는 코드
export function singup() {
  const auth = getAuth();
  const displayName = "홍길동3";
  const email = "Test412455@gmail.com";
  const password = "test0000";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 회원가입을 성공하면 아래를 합니다.
      const user = userCredential.user;
      console.log("회원가입 성공 : ", user);

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
      uploadUserTodo(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

// 회원가입시 사용자 정보 db 에 저장
async function uploadUserInfo(displayName, email, uid) {
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
  }
}
// 회원가입시 기본 필드 생성
async function uploadUserTodo(uid) {
  const userDocRef = doc(db, "todos", uid);
  await setDoc(userDocRef, {
    topics: ["오늘 할 일"],
  });
  await setDoc(userDocRef, {
    test: "test",
  });
}

// 로그인 하는 코드
export function login() {
  const auth = getAuth();
  const email = "Tesddfgdfgfdgfghghjhghjghjst1@gmail.com";
  const password = "test0000";
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("로그인됨 : ", user);
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
      console.log("로그인 중인 상태 : ", user);
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
