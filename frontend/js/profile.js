document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  const statusMessage = document.getElementById("statusMessage");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Pre-fill the form
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
    };

    const password = document.getElementById("password").value;
    if (password) {
      updatedData.password = password;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (data.success) {
        statusMessage.innerText = "Profile updated successfully!";
        // Update localStorage user
        localStorage.setItem("user", JSON.stringify({ ...user, ...updatedData }));
      } else {
        statusMessage.innerText = "Failed to update profile: " + data.message;
      }
    } catch (err) {
      console.error(err);
      statusMessage.innerText = "Server error. Please try again later.";
    }
  });

  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
});
