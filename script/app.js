const openLoginMd = document.getElementById("open_login_md");
const loginMd = document.querySelector(".login-wrap");

openLoginMd.addEventListener("click", () => {
  console.log("클릭함");
  console.log(loginMd.classList);
  loginMd.classList.remove("none");
});
