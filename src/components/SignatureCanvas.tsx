import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool, Upload, Wand2, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string) => void;
  initialSignature?: string;
  namePrompt?: string;
  height?: number;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  initialSignature = '',
  namePrompt = '',
  height = 130,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));
  const [penColor, setPenColor] = useState('#0f172a'); // Black/Deep Slate or Navy
  const [penWidth, setPenWidth] = useState(2.2);
  const [mode, setMode] = useState<'draw' | 'generate' | 'upload'>('draw');
  const [typedName, setTypedName] = useState(namePrompt);
  const [cursiveFont, setCursiveFont] = useState<'style1' | 'style2' | 'style3'>('style1');

  useEffect(() => {
    if (namePrompt && !typedName) {
      setTypedName(namePrompt);
    }
  }, [namePrompt, typedName]);

  // Set up canvas with high DPI sharpness
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, height);
        ctx.drawImage(img, 0, 0, rect.width, height);
        setHasDrawn(true);
      };
      img.src = initialSignature;
    }
  }, [height]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    exportData();
  };

  const exportData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, height);
    setHasDrawn(false);
    onSignatureChange('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();

        ctx.clearRect(0, 0, rect.width, height);
        // Draw centered and proportional
        const scale = Math.min((rect.width - 20) / img.width, (height - 10) / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (rect.width - w) / 2;
        const y = (height - h) / 2;

        ctx.drawImage(img, x, y, w, h);
        setHasDrawn(true);
        exportData();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const generateSignatureFromText = () => {
    const canvas = canvasRef.current;
    if (!canvas || !typedName.trim()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, height);

    ctx.fillStyle = penColor;
    ctx.strokeStyle = penColor;

    const fontFamilies = {
      style1: "'Brush Script MT', 'Segoe Script', cursive, sans-serif",
      style2: "'Snell Roundhand', 'Great Vibes', 'Edwardian Script ITC', cursive",
      style3: "'Dancing Script', 'Caveat', 'Segoe Script', cursive",
    };

    ctx.font = `italic 36px ${fontFamilies[cursiveFont]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cleanName = typedName.split(',')[0].replace(/^(Dr\.|Prof\.|Ir\.|Drs\.|Dra\.|H\.|Hj\.)\s*/gi, '');
    ctx.fillText(cleanName, rect.width / 2, height / 2 - 4);

    // Add artistic swoosh under the signature
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const startX = rect.width / 2 - Math.min(cleanName.length * 9, rect.width * 0.38);
    const endX = rect.width / 2 + Math.min(cleanName.length * 10, rect.width * 0.42);
    ctx.moveTo(startX, height / 2 + 16);
    ctx.bezierCurveTo(
      rect.width / 2,
      height / 2 + 24,
      rect.width / 2 + 20,
      height / 2 + 10,
      endX,
      height / 2 + 18
    );
    ctx.stroke();

    setHasDrawn(true);
    exportData();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition ${
              mode === 'draw' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3 h-3" /> Goreskan
          </button>
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition ${
              mode === 'generate' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-3 h-3" /> Buat TTD
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition ${
              mode === 'upload' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" /> Unggah
          </button>
        </div>

        <button
          type="button"
          onClick={clearCanvas}
          className="text-rose-600 hover:text-rose-700 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-50 transition"
        >
          <Eraser className="w-3 h-3" /> Bersihkan
        </button>
      </div>

      {mode === 'generate' && (
        <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Ketik nama untuk paraf/tanda tangan..."
              className="flex-1 px-2.5 py-1 bg-white border border-blue-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={generateSignatureFromText}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Terapkan
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>Gaya Kaligrafi:</span>
            {(['style1', 'style2', 'style3'] as const).map((style, idx) => (
              <label key={style} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="fontStyle"
                  checked={cursiveFont === style}
                  onChange={() => setCursiveFont(style)}
                  className="accent-blue-600"
                />
                <span>Model #{idx + 1}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="p-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-xs">
          <label className="cursor-pointer block p-2 hover:bg-slate-100 rounded transition">
            <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
            <span className="text-blue-600 font-medium hover:underline">Pilih file gambar TTD (PNG / JPG)</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Disarankan file transparan latar belakang bersih</p>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Signature drawing canvas container */}
      <div className="relative signature-pad-container overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full bg-slate-50/50 cursor-crosshair block rounded-lg touch-none"
          style={{ height: `${height}px` }}
        />

        {!hasDrawn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none text-xs">
            <PenTool className="w-4 h-4 mb-1 text-slate-300" />
            <span>Goreskan tanda tangan / paraf di sini</span>
            <span className="text-[10px] text-slate-400">Gunakan mouse, stylus pen, atau layar sentuh</span>
          </div>
        )}

        <div className="absolute bottom-1 right-2 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-500 border border-slate-200 pointer-events-auto">
          <span>Tinta:</span>
          <button
            type="button"
            onClick={() => setPenColor('#0f172a')}
            className={`w-3.5 h-3.5 rounded-full bg-slate-900 border ${penColor === '#0f172a' ? 'ring-2 ring-blue-500' : ''}`}
            title="Hitam"
          />
          <button
            type="button"
            onClick={() => setPenColor('#1e3a8a')}
            className={`w-3.5 h-3.5 rounded-full bg-blue-900 border ${penColor === '#1e3a8a' ? 'ring-2 ring-blue-500' : ''}`}
            title="Biru Naskah Dinas"
          />
          <span className="ml-1 border-l pl-1.5 border-slate-300">Tebal:</span>
          <button
            type="button"
            onClick={() => setPenWidth(1.6)}
            className={`px-1 rounded ${penWidth === 1.6 ? 'bg-slate-200 font-bold' : ''}`}
          >
            Tipis
          </button>
          <button
            type="button"
            onClick={() => setPenWidth(2.5)}
            className={`px-1 rounded ${penWidth === 2.5 ? 'bg-slate-200 font-bold' : ''}`}
          >
            Standar
          </button>
        </div>
      </div>
    </div>
  );
};
