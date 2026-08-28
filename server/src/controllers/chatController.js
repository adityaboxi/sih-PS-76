import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:4000';

export const handleChat = async (req, res) => {
  try {
    const { message, language_code, conversation_id, grievance_id } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    try {
      const aiRes = await axios.post(`${AI_SERVICE_URL}/api/v1/chat`, {
        message,
        language_code: language_code || 'en',
        conversation_id,
        grievance_id
      }, { timeout: 6000 });
      return res.json({ success: true, data: aiRes.data });
    } catch (aiErr) {
      console.warn('AI Chat offline fallback:', aiErr.message);
      return res.json({
        success: true,
        data: {
          reply: 'Thank you for reaching out. Our citizen support team is ready to assist you. Please provide your Grievance Tracking ID or query details.',
          detected_language: language_code || 'en',
          cited_sources: ['Citizen Charter SOP 2026'],
          suggested_actions: ['File a Grievance', 'Track Ticket']
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
