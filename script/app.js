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
  const exit_btn = document.querySelector("#modal_exit");
  const signup_btn = document.querySelector("#to_signup_from_modal");

  signup_btn.addEventListener("click", () => {
    loginMd.classList.add("none");
    openSignupModal();
  });

  exit_btn.addEventListener("click", () => {
    loginMd.classList.add("none");
  });

  login_btn.addEventListener("click", () => {
    login(login_email_input.value, login_pw_input.value);
  });
});

//  회원가입 관련 로직 --------------------------------------------------------

const openSignupMd = document.getElementById("open_signup_md");
const signupMd = document.querySelector(".signup-wrap");

function openSignupModal() {
  signupMd.classList.remove("none");

  const signup_name_input = document.querySelector("#signup_name");
  const lsignup_email_input = document.querySelector("#signup_email");
  const signup_pw_input = document.querySelector("#signup_pw");

  const signup_btn = document.querySelector("#signup_btn");
  const exit_btn = document.querySelector("#signup_modal_exit");

  signup_btn.addEventListener("click", () => {
    singup(
      lsignup_email_input.value,
      signup_pw_input.value,
      signup_name_input.value
    );
  });

  exit_btn.addEventListener("click", () => {
    console.log("qkqh");
    signupMd.classList.add("none");
  });
}

openSignupMd.addEventListener("click", openSignupModal);

//  간이 모달 로직 --------------------------------------------------------
export function createModal(text) {
  let modalDiv = document.createElement("div");
  modalDiv.innerHTML = text;
  modalDiv.classList.add("createMoadl");
  document.body.appendChild(modalDiv);

  setTimeout(() => {
    modalDiv.style.display = "none";
  }, 2500);
}
