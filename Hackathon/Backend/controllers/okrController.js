// OKR Controller
// Handles OKR submission, retrieval, and updates
import OKR from '../models/OKR.js';
import axios from 'axios';

export const submitOKR = async (req, res) => {
  const { okr_text, userId, isYourOKR } = req.body;

  try {
    if (isYourOKR) {
      // Set all other OKRs for this user to false
      await OKR.updateMany({ userId, isYourOKR: true }, { $set: { isYourOKR: false } });
    }
    const response = await axios.post('http://localhost:8000/submit_okr', req.body);
    // Save to DB
    const okrPayload = {
      userId: req.body.userId,
      name: req.body.name,
      leetcodeId: req.body.leetcodeId,
      githubId: req.body.githubId,
      linkedinId: req.body.linkedinId,
      isYourOKR: req.body.isYourOKR || false,
      ...response.data
    };
    const savedOKR = await OKR.create(okrPayload);
    res.json(savedOKR);
  } catch (error) {
    res.status(500).json({ error: 'AI pipeline error', details: error.message });
  }
};

export const getOKRs = async (req, res) => {
  try {
    const okrs = await OKR.find();
    res.json(okrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to check if any OKR for a user has isYourOKR true
export const checkIsYourOKR = async (req, res) => {
  const { userId } = req.query;
  try {
    const okr = await OKR.findOne({ userId, isYourOKR: true });
    res.json({ exists: !!okr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the OKR where isYourOKR is true
export const getPrimaryOKR = async (req, res) => {
  try {
    const okr = await OKR.findOne({ isYourOKR: true });
    if (!okr) return res.status(404).json({ error: 'No primary OKR found' });
    res.json(okr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all OKRs
export const getAllOKRs = async (req, res) => {
  try {
    const okrs = await OKR.find();
    res.json(okrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get OKR by ID
export const getOKRById = async (req, res) => {
  try {
    const okr = await OKR.findById(req.params.id);
    if (!okr) return res.status(404).json({ error: 'OKR not found' });
    res.json(okr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 