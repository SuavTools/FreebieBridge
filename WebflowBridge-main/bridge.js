(function () {
  const ENDPOINT = "https://webflow-bridge.vercel.app/api/submit";

  function extractFormData(form) {
    const formData = new FormData(form);
    return {
      firstName: formData.get("first_name"),
      email: formData.get("email"),
      formId: formData.get("form_id"),  // form ID is included as needed
      token: "suav2025magic",           // static token for server validation
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const contact = extractFormData(form);

    console.log("📤 Sending to SUAV Bridge:", contact);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        console.log("✅ Contact sent successfully");
        form.reset();
      } else {
        const errorText = await response.text();
        console.error("❌ Bridge rejected:", errorText);
      }
    } catch (err) {
      console.error("🚫 Network error:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", handleSubmit);
    });

    console.log(`
██████████████████████████████████████████████
 SUAV BRIDGE — Licensed Version Active
██████████████████████████████████████████████
    `);
  });
})();



