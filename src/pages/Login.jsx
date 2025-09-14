import { useState, useContext } from "react";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login: authLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ nim: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.nim) newErrors.nim = "NIM wajib diisi";
    if (!form.password) newErrors.password = "Password wajib diisi";
    if (form.nim && !/^[0-9]{1,15}$/.test(form.nim)) {
      newErrors.nim = "Format NIM tidak valid. Maksimal 15 digit angka.";
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
      const data = await login(form);
      authLogin(data);
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.msg ||
          "Login gagal. Periksa NIM dan password Anda.",
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
            Masuk ke Forum Chat
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Atau{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              daftar akun baru
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 dark:bg-gray-800">
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 dark:bg-red-900/30 dark:border-red-500/50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {errors.general}
                  </p>
                </div>
              </div>
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
              <div className="mt-1 relative">
                <input
                  id="nim"
                  type="text"
                  autoComplete="nim"
                  value={form.nim}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if the value length is within the 15-character limit
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
                  maxLength={15} // This is a new addition
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
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Password Anda"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
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
                {isLoading ? "Masuk..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
