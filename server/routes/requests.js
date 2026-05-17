const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { verifyAdmin } = require('../middleware/auth');

const DATA_FILE = path.join(__dirname, '../data/requests.json');
if (process.env.VERCEL !== '1' && !fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, { requests: [] });
}

const getRequests = () => {
  try {
    return fs.readJsonSync(DATA_FILE).requests;
  } catch {
    return [];
  }
};
const saveRequests = (requests) => {
  if (process.env.VERCEL === '1') return;
  fs.writeJsonSync(DATA_FILE, { requests });
};

// Email transporter
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOwnerEmail = async (requestData, design) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured. Skipping email notification.');
    return;
  }
  const transporter = createTransporter();
  const whatsappLink = `https://wa.me/${process.env.OWNER_WHATSAPP}?text=${encodeURIComponent(
    `New booking request from ${requestData.customerName} for "${design?.title || 'a design'}". Event: ${requestData.eventType} on ${requestData.eventDate}.`
  )}`;

  await transporter.sendMail({
    from: `"AVD Spark Decor" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `🌟 New Booking Request - ${requestData.eventType} from ${requestData.customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #b8860b, #ffd700); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: #0a0a0a;">AVD Spark Decor</h1>
          <p style="margin: 8px 0 0; color: #0a0a0a; font-size: 16px;">New Booking Request ✨</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #ffd700; margin-top: 0;">Customer Details</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #aaa;">Name</td><td style="padding: 8px 0; font-weight: bold;">${requestData.customerName}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Phone</td><td style="padding: 8px 0;">${requestData.phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td style="padding: 8px 0;">${requestData.email || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Event Type</td><td style="padding: 8px 0;">${requestData.eventType}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Event Date</td><td style="padding: 8px 0;">${requestData.eventDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Venue</td><td style="padding: 8px 0;">${requestData.venue || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Design Selected</td><td style="padding: 8px 0; color: #ffd700; font-weight: bold;">${design?.title || 'N/A'} (${design?.category || ''})</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Budget</td><td style="padding: 8px 0;">${requestData.budget || 'Not mentioned'}</td></tr>
          </table>
          ${requestData.message ? `<div style="margin-top: 20px; background: #1a1a1a; padding: 16px; border-radius: 8px; border-left: 4px solid #ffd700;"><p style="margin: 0; color: #ccc;">"${requestData.message}"</p></div>` : ''}
          <div style="margin-top: 30px; text-align: center;">
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">💬 Reply on WhatsApp</a>
          </div>
        </div>
        <div style="background: #111; padding: 16px; text-align: center; color: #666; font-size: 12px;">
          Request ID: ${requestData.id} • ${new Date().toLocaleString('en-IN')}
        </div>
      </div>
    `
  });
};

const sendCustomerConfirmation = async (requestData, design) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !requestData.email) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"AVD Spark Decor" <${process.env.EMAIL_USER}>`,
    to: requestData.email,
    subject: `✨ Your booking request is received - AVD Spark Decor`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #b8860b, #ffd700); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: #0a0a0a;">AVD Spark Decor</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #ffd700;">Hello ${requestData.customerName}! 🌟</h2>
          <p style="color: #ccc; line-height: 1.7;">Thank you for choosing AVD Spark Decor. We have received your booking request for <strong style="color: #ffd700;">${design?.title || 'your selected design'}</strong>.</p>
          <p style="color: #ccc; line-height: 1.7;">Our team will contact you within <strong style="color: #ffd700;">24 hours</strong> to discuss the details and confirm your booking.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #888; font-size: 13px;">Your Request ID</p>
            <p style="margin: 4px 0 0; color: #ffd700; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${requestData.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="color: #888; font-size: 14px;">For urgent queries, contact us on WhatsApp: <a href="https://wa.me/${process.env.OWNER_WHATSAPP}" style="color: #25D366;">+${process.env.OWNER_WHATSAPP}</a></p>
        </div>
      </div>
    `
  });
};

// POST new request (public)
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, eventType, eventDate, venue, designId, budget, message } = req.body;
    if (!customerName || !phone || !eventType || !eventDate) {
      return res.status(400).json({ success: false, message: 'Name, phone, event type and date are required' });
    }

    // Get design info
    let design = null;
    if (designId) {
      try {
        const designsData = fs.readJsonSync(path.join(__dirname, '../data/designs.json'));
        design = designsData.designs.find(d => d.id === designId) || null;
      } catch (e) {}
    }

    const newRequest = {
      id: uuidv4(),
      customerName, phone, email: email || null,
      eventType, eventDate, venue: venue || null,
      designId: designId || null,
      designTitle: design?.title || null,
      budget: budget || null,
      message: message || null,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const requests = getRequests();
    requests.unshift(newRequest);
    saveRequests(requests);

    // Send notifications (non-blocking)
    Promise.all([
      sendOwnerEmail(newRequest, design).catch(e => console.error('Owner email failed:', e.message)),
      sendCustomerConfirmation(newRequest, design).catch(e => console.error('Customer email failed:', e.message))
    ]);

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully!',
      requestId: newRequest.id.slice(0, 8).toUpperCase()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all requests (admin only)
router.get('/', verifyAdmin, (req, res) => {
  try {
    const requests = getRequests();
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// PATCH update request status (admin only)
router.patch('/:id/status', verifyAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const requests = getRequests();
    const idx = requests.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Request not found' });
    requests[idx].status = status;
    requests[idx].updatedAt = new Date().toISOString();
    saveRequests(requests);
    res.json({ success: true, request: requests[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
