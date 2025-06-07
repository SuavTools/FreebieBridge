import 'dotenv/config';
import fetch from 'node-fetch';

const payload = {
  firstName: "tester",
  email: "tester@suav.dev",
  message: "sending from script ✶",
  formId: "email-form",  // your form ID here
  token: "suav2025magic", // must match server's SUBMIT_TOKEN
};

const main = async () => {
  try {
    const res = await fetch('https://webflow-bridge.vercel.app/api/submit', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log(res.ok ? "✅ Sent successfully:\n" + text : "❌ Error:\n" + text);
  } catch (err) {
    console.error("🚫 Network error:", err);
  }
};

main();




