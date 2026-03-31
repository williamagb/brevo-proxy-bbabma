module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const email = body?.email;
  const prenom = body?.prenom;

  if (!email) return res.status(400).json({ error: 'Email requis' });

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      email: email,
      attributes: { PRENOM: prenom },
      updateEnabled: true
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data });
  return res.status(200).json({ success: true });
}
