import React, { useState } from 'react';
import Header from './components/Header';
import ExamDetailsForm from './components/ExamDetailsForm';
import FileUploadArea from './components/FileUploadArea';
import SystemStatusModal from './components/SystemStatusModal';
import ApiKeyNoticeModal from './components/ApiKeyNoticeModal';
import FinalExaminationPaper from './components/FinalExaminationPaper';
import { uploadDraftFiles } from './services/api';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

function App() {
  // 3-Step Navigation State: 'upload' | 'paper'
  const [currentStep, setCurrentStep] = useState('upload');
  const [convertedPaper, setConvertedPaper] = useState(null);

  // 6 Core Examination Fields + Optional Secondary Details
  const [formData, setFormData] = useState({
    schoolName: 'Maharshi Dayanand Saraswati Public School',
    examType: 'Annual Examination 2026',
    examClass: 'X',
    subject: '',
    duration: '3 Hours',
    maxMarks: '',
    examDate: '',
    session: '2026-2027'
  });

  const [formErrors, setFormErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Form input change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form fields before upload
  const validateForm = () => {
    const errors = {};
    if (!formData.schoolName.trim()) {
      errors.schoolName = 'School name is required';
    }
    if (!formData.examType.trim()) {
      errors.examType = 'Examination type is required';
    }
    if (!formData.examClass.trim()) {
      errors.examClass = 'Class is required (e.g. V, VI, X, XII)';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required (e.g. Mathematics, Science, हिन्दी)';
    }
    if (!formData.duration.trim()) {
      errors.duration = 'Time allowed is required (e.g. 2 Hours, 3 Hours)';
    }
    if (!formData.maxMarks || Number(formData.maxMarks) <= 0) {
      errors.maxMarks = 'Maximum marks is required (e.g. 50, 80, 100)';
    }
    if (files.length === 0) {
      setUploadError('Please upload at least one handwritten question paper image or PDF.');
      return false;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Convert Button Click (STEP 1 -> STEP 2 -> STEP 3)
  const handleConvert = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { status, data: result } = await uploadDraftFiles(files, formData);
      setUploadResult(result);

      if (status >= 200 && status < 300) {
        if (result.code === 'GEMINI_API_KEY_REQUIRED') {
          setApiKeyModalOpen(true);
        } else if (result.success && result.data) {
          // STEP 3: Display the final professionally formatted document!
          // Guarantee that user form inputs strictly override any AI-extracted metadata
          const mergedPaper = {
            ...result.data,
            schoolName: formData.schoolName.trim(),
            examinationType: formData.examType.trim(),
            classGrade: formData.examClass.trim(),
            subject: formData.subject.trim(),
            timeAllowed: formData.duration.trim(),
            maximumMarks: formData.maxMarks
          };
          setConvertedPaper(mergedPaper);
          setCurrentStep('paper');
        } else {
          setUploadError(result.message || 'Unable to process document.');
        }
      } else {
        setUploadError(result.error?.message || result.message || 'Failed to convert handwritten document.');
      }
    } catch (err) {
      console.error('Conversion Error:', err);
      setUploadError('Unable to connect to the server. Please check your backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. School Header (Hidden on Print) */}
      <div className="no-print">
        <Header onOpenSystemStatus={() => setStatusModalOpen(true)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentStep === 'paper' && convertedPaper ? (
          /* STEP 3: Display Final Digital Document (Print / Download PDF) */
          <FinalExaminationPaper
            paperData={convertedPaper}
            formData={formData}
            onBack={() => {
              setCurrentStep('upload');
            }}
          />
        ) : (
          /* STEP 1: Upload Handwritten Draft & Exam Details */
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Main Heading and Subtitle */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-school-navy tracking-tight mb-2.5">
                Handwritten Question Paper Converter
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Upload your handwritten examination drafts in <strong className="text-slate-800">English</strong> or <strong className="text-slate-800">हिन्दी (Devanagari)</strong>.
                AI will transcribe, typeset, and format them into an official printable A4 examination sheet.
              </p>
            </div>

            {/* Error Banner */}
            {uploadError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-3 shadow-xs animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm">
                  <p className="font-bold text-red-900">Conversion Issue</p>
                  <p className="text-red-700 mt-0.5 leading-relaxed">{uploadError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleConvert}>
              {/* Core Examination Details (School, Exam Type, Class, Subject, Time, Max Marks) */}
              <ExamDetailsForm
                formData={formData}
                onChange={handleFormChange}
                errors={formErrors}
              />

              {/* Large File Upload Interface */}
              <FileUploadArea
                files={files}
                onFilesChange={setFiles}
                error={uploadError}
                setError={setUploadError}
              />

              {/* Action Button & Processing Indicator (STEP 2) */}
              <div className="mt-8 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isSubmitting || files.length === 0}
                  className={`w-full sm:w-auto min-w-[340px] px-8 py-4 rounded-xl font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-3 select-none active:scale-98 ${
                    files.length === 0 || isSubmitting
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-school-navy hover:bg-school-accent text-white hover:shadow-lg hover:shadow-school-navy/20 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-school-gold" />
                      <span>Converting Handwriting to Digital Paper...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-school-gold" />
                      <span>Convert Handwriting to Digital Paper</span>
                    </>
                  )}
                </button>

                {isSubmitting && (
                  <p className="text-xs text-school-accent font-medium mt-3 animate-pulse text-center">
                    Transcribing handwritten English & हिन्दी (Devanagari) script using Gemini Vision...
                  </p>
                )}

                {!isSubmitting && (
                  <p className="text-xs text-slate-400 mt-3 text-center">
                    Supports handwritten English and हिन्दी (Devanagari) script • Professional A4 Output
                  </p>
                )}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer (Hidden on Print) */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-700">
            Maharshi Dayanand Saraswati Public School — Examination Paper Generator
          </p>
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setStatusModalOpen(true)}
              className="text-slate-500 hover:text-school-navy transition-colors font-medium"
            >
              System Status
            </button>
            <span>•</span>
            <span className="text-slate-500">English & Hindi Bilingual Digitizer</span>
          </div>
        </div>
      </footer>

      {/* System Status Modal */}
      <SystemStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />

      {/* API Key Instructions Modal */}
      <ApiKeyNoticeModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        uploadData={uploadResult}
      />
    </div>
  );
}

export default App;
