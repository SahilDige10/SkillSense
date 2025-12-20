const email = localStorage.getItem("userEmail");

if (email) {
  const el = document.getElementById("userEmail");
  if (el) el.innerText = email;
}

function applyTheme(){
  const theme = localStorage.getItem("theme");
  if(theme === "light"){
    document.body.classList.add("light");
  }
}

function toggleTheme(){
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

applyTheme();


function logout(){
  localStorage.removeItem("userEmail");
  localStorage.removeItem("currentInterview");
  window.location.href = "NewIndex.html";
}

function startInterview() {
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

function goHistory() {
  window.location.href = "history.html";
}
