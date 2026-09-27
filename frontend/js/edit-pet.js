document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editPetForm");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "shelter") {
    alert("You must be logged in as a shelter to edit a pet.");
    window.location.href = "login.html";
    return;
  }

  // Get pet ID from localStorage instead of URL
  const petId = localStorage.getItem("selectedPetId");
  if (!petId) {
    alert("No pet selected for editing.");
    window.location.href = "shelter-pets.html";
    return;
  }

  // Fetch pet details
  const fetchPet = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message || "Failed to fetch pet details.");
        window.location.href = "shelter-pets.html";
        return;
      }

      // Prefill a <select> element
      const prefillSelect = (selectElement, value) => {
      if (!selectElement || !value) return;
      const options = Array.from(selectElement.options);
      const match = options.find(opt => opt.value.toLowerCase() === value.toLowerCase().trim());
      if (match) selectElement.value = match.value;
    };

      
      const pet = data.data;
      form.name.value = pet.name || "";
      form.species.value = pet.species || "";
      form.breed.value = pet.breed || "";
      form.age.value = pet.age || "";
      prefillSelect(form.gender, pet.gender);
      prefillSelect(form.status, pet.status);
      const photoInput = form.photo;
      const photoPreview = document.getElementById("photoPreview");

     // Show current photo
      if (pet.photo_url) {
      photoPreview.src = pet.photo_url.startsWith("http") ? pet.photo_url : `http://localhost:5000${pet.photo_url}`;
     }

     // Update preview when user selects new file
     photoInput.addEventListener("change", (e) => {
     const file = e.target.files[0];
     if (file) {
      photoPreview.src = URL.createObjectURL(file);
    }
   });

    } catch (err) {
      console.error("Error fetching pet:", err);
      alert("Server error. Please try again.");
      window.location.href = "shelter-pets.html";
    }
   };

   fetchPet();

   // Submit updated pet
   form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name.value.trim());
    formData.append("species", form.species.value.trim());
    formData.append("breed", form.breed.value.trim());
    formData.append("age", parseInt(form.age.value));
    formData.append("gender", form.gender.value);
    formData.append("status", form.status.value);

    const photoFile = form.photo.files[0];
    if (photoFile) {
     formData.append("photo", photoFile);
    }




    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert("Pet updated successfully!");
        localStorage.removeItem("selectedPetId");
        window.location.href = "shelter-pets.html";
      } else {
        alert("Failed to update pet: " + data.message);
      }
    } catch (err) {
      console.error("Error updating pet:", err);
      alert("Server error. Please try again.");
    }
  });

 
  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
});
