import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    nim: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!form.nim) {
      newErrors.nim = "NIM wajib diisi";
    } else if (!/^[0-9]{1,15}$/.test(form.nim)) {
      newErrors.nim = "Format NIM tidak valid. Maksimal 15 digit angka.";
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e) => {
    // Memungkinkan tombol kontrol seperti Backspace, Delete, Arrow Keys
    const controlKeys = [8, 46, 37, 39];
    if (controlKeys.includes(e.keyCode)) {
      return;
    }
    // Mencegah input jika bukan angka
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({ nim: form.nim, password: form.password });

      setErrors({
        success: "Registrasi berhasil! Menunggu persetujuan admin.",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors({
        general: err.response?.data?.msg || "Registrasi gagal. Coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">💬</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Daftar Forum Chat
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 dark:bg-gray-800">
          {errors.success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 dark:bg-green-900/30 dark:border-green-500/50">
              <p className="text-sm text-green-800 dark:text-green-200">
                {errors.success}
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 dark:bg-red-900/30 dark:border-red-500/50">
              <p className="text-sm text-red-800 dark:text-red-200">
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nim"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nomor Induk Mahasiswa (NIM)
              </label>
              <div className="mt-1">
                <input
                  id="nim"
                  type="text"
                  value={form.nim}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 15) {
                      setForm({ ...form, nim: value });
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.nim
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Masukkan NIM Anda (maks. 15 digit)"
                  maxLength={15}
                />
              </div>
              {errors.nim && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.nim}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Konfirmasi Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Ulangi password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed dark:bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 dark:bg-blue-900/20 dark:border-blue-500/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400 dark:text-blue-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Setelah mendaftar, akun Anda akan diverifikasi oleh admin
                    sebelum bisa digunakan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
