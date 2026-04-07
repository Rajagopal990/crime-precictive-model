import { useRef, useState } from 'react';

const ALLOWED_EXTENSIONS = ['csv', 'json', 'xlsx', 'xls', 'pdf', 'png', 'jpg', 'jpeg', 'bmp', 'webp', 'tiff'];

export default function UploadBox({ onUpload }) {
  const fileRef = useRef(null);
  const [selectedName, setSelectedName] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      setSelectedName('');
      setError('');
      return;
    }

    const name = file.name || '';
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';

    if (file.type?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'].includes(ext)) {
      setSelectedFile(null);
      setSelectedName('');
      setError('Video files are not allowed. Upload CSV, JSON, Excel, PDF, or image files.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setSelectedFile(null);
      setSelectedName('');
      setError('Unsupported file type. Use CSV, JSON, Excel, PDF, or image files.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setError('');
    setSelectedFile(file);
    setSelectedName(name);
  };

  const handlePrimaryAction = async () => {
    if (!selectedFile) {
      fileRef.current?.click();
      return;
    }

    setSubmitting(true);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setSelectedName('');
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <h3 className="font-display text-lg font-semibold">Bulk FIR Upload</h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Upload CSV, JSON, Excel, PDF, or images. Videos are blocked. Image uploads run through a CNN-based analyzer.</p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.bmp,.webp,.tiff,image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
          onClick={handlePrimaryAction}
          disabled={submitting}
        >
          {submitting ? 'Uploading...' : selectedFile ? 'Upload File' : 'Choose File'}
        </button>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{selectedName || 'Choose a CSV, JSON, Excel, PDF, or image file.'}</p>
        {error && <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      </div>
    </div>
  );
}
