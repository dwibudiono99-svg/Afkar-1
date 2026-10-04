import React, { useState } from 'react';
import { X, Check, UserCheck } from 'lucide-react';
import { AttendeeItem } from '../types';
import { SignatureCanvas } from './SignatureCanvas';

interface QuickSignKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: AttendeeItem[];
  selectedAttendeeId?: string;
  onSaveSignature: (attendeeId: string, signatureDataUrl: string) => void;
  onAddNewAttendeeAndSign?: (name: string, role: string, nip: string, org: string, signature: string) => void;
}

export const QuickSignKioskModal: React.FC<QuickSignKioskModalProps> = ({
  isOpen,
  onClose,
  attendees,
  selectedAttendeeId,
  onSaveSignature,
  onAddNewAttendeeAndSign,
}) => {
  const [activeAttendeeId, setActiveAttendeeId] = useState<string>(selectedAttendeeId || (attendees[0]?.id ?? ''));
  const [currentSignature, setCurrentSignature] = useState<string>('');
  const [isNewAttendeeMode, setIsNewAttendeeMode] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const currentAttendee = attendees.find((a) => a.id === activeAttendeeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSignature) {
      alert('Silakan bubuhkan tanda tangan terlebih dahulu pada canvas!');
      return;
    }

    if (isNewAttendeeMode) {
      if (!newName.trim() || !newRole.trim()) {
        alert('Mohon isi nama lengkap dan jabatan!');
        return;
      }
      if (onAddNewAttendeeAndSign) {
        onAddNewAttendeeAndSign(newName, newRole, newNip, newOrg, currentSignature);
      }
      setSuccessMessage(`Presensi & Tanda Tangan ${newName} berhasil disimpan!`);
      setNewName('');
      setNewRole('');
      setNewNip('');
      setIsNewAttendeeMode(false);
    } else {
      if (!activeAttendeeId) return;
      onSaveSignature(activeAttendeeId, currentSignature);
      setSuccessMessage(`Tanda tangan untuk ${currentAttendee?.name} berhasil disimpan!`);
    }

    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Presensi Mandiri / Mode Tablet Kiosk</h3>
              <p className="text-xs text-slate-400">Bubuhkan tanda tangan kehadiran peserta secara digital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-500 text-white px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
            <Check className="w-4 h-4" /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Pilih Peserta atau Tambah Baru:</span>
            <button
              type="button"
              onClick={() => setIsNewAttendeeMode(!isNewAttendeeMode)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isNewAttendeeMode ? '← Pilih dari Daftar yang Ada' : '+ Peserta Belum Terdaftar?'}
            </button>
          </div>

          {!isNewAttendeeMode ? (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Nama Peserta Terdaftar:
              </label>
              <select
                value={activeAttendeeId}
                onChange={(e) => setActiveAttendeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {attendees.map((a, idx) => (
                  <option key={a.id} value={a.id}>
                    {idx + 1}. {a.name} — {a.role} {a.signature ? '(Sudah TTD ✓)' : '(Belum TTD)'}
                  </option>
                ))}
              </select>

              {currentAttendee && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                  <div className="font-bold text-slate-900">{currentAttendee.name}</div>
                  <div className="text-slate-600">{currentAttendee.role}</div>
                  {currentAttendee.nip && currentAttendee.nip !== '-' && (
                    <div className="text-[11px] text-slate-500 font-mono">NIP: {currentAttendee.nip}</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5 p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Kom."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jabatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kepala Seksi"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NIP / NIK (Opsional)</label>
                  <input
                    type="text"
                    placeholder="1985xxxx xxxxx xx x"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Instansi / Unit Kerja</label>
                <input
                  type="text"
                  placeholder="Dinas Komunikasi & Informatika"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Signature Canvas */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Goreskan Tanda Tangan Digital Anda:
            </label>
            <SignatureCanvas
              onSignatureChange={(url) => setCurrentSignature(url)}
              namePrompt={isNewAttendeeMode ? newName : currentAttendee?.name || ''}
              height={140}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Simpan Presensi & TTD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
