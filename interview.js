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

const config = JSON.parse(localStorage.getItem("currentInterview"));
if (!config) window.location.href = "dashboard.html";

let current = 0;
let questions = [];
let responses = [];

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

questions = QUESTION_BANK.slice(0, config.total);

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
    alert("Answer required");
    return;
  }

  const score = Math.floor(Math.random() * 10) + 1;

  responses.push({
    question: questions[current],
    answer: ans,
    score
  });

  document.getElementById("answer").value = "";
  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    finishInterview();
  }
}

function finishInterview() {
  const history =
    JSON.parse(localStorage.getItem("interviewHistory") || "[]");

  history.push({
    role: config.role,
    job: config.job,
    difficulty: config.difficulty,
    date: new Date().toLocaleString(),
    responses,
    totalScore: responses.reduce((a, b) => a + b.score, 0)
  });

  localStorage.setItem("interviewHistory", JSON.stringify(history));
  localStorage.removeItem("currentInterview");

  window.location.href = "history.html";
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
