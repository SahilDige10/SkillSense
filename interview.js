const email = localStorage.getItem("userEmail");

if (email) {
  const el = document.getElementById("userEmail");
  if (el) el.innerText = email;
}

function logout(){
  localStorage.removeItem("userEmail");
  localStorage.removeItem("currentInterview");
  window.location.href = "NewIndex.html";
}

function toggleTheme(){
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

// 1. Get the configuration saved from the Dashboard
const config = JSON.parse(localStorage.getItem("currentInterview"));
if (!config) window.location.href = "dashboard.html";

let current = 0;
let questions = [];
let responses = [];

// Fallback bank (used only if AI fails)
const QUESTION_BANK = [
  "Explain closures in JavaScript",
  "What is REST API?",
  "Difference between let and var?",
  "Explain event bubbling",
  "What is authentication?",
  "Explain normalization",
  "What is async/await?",
  "Explain MVC architecture",
  "What is cloud computing?",
  "Explain HTTP vs HTTPS"
];

// 2. THIS IS THE FIX: Load AI questions if available
if (config.questions && config.questions.length > 0) {
    questions = config.questions;
} else {
    // Fallback logic
    questions = QUESTION_BANK.slice(0, config.total || 5);
}

showQuestion();

function showQuestion() {
  document.getElementById("progress").innerText =
    `Question ${current + 1} / ${questions.length}`;
  document.getElementById("questionBox").innerText =
    questions[current];
}

function nextQuestion() {
  const ans = document.getElementById("answer").value.trim();
  if (!ans) {
    alert("Please type an answer!");
    return;
  }

  // Save the answer (We don't need 'score' here anymore, the AI does that later)
  responses.push({
    question: questions[current],
    answer: ans
  });

  // Clear input
  document.getElementById("answer").value = "";
  current++;

  // Decide: Next Question or Finish?
  if (current < questions.length) {
    showQuestion();
  } else {
    finishInterview();
  }
}

async function finishInterview() {
  const btn = document.querySelector("button");
  if(btn) { 
      btn.innerText = "AI is Grading..."; 
      btn.disabled = true; 
  }

  try {
    // 1. Send answers to your n8n AI Brain
    // 👇 PASTE YOUR COPIED PRODUCTION URL INSIDE THE QUOTES BELOW 👇
    const response = await fetch("https://sahil10.app.n8n.cloud/webhook/grade-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: config.role,
        difficulty: config.difficulty,
        responses: responses // This sends all your Q&A data
      })
    });

    const aiResult = await response.json();

    // 2. Save the AI's Feedback to History
    const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");

    history.push({
      role: config.role,
      job: config.job,
      difficulty: config.difficulty,
      date: new Date().toLocaleString(),
      responses: responses,
      // Use AI data if available, otherwise fallback to 0
      totalScore: aiResult.totalScore || 0, 
      feedback: aiResult.feedback || "AI Grading Complete",
      detailed_feedback: aiResult.detailed_feedback || []
    });

    localStorage.setItem("interviewHistory", JSON.stringify(history));
    localStorage.removeItem("currentInterview");

    // 3. Go to results
    window.location.href = "history.html";

  } catch (error) {
    console.error("Grading failed:", error);
    alert("AI Grading failed. Check console.");
    btn.disabled = false;
    btn.innerText = "Submit Answer";
  }
}

let recognition;

function startVoice(){
  if(!('webkitSpeechRecognition' in window)){
    alert("Voice input not supported in this browser");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function(event){
    const speechText = event.results[0][0].transcript;
    const textarea = document.getElementById("answer");
    textarea.value += (textarea.value ? " " : "") + speechText;
  };

  recognition.start();
}