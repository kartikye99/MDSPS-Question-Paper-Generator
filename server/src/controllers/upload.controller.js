const { extractQuestionsFromDrafts } = require('../services/gemini.service');

/**
 * Controller for handling handwritten question paper uploads and AI OCR conversion requests
 */
exports.handleUpload = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'NO_FILES_UPLOADED',
        message: 'Please select at least one handwritten question paper image or PDF.'
      });
    }

    const {
      schoolName = 'Maharshi Dayanand Saraswati Public School',
      examType = 'Annual Examination',
      subject = '',
      maxMarks = '',
      examClass = '',
      session = '',
      examDate = '',
      duration = '',
      instructions = ''
    } = req.body;

    const filesSummary = files.map((file, index) => ({
      pageNumber: index + 1,
      name: file.originalname,
      sizeBytes: file.size,
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: file.mimetype
    }));

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = Boolean(
      geminiApiKey &&
      geminiApiKey.trim() !== '' &&
      geminiApiKey !== 'your_gemini_api_key_here'
    );

    // If Gemini API Key is not set or placeholder, do not fake transcription!
    if (!isApiKeyConfigured) {
      return res.status(200).json({
        success: false,
        code: 'GEMINI_API_KEY_REQUIRED',
        message: 'Draft received successfully, but Google Gemini API key is missing.',
        help: 'To transcribe handwritten English and Hindi question papers, please add your GEMINI_API_KEY in server/.env.',
        filesReceived: filesSummary,
        examDetails: {
          schoolName,
          examType,
          subject,
          maxMarks,
          examClass,
          session,
          examDate,
          duration,
          instructions
        }
      });
    }

    // Call Gemini Vision to extract questions in English and Hindi
    console.log(`[Upload Controller] Processing ${files.length} draft file(s) for "${schoolName}" - Subject: "${subject}"...`);

    const extractedPaper = await extractQuestionsFromDrafts(files, {
      schoolName,
      examType,
      subject,
      maxMarks,
      examClass,
      session,
      examDate,
      duration,
      instructions
    });

    return res.status(200).json({
      success: true,
      code: 'OCR_EXTRACTION_SUCCESS',
      message: `Questions extracted successfully from ${files.length} handwritten draft page(s).`,
      filesReceived: filesSummary,
      data: extractedPaper
    });
  } catch (error) {
    console.error('[Upload Controller Error]:', error.message);

    const statusCode = error.statusCode || (error.code === 'INVALID_API_KEY' ? 400 : 500);

    return res.status(statusCode).json({
      success: false,
      code: error.code || 'EXTRACTION_FAILED',
      message: error.message || 'Failed to extract handwritten questions.',
      details: error.statusText || null
    });
  }
};
