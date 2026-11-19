const { GoogleGenerativeAI } = require('@google/generative-ai');

// Candidate models in order of priority (gemini-3.1-flash-lite is active, fast & multimodal)
const MODEL_CANDIDATES = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

/**
 * Extracts and transcribes questions from handwritten question paper images/PDFs
 * using Google Gemini Vision API without translating between languages.
 *
 * @param {Array<Object>} files - Array of multer file objects with buffer and mimetype
 * @param {Object} examDetails - Metadata (schoolName, examType, subject, maxMarks)
 * @returns {Promise<Object>} Structured question paper data
 */
async function extractQuestionsFromDrafts(files, examDetails = {}) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const error = new Error('Google Gemini API Key is missing. Please configure GEMINI_API_KEY in server/.env.');
    error.code = 'GEMINI_API_KEY_REQUIRED';
    error.statusCode = 400;
    throw error;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // 1. Prepare image/document parts in sequential order
  const fileParts = files.map((file) => {
    return {
      inlineData: {
        mimeType: file.mimetype,
        data: file.buffer.toString('base64')
      }
    };
  });

  // 2. Bilingual OCR prompt specifically designed for Maharshi Dayanand Saraswati Public School
  const prompt = `
You are an expert handwritten examination paper transcriber for Maharshi Dayanand Saraswati Public School (MDSPS).
Your job is to read handwritten question papers (in English, Hindi, or Mixed) and convert them into a digital, professional examination paper.

USER-SPECIFIED METADATA (Use as fallback if not clearly written in document):
- School Name: ${examDetails.schoolName || 'Maharshi Dayanand Saraswati Public School'}
- Examination Type: ${examDetails.examType || 'Annual Examination'}
- Subject: ${examDetails.subject || 'General'}
- Maximum Marks: ${examDetails.maxMarks || 80}

CRITICAL TRANSCRIPTION RULES:
1. STRICT LANGUAGE PRESERVATION - NEVER TRANSLATE:
   - If a question is in English, transcribe it purely in English.
   - If a question is in Hindi (Devanagari script: हिन्दी), transcribe it purely in Hindi.
   - If a question has mixed English and Hindi text, preserve the exact combination.
   - NEVER translate Hindi into English or English into Hindi.
2. PRESERVE ORIGINAL WORDING & ORDER:
   - Maintain the exact question order, question numbering, and wording.
   - Never invent missing questions or omit any questions.
   - Accurately preserve mathematical equations, fractions, square roots, formulas, and symbols.
   - DO NOT repeat or duplicate the School Name, Examination Title, Class, or Subject as questions or section titles. The system automatically typesets the header. Transcribe only the sections, instructions, and questions.
3. EXTRACT SECTIONS & HEADINGS:
   - Extract section headings as written (e.g. "SECTION A", "खंड 'क'", "PART 1").
   - If no section is written, assign them to "SECTION A / खंड 'क'".
4. EXTRACT QUESTION MARKS:
   - Extract marks assigned to each question (e.g., [1], [2], [3], [5], [10 Marks]).
   - If marks are indicated per section (e.g., "All questions carry 2 marks"), apply accordingly.
5. EXTRACT SUBQUESTIONS & OPTIONS:
   - Extract subparts neatly (e.g., (a), (b), (c) or (i), (ii), (iii)).
   - Extract multiple choice options (A, B, C, D).
6. GENERAL INSTRUCTIONS:
   - Extract any general instructions or student directions written on the paper.
7. UNREADABLE / UNCLEAR HANDWRITING:
   - If any word, number, or equation cannot be confidently deciphered:
     * Set "flagged": true for that question.
     * Set "unclearWarning": A brief note describing what is unclear (e.g., "Unclear word in question 3", "Handwritten equation partially blurred").
     * DO NOT guess or invent text.
   - If the handwriting is clear, set "flagged": false and "unclearWarning": null.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema with NO markdown code block wrappers:
{
  "schoolName": "${examDetails.schoolName || 'Maharshi Dayanand Saraswati Public School'}",
  "examinationType": "${examDetails.examType || 'Annual Examination'}",
  "subject": "${examDetails.subject || 'Subject'}",
  "classGrade": "Extracted class e.g. Class 10th if written, else empty string",
  "maximumMarks": ${Number(examDetails.maxMarks) || 80},
  "timeAllowed": "Extracted time e.g. 3 Hours if written, else 3 Hours",
  "generalInstructions": [
    "1. All questions are compulsory.",
    "2. Write all answers clearly and neatly."
  ],
  "sections": [
    {
      "sectionId": "sec-1",
      "sectionName": "SECTION A / खंड 'क'",
      "description": "Short description if present (e.g., Multiple Choice Questions)",
      "questions": [
        {
          "id": "q-1",
          "questionNumber": "1",
          "questionText": "Exact transcribed text in original language",
          "marks": 1,
          "options": ["(a) Option 1", "(b) Option 2"],
          "subquestions": [
            {
              "label": "(i)",
              "text": "Subquestion text"
            }
          ],
          "flagged": false,
          "unclearWarning": null
        }
      ]
    }
  ]
}
`;

  // 3. Attempt extraction across candidate models
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`[Gemini Vision] Transcribing ${files.length} draft page(s) with model ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      });

      const contents = [
        ...fileParts,
        { text: prompt }
      ];

      const result = await model.generateContent(contents);
      const rawText = result.response.text();

      // Clean code fences if present
      let cleanJsonText = rawText.trim();
      if (cleanJsonText.startsWith('```json')) {
        cleanJsonText = cleanJsonText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      } else if (cleanJsonText.startsWith('```')) {
        cleanJsonText = cleanJsonText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
      }

      const parsedData = JSON.parse(cleanJsonText);
      console.log(`[Gemini Vision] Successfully converted handwritten document using ${modelName}!`);
      return {
        ...parsedData,
        _meta: {
          modelUsed: modelName,
          pagesProcessed: files.length,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (err) {
      console.warn(`[Gemini Vision] Model ${modelName} encountered error:`, err.message);
      lastError = err;

      // Fail fast on invalid key
      if (err.status === 400 && err.message?.includes('API_KEY_INVALID')) {
        const error = new Error('The provided Google Gemini API Key is invalid. Please check server/.env.');
        error.code = 'INVALID_API_KEY';
        error.statusCode = 400;
        throw error;
      }
    }
  }

  // All models failed
  console.error('[Gemini Vision] All models exhausted:', lastError);
  let failureMessage = `Failed to convert handwritten document: ${lastError?.message || 'Unknown error'}`;
  let statusCode = 502;
  let errorCode = 'EXTRACTION_FAILED';

  if (lastError?.status === 429 || lastError?.message?.includes('Quota exceeded') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
    failureMessage = 'Google Gemini API quota exceeded on your free tier (daily limit reached). Please check your Google AI Studio plan or try again later.';
    statusCode = 429;
    errorCode = 'QUOTA_EXCEEDED';
  } else if (lastError?.status === 503 || lastError?.message?.includes('high demand')) {
    failureMessage = 'Gemini Vision AI is temporarily busy. Please wait a moment and click Convert again.';
    statusCode = 503;
    errorCode = 'SERVICE_UNAVAILABLE';
  }

  const failureError = new Error(failureMessage);
  failureError.statusCode = statusCode;
  failureError.code = errorCode;
  throw failureError;
}

module.exports = {
  extractQuestionsFromDrafts,
  MODEL_CANDIDATES
};
