export interface ReportConfig {
  // Instansi & Kop Surat
  instansiAtasan: string;
  unitKerja: string;
  subUnitKerja: string;
  alamat: string;
  kontak: string;
  website: string;
  kodePos: string;
  logoType: 'government' | 'corporate' | 'education' | 'community' | 'custom';
  customLogoUrl: string;
  accentColor: string;
  borderStyle: 'double' | 'thick-thin' | 'minimal' | 'none';

  // Naskah Surat & Rapat
  judulRapat: string;
  subJudul: string;
  noSurat: string;
  sifat: string;
  lampiran: string;
  perihal: string;
  hariTanggal: string;
  waktu: string;
  tempat: string;
  kota: string;
  tanggalCetak: string;

  // Pejabat
  namaPimpinan: string;
  nipPimpinan: string;
  jabatanPimpinan: string;
  ttdPimpinanUrl?: string;

  namaNotulis: string;
  nipNotulis: string;
  jabatanNotulis: string;
  ttdNotulisUrl?: string;

  // Teks Pengantar
  pendahuluan: string;
  dasarPelaksanaan: string;

  // Ketentuan Pelaporan & Monitoring Tindak Lanjut
  judulKetentuanTindakLanjut?: string;
  ketentuanTindakLanjut?: string[];

  // Style Settings
  fontFamily: 'serif' | 'sans';
  showQrCode: boolean;
}

export interface NotulensiItem {
  id: string;
  pembicara: string;
  jabatanPembicara?: string;
  waktu?: string;
  topik: string;
  poin: string;
}

export interface KesimpulanItem {
  id: string;
  text: string;
  kategori?: string;
}

export type ActionStatus = 'Belum Mulai' | 'Proses' | 'Selesai' | 'Tunda';
export type ActionPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export interface ActionPlanItem {
  id: string;
  task: string;
  pic: string;
  deadline: string;
  status: ActionStatus;
  prioritas: ActionPriority;
  outputTarget?: string;
}

export interface AttendeeItem {
  id: string;
  name: string;
  nip: string;
  role: string;
  organization: string;
  phone?: string;
  signature: string; // Base64 dataUrl
  status: 'Hadir' | 'Izin' | 'Sakit';
  signedAt?: string;
}

export interface AppState {
  config: ReportConfig;
  notulensi: NotulensiItem[];
  kesimpulan: KesimpulanItem[];
  actionPlan: ActionPlanItem[];
  attendees: AttendeeItem[];
}
