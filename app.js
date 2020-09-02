/****** firebase initialization ******/
const firebaseConfig = {
  apiKey: "AIzaSyCYJVZV82swWZYxjS8UoOtWxIbx9pXyv70",
  authDomain: "runa-demos.firebaseapp.com",
  databaseURL: "https://runa-demos.firebaseio.com",
  projectId: "runa-demos",
  storageBucket: "runa-demos.appspot.com",
  messagingSenderId: "1091914196929",
  appId: "1:1091914196929:web:6a8b15680a595700f13140",
};

firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebase.auth();
const firebaseFirestore = firebase.firestore();

/****** selectors ******/
const loginBtn = document.querySelector("#login-btn");
const logoutBtn = document.querySelector("#logout-btn");
const form = document.querySelector("#form");
const formInput = document.querySelector("#form-input");
const formButton = document.querySelector("#form-btn");
const title = document.querySelector("#title");

/****** functions ******/

// Login functions
const googleLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebaseAuth
    .signInWithPopup(provider)
    .then((result) => {
      setUserStyles(result.user.displayName);
    })
    .catch((error) => {
      console.log(error);
    });
};

const checkIfUser = () => {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setUserStyles(user.displayName);
    } else {
      setNoUserStyles();
    }
  });
};

const logOut = () => {
  firebaseAuth
    .signOut()
    .then(() => {
      setNoUserStyles();
    })
    .catch((error) => {
      console.log("error");
    });
};

const setNoUserStyles = () => {
  loginBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  formInput.disabled = true;
  formButton.disabled = true;
  title.innerHTML = "Log In to Enjoy!";
};

const setUserStyles = (userName) => {
  loginBtn.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
  formInput.disabled = false;
  formButton.disabled = false;
  title.innerHTML = `Welcome ${userName}`;
};
/****** events ******/

loginBtn.onclick = googleLogin;
logoutBtn.onclick = logOut;

checkIfUser();
