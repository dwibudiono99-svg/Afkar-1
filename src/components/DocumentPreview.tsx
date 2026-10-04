import React from 'react';
import { AppState } from '../types';
import { OfficialLogo } from './OfficialLogo';
import { DocumentVerificationBadge } from './DocumentVerificationBadge';

interface DocumentPreviewProps {
  state: AppState;
  viewMode: 'all' | 'laporan' | 'action_plan' | 'presensi';
  zoom: number;
  onUpdateConfig: (key: keyof AppState['config'], value: any) => void;
  onUpdateNotulensi: (index: number, text: string) => void;
  onUpdateKesimpulan: (index: number, text: string) => void;
  onUpdateKetentuanTindakLanjut?: (index: number, text: string) => void;
  onOpenQuickSign?: (attendeeId: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  state,
  viewMode,
  zoom,
  onUpdateConfig,
  onUpdateNotulensi,
  onUpdateKesimpulan,
  onUpdateKetentuanTindakLanjut,
  onOpenQuickSign,
}) => {
  const { config, notulensi, kesimpulan, actionPlan, attendees } = state;

  const fontClass = config.fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const borderClass =
    config.borderStyle === 'double'
      ? 'kop-border-double'
      : config.borderStyle === 'thick-thin'
      ? 'kop-border-thick-thin'
      : config.borderStyle === 'minimal'
      ? 'kop-border-minimal'
      : '';

  const hadirCount = attendees.filter((a) => a.status === 'Hadir').length;

  return (
    <div
      id="previewScaleWrapper"
      className="transition-transform origin-top flex flex-col items-center pb-12 w-full"
      style={{ transform: `scale(${zoom / 100})` }}
    >
      {/* ============================================================== */}
      {/* PAGE 1: LAPORAN & NOTULENSI UTAMA                              */}
      {/* ============================================================== */}
      {(viewMode === 'all' || viewMode === 'laporan') && (
        <div id="page-laporan-1" className={`a4-page print-area ${fontClass}`}>
          {/* KOP SURAT RESMI */}
          <div className={`${borderClass} pb-3.5 mb-3.5 flex items-center gap-4 relative`}>
            <OfficialLogo
              type={config.logoType}
              customUrl={config.customLogoUrl}
              color={config.accentColor}
              size={68}
            />

            <div className="flex-1 text-center font-serif">
              <h3
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('instansiAtasan', e.currentTarget.innerText)}
                className="text-[10pt] uppercase font-bold tracking-wide m-0 text-slate-800"
              >
                {config.instansiAtasan}
              </h3>
              <h1
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('unitKerja', e.currentTarget.innerText)}
                className="text-[14pt] uppercase font-extrabold tracking-wider m-0 leading-tight"
                style={{ color: config.accentColor }}
              >
                {config.unitKerja}
              </h1>
              {config.subUnitKerja && (
                <h4
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateConfig('subUnitKerja', e.currentTarget.innerText)}
                  className="text-[9.5pt] font-semibold tracking-normal m-0 text-slate-700 font-sans"
                >
                  {config.subUnitKerja}
                </h4>
              )}
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('alamat', e.currentTarget.innerText)}
                className="text-[8.5pt] font-sans m-0 leading-tight text-slate-600 mt-1"
              >
                {config.alamat} {config.kodePos ? `Kode Pos ${config.kodePos}` : ''}
              </p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('kontak', e.currentTarget.innerText)}
                className="text-[8pt] font-sans m-0 text-slate-500"
              >
                {config.kontak} {config.website ? `| ${config.website}` : ''}
              </p>
            </div>
          </div>

          {/* DOKUMEN TITLE */}
          <div className="text-center mb-3.5">
            <h2 className="text-[12pt] uppercase font-bold tracking-wider m-0 underline">
              LAPORAN PELAKSANAAN & NOTULENSI RAPAT
            </h2>
            <p className="text-[9pt] font-sans text-slate-600 m-0 mt-0.5">
              Nomor:{' '}
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('noSurat', e.currentTarget.innerText)}
                className="font-medium text-slate-800"
              >
                {config.noSurat}
              </span>
            </p>
          </div>

          {/* METADATA INFORMASI RAPAT */}
          <div className="border border-slate-300 rounded bg-slate-50/70 p-2 text-[9pt] font-sans mb-3.5">
            <div className="grid grid-cols-12 gap-x-2 gap-y-1">
              <div className="col-span-2 font-bold text-slate-700">Agenda / Hal</div>
              <div className="col-span-1 text-center">:</div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('judulRapat', e.currentTarget.innerText)}
                className="col-span-9 font-semibold text-slate-900"
              >
                {config.judulRapat}
              </div>

              <div className="col-span-2 font-bold text-slate-700">Hari / Tanggal</div>
              <div className="col-span-1 text-center">:</div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('hariTanggal', e.currentTarget.innerText)}
                className="col-span-4 text-slate-800"
              >
                {config.hariTanggal}
              </div>

              <div className="col-span-2 font-bold text-slate-700">Waktu</div>
              <div className="col-span-1 text-center">:</div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('waktu', e.currentTarget.innerText)}
                className="col-span-2 text-slate-800"
              >
                {config.waktu}
              </div>

              <div className="col-span-2 font-bold text-slate-700">Tempat</div>
              <div className="col-span-1 text-center">:</div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('tempat', e.currentTarget.innerText)}
                className="col-span-4 text-slate-800"
              >
                {config.tempat}
              </div>

              <div className="col-span-2 font-bold text-slate-700">Sifat / Lamp.</div>
              <div className="col-span-1 text-center">:</div>
              <div className="col-span-2 text-slate-800">
                {config.sifat} ({config.lampiran})
              </div>

              <div className="col-span-2 font-bold text-slate-700">Kehadiran</div>
              <div className="col-span-1 text-center">:</div>
              <div className="col-span-9 text-slate-800 font-medium">
                {hadirCount} Orang Hadir dari {attendees.length} Undangan (Daftar Hadir Terlampir)
              </div>
            </div>
          </div>

          {/* I. PENDAHULUAN & LATAR BELAKANG */}
          <div
            className="text-[9.5pt] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 flex items-center justify-between"
            style={{ borderColor: config.accentColor, color: config.accentColor }}
          >
            <span>I. Pendahuluan & Latar Belakang</span>
          </div>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateConfig('pendahuluan', e.currentTarget.innerText)}
            className="text-justify indent-6 mb-2.5 text-[9.5pt] leading-relaxed text-slate-900"
          >
            {config.pendahuluan}
          </p>

          {config.dasarPelaksanaan && (
            <p className="text-[9pt] italic text-slate-600 mb-3 bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="font-semibold not-italic text-slate-700">Dasar Pelaksanaan: </span>
              {config.dasarPelaksanaan}
            </p>
          )}

          {/* II. NOTULENSI JALANNYA RAPAT */}
          <div
            className="text-[9.5pt] font-bold uppercase tracking-wider border-b pb-0.5 mb-2 mt-3"
            style={{ borderColor: config.accentColor, color: config.accentColor }}
          >
            <span>II. Notulensi Jalannya Rapat (Poin Pembahasan)</span>
          </div>

          <div className="space-y-2 mb-3.5">
            {notulensi.map((item, idx) => (
              <div key={item.id} className="text-[9.5pt] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-800 min-w-5">{idx + 1}.</span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">
                      {item.pembicara}
                      {item.jabatanPembicara ? ` (${item.jabatanPembicara})` : ''}
                      {item.waktu ? ` [${item.waktu}]` : ''}:{' '}
                    </span>
                    <span className="font-semibold text-slate-700 underline mr-1">
                      {item.topik}.
                    </span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateNotulensi(idx, e.currentTarget.innerText)}
                      className="text-slate-800"
                    >
                      {item.poin}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* III. KESIMPULAN RAPAT */}
          <div
            className="text-[9.5pt] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 mt-3"
            style={{ borderColor: config.accentColor, color: config.accentColor }}
          >
            <span>III. Kesimpulan Utama Rapat</span>
          </div>

          <div className="bg-blue-50/70 border-l-4 border-blue-700 p-2.5 my-2 text-[9pt] font-sans rounded-r">
            <ul className="list-disc pl-4 space-y-1 text-slate-900">
              {kesimpulan.map((item, idx) => (
                <li
                  key={item.id}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateKesimpulan(idx, e.currentTarget.innerText)}
                >
                  {item.kategori && <span className="font-bold text-blue-900">{item.kategori}: </span>}
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* PENGESAHAN BLOK TANDA TANGAN */}
          <div className="mt-6 flex justify-between items-start text-[9.5pt] font-serif">
            {/* Notulis di kiri */}
            <div className="w-5/12 text-center">
              <p className="m-0 text-slate-700">Notulis Rapat,</p>
              <div className="h-14 flex items-center justify-center">
                {config.ttdNotulisUrl ? (
                  <img
                    src={config.ttdNotulisUrl}
                    alt="TTD Notulis"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[8pt] text-slate-400 font-sans italic">
                    (Tanda Tangan Basah/Elektronik)
                  </span>
                )}
              </div>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('namaNotulis', e.currentTarget.innerText)}
                className="font-bold underline m-0 text-slate-900"
              >
                {config.namaNotulis}
              </p>
              <p className="text-[8pt] font-sans text-slate-600 m-0">
                {config.nipNotulis}
              </p>
              <p className="text-[7.5pt] font-sans text-slate-500 m-0">
                {config.jabatanNotulis}
              </p>
            </div>

            {/* Pimpinan di kanan */}
            <div className="w-5/12 text-center">
              <p className="m-0 text-slate-700">
                {config.kota}, {config.tanggalCetak || config.hariTanggal.split(',')[1] || config.hariTanggal}
              </p>
              <p className="m-0 font-medium text-slate-800">Pimpinan Rapat,</p>
              <div className="h-14 flex items-center justify-center">
                {config.ttdPimpinanUrl ? (
                  <img
                    src={config.ttdPimpinanUrl}
                    alt="TTD Pimpinan"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[8pt] text-slate-400 font-sans italic">
                    (Tanda Tangan Basah/Elektronik)
                  </span>
                )}
              </div>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdateConfig('namaPimpinan', e.currentTarget.innerText)}
                className="font-bold underline m-0 text-slate-900"
              >
                {config.namaPimpinan}
              </p>
              <p className="text-[8pt] font-sans text-slate-600 m-0">
                {config.nipPimpinan}
              </p>
              <p className="text-[7.5pt] font-sans text-slate-500 m-0">
                {config.jabatanPimpinan}
              </p>
            </div>
          </div>

          {/* FOOTER HALAMAN 1 */}
          <div className="absolute bottom-3 left-18 right-18 text-[7.5pt] font-sans text-slate-400 flex items-center justify-between border-t border-slate-200 pt-1">
            <span>Tata Naskah Dinas Resmi & Notulensi Rapat</span>
            {config.showQrCode && (
              <DocumentVerificationBadge
                noSurat={config.noSurat}
                pimpinan={config.namaPimpinan}
                kota={config.kota}
                tanggal={config.tanggalCetak}
                compact
              />
            )}
            <span>Halaman 1 dari 3</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGE 2: ACTION PLAN & TINDAK LANJUT MATRIKS                     */}
      {/* ============================================================== */}
      {(viewMode === 'all' || viewMode === 'action_plan') && (
        <div id="page-action-plan" className={`a4-page print-area ${fontClass}`}>
          {/* HEADER LAMPIRAN I */}
          <div className="border-b-2 border-slate-700 pb-2 mb-4 flex justify-between items-start">
            <div>
              <p className="text-[8pt] font-sans text-slate-500 m-0 uppercase font-semibold">
                Lampiran I: Dokumen Rencana Kerja
              </p>
              <h2 className="text-[11pt] uppercase font-bold tracking-wide m-0 text-slate-900">
                MATRIKS RENCANA TINDAK LANJUT (ACTION PLAN)
              </h2>
              <p className="text-[8.5pt] font-sans text-slate-600 m-0">
                Agenda: {config.judulRapat}
              </p>
            </div>
            <div className="text-right text-[8pt] font-sans text-slate-500">
              <p className="m-0 font-medium">Nomor: {config.noSurat}</p>
              <p className="m-0">{config.hariTanggal}</p>
            </div>
          </div>

          <div className="mb-3 text-[9pt] font-sans text-slate-700">
            Berikut adalah matriks kesepakatan tindak lanjut yang menjadi tanggung jawab masing-masing penanggung jawab program (PIC) untuk diselesaikan sesuai batas waktu yang telah disepakati:
          </div>

          {/* TABEL MATRIKS ACTION PLAN */}
          <table className="w-full text-[8.5pt] font-sans border-collapse mb-5 border border-slate-300">
            <thead>
              <tr
                className="text-white text-left font-semibold"
                style={{ backgroundColor: config.accentColor }}
              >
                <th className="p-2 border border-slate-400 w-8 text-center">No</th>
                <th className="p-2 border border-slate-400">Uraian Tugas / Rencana Kerja</th>
                <th className="p-2 border border-slate-400 w-36">Penanggung Jawab (PIC)</th>
                <th className="p-2 border border-slate-400 w-24 text-center">Batas Waktu</th>
                <th className="p-2 border border-slate-400 w-20 text-center">Prioritas</th>
                <th className="p-2 border border-slate-400 w-22 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {actionPlan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    Belum ada item rencana tindak lanjut.
                  </td>
                </tr>
              ) : (
                actionPlan.map((item, idx) => {
                  const statusColor =
                    item.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : item.status === 'Proses'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : item.status === 'Tunda'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300';

                  const priorityColor =
                    item.prioritas === 'Tinggi'
                      ? 'text-rose-700 font-semibold'
                      : item.prioritas === 'Sedang'
                      ? 'text-amber-700'
                      : 'text-slate-600';

                  return (
                    <tr
                      key={item.id}
                      className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="p-2 border border-slate-300 text-center font-medium text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-900">
                        <div className="font-medium">{item.task}</div>
                        {item.outputTarget && (
                          <div className="text-[7.5pt] text-slate-500 italic mt-0.5">
                            Target: {item.outputTarget}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-300 font-medium text-slate-800">
                        {item.pic}
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-slate-700 font-medium">
                        {item.deadline}
                      </td>
                      <td className={`p-2 border border-slate-300 text-center text-[8pt] ${priorityColor}`}>
                        {item.prioritas}
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[7.5pt] font-semibold rounded border ${statusColor}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* CATATAN TAMBAHAN / KETENTUAN PELAPORAN TINDAK LANJUT */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded text-[8.5pt] font-sans mb-6">
            <h4
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateConfig('judulKetentuanTindakLanjut', e.currentTarget.innerText)}
              className="font-bold text-amber-900 uppercase text-[8pt] tracking-wider mb-1"
            >
              {config.judulKetentuanTindakLanjut || 'Ketentuan Pelaporan & Monitoring Tindak Lanjut:'}
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-amber-950">
              {(config.ketentuanTindakLanjut && config.ketentuanTindakLanjut.length > 0
                ? config.ketentuanTindakLanjut
                : [
                    'Setiap PIC wajib mengunggah bukti dukung (evidence) pelaksanaan tugas pada dashboard sistem evaluasi.',
                    'Monitoring progres dilakukan secara berkala tiap hari Jumat pada akhir pekan berjalan.',
                    'Kendala teknis atau pergeseran target harus dilaporkan segera kepada pimpinan rapat untuk alternatif penyesuaian.',
                  ]
              ).map((rule, rIdx) => (
                <li
                  key={rIdx}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateKetentuanTindakLanjut &&
                    onUpdateKetentuanTindakLanjut(rIdx, e.currentTarget.innerText)
                  }
                  className="hover:bg-amber-100/60 transition rounded px-1"
                >
                  {rule}
                </li>
              ))}
            </ol>
          </div>

          {/* TTD PENGESAHAN HALAMAN 2 */}
          <div className="mt-8 flex justify-end text-[9.5pt] font-serif">
            <div className="w-5/12 text-center">
              <p className="m-0 text-slate-700">
                {config.kota}, {config.tanggalCetak || config.hariTanggal.split(',')[1] || config.hariTanggal}
              </p>
              <p className="m-0 font-medium text-slate-800">Pimpinan Rapat,</p>
              <div className="h-16 flex items-center justify-center">
                {config.ttdPimpinanUrl ? (
                  <img
                    src={config.ttdPimpinanUrl}
                    alt="TTD Pimpinan"
                    className="max-h-14 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[8pt] text-slate-400 font-sans italic">
                    (Tanda Tangan)
                  </span>
                )}
              </div>
              <p className="font-bold underline m-0 text-slate-900">
                {config.namaPimpinan}
              </p>
              <p className="text-[8pt] font-sans text-slate-600 m-0">
                {config.nipPimpinan}
              </p>
            </div>
          </div>

          {/* FOOTER HALAMAN 2 */}
          <div className="absolute bottom-3 left-18 right-18 text-[7.5pt] font-sans text-slate-400 flex items-center justify-between border-t border-slate-200 pt-1">
            <span>Lampiran I: Matriks Rencana Tindak Lanjut</span>
            <span>Halaman 2 dari 3</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGE 3: LAMPIRAN PRESENSI & TTD DIGITAL ZIG-ZAG                */}
      {/* ============================================================== */}
      {(viewMode === 'all' || viewMode === 'presensi') && (
        <div id="page-presensi" className={`a4-page print-area ${fontClass}`}>
          {/* KOP PRESENSI */}
          <div className={`${borderClass} pb-3 mb-3 flex items-center gap-4`}>
            <OfficialLogo
              type={config.logoType}
              customUrl={config.customLogoUrl}
              color={config.accentColor}
              size={60}
            />

            <div className="flex-1 text-center font-serif">
              <h3 className="text-[9pt] uppercase font-bold tracking-wide m-0 text-slate-700">
                {config.instansiAtasan}
              </h3>
              <h1
                className="text-[12pt] uppercase font-bold tracking-wider m-0 leading-tight"
                style={{ color: config.accentColor }}
              >
                {config.unitKerja}
              </h1>
              <p className="text-[8pt] font-sans m-0 text-slate-500 font-medium">
                LAMPIRAN II: DAFTAR HADIR PESERTA RAPAT & TANDA TANGAN DIGITAL
              </p>
            </div>
          </div>

          <div className="text-center mb-3">
            <h2 className="text-[11pt] uppercase font-bold underline tracking-wider m-0">
              DAFTAR HADIR PESERTA RAPAT
            </h2>
            <p className="text-[8.5pt] font-sans font-medium text-slate-800 m-0 mt-0.5">
              {config.judulRapat}
            </p>
            <p className="text-[8pt] font-sans text-slate-600 m-0">
              {config.hariTanggal} | Pukul {config.waktu} | Tempat: {config.tempat}
            </p>
          </div>

          {/* TABEL PRESENSI FORMAT ZIG-ZAG STANDAR PEMERINTAH */}
          <table className="w-full text-[8.5pt] font-sans border-collapse mb-4 border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-left font-bold border-b border-slate-300">
                <th className="p-2 border border-slate-300 w-8 text-center">No</th>
                <th className="p-2 border border-slate-300">Nama Lengkap & NIP/ID</th>
                <th className="p-2 border border-slate-300 w-44">Jabatan / Instansi</th>
                <th className="p-2 border border-slate-300 text-center w-36" colSpan={2}>
                  Tanda Tangan / Paraf
                </th>
              </tr>
            </thead>
            <tbody>
              {attendees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">
                    Belum ada data peserta yang hadir. Silakan tambahkan pada form presensi.
                  </td>
                </tr>
              ) : (
                attendees.map((a, idx) => {
                  const isOdd = (idx + 1) % 2 !== 0; // 1, 3, 5 di kolom kiri; 2, 4, 6 di kolom kanan

                  return (
                    <tr
                      key={a.id}
                      className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}
                    >
                      <td className="p-1.5 border border-slate-300 text-center font-medium text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="p-1.5 border border-slate-300">
                        <div className="font-bold text-slate-900 leading-tight">
                          {a.name}
                        </div>
                        {a.nip && a.nip !== '-' && (
                          <div className="text-[7.5pt] text-slate-500 font-mono">
                            NIP. {a.nip}
                          </div>
                        )}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-slate-800">
                        <div className="font-medium leading-tight">{a.role}</div>
                        {a.organization && (
                          <div className="text-[7.5pt] text-slate-500">
                            {a.organization}
                          </div>
                        )}
                      </td>

                      {/* KOLOM TANDA TANGAN 1 (GANJIL) */}
                      <td className="p-1 border border-slate-300 w-18 h-10 align-middle text-left relative">
                        {isOdd ? (
                          a.signature ? (
                            <div className="flex items-center justify-center h-full">
                              <img
                                src={a.signature}
                                alt={`TTD ${a.name}`}
                                className="max-h-8 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => onOpenQuickSign && onOpenQuickSign(a.id)}
                              className="text-[8pt] text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 p-1 rounded cursor-pointer transition"
                            >
                              <span className="font-bold">{idx + 1}.</span> ..........
                            </div>
                          )
                        ) : null}
                      </td>

                      {/* KOLOM TANDA TANGAN 2 (GENAP) */}
                      <td className="p-1 border border-slate-300 w-18 h-10 align-middle text-left relative">
                        {!isOdd ? (
                          a.signature ? (
                            <div className="flex items-center justify-center h-full">
                              <img
                                src={a.signature}
                                alt={`TTD ${a.name}`}
                                className="max-h-8 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => onOpenQuickSign && onOpenQuickSign(a.id)}
                              className="text-[8pt] text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 p-1 rounded cursor-pointer transition"
                            >
                              <span className="font-bold">{idx + 1}.</span> ..........
                            </div>
                          )
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* REKAPITULASI KEHADIRAN */}
          <div className="flex items-center justify-between text-[8pt] font-sans p-2 bg-slate-50 border border-slate-200 rounded mb-4">
            <div className="flex gap-4">
              <span>
                Total Undangan: <strong>{attendees.length}</strong> orang
              </span>
              <span>
                Hadir: <strong className="text-emerald-700">{hadirCount}</strong> orang
              </span>
              <span>
                Tingkat Kehadiran:{' '}
                <strong>
                  {attendees.length > 0
                    ? Math.round((hadirCount / attendees.length) * 100)
                    : 0}
                  %
                </strong>
              </span>
            </div>
            <div className="text-slate-500 italic">
              Dokumen presensi sah dan terautentikasi
            </div>
          </div>

          {/* PENGESAHAN PIMPINAN LAMPIRAN PRESENSI */}
          <div className="mt-6 flex justify-end text-[9.5pt] font-serif">
            <div className="w-5/12 text-center">
              <p className="m-0 text-slate-700">Mengetahui,</p>
              <p className="m-0 font-medium text-slate-800">Pimpinan Rapat,</p>
              <div className="h-14 flex items-center justify-center">
                {config.ttdPimpinanUrl ? (
                  <img
                    src={config.ttdPimpinanUrl}
                    alt="TTD Pimpinan"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[8pt] text-slate-400 font-sans italic">
                    (Tanda Tangan)
                  </span>
                )}
              </div>
              <p className="font-bold underline m-0 text-slate-900">
                {config.namaPimpinan}
              </p>
              <p className="text-[8pt] font-sans text-slate-600 m-0">
                {config.nipPimpinan}
              </p>
            </div>
          </div>

          {/* FOOTER HALAMAN 3 */}
          <div className="absolute bottom-3 left-18 right-18 text-[7.5pt] font-sans text-slate-400 flex items-center justify-between border-t border-slate-200 pt-1">
            <span>Lampiran II: Daftar Hadir Peserta Rapat Resmi</span>
            <span>Halaman 3 dari 3</span>
          </div>
        </div>
      )}
    </div>
  );
};
