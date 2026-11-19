/**
 * API Service for MDSPS Question Paper Generator
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }
  return response.json();
}

export async function uploadDraftFiles(files, examDetails) {
  const formData = new FormData();

  // Append handwritten draft files
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Append exam metadata
  Object.entries(examDetails).forEach(([key, value]) => {
    formData.append(key, value || '');
  });

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return { status: response.status, data: result };
}
