import React from "react";

export default function Sponsorship() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Beriklan Bersama Kami
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Jangkau ribuan mahasiswa aktif setiap hari. Bergabunglah dengan
            komunitas pendidikan terbesar dan tingkatkan awareness brand Anda.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Mengapa Memilih Platform Kami?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Audiens Tertarget
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Akses eksklusif ke komunitas mahasiswa yang aktif dan engaged
                  dalam diskusi akademik setiap hari.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Engagement Tinggi
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Platform dengan tingkat interaksi tinggi memastikan
                  visibilitas maksimal untuk brand Anda.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reputasi Positif
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Asosiasi dengan platform pendidikan akan meningkatkan
                  kredibilitas dan image positif brand Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsorship Package */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Paket Sponsorship
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Slot Iklan Premium
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Tampilkan iklan Anda di lokasi strategis yang akan dilihat oleh
                seluruh pengguna aktif platform kami. Iklan Anda akan mendapat
                exposure maksimal di area dengan traffic tertinggi.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Format:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Gambar berkualitas tinggi (JPG/PNG) dengan link tujuan
                      yang dapat dikustomisasi
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Posisi:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Sidebar kanan dan kiri (Desktop), area bawah chat (Mobile)
                      - lokasi dengan visibilitas optimal
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Proses:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Kirimkan materi iklan, link tujuan, dan detail campaign
                      melalui email. Tim kami akan mengurus setup dan aktivasi
                      iklan Anda
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mari Berkolaborasi!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Tertarik untuk mengiklankan brand Anda? Hubungi tim kami untuk
              mendiskusikan paket yang sesuai dengan kebutuhan dan budget Anda.
              Kami siap membantu menciptakan kampanye yang efektif.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Silakan sertakan informasi berikut dalam email Anda:
              </p>
              <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• Deskripsi singkat tentang brand/produk Anda</div>
                <div>• Target audience yang diinginkan</div>
                <div>• Budget range untuk kampanye iklan</div>
                <div>• Materi iklan (gambar) dan link tujuan</div>
                <div>• Durasi kampanye yang diinginkan</div>
              </div>
            </div>

            <a
              href="mailto:sponsorship@forumtek.com?subject=Inquiry%20Sponsorship%20-%20Forum%20Mahasiswa&body=Halo%20Tim%20FORTEK%2C%0A%0ASaya%20tertarik%20untuk%20beriklan%20di%20platform%20Anda.%20Berikut%20adalah%20informasi%20singkat%20tentang%20brand%2Fproduk%20saya%3A%0A%0A-%20Nama%20Brand%2FPerusahaan%3A%20%0A-%20Deskripsi%20Produk%2FLayanan%3A%20%0A-%20Target%20Audience%3A%20%0A-%20Budget%20Range%3A%20%0A-%20Durasi%20Kampanye%3A%20%0A%0AMohon%20informasi%20lebih%20lanjut%20mengenai%3A%0A-%20Harga%20paket%20sponsorship%0A-%20Statistik%20pengguna%20platform%0A-%20Contoh%20penempatan%20iklan%0A%0ATerima%20kasih%2C%0A%5BNama%20Anda%5D"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-medium rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.23a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              sponsorship@forumtek.com
            </a>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Kami akan merespons dalam 1-2 hari kerja
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
