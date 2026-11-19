import React from 'react';
import { Printer, Download, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function FinalExaminationPaper({ paperData, formData, onBack }) {
  // Always prioritize user-entered form data over AI extraction as mandated by requirements
  const schoolName = (formData?.schoolName || paperData?.schoolName || 'Maharshi Dayanand Saraswati Public School').trim();
  const examType = (formData?.examType || paperData?.examinationType || 'Annual Examination 2026').trim();
  const examClass = (formData?.examClass || paperData?.classGrade || 'X').trim();
  const subject = (formData?.subject || paperData?.subject || 'Mathematics').trim();
  const timeAllowed = (formData?.duration || paperData?.timeAllowed || '3 Hours').trim();
  const maxMarks = formData?.maxMarks !== undefined && formData?.maxMarks !== ''
    ? formData.maxMarks
    : (paperData?.maximumMarks || '80');
  const examDate = formData?.examDate?.trim();
  const session = formData?.session?.trim();

  // Collect all flagged/unclear questions across sections
  const flaggedQuestions = [];
  (paperData?.sections || []).forEach((sec) => {
    (sec.questions || []).forEach((q) => {
      if (q.flagged) {
        flaggedQuestions.push({
          num: q.questionNumber,
          warning: q.unclearWarning || 'Unclear handwriting in original draft'
        });
      }
    });
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const totalQuestions = (paperData?.sections || []).reduce(
    (sum, sec) => sum + (sec.questions?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-100/80 py-6 sm:py-8">
      {/* 1. TOP ACTION TOOLBAR (Hidden in Print) */}
      <div className="no-print max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-school-navy bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Convert Another Paper</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-500 font-medium">
                {totalQuestions} Questions Converted
              </span>
            </div>
          </div>

          {/* Two Prominent Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-school-navy hover:bg-school-accent text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-school-gold" />
              <span>PRINT QUESTION PAPER</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              title="Save directly as PDF in your print dialog"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PDF</span>
            </button>
          </div>
        </div>

        {/* Unclear Handwriting Alert Banner (Hidden in Print) */}
        {flaggedQuestions.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-900">
                Notice: {flaggedQuestions.length} Question(s) Had Unclear Handwriting
              </p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                The AI flagged Question {flaggedQuestions.map((f) => `#${f.num}`).join(', ')} because portions of the original draft were faded, smeared, or difficult to decipher. Please verify these items before printing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. THE OFFICIAL A4 PRINTABLE EXAMINATION SHEET */}
      <div className="max-w-[210mm] mx-auto px-2 sm:px-0">
        <div
          id="examination-paper"
          className="print-document bg-white text-black shadow-md border border-slate-300 sm:rounded-lg p-8 sm:p-12 min-h-[297mm] font-serif leading-relaxed"
          style={{ width: '100%', maxWidth: '210mm' }}
        >
          {/* EXACT EXAMINATION HEADER LAYOUT REQUIRED */}
          <div className="text-center pb-1 mb-3">
            {/* 1. School Name (Centered, Bold Professional Typography, No Logo) */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black font-serif text-center mb-1">
              {schoolName}
            </h1>

            {/* 2. Examination Type (Centered, Directly below School Name) */}
            <h2 className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-black font-serif text-center mb-2">
              {examType}
            </h2>

            {/* 3. Thin Horizontal Divider */}
            <hr className="border-t border-black my-2" />

            {/* 4. Row 1: Class (Left) and Subject (Right) */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-sans font-bold py-0.5">
              <div className="text-left">
                Class: <span className="font-serif font-bold">{examClass}</span>
              </div>
              <div className="text-right">
                Subject: <span className="font-serif font-bold">{subject}</span>
              </div>
            </div>

            {/* 5. Row 2: Time Allowed (Left) and Maximum Marks (Right) */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-sans font-bold py-0.5">
              <div className="text-left">
                Time Allowed: <span className="font-serif font-normal">{timeAllowed}</span>
              </div>
              <div className="text-right">
                Maximum Marks: <span className="font-serif font-bold">{maxMarks}</span>
              </div>
            </div>

            {/* Optional details if provided by user */}
            {(examDate || session) && (
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-sans text-black/80 py-0.5">
                {examDate ? <div className="text-left">Date: <span className="font-serif">{examDate}</span></div> : <div />}
                {session ? <div className="text-right">Session: <span className="font-serif">{session}</span></div> : <div />}
              </div>
            )}

            {/* 6. Another Thin Horizontal Divider */}
            <hr className="border-t border-black my-2" />
          </div>

          {/* General Instructions (if extracted or provided) */}
          {paperData?.generalInstructions && paperData.generalInstructions.length > 0 && (
            <div className="mb-4 pb-2 border-b border-black/30 text-xs sm:text-sm font-sans">
              <p className="font-bold underline mb-1">General Instructions:</p>
              <ul className="space-y-0.5 list-none pl-1">
                {paperData.generalInstructions.map((inst, idx) => (
                  <li key={idx} className="leading-snug">
                    {inst}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections and Original Questions Content */}
          <div className="space-y-5">
            {(paperData?.sections || []).map((section, sIdx) => (
              <div key={section.sectionId || sIdx} className="page-break-inside-avoid">
                {/* Section Title */}
                <div className="text-center my-3">
                  <h3 className="font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider underline inline-block">
                    {section.sectionName || `SECTION ${String.fromCharCode(65 + sIdx)}`}
                  </h3>
                  {section.description && (
                    <p className="text-[11px] sm:text-xs italic text-black/80 mt-0.5 font-sans">
                      ({section.description})
                    </p>
                  )}
                </div>

                {/* Questions under this section */}
                <div className="space-y-3">
                  {(section.questions || []).map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className="flex items-start justify-between gap-4 py-0.5 page-break-inside-avoid"
                    >
                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          {/* Question Number */}
                          <span className="font-bold whitespace-nowrap min-w-[28px] text-xs sm:text-sm">
                            {q.questionNumber ? `${q.questionNumber}.` : `Q.${qIdx + 1}.`}
                          </span>

                          {/* Question Text (English, Hindi, or Mixed) */}
                          <div className="flex-1 text-xs sm:text-sm leading-relaxed font-serif">
                            <span>{q.questionText}</span>

                            {/* Hindi Text if explicitly provided as bilingual pair */}
                            {q.hindiText && q.hindiText !== q.questionText && (
                              <div className="mt-1 font-devanagari text-black/90">
                                {q.hindiText}
                              </div>
                            )}

                            {/* Subquestions */}
                            {q.subquestions && q.subquestions.length > 0 && (
                              <div className="mt-1.5 space-y-1 pl-4">
                                {q.subquestions.map((sub, subIdx) => (
                                  <div key={subIdx} className="flex items-start gap-2">
                                    <span className="font-bold min-w-[20px]">
                                      {sub.label || `(${String.fromCharCode(97 + subIdx)})`}
                                    </span>
                                    <span>{sub.text || sub}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Multiple Choice Options */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-1.5 pl-4 text-xs font-sans">
                                {q.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-1.5">
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Unclear Handwriting Warning Indicator (Hidden on Print) */}
                            {q.flagged && (
                              <div className="no-print mt-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-300 rounded px-2 py-0.5 inline-flex items-center gap-1 font-sans">
                                <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                                <span>Draft handwriting was unclear here: {q.unclearWarning || 'Please verify text'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Marks on the Right Side */}
                      <div className="text-right flex-shrink-0 font-bold font-sans text-xs sm:text-sm min-w-[32px] pt-0.5">
                        {q.marks !== undefined && q.marks !== null ? `[${q.marks}]` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* End of Question Paper marker */}
          <div className="mt-8 pt-3 text-center border-t border-black/20 text-xs font-sans text-black/60 tracking-wider uppercase">
            *** End of Question Paper / प्रश्न पत्र समाप्त ***
          </div>
        </div>
      </div>
    </div>
  );
}
