document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addPetForm");
  const token = localStorage.getItem("token");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name.value.trim());
    formData.append("species", form.species.value.trim());
    formData.append("breed", form.breed.value.trim());
    formData.append("age", form.age.value);
    formData.append("gender", form.gender.value);
    formData.append("status", form.status.value);

    const photoFile = form.photo.files[0];
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/pets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
         
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert("Pet added successfully!");
        form.reset();
        window.location.href = "shelter-dashboard.html";
      } else {
        alert("Failed to add pet: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error adding pet:", err);
      alert("Server error. Please try again.");
    }
  });
});
