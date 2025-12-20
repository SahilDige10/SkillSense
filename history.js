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
const history =
  JSON.parse(localStorage.getItem("interviewHistory") || "[]");

const box = document.getElementById("history");

if (!history.length) {
  box.innerHTML = "<p>No interviews yet.</p>";
} else {
  box.innerHTML = history.map(h => `
    <div class="question" style="margin-bottom:15px">
      <strong>${h.role}</strong> (${h.job})<br>
      Difficulty: ${h.difficulty}<br>
      Score: ${h.totalScore}/100<br>
      Date: ${h.date}
    </div>
  `).join("");
}

function back() {
  window.location.href = "dashboard.html";
}

function toggleTheme(){
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

function loadHistory() {
  const history =
    JSON.parse(localStorage.getItem("interviewHistory") || "[]");

  const box = document.getElementById("history");

  if (!history.length) {
    box.innerHTML = "<p>No interviews yet.</p>";
    return;
  }

  box.innerHTML = history.map((h, index) => `
    <div class="question history-card">
      
      <span class="delete-btn" onclick="deleteHistory(${index})">✖</span>

      <strong>${h.role}</strong> (${h.job})<br>
      Difficulty: ${h.difficulty}<br>
      Score: ${h.totalScore}/100<br>
      Date: ${h.date}
    </div>
  `).join("");
}

loadHistory();

function deleteHistory(index) {
  const history =
    JSON.parse(localStorage.getItem("interviewHistory") || "[]");

  if (!confirm("Delete this interview record?")) return;

  history.splice(index, 1);
  localStorage.setItem("interviewHistory", JSON.stringify(history));

  loadHistory(); // refresh UI
}
