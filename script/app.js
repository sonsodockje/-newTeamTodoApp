import { login, uploadUserInfo, logout, singup } from "./firebase";

//  로그인 관련 로직 ----------------------------------------------------------
//  1. 로그인 버튼 클릭시 로그인 모달 오픈
//  2. 모달내 로그인 버튼 클식시 fb 로그인 함수 호출
//  3. 로그인 완료 후 모달 숨기기

const openLoginMd = document.getElementById("open_login_md");
const loginMd = document.querySelector(".login-wrap");

openLoginMd.addEventListener("click", () => {
  loginMd.classList.remove("none");

  const login_email_input = document.querySelector("#login_email");
  const login_pw_input = document.querySelector("#login_pw");
  const login_btn = document.querySelector("#login_btn");
  const exit_btn = document.querySelector("#exit");

  exit_btn.addEventListener("click", ()=>{
    loginMd.classList.add("none");
  })

  login_btn.addEventListener("click", () => {
    login(login_email_input.value, login_pw_input.value);
  });

  // 나가기 버튼
});

//  회원가입 관련 로직 --------------------------------------------------------
