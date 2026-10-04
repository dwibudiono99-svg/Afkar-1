import React, { useState } from 'react';
import {
  Users,
  Building2,
  Calendar,
  ListTodo,
  FileCheck2,
  Sparkles,
  UserPlus,
  Trash2,
  Plus,
  Search,
  PenTool,
  Tablet,
  Download,
  Upload,
} from 'lucide-react';
import { AppState, ActionStatus, ActionPriority, AttendeeItem } from '../types';
import { SignatureCanvas } from './SignatureCanvas';
import { presetTemplates } from '../data/presets';

interface EditorSidebarProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onUpdateConfig: (key: keyof AppState['config'], value: any) => void;
  onOpenKiosk: () => void;
  onOpenQuickSignAttendee: (attendeeId: string) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  state,
  onUpdateState,
  onUpdateConfig,
  onOpenKiosk,
  onOpenQuickSignAttendee,
}) => {
  const [activeTab, setActiveTab] = useState<
    'presensi' | 'kop' | 'agenda' | 'notulensi' | 'action_plan' | 'presets'
  >('presensi');

  // Form states for adding attendee
  const [attName, setAttName] = useState('');
  const [attNip, setAttNip] = useState('');
  const [attRole, setAttRole] = useState('');
  const [attOrg, setAttOrg] = useState('');
  const [attSignature, setAttSignature] = useState('');
  const [searchAttendee, setSearchAttendee] = useState('');

  // Signature state for officials
  const [editingOfficialSig, setEditingOfficialSig] = useState<'pimpinan' | 'notulis' | null>(null);

  // Attendees Handlers
  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attName.trim() || !attRole.trim()) return;

    const newAttendee: AttendeeItem = {
      id: `att-${Date.now()}`,
      name: attName.trim(),
      nip: attNip.trim() || '-',
      role: attRole.trim(),
      organization: attOrg.trim() || state.config.unitKerja,
      signature: attSignature,
      status: 'Hadir',
      signedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    onUpdateState({
      ...state,
      attendees: [...state.attendees, newAttendee],
    });

    // Reset Form
    setAttName('');
    setAttNip('');
    setAttRole('');
    setAttOrg('');
    setAttSignature('');
  };

  const handleRemoveAttendee = (id: string) => {
    if (confirm('Hapus peserta ini dari daftar presensi?')) {
      onUpdateState({
        ...state,
        attendees: state.attendees.filter((a) => a.id !== id),
      });
    }
  };

  const handleClearAllAttendees = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh daftar peserta?')) {
      onUpdateState({
        ...state,
        attendees: [],
      });
    }
  };

  const exportAttendeesCSV = () => {
    const headers = 'No,Nama Lengkap,NIP/ID,Jabatan,Instansi,Status Kehadiran,Waktu TTD\n';
    const rows = state.attendees
      .map(
        (a, idx) =>
          `"${idx + 1}","${a.name}","${a.nip}","${a.role}","${a.organization}","${a.status}","${a.signedAt || '-'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Presensi_Rapat_${state.config.kota}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Notulensi Handlers
  const handleAddNotulensi = () => {
    const newItem = {
      id: `notul-${Date.now()}`,
      pembicara: 'Nama Pembicara / Pemapar',
      jabatanPembicara: 'Jabatan / Seksi',
      waktu: '10.00 WIB',
      topik: 'Topik Pembahasan Baru',
      poin: 'Uraikan hasil diskusi atau pemaparan yang disampaikan pada sesi ini...',
    };
    onUpdateState({
      ...state,
      notulensi: [...state.notulensi, newItem],
    });
  };

  const handleUpdateNotulensi = (id: string, field: string, value: string) => {
    onUpdateState({
      ...state,
      notulensi: state.notulensi.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    });
  };

  const handleRemoveNotulensi = (id: string) => {
    onUpdateState({
      ...state,
      notulensi: state.notulensi.filter((n) => n.id !== id),
    });
  };

  // Kesimpulan Handlers
  const handleAddKesimpulan = () => {
    const newItem = {
      id: `kes-${Date.now()}`,
      text: 'Poin rumusan kesimpulan atau keputusan rapat...',
      kategori: 'Keputusan',
    };
    onUpdateState({
      ...state,
      kesimpulan: [...state.kesimpulan, newItem],
    });
  };

  const handleUpdateKesimpulan = (id: string, field: string, value: string) => {
    onUpdateState({
      ...state,
      kesimpulan: state.kesimpulan.map((k) => (k.id === id ? { ...k, [field]: value } : k)),
    });
  };

  const handleRemoveKesimpulan = (id: string) => {
    onUpdateState({
      ...state,
      kesimpulan: state.kesimpulan.filter((k) => k.id !== id),
    });
  };

  // Action Plan Handlers
  const handleAddActionPlan = () => {
    const newItem = {
      id: `act-${Date.now()}`,
      task: 'Uraian rencana tindak lanjut kegiatan baru',
      pic: 'Penanggung Jawab / Seksi',
      deadline: '30 Okt 2026',
      status: 'Proses' as ActionStatus,
      prioritas: 'Sedang' as ActionPriority,
      outputTarget: 'Laporan Selesai',
    };
    onUpdateState({
      ...state,
      actionPlan: [...state.actionPlan, newItem],
    });
  };

  const handleUpdateActionPlan = (id: string, field: string, value: any) => {
    onUpdateState({
      ...state,
      actionPlan: state.actionPlan.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    });
  };

  const handleRemoveActionPlan = (id: string) => {
    onUpdateState({
      ...state,
      actionPlan: state.actionPlan.filter((a) => a.id !== id),
    });
  };

  // Preset Template Loader
  const handleLoadPreset = (presetKey: string) => {
    const template = presetTemplates[presetKey];
    if (!template) return;
    if (confirm(`Terapkan template "${template.label}"? Perubahan teks yang belum disimpan akan digantikan template.`)) {
      onUpdateState({
        ...state,
        ...template.data,
        config: {
          ...state.config,
          ...template.data.config,
        },
      });
    }
  };

  const filteredAttendees = state.attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      a.role.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      (a.nip && a.nip.includes(searchAttendee))
  );

  return (
    <aside className="no-print w-full md:w-[460px] lg:w-[490px] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-61px)] shadow-lg z-20 flex-shrink-0">
      {/* Top Tab Bar */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('presensi')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'presensi'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Presensi ({state.attendees.length})
        </button>
        <button
          onClick={() => setActiveTab('kop')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kop'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Kop Surat
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'agenda'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Agenda
        </button>
        <button
          onClick={() => setActiveTab('notulensi')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notulensi'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" /> Notulensi
        </button>
        <button
          onClick={() => setActiveTab('action_plan')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'action_plan'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" /> Matriks
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'presets'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Template Preset"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Preset
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* TAB 1: PRESENSI & TTD DIGITAL                                  */}
        {/* ============================================================== */}
        {activeTab === 'presensi' && (
          <div className="space-y-4">
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <div>
                <span className="text-xs font-bold text-blue-900 block">Mode Tablet Kiosk</span>
                <span className="text-[11px] text-blue-700">Edarkan tablet ke peserta rapat untuk TTD mandiri</span>
              </div>
              <button
                type="button"
                onClick={onOpenKiosk}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
              >
                <Tablet className="w-3.5 h-3.5" /> Buka Kiosk
              </button>
            </div>

            {/* Form Tambah Peserta */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-600" /> Input Peserta & Tanda Tangan
              </h3>

              <form onSubmit={handleAddAttendee} className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dr. Budi Santoso, S.T., M.T."
                    value={attName}
                    onChange={(e) => setAttName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      NIP / NIK / ID
                    </label>
                    <input
                      type="text"
                      placeholder="19850101 201001 1 002"
                      value={attNip}
                      onChange={(e) => setAttNip(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Jabatan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Kabid Aptika"
                      value={attRole}
                      onChange={(e) => setAttRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Instansi / Unit Kerja
                  </label>
                  <input
                    type="text"
                    placeholder="Diskominfo Kota Nusantara"
                    value={attOrg}
                    onChange={(e) => setAttOrg(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {/* Signature canvas */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tanda Tangan Digital (Bisa langsung atau susulan)
                  </label>
                  <SignatureCanvas
                    onSignatureChange={(url) => setAttSignature(url)}
                    namePrompt={attName}
                    height={110}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <UserPlus className="w-4 h-4" /> Simpan Peserta ke Daftar
                </button>
              </form>
            </div>

            {/* List Peserta Terdata */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Daftar Peserta ({state.attendees.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={exportAttendeesCSV}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    title="Download presensi sebagai spreadsheet CSV"
                  >
                    <Download className="w-3 h-3" /> Unduh CSV
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllAttendees}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, jabatan, atau NIP..."
                  value={searchAttendee}
                  onChange={(e) => setSearchAttendee(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredAttendees.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Belum ada peserta yang sesuai.
                  </p>
                ) : (
                  filteredAttendees.map((a, idx) => (
                    <div
                      key={a.id}
                      className="p-2.5 border border-slate-200 rounded-lg bg-white flex items-center justify-between gap-2 text-xs hover:border-blue-300 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 truncate">
                            {idx + 1}. {a.name}
                          </span>
                          {a.signature ? (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                              ✓ TTD
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenQuickSignAttendee(a.id)}
                              className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded hover:bg-amber-200 transition"
                            >
                              + Isi TTD
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {a.role} {a.nip && a.nip !== '-' ? `| NIP. ${a.nip}` : ''}
                        </p>
                      </div>

                      {a.signature && (
                        <img
                          src={a.signature}
                          alt="TTD"
                          className="h-7 w-14 object-contain bg-slate-50 border rounded p-0.5 flex-shrink-0"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(a.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: KOP SURAT & IDENTITAS INSTANSI                          */}
        {/* ============================================================== */}
        {activeTab === 'kop' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Lambang / Logo Instansi
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih Lambang Resmi
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onUpdateConfig('logoType', 'government')}
                    className={`p-2 border rounded-lg text-left transition flex items-center gap-2 ${
                      state.config.logoType === 'government'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏛️ Pemerintah / Daerah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateConfig('logoType', 'corporate')}
                    className={`p-2 border rounded-lg text-left transition flex items-center gap-2 ${
                      state.config.logoType === 'corporate'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏢 Korporat / BUMN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateConfig('logoType', 'education')}
                    className={`p-2 border rounded-lg text-left transition flex items-center gap-2 ${
                      state.config.logoType === 'education'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🎓 Kampus / Akademik</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateConfig('logoType', 'community')}
                    className={`p-2 border rounded-lg text-left transition flex items-center gap-2 ${
                      state.config.logoType === 'community'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🤝 Komunitas / Yayasan</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Atau Unggah Logo Kustom Sendiri
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="customLogoUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        onUpdateConfig('customLogoUrl', ev.target?.result as string);
                        onUpdateConfig('logoType', 'custom');
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="customLogoUpload"
                    className="flex-1 py-1.5 px-3 border border-slate-300 rounded-lg text-xs text-center cursor-pointer hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    {state.config.customLogoUrl ? 'Ganti Logo Kustom' : 'Pilih Gambar Logo'}
                  </label>
                  {state.config.customLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateConfig('customLogoUrl', '');
                        onUpdateConfig('logoType', 'government');
                      }}
                      className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded border border-rose-200"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Warna Aksen Instansi
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.config.accentColor}
                      onChange={(e) => onUpdateConfig('accentColor', e.target.value)}
                      className="w-8 h-8 p-0.5 border border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">
                      {state.config.accentColor}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Model Garis Kop
                  </label>
                  <select
                    value={state.config.borderStyle}
                    onChange={(e) => onUpdateConfig('borderStyle', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="double">Ganda (Baku Permendagri)</option>
                    <option value="thick-thin">Tebal-Tipis Modern</option>
                    <option value="minimal">Tunggal Minimalis</option>
                    <option value="none">Tanpa Garis</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Identitas Teks Kop */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Teks Identitas Instansi
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Instansi Atasan (Header Baris 1)
                </label>
                <input
                  type="text"
                  value={state.config.instansiAtasan}
                  onChange={(e) => onUpdateConfig('instansiAtasan', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Unit Kerja / Dinas (Header Utama) *
                </label>
                <input
                  type="text"
                  value={state.config.unitKerja}
                  onChange={(e) => onUpdateConfig('unitKerja', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sub Unit / Bidang (Opsional)
                </label>
                <input
                  type="text"
                  value={state.config.subUnitKerja}
                  onChange={(e) => onUpdateConfig('subUnitKerja', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Lengkap Kantor
                </label>
                <textarea
                  rows={2}
                  value={state.config.alamat}
                  onChange={(e) => onUpdateConfig('alamat', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kontak / Telepon
                  </label>
                  <input
                    type="text"
                    value={state.config.kontak}
                    onChange={(e) => onUpdateConfig('kontak', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Website / Email
                  </label>
                  <input
                    type="text"
                    value={state.config.website}
                    onChange={(e) => onUpdateConfig('website', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={state.config.kodePos}
                    onChange={(e) => onUpdateConfig('kodePos', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gaya Huruf Dokumen
                  </label>
                  <select
                    value={state.config.fontFamily}
                    onChange={(e) => onUpdateConfig('fontFamily', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="serif">Serif (Times / Tinos - Resmi)</option>
                    <option value="sans">Sans-Serif (Modern / Bersih)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AGENDA & PERSURATAN                                     */}
        {/* ============================================================== */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> Agenda & Surat Rapat
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Judul / Agenda Rapat *
                </label>
                <input
                  type="text"
                  value={state.config.judulRapat}
                  onChange={(e) => onUpdateConfig('judulRapat', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nomor Surat / Berkas
                  </label>
                  <input
                    type="text"
                    value={state.config.noSurat}
                    onChange={(e) => onUpdateConfig('noSurat', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sifat Naskah
                  </label>
                  <input
                    type="text"
                    value={state.config.sifat}
                    onChange={(e) => onUpdateConfig('sifat', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Hari & Tanggal
                  </label>
                  <input
                    type="text"
                    value={state.config.hariTanggal}
                    onChange={(e) => onUpdateConfig('hariTanggal', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={state.config.waktu}
                    onChange={(e) => onUpdateConfig('waktu', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tempat Rapat
                  </label>
                  <input
                    type="text"
                    value={state.config.tempat}
                    onChange={(e) => onUpdateConfig('tempat', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kota Penerbitan
                  </label>
                  <input
                    type="text"
                    value={state.config.kota}
                    onChange={(e) => onUpdateConfig('kota', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dasar Surat Perintah / Pelaksanaan
                </label>
                <input
                  type="text"
                  value={state.config.dasarPelaksanaan}
                  onChange={(e) => onUpdateConfig('dasarPelaksanaan', e.target.value)}
                  placeholder="Contoh: Surat Perintah Tugas Kepala Dinas No. 800/..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Pejabat Penandatangan */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Pejabat Penandatangan</span>
                <span className="text-[11px] font-normal text-slate-500">Pimpinan & Notulis</span>
              </h3>

              {/* Pimpinan */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-bold text-blue-900 block">Pimpinan Rapat</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nama & Gelar</label>
                    <input
                      type="text"
                      value={state.config.namaPimpinan}
                      onChange={(e) => onUpdateConfig('namaPimpinan', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">NIP / NIK</label>
                    <input
                      type="text"
                      value={state.config.nipPimpinan}
                      onChange={(e) => onUpdateConfig('nipPimpinan', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Jabatan Lengkap</label>
                  <input
                    type="text"
                    value={state.config.jabatanPimpinan}
                    onChange={(e) => onUpdateConfig('jabatanPimpinan', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-600">Tanda Tangan Pimpinan</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingOfficialSig(editingOfficialSig === 'pimpinan' ? null : 'pimpinan')
                      }
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" />
                      {state.config.ttdPimpinanUrl ? 'Ganti TTD' : '+ Bubuhkan TTD'}
                    </button>
                  </div>
                  {editingOfficialSig === 'pimpinan' && (
                    <div className="p-2 bg-slate-50 border border-blue-200 rounded-lg">
                      <SignatureCanvas
                        onSignatureChange={(url) => {
                          onUpdateConfig('ttdPimpinanUrl', url);
                        }}
                        namePrompt={state.config.namaPimpinan}
                        height={100}
                      />
                    </div>
                  )}
                  {state.config.ttdPimpinanUrl && editingOfficialSig !== 'pimpinan' && (
                    <div className="flex items-center gap-2">
                      <img
                        src={state.config.ttdPimpinanUrl}
                        alt="TTD Pimpinan"
                        className="h-8 max-w-28 object-contain border rounded bg-slate-50 p-1"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateConfig('ttdPimpinanUrl', '')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Hapus TTD
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notulis */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-bold text-blue-900 block">Notulis Rapat</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nama & Gelar</label>
                    <input
                      type="text"
                      value={state.config.namaNotulis}
                      onChange={(e) => onUpdateConfig('namaNotulis', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">NIP / NIK</label>
                    <input
                      type="text"
                      value={state.config.nipNotulis}
                      onChange={(e) => onUpdateConfig('nipNotulis', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Jabatan Lengkap</label>
                  <input
                    type="text"
                    value={state.config.jabatanNotulis}
                    onChange={(e) => onUpdateConfig('jabatanNotulis', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-600">Tanda Tangan Notulis</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingOfficialSig(editingOfficialSig === 'notulis' ? null : 'notulis')
                      }
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" />
                      {state.config.ttdNotulisUrl ? 'Ganti TTD' : '+ Bubuhkan TTD'}
                    </button>
                  </div>
                  {editingOfficialSig === 'notulis' && (
                    <div className="p-2 bg-slate-50 border border-blue-200 rounded-lg">
                      <SignatureCanvas
                        onSignatureChange={(url) => {
                          onUpdateConfig('ttdNotulisUrl', url);
                        }}
                        namePrompt={state.config.namaNotulis}
                        height={100}
                      />
                    </div>
                  )}
                  {state.config.ttdNotulisUrl && editingOfficialSig !== 'notulis' && (
                    <div className="flex items-center gap-2">
                      <img
                        src={state.config.ttdNotulisUrl}
                        alt="TTD Notulis"
                        className="h-8 max-w-28 object-contain border rounded bg-slate-50 p-1"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateConfig('ttdNotulisUrl', '')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Hapus TTD
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: NOTULENSI & PEMBAHASAN                                  */}
        {/* ============================================================== */}
        {activeTab === 'notulensi' && (
          <div className="space-y-4">
            {/* Pendahuluan */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                I. Pendahuluan & Latar Belakang
              </label>
              <textarea
                rows={3}
                value={state.config.pendahuluan}
                onChange={(e) => onUpdateConfig('pendahuluan', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              />
            </div>

            {/* Poin-Poin Pembahasan Notulensi */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  II. Poin Pembahasan Notulensi ({state.notulensi.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddNotulensi}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Tambah Sesi
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {state.notulensi.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-700 font-bold">
                      <span>Sesi Pembahasan #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNotulensi(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        placeholder="Nama Pembicara"
                        value={item.pembicara}
                        onChange={(e) =>
                          handleUpdateNotulensi(item.id, 'pembicara', e.target.value)
                        }
                        className="px-2 py-1 border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Jabatan / Waktu"
                        value={item.jabatanPembicara || ''}
                        onChange={(e) =>
                          handleUpdateNotulensi(item.id, 'jabatanPembicara', e.target.value)
                        }
                        className="px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Topik / Pokok Bahasan"
                      value={item.topik}
                      onChange={(e) => handleUpdateNotulensi(item.id, 'topik', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded font-semibold text-slate-800"
                    />

                    <textarea
                      rows={2}
                      placeholder="Uraian poin notulensi jalannya rapat..."
                      value={item.poin}
                      onChange={(e) => handleUpdateNotulensi(item.id, 'poin', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Kesimpulan Utama */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  III. Kesimpulan Utama Rapat ({state.kesimpulan.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddKesimpulan}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>

              <div className="space-y-2">
                {state.kesimpulan.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2 bg-white border border-slate-200 rounded-lg flex items-start gap-2 text-xs"
                  >
                    <span className="font-bold text-slate-400 mt-1">{idx + 1}.</span>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        placeholder="Kategori (mis: Keputusan / Jadwal)"
                        value={item.kategori || ''}
                        onChange={(e) =>
                          handleUpdateKesimpulan(item.id, 'kategori', e.target.value)
                        }
                        className="w-full px-2 py-0.5 border border-slate-200 rounded text-[11px] font-semibold text-blue-900"
                      />
                      <textarea
                        rows={2}
                        value={item.text}
                        onChange={(e) =>
                          handleUpdateKesimpulan(item.id, 'text', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveKesimpulan(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MATRIKS ACTION PLAN                                     */}
        {/* ============================================================== */}
        {activeTab === 'action_plan' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Matriks Tindak Lanjut ({state.actionPlan.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Akan tercetak rapi pada Halaman 2 (Lampiran I)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddActionPlan}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tugas
              </button>
            </div>

            <div className="space-y-2.5">
              {state.actionPlan.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">
                        {idx + 1}
                      </span>
                      <span>Item Tindak Lanjut</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActionPlan(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Uraian Tugas / Kegiatan *</label>
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) =>
                        handleUpdateActionPlan(item.id, 'task', e.target.value)
                      }
                      className="w-full px-2.5 py-1 border border-slate-200 rounded font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Penanggung Jawab (PIC)</label>
                      <input
                        type="text"
                        value={item.pic}
                        onChange={(e) =>
                          handleUpdateActionPlan(item.id, 'pic', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Batas Waktu (Deadline)</label>
                      <input
                        type="text"
                        value={item.deadline}
                        onChange={(e) =>
                          handleUpdateActionPlan(item.id, 'deadline', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Prioritas</label>
                      <select
                        value={item.prioritas}
                        onChange={(e) =>
                          handleUpdateActionPlan(item.id, 'prioritas', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                      >
                        <option value="Tinggi">Tinggi (Segera)</option>
                        <option value="Sedang">Sedang (Rutin)</option>
                        <option value="Rendah">Rendah (Fleksibel)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Status</label>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateActionPlan(item.id, 'status', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                      >
                        <option value="Belum Mulai">Belum Mulai</option>
                        <option value="Proses">Proses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Tunda">Tunda</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Target Output (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Draf Dokumen SOP / 100% Selesai"
                      value={item.outputTarget || ''}
                      onChange={(e) =>
                        handleUpdateActionPlan(item.id, 'outputTarget', e.target.value)
                      }
                      className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: TEMPLATE PRESETS                                        */}
        {/* ============================================================== */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>Template Siap Pakai:</strong> Pilih jenis organisasi untuk mengubah otomatis format naskah, kop instansi, struktur pejabat, dan contoh materi notulensi.
            </div>

            <div className="space-y-2.5">
              {Object.entries(presetTemplates).map(([key, template]) => (
                <div
                  key={key}
                  className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl space-y-2 transition shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{template.label}</span>
                    <button
                      type="button"
                      onClick={() => handleLoadPreset(key)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded transition"
                    >
                      Gunakan Template
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
