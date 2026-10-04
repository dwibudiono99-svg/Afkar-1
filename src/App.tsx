import { useState, useEffect } from 'react';
import { AppState } from './types';
import { defaultState, presetTemplates } from './data/presets';
import { Navbar } from './components/Navbar';
import { EditorSidebar } from './components/EditorSidebar';
import { DocumentPreview } from './components/DocumentPreview';
import { PreviewControls } from './components/PreviewControls';
import { QuickSignKioskModal } from './components/QuickSignKioskModal';
import { Check } from 'lucide-react';

const STORAGE_KEY = 'official_report_pro_data_v2';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of missing keys
        return {
          ...defaultState,
          ...parsed,
          config: {
            ...defaultState.config,
            ...(parsed.config || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed loading localStorage', e);
    }
    return defaultState;
  });

  const [documentRevision, setDocumentRevision] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(new Date());
  const [zoom, setZoom] = useState<number>(88);
  const [viewMode, setViewMode] = useState<'all' | 'laporan' | 'action_plan' | 'presensi'>('all');

  // Kiosk / Tablet Modal state
  const [isKioskOpen, setIsKioskOpen] = useState<boolean>(false);
  const [selectedAttendeeForSign, setSelectedAttendeeForSign] = useState<string | undefined>(undefined);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setLastSavedTime(new Date());
    } catch (e) {
      console.error('LocalStorage save failed', e);
    }
  }, [state]);

  const handleApplyPreset = (presetKey: string) => {
    const template = presetTemplates[presetKey];
    if (!template || !template.data) return;

    const newState: AppState = {
      config: {
        ...defaultState.config,
        ...(template.data.config || {}),
      },
      notulensi: [...(template.data.notulensi || defaultState.notulensi)],
      kesimpulan: [...(template.data.kesimpulan || defaultState.kesimpulan)],
      actionPlan: [...(template.data.actionPlan || defaultState.actionPlan)],
      attendees: [...(template.data.attendees || defaultState.attendees)],
    };

    setState(newState);
    setDocumentRevision((r) => r + 1);
    setToastMessage(`✓ Template "${template.label}" berhasil diterapkan ke seluruh dokumen!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleUpdateConfig = (key: keyof AppState['config'], value: any) => {
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleUpdateNotulensi = (index: number, text: string) => {
    setState((prev) => {
      const updated = [...prev.notulensi];
      if (updated[index]) {
        updated[index] = { ...updated[index], poin: text };
      }
      return { ...prev, notulensi: updated };
    });
  };

  const handleUpdateKesimpulan = (index: number, text: string) => {
    setState((prev) => {
      const updated = [...prev.kesimpulan];
      if (updated[index]) {
        updated[index] = { ...updated[index], text };
      }
      return { ...prev, kesimpulan: updated };
    });
  };

  const handleUpdateKetentuanTindakLanjut = (index: number, text: string) => {
    setState((prev) => {
      const current = [
        ...(prev.config.ketentuanTindakLanjut || [
          'Setiap PIC wajib mengunggah bukti dukung (evidence) pelaksanaan tugas pada dashboard sistem evaluasi.',
          'Monitoring progres dilakukan secara berkala tiap hari Jumat pada akhir pekan berjalan.',
          'Kendala teknis atau pergeseran target harus dilaporkan segera kepada pimpinan rapat untuk alternatif penyesuaian.',
        ]),
      ];
      current[index] = text;
      return {
        ...prev,
        config: {
          ...prev.config,
          ketentuanTindakLanjut: current,
        },
      };
    });
  };

  const handleSaveSignature = (attendeeId: string, signatureDataUrl: string) => {
    setState((prev) => ({
      ...prev,
      attendees: prev.attendees.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              signature: signatureDataUrl,
              signedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            }
          : a
      ),
    }));
  };

  const handleAddNewAttendeeAndSign = (
    name: string,
    role: string,
    nip: string,
    org: string,
    signature: string
  ) => {
    const newAttendee = {
      id: `att-${Date.now()}`,
      name,
      nip: nip || '-',
      role,
      organization: org || state.config.unitKerja,
      signature,
      status: 'Hadir' as const,
      signedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setState((prev) => ({
      ...prev,
      attendees: [...prev.attendees, newAttendee],
    }));
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setDocumentRevision((r) => r + 1);
    setToastMessage('✓ Pengaturan dokumen telah dikembalikan ke format awal.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenQuickSignAttendee = (attendeeId: string) => {
    setSelectedAttendeeForSign(attendeeId);
    setIsKioskOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col antialiased relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-400 animate-bounce">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        state={state}
        onImportState={(newState) => {
          setState(newState);
          setDocumentRevision((r) => r + 1);
        }}
        onResetState={handleReset}
        lastSavedTime={lastSavedTime}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex flex-col md:flex-row overflow-hidden">
        {/* Left Side Control Panel */}
        <EditorSidebar
          state={state}
          onUpdateState={setState}
          onUpdateConfig={handleUpdateConfig}
          onApplyPreset={handleApplyPreset}
          onOpenKiosk={() => {
            setSelectedAttendeeForSign(undefined);
            setIsKioskOpen(true);
          }}
          onOpenQuickSignAttendee={handleOpenQuickSignAttendee}
        />

        {/* Right Side Live A4 Canvas Preview */}
        <main className="flex-1 bg-slate-200/70 p-2 sm:p-4 md:p-6 overflow-y-auto flex flex-col items-center relative h-[calc(100vh-61px)]">
          {/* Floating Controls Bar */}
          <PreviewControls
            zoom={zoom}
            onZoomChange={setZoom}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showQrCode={state.config.showQrCode}
            onToggleQrCode={() =>
              handleUpdateConfig('showQrCode', !state.config.showQrCode)
            }
            onApplyPreset={handleApplyPreset}
            activeUnitKerja={state.config.unitKerja}
          />

          {/* Document Preview Pages - key forces clean remount on preset change */}
          <DocumentPreview
            key={`doc-rev-${documentRevision}-${state.config.unitKerja}`}
            state={state}
            viewMode={viewMode}
            zoom={zoom}
            onUpdateConfig={handleUpdateConfig}
            onUpdateNotulensi={handleUpdateNotulensi}
            onUpdateKesimpulan={handleUpdateKesimpulan}
            onUpdateKetentuanTindakLanjut={handleUpdateKetentuanTindakLanjut}
            onOpenQuickSign={handleOpenQuickSignAttendee}
          />
        </main>
      </div>

      {/* Tablet Kiosk / Quick Digital Sign Modal */}
      <QuickSignKioskModal
        isOpen={isKioskOpen}
        onClose={() => {
          setIsKioskOpen(false);
          setSelectedAttendeeForSign(undefined);
        }}
        attendees={state.attendees}
        selectedAttendeeId={selectedAttendeeForSign}
        onSaveSignature={handleSaveSignature}
        onAddNewAttendeeAndSign={handleAddNewAttendeeAndSign}
      />
    </div>
  );
}
