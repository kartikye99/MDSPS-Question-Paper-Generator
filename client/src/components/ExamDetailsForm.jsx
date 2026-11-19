import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ExamDetailsForm({ formData, onChange, errors = {} }) {
  const [showOptional, setShowOptional] = useState(false);

  const examTypes = [
    'Annual Examination 2026',
    'Half-Yearly Examination 2026',
    'Mid-Term Examination 2026',
    'Pre-Board Examination 2026',
    'Unit Test 2026',
    'Monthly Test 2026',
    'Final Examination 2026',
    'Other'
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 mb-6">
      <div className="mb-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            Examination Details
          </h2>
          <p className="text-xs text-slate-500">
            These values format the official header on your final printable examination paper.
          </p>
        </div>
      </div>

      {/* 6 Core Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. School Name */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            1. School Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={onChange}
            className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
              errors.schoolName ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
            }`}
            placeholder="Maharshi Dayanand Saraswati Public School"
          />
          {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>}
        </div>

        {/* 2. Examination Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            2. Examination Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="examType"
              list="exam-type-options"
              value={formData.examType}
              onChange={onChange}
              className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
                errors.examType ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
              }`}
              placeholder="e.g. Annual Examination 2026"
            />
            <datalist id="exam-type-options">
              {examTypes.map((type) => (
                <option key={type} value={type} />
              ))}
            </datalist>
          </div>
          {errors.examType && <p className="text-red-500 text-xs mt-1">{errors.examType}</p>}
        </div>

        {/* 3. Class (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            3. Class / Grade <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="examClass"
            value={formData.examClass}
            onChange={onChange}
            className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
              errors.examClass ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
            }`}
            placeholder="e.g. V, VI, VII, VIII, IX, X, XI, XII"
          />
          {errors.examClass && <p className="text-red-500 text-xs mt-1">{errors.examClass}</p>}
        </div>

        {/* 4. Subject (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            4. Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={onChange}
            className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
              errors.subject ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
            }`}
            placeholder="e.g. Mathematics, Science, हिन्दी"
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>

        {/* 5. Time Allowed (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            5. Time Allowed <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={onChange}
            className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
              errors.duration ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
            }`}
            placeholder="e.g. 2 Hours, 3 Hours, 1 Hour 30 Minutes"
          />
          {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
        </div>

        {/* 6. Maximum Marks (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            6. Maximum Marks <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={onChange}
              min="1"
              max="500"
              className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white transition-all ${
                errors.maxMarks ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
              }`}
              placeholder="e.g. 50, 80, 100"
            />
            <span className="text-xs text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 font-medium pointer-events-none">
              Marks
            </span>
          </div>
          {errors.maxMarks && <p className="text-red-500 text-xs mt-1">{errors.maxMarks}</p>}
        </div>
      </div>

      {/* Optional Details (Date & Academic Session) */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-school-navy transition-colors py-1"
        >
          <span>{showOptional ? 'Hide Optional Details' : '+ Optional Details (Exam Date, Academic Session)'}</span>
          {showOptional ? (
            <ChevronUp className="w-3.5 h-3.5 ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          )}
        </button>

        {showOptional && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Examination Date (Optional)
              </label>
              <input
                type="text"
                name="examDate"
                value={formData.examDate || ''}
                onChange={onChange}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white"
                placeholder="e.g. 15-03-2026"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Academic Session (Optional)
              </label>
              <input
                type="text"
                name="session"
                value={formData.session || ''}
                onChange={onChange}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-navy focus:bg-white"
                placeholder="e.g. 2026-2027"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
