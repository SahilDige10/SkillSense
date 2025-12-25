import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// 1. User & Theme Logic (Kept from your original code)
const email = localStorage.getItem("userEmail");

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

// Apply theme on load
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
function logout(){
  localStorage.removeItem("userEmail");
  localStorage.removeItem("currentInterview");
  window.location.href = "NewIndex.html";
}

function goHistory() {
  window.location.href = "history.html";
}

// 2. NEW AI Interview Logic (Replaces your old startInterview)
async function startInterview() {
  // Get values from your HTML dropdowns
  const role = document.getElementById("role").value;
  const job = document.getElementById("job").value;
  const difficulty = document.getElementById("difficulty").value;

  // Validation
  if (!role || !job || !difficulty) {
    alert("Please select Role, Job Level, and Difficulty");
    return;
  }

  // Update Button to show loading
  const btn = document.querySelector(".start"); // Grabs the Start Interview button
  const originalText = btn.innerText;
  btn.innerText = "AI is thinking...";
  btn.disabled = true;

  try {
    // --- CONNECT TO N8N ---
    // Make sure this is your correct TEST URL from n8n
    const webhookUrl = 'https://sahil10.app.n8n.cloud/webhook/generate-questions';
    
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            role: role, 
            difficulty: difficulty,
            jobLevel: job 
        })
    });

window.goHistory = function() {
  window.location.href = "history.html";
    const data = await response.json();
    console.log("AI Data Received:", data);

    // Get the questions from the response
    let aiQuestions = data.questions;

    // Safety check: Ensure it's a real list
    if (typeof aiQuestions === 'string') {
        try {
            aiQuestions = JSON.parse(aiQuestions);
        } catch (e) {
            aiQuestions = [aiQuestions];
        }
    }

    // Save config + Questions to LocalStorage
    const config = {
      role,
      job,
      difficulty,
      total: aiQuestions.length,
      questions: aiQuestions, // <--- SAVING AI QUESTIONS HERE
      startedAt: Date.now()
    };

    localStorage.setItem("currentInterview", JSON.stringify(config));
    
    // Redirect to Interview Page
    window.location.href = "interview.html";

  } catch (error) {
    console.error("Error connecting to AI:", error);
    alert("Failed to generate questions. Please check the console.");
    
    // Reset button if it fails
    btn.innerText = originalText;
    btn.disabled = false;
  }
}