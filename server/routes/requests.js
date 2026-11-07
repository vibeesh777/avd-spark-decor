const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const store = require('../lib/store');


const getRequests = () => store.read('requests');
const saveRequests = (requests) => store.write('requests', requests);

// Bookings now happen by call / WhatsApp / Instagram, so there is no public submit route.
// These admin-only routes remain for viewing/updating older requests.

// GET all requests (admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const requests = await getRequests();
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// PATCH update request status (admin only)
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const requests = await getRequests();
    const idx = requests.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Request not found' });
    requests[idx].status = status;
    requests[idx].updatedAt = new Date().toISOString();
    await saveRequests(requests);
    res.json({ success: true, request: requests[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
