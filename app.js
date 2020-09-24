/****** firebase initialization ******/
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
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
const errorText = document.querySelector("#errors");
const messagesContainer = document.querySelector("#messages");

/****** functions ******/

// Login functions
const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebaseAuth.signInWithPopup(provider);
    setUserStyles(result.user);
    readMessages();
  } catch (error) {
    console.error({ error });
  }
};

const checkIfUser = () => {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setUserStyles(user);
    } else {
      setNoUserStyles();
    }
  });
};

const logOut = async () => {
  try {
    await firebaseAuth.signOut();
    setNoUserStyles();
  } catch (error) {
    console.error({ error });
  }
};

//Firestore functions
const sendMessage = (event) => {
  event.preventDefault();
  const user = firebaseAuth.currentUser;
  if (formInput.value.length < 3) return showErrors();
  deleteErrors();
  try {
    firebaseFirestore.collection("messages").add({
      message: formInput.value,
      date: new Date(),
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    });
    clearInput();
  } catch (error) {
    console.error({ error });
  }
};

const readMessages = () => {
  firebaseFirestore
    .collection("messages")
    .orderBy("date", "asc")
    .onSnapshot((querySnapshot) => {
      const messages = [];
      clearMessages();
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
        displayMessage(doc.data());
      });
      scrollToBottom();
    });
};

// DOM functions

const setNoUserStyles = () => {
  loginBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  formInput.disabled = true;
  formButton.disabled = true;
  title.innerHTML = "Log In to Enjoy!";
};

const setUserStyles = ({ displayName, photoURL }) => {
  loginBtn.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
  formInput.disabled = false;
  formButton.disabled = false;
  title.innerHTML = `Welcome ${displayName} <img class='laFoto' src="${photoURL}"/>`;
};

const showErrors = () => {
  errorText.innerHTML = "Escribe mas de 3 caracteres";
};

const deleteErrors = () => {
  errorText.innerHTML = "";
};

const clearInput = () => {
  formInput.value = "";
};

const displayMessage = ({ message, user, date }) => {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message");
  if (firebaseAuth.currentUser.uid === user.uid)
    messageBox.classList.add("my-message");

  messageBox.innerHTML = `
  <img class='message-photo' src="${user.photoURL}"/>
  <div>
    <span class='message-user'>${user.displayName}</span>
    <p>${message}</p>
  </div>
  `;
  messagesContainer.appendChild(messageBox);
};

const clearMessages = () => {
  messagesContainer.innerHTML = "";
};

const scrollToBottom = () => {
  //window.scrollTo(0, messagesContainer.scrollHeight);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};
/****** events ******/

loginBtn.onclick = googleLogin;
logoutBtn.onclick = logOut;
form.onsubmit = sendMessage;

checkIfUser();
readMessages();
