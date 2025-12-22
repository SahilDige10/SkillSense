// 1. User & Theme Logic (Kept from your original code)
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

// Apply theme on load
applyTheme();

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