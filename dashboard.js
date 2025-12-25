import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. CHECK AUTH STATUS (LOGIN HAI YA NAHI)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User login hai, uska email dikhao
        const el = document.getElementById("userEmail");
        if (el) el.innerText = user.email; 
        console.log("Logged in as:", user.email);
    } else {
        // Login nahi hai, wapas bhej do
        window.location.href = "NewIndex.html"; 
    }
});

// --- THEME FUNCTIONS ---
function applyTheme(){
  const theme = localStorage.getItem("theme");
  if(theme === "light"){
    document.body.classList.add("light");
  }
}

window.toggleTheme = function(){
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

applyTheme();

// --- LOGOUT FUNCTION (FIXED) ---
window.logout = function(){
  signOut(auth).then(() => {
    // Firebase se signout hone ke baad storage clear karein
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentInterview");
    window.location.href = "NewIndex.html";
  }).catch((error) => {
    console.error("Logout Error:", error);
  });
}

// --- NAVIGATION FUNCTIONS ---
window.startInterview = function() {
  const role = document.getElementById("role").value;
  const job = document.getElementById("job").value;
  const difficulty = document.getElementById("difficulty").value;

  if (!role || !job || !difficulty) {
    alert("Select all fields");
    return;
  }

  const config = {
    role,
    job,
    difficulty,
    total: 10,
    startedAt: Date.now()
  };

  localStorage.setItem("currentInterview", JSON.stringify(config));
  window.location.href = "interview.html";
}

window.goHistory = function() {
  window.location.href = "history.html";
}