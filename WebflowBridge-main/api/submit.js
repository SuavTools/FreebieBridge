const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  // CORS headers for your Webflow domain ONLY
  res.setHeader('Access-Control-Allow-Origin', 'https://ghostform-b9eb5f.webflow.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { firstName, email, formId, token } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing firstName or email' });
  }

  const PRIVATE_TOKEN = process.env.SUBMIT_TOKEN;
  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
  const GHL_FORM_ID_FIELD = process.env.GHL_FORM_ID_FIELD;

  if (!PRIVATE_TOKEN || !GHL_API_KEY || !GHL_LOCATION_ID || !GHL_FORM_ID_FIELD) {
    return res.status(500).json({ error: 'Missing required environment variables' });
  }

  if (token !== PRIVATE_TOKEN) {
    console.warn('🛑 Invalid token attempt:', token);
    return res.status(401).json({ error: 'Unauthorized — Invalid token' });
  }

  const payload = {
    firstName,
    email,
    locationId: GHL_LOCATION_ID,
    tags: ['modsuav-form'],
    customField: [
      {
        id: GHL_FORM_ID_FIELD,
        value: formId || '',
      },
    ],
  };

  console.log('🧾 FINAL GHL Payload:', JSON.stringify(payload, null, 2));

  try {
    const ghlRes = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GHL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const ghlText = await ghlRes.text();

    if (!ghlRes.ok) {
      console.error('❌ GHL Error:', ghlText);
      return res.status(ghlRes.status).send(ghlText);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('🚫 GHL Fetch Error:', err);
    return res.status(500).json({ error: 'GHL connection failed' });
  }
}

















