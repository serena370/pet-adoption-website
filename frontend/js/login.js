document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // debug line

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log(data); // debug

      if (response.ok) {

        localStorage.setItem("token", data.token);
localStorage.setItem("role", data.user.role);



        alert(`Welcome ${data.user.role}!`);
        localStorage.setItem("user", JSON.stringify(data.user));

          if (data.user.role === "shelter") {
          window.location.href = "shelter-dashboard.html";
        } else {
          window.location.href = "adopter-dashboard.html";
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  });
});
