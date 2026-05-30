// src/emailService.js
// ─────────────────────────────────────────────────────────────────────────────
//  EmailJS configuration
//  ➜ Sign up at https://www.emailjs.com (free tier = 200 emails/month)
//  ➜ Connect your Gmail account (aisummit31@gmail.com) as the email service
//  ➜ Create 3 templates (see comments below) and paste the IDs here
// ─────────────────────────────────────────────────────────────────────────────
import emailjs from '@emailjs/browser';

// ─── PASTE YOUR OWN IDs HERE ─────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY   = 'UDBGUVnwzVRvo2O-4';   // Account → API Keys
const EMAILJS_SERVICE_ID   = 'service_mlq29mf';   // Email Services tab
const TEMPLATE_REGISTER    = 'template_uziqozm'; // template for registration
const TEMPLATE_LOGIN       = 'template_syxiwj6';    // template for login
const TEMPLATE_PAYMENT     = 'template_xj8w0m2';  // template for payment
// ─────────────────────────────────────────────────────────────────────────────

// Initialise once (safe to call multiple times)
emailjs.init(EMAILJS_PUBLIC_KEY);

// ─── HELPER ──────────────────────────────────────────────────────────────────
async function sendEmail(templateId, params) {
  try {
    const response = await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
    console.log('Email sent ✓', response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error('Email send failed ✗', error);
    return { success: false, error };
  }
}

// ─── 1. REGISTRATION CONFIRMATION ────────────────────────────────────────────
//  Required EmailJS template variables:
//   {{to_email}}   – recipient email
//   {{to_name}}    – user's display name
//   {{from_name}}  – "AI Sathi Team"
//   {{reply_to}}   – aisummit31@gmail.com
//   {{date}}       – registration date/time
// ─────────────────────────────────────────────────────────────────────────────
export async function sendRegistrationEmail({ email, name }) {
  if (!email) return;
  return sendEmail(TEMPLATE_REGISTER, {
    to_email:  email,
    to_name:   name || 'User',
    from_name: 'AI Sathi Team',
    reply_to:  'aisummit31@gmail.com',
    date:      new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
  });
}

// ─── 2. LOGIN WELCOME-BACK ────────────────────────────────────────────────────
//  Required EmailJS template variables:
//   {{to_email}}   – recipient email
//   {{to_name}}    – user's display name
//   {{from_name}}  – "AI Sathi Team"
//   {{reply_to}}   – aisummit31@gmail.com
//   {{login_time}} – formatted login date/time
// ─────────────────────────────────────────────────────────────────────────────
export async function sendLoginEmail({ email, name }) {
  if (!email) return;
  return sendEmail(TEMPLATE_LOGIN, {
    to_email:   email,
    to_name:    name || 'User',
    from_name:  'AI Sathi Team',
    reply_to:   'aisummit31@gmail.com',
    login_time: new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
  });
}

// ─── 3. RAZORPAY PAYMENT CONFIRMATION ────────────────────────────────────────
//  Required EmailJS template variables:
//   {{to_email}}      – recipient email
//   {{to_name}}       – payer name
//   {{from_name}}     – "AI Sathi Team"
//   {{reply_to}}      – aisummit31@gmail.com
//   {{event_title}}   – name of the event
//   {{people}}        – number of people
//   {{amount}}        – amount paid (e.g. "₹400")
//   {{payment_id}}    – Razorpay payment ID
//   {{payment_date}}  – formatted payment date/time
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail({ email, name, eventTitle, people, amount, paymentId }) {
  if (!email) return;
  return sendEmail(TEMPLATE_PAYMENT, {
    to_email:     email,
    to_name:      name || 'User',
    from_name:    'AI Sathi Team',
    reply_to:     'aisummit31@gmail.com',
    event_title:  eventTitle,
    people:       people,
    amount:       `₹${amount}`,
    payment_id:   paymentId,
    payment_date: new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
  });
}
