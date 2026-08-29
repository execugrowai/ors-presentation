export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'jason@infralaunchpro.com',
      to: 'jason@infralaunchpro.com',
      reply_to: email,
      subject: `ORS Presentation question from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nQuestion:\n${message}`
    })
  });

  if (res.ok) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    const err = await res.text();
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ error: 'Send failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
