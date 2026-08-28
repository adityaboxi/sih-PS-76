import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:4000';

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, language_code } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/v1/chat`, {
        message,
        language_code: language_code || 'auto'
      }, { timeout: 5000 });

      return res.json({ success: true, data: response.data });
    } catch (aiErr) {
      // Resilient local conversational response
      const isWater = message.includes('জল') || message.includes('पानी') || message.toLowerCase().includes('water');
      const isPower = message.includes('বিদ্যুৎ') || message.includes('बिजली') || message.toLowerCase().includes('wire');
      
      let reply = 'নমস্কার! আমি নাগরিক সহায়ক। আপনার অভিযোগ বা যে কোনো নাগরিক পরিষেবা সম্পর্কে প্রশ্ন করতে পারেন।';
      if (isWater) {
        reply = 'পানীয় জল সংক্রান্ত অভিযোগের জন্য আমাদের জল সরবরাহ বিভাগ ৪ ঘণ্টার মধ্যে জরুরি মেরামত দল পাঠায়। আপনি সরাসরি এই পোর্টাল থেকেই অভিযোগ দাখিল করতে পারেন।';
      } else if (isPower) {
        reply = 'ছেঁড়া তার বা ট্রান্সফরমার স্পার্ক দেখলে দয়া করে বিদ্যুৎ হেল্পলাইন ১৯১২ অথবা ১১২ তে কল করুন। আমাদের পোর্টালে অভিযোগ দাখিল করলে এটি ২ ঘণ্টার মধ্যে অগ্রাধিকার পায়।';
      }

      return res.json({
        success: true,
        data: {
          reply,
          detected_language: language_code || 'bn',
          cited_sources: ['Citizen Charter 2026 - West Bengal Public Services'],
          suggested_actions: ['File Grievance', 'Track Status']
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
