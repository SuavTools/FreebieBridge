/**
 * Licensing — SUAV Console Labs
 *
 * ✅ You may:
 * – Use in Webflow projects
 * – Install for clients
 *
 * ❌ You may not:
 * – Resell the code
 * – Claim authorship
 * – Distribute modified versions without written consent
 *
 * 🔑 To license or unlock premium features, contact: ricardo.moreira.designs@gmail.com
 */

(function () {
  const ENDPOINT = "https://bridge-client1-suav.vercel.app/api/submit"; // 🔁 use your paid Vercel deployment URL

  function extractFormData(form) {
    const formData = new FormData(form);
    return {
      firstName: formData.get("first_name"),
      email: formData.get("email")
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
