import { AppState } from '../types';

export const generateWordHtml = (state: AppState): string => {
  const { config, notulensi, kesimpulan, actionPlan, attendees } = state;
  const tanggalFormat = config.tanggalCetak || config.hariTanggal.split(',')[1]?.trim() || config.hariTanggal;

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${config.judulRapat} - Dokumen Resmi</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 21.0cm 29.7cm;
          margin: 2.5cm 2.0cm 2.0cm 2.5cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #000000;
        }
        h1, h2, h3, h4, p { margin: 0; padding: 0; }
        .page-break { page-break-before: always; mso-break-type: page-break; }
        
        /* Kop Surat Resmi */
        .kop-container {
          text-align: center;
          border-bottom: 3.5px double #000000;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .kop-instansi {
          font-size: 12pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .kop-unit {
          font-size: 15pt;
          font-weight: bold;
          text-transform: uppercase;
          color: ${config.accentColor || '#1e3a8a'};
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .kop-sub {
          font-size: 11pt;
          font-weight: normal;
          color: #333333;
          margin-bottom: 4px;
        }
        .kop-alamat {
          font-size: 9.5pt;
          color: #444444;
          margin-bottom: 2px;
        }
        .kop-kontak {
          font-size: 9pt;
          color: #555555;
        }

        /* Dokumen Title */
        .doc-title-box {
          text-align: center;
          margin: 18px 0 16px 0;
        }
        .doc-title {
          font-size: 13pt;
          font-weight: bold;
          text-transform: uppercase;
          text-decoration: underline;
          letter-spacing: 0.5px;
        }
        .doc-nomor {
          font-size: 10.5pt;
          margin-top: 4px;
        }

        /* Tabel & Matriks */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 10pt;
        }
        th, td {
          border: 1px solid #333333;
          padding: 6px 8px;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: left;
        }
        .table-no-border, .table-no-border th, .table-no-border td {
          border: none !important;
          padding: 3px 4px;
        }

        /* Section Headings */
        .section-header {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          color: ${config.accentColor || '#1e3a8a'};
          border-bottom: 1.5px solid ${config.accentColor || '#1e3a8a'};
          padding-bottom: 3px;
          margin-top: 18px;
          margin-bottom: 8px;
        }

        .text-justify { text-align: justify; text-justify: inter-word; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        /* Kotak Ketentuan */
        .box-ketentuan {
          background-color: #fefce8;
          border: 1px solid #ca8a04;
          padding: 10px 14px;
          margin: 14px 0;
          border-radius: 4px;
        }
        .box-ketentuan h4 {
          color: #713f12;
          font-size: 10pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .box-ketentuan ol {
          margin: 0;
          padding-left: 20px;
          font-size: 9.5pt;
          color: #451a03;
        }

        /* Tanda Tangan */
        .ttd-box {
          margin-top: 24px;
          width: 100%;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <!-- ============================================================== -->
      <!-- HALAMAN 1: LAPORAN PELAKSANAAN & NOTULENSI UTAMA               -->
      <!-- ============================================================== -->
      <div class="kop-container">
        <div class="kop-instansi">${config.instansiAtasan}</div>
        <div class="kop-unit">${config.unitKerja}</div>
        ${config.subUnitKerja ? `<div class="kop-sub">${config.subUnitKerja}</div>` : ''}
        <div class="kop-alamat">${config.alamat} ${config.kodePos ? `Kode Pos ${config.kodePos}` : ''}</div>
        <div class="kop-kontak">${config.kontak} ${config.website ? `| ${config.website}` : ''}</div>
      </div>

      <div class="doc-title-box">
        <div class="doc-title">LAPORAN PELAKSANAAN & NOTULENSI RAPAT</div>
        <div class="doc-nomor">Nomor: ${config.noSurat}</div>
      </div>

      <table class="table-no-border" style="width: 100%; margin-bottom: 14px;">
        <tr><td style="width: 22%; font-weight: bold;">Agenda / Perihal</td><td style="width: 2%;">:</td><td style="font-weight: bold;">${config.judulRapat}</td></tr>
        ${config.subJudul ? `<tr><td style="font-weight: bold;">Sub Pokok Bahasan</td><td>:</td><td>${config.subJudul}</td></tr>` : ''}
        <tr><td style="font-weight: bold;">Hari / Tanggal</td><td>:</td><td>${config.hariTanggal}</td></tr>
        <tr><td style="font-weight: bold;">Waktu Pelaksanaan</td><td>:</td><td>${config.waktu}</td></tr>
        <tr><td style="font-weight: bold;">Tempat / Ruangan</td><td>:</td><td>${config.tempat}</td></tr>
        <tr><td style="font-weight: bold;">Sifat Naskah / Lampiran</td><td>:</td><td>${config.sifat || 'Penting'} / ${config.lampiran || '2 Lembar'}</td></tr>
        <tr><td style="font-weight: bold;">Jumlah Kehadiran</td><td>:</td><td>${attendees.filter(a => a.status === 'Hadir').length} dari ${attendees.length} Orang Terdaftar</td></tr>
      </table>

      <div class="section-header">I. Pendahuluan & Dasar Pelaksanaan</div>
      <p class="text-justify" style="text-indent: 32px; margin-bottom: 6px;">${config.pendahuluan}</p>
      ${config.dasarPelaksanaan ? `<p class="text-justify" style="font-style: italic; font-size: 10pt; color: #333333;"><strong>Dasar Pelaksanaan:</strong> ${config.dasarPelaksanaan}</p>` : ''}

      <div class="section-header">II. Notulensi Jalannya Pembahasan Rapat</div>
      <ol style="margin-top: 6px; padding-left: 22px;">
        ${notulensi
          .map(
            (n) => `
          <li style="margin-bottom: 8px;">
            <strong>${n.pembicara}</strong> ${n.jabatanPembicara ? `<em>(${n.jabatanPembicara}${n.waktu ? ` - ${n.waktu}` : ''})</em>` : ''}: 
            <strong>${n.topik}</strong>
            <p class="text-justify" style="margin-top: 2px;">${n.poin}</p>
          </li>
        `
          )
          .join('')}
      </ol>

      <div class="section-header">III. Kesimpulan Utama & Keputusan Rapat</div>
      <ol style="margin-top: 6px; padding-left: 22px;">
        ${kesimpulan
          .map(
            (k) => `
          <li style="margin-bottom: 6px;">
            ${k.kategori ? `<strong>[${k.kategori}]</strong> ` : ''}
            <span>${k.text}</span>
          </li>
        `
          )
          .join('')}
      </ol>

      <!-- TTD Pengesahan Halaman 1 -->
      <table class="table-no-border ttd-box" style="margin-top: 30px;">
        <tr>
          <td style="width: 50%; text-align: center;">
            <p>Notulis Rapat,</p>
            <div style="height: 60px;"></div>
            <p style="font-weight: bold; text-decoration: underline;">${config.namaNotulis}</p>
            <p style="font-size: 9.5pt; color: #444444;">${config.nipNotulis}</p>
            <p style="font-size: 9pt; color: #555555;">${config.jabatanNotulis || 'Notulis'}</p>
          </td>
          <td style="width: 50%; text-align: center;">
            <p>${config.kota}, ${tanggalFormat}</p>
            <p style="font-weight: bold;">Pimpinan Rapat,</p>
            <div style="height: 60px;"></div>
            <p style="font-weight: bold; text-decoration: underline;">${config.namaPimpinan}</p>
            <p style="font-size: 9.5pt; color: #444444;">${config.nipPimpinan}</p>
            <p style="font-size: 9pt; color: #555555;">${config.jabatanPimpinan || 'Pimpinan Rapat'}</p>
          </td>
        </tr>
      </table>

      <!-- ============================================================== -->
      <!-- HALAMAN 2: MATRIKS TINDAK LANJUT (ACTION PLAN)                 -->
      <!-- ============================================================== -->
      <br clear="all" class="page-break" style="page-break-before: always;" />

      <div style="border-bottom: 2px solid #333333; padding-bottom: 8px; margin-bottom: 16px;">
        <div style="font-size: 9pt; text-transform: uppercase; font-weight: bold; color: #555555;">Lampiran I: Dokumen Rencana Kerja</div>
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">MATRIKS RENCANA TINDAK LANJUT (ACTION PLAN)</div>
        <div style="font-size: 9.5pt; color: #444444;">Agenda: ${config.judulRapat}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%; text-align: center;">No</th>
            <th style="width: 35%;">Uraian Tugas / Tindak Lanjut</th>
            <th style="width: 22%;">Penanggung Jawab (PIC)</th>
            <th style="width: 14%; text-align: center;">Batas Waktu</th>
            <th style="width: 12%; text-align: center;">Prioritas</th>
            <th style="width: 12%; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${actionPlan
            .map(
              (a, idx) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
              <td>
                <strong>${a.task}</strong>
                ${a.outputTarget ? `<div style="font-size: 8.5pt; color: #555555; margin-top: 2px;">Target: ${a.outputTarget}</div>` : ''}
              </td>
              <td>${a.pic}</td>
              <td style="text-align: center;">${a.deadline}</td>
              <td style="text-align: center;">
                <span style="font-weight: bold; color: ${a.prioritas === 'Tinggi' ? '#b91c1c' : a.prioritas === 'Sedang' ? '#c2410c' : '#15803d'};">
                  ${a.prioritas}
                </span>
              </td>
              <td style="text-align: center;">
                <span style="font-weight: bold; color: ${a.status === 'Selesai' ? '#15803d' : a.status === 'Proses' ? '#1d4ed8' : '#64748b'};">
                  ${a.status}
                </span>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Kotak Ketentuan Pelaporan Tindak Lanjut -->
      <div class="box-ketentuan">
        <h4>${config.judulKetentuanTindakLanjut || 'Ketentuan Pelaporan & Monitoring Tindak Lanjut:'}</h4>
        <ol>
          ${(
            config.ketentuanTindakLanjut || [
              'Setiap PIC wajib mengunggah bukti dukung (evidence) pelaksanaan tugas pada dashboard sistem evaluasi.',
              'Monitoring progres dilakukan secara berkala tiap hari Jumat pada akhir pekan berjalan.',
              'Kendala teknis atau pergeseran target harus dilaporkan segera kepada pimpinan rapat untuk alternatif penyesuaian.',
            ]
          )
            .map((rule) => `<li style="margin-bottom: 3px;">${rule}</li>`)
            .join('')}
        </ol>
      </div>

      <!-- TTD Pengesahan Halaman 2 -->
      <table class="table-no-border ttd-box" style="margin-top: 30px;">
        <tr>
          <td style="width: 50%;"></td>
          <td style="width: 50%; text-align: center;">
            <p>${config.kota}, ${tanggalFormat}</p>
            <p style="font-weight: bold;">Pimpinan Rapat,</p>
            <div style="height: 60px;"></div>
            <p style="font-weight: bold; text-decoration: underline;">${config.namaPimpinan}</p>
            <p style="font-size: 9.5pt; color: #444444;">${config.nipPimpinan}</p>
            <p style="font-size: 9pt; color: #555555;">${config.jabatanPimpinan || 'Pimpinan Rapat'}</p>
          </td>
        </tr>
      </table>

      <!-- ============================================================== -->
      <!-- HALAMAN 3: LAMPIRAN DAFTAR HADIR PRESENSI BER-TTD DIGITAL     -->
      <!-- ============================================================== -->
      <br clear="all" class="page-break" style="page-break-before: always;" />

      <div style="border-bottom: 2px solid #333333; padding-bottom: 8px; margin-bottom: 16px;">
        <div style="font-size: 9pt; text-transform: uppercase; font-weight: bold; color: #555555;">Lampiran II: Berita Acara Presensi</div>
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">DAFTAR HADIR PESERTA RAPAT</div>
        <div style="font-size: 9.5pt; color: #444444;">Kegiatan: ${config.judulRapat} (${config.hariTanggal} di ${config.tempat})</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%; text-align: center;">No</th>
            <th style="width: 25%;">Nama Lengkap</th>
            <th style="width: 20%;">NIP / NIK / ID</th>
            <th style="width: 20%;">Jabatan & Instansi</th>
            <th style="width: 10%; text-align: center;">Status</th>
            <th style="width: 20%; text-align: center;">Tanda Tangan / Paraf</th>
          </tr>
        </thead>
        <tbody>
          ${attendees
            .map(
              (att, idx) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
              <td><strong>${att.name}</strong></td>
              <td style="font-size: 9pt; color: #333333;">${att.nip || '-'}</td>
              <td>
                <div>${att.role}</div>
                <div style="font-size: 8.5pt; color: #555555;">${att.organization}</div>
              </td>
              <td style="text-align: center;">
                <span style="font-weight: bold; color: ${att.status === 'Hadir' ? '#15803d' : '#b45309'};">
                  ${att.status}
                </span>
                ${att.signedAt ? `<div style="font-size: 7.5pt; color: #64748b;">${att.signedAt}</div>` : ''}
              </td>
              <td style="text-align: center; vertical-align: middle;">
                ${
                  att.signature
                    ? `<img src="${att.signature}" alt="TTD ${att.name}" style="max-height: 40px; max-width: 120px;" />`
                    : `<span style="font-size: 8pt; color: #888888; font-style: italic;">(${att.status === 'Hadir' ? 'Terverifikasi' : 'Belum TTD'})</span>`
                }
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- TTD Pengesahan Halaman 3 (Mengetahui) -->
      <table class="table-no-border ttd-box" style="margin-top: 30px;">
        <tr>
          <td style="width: 50%; text-align: center;">
            <p>Petugas Notulensi / Presensi,</p>
            <div style="height: 60px;"></div>
            <p style="font-weight: bold; text-decoration: underline;">${config.namaNotulis}</p>
            <p style="font-size: 9.5pt; color: #444444;">${config.nipNotulis}</p>
          </td>
          <td style="width: 50%; text-align: center;">
            <p>${config.kota}, ${tanggalFormat}</p>
            <p style="font-weight: bold;">Mengetahui Pimpinan Rapat,</p>
            <div style="height: 60px;"></div>
            <p style="font-weight: bold; text-decoration: underline;">${config.namaPimpinan}</p>
            <p style="font-size: 9.5pt; color: #444444;">${config.nipPimpinan}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const downloadWordDocument = (state: AppState): void => {
  const content = generateWordHtml(state);
  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const cleanTitle = state.config.judulRapat
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 35);
  const cleanDate = new Date().toISOString().slice(0, 10);
  link.download = `Laporan_Resmi_${cleanTitle}_${cleanDate}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
