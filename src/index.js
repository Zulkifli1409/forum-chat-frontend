import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ============================================
// 🛡️ ADVANCED CONSOLE SECURITY SYSTEM
// ============================================

// Console Styling dengan Animasi
const createGradientText = (text, gradient) => {
    return `%c${text}`;
};

const styles = {
    title: `
    font-size: 48px;
    font-weight: 900;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    animation: gradient 3s ease infinite;
    font-family: 'Arial Black', sans-serif;
    letter-spacing: 4px;
    margin: 20px 0;
  `,
    subtitle: `
    font-size: 18px;
    color: #a78bfa;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
    margin: 10px 0;
  `,
    warning: `
    font-size: 32px;
    font-weight: 900;
    color: #ff4757;
    background: linear-gradient(45deg, #ff4757, #ff6b7a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
    animation: pulse 2s infinite;
  `,
    danger: `
    font-size: 16px;
    color: #ffa502;
    font-weight: 600;
    background: #2c2c2c;
    padding: 15px;
    border-left: 5px solid #ff4757;
    margin: 10px 0;
  `,
    info: `
    font-size: 14px;
    color: #70a1ff;
    font-weight: 500;
    background: linear-gradient(90deg, #1e3c72, #2a5298);
    padding: 10px;
    border-radius: 5px;
    margin: 5px 0;
  `,
    success: `
    font-size: 16px;
    color: #2ed573;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(46, 213, 115, 0.3);
  `
};

// Security Functions
class ConsoleSecurityGuard {
    constructor() {
        this.isDevMode = process.env.NODE_ENV === 'development';
        this.suspiciousActivity = 0;
        this.maxSuspiciousActivity = 3;
        this.isSecurityActive = true;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        this.displayWelcomeMessage();
        this.setupSecurityMeasures();
        this.monitorConsoleActivity();
        this.setupAntiDebug();
    }

    displayWelcomeMessage() {
        // Clear console untuk efek dramatis
        console.clear();

        // ASCII Art Banner
        const banner = `
    ███████╗ ██████╗ ██████╗ ████████╗███████╗██╗  ██╗
    ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██║ ██╔╝
    █████╗  ██║   ██║██████╔╝   ██║   █████╗  █████╔╝ 
    ██╔══╝  ██║   ██║██╔══██╗   ██║   ██╔══╝  ██╔═██╗ 
    ██║     ╚██████╔╝██║  ██║   ██║   ███████╗██║  ██╗
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
    `;

        console.log(`%c${banner}`, 'color: #667eea; font-family: monospace; font-size: 12px;');
        console.log(createGradientText("🚀 FORTEK SECURITY SYSTEM ACTIVATED", "gradient"), styles.title);
        console.log("%c✨ Selamat datang di sistem yang aman!", styles.subtitle);
        console.log("%c🔒 Console Security Guard: AKTIF", styles.success);

        // Warning Messages
        setTimeout(() => {
            console.log("%c⚠️ PERINGATAN KEAMANAN!", styles.warning);
            console.log("%c🛑 Akses tidak sah ke konsol ini dapat membahayakan keamanan aplikasi!", styles.danger);
            console.log("%c🔐 Semua aktivitas konsol dimonitor dan dicatat.", styles.info);
        }, 1000);

        setTimeout(() => {
            console.log("%c🚨 BERHENTI SEKARANG JUGA!", styles.warning);
            console.log("%c⛔ Memasukkan kode berbahaya dapat:", styles.danger);
            console.log("%c• Mencuri informasi login Anda", styles.info);
            console.log("%c• Mengakses data pribadi", styles.info);
            console.log("%c• Merusak fungsi aplikasi", styles.info);
            console.log("%c• Mengirim data ke server jahat", styles.info);
        }, 2000);

        setTimeout(() => {
            console.log("%c🔍 Security Scan: RUNNING...", styles.info);
            console.log("%c✅ Aplikasi aman dari ancaman", styles.success);
            console.log("%c🛡️ Protection Level: MAXIMUM", styles.success);
        }, 3000);
    }

    setupSecurityMeasures() {
        // Disable right-click dalam production
        if (!this.isDevMode) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.logSuspiciousActivity('Right-click disabled');
            });

            // Disable F12, Ctrl+Shift+I, dll
            document.addEventListener('keydown', (e) => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                    (e.ctrlKey && e.key === 'u')
                ) {
                    e.preventDefault();
                    this.logSuspiciousActivity('Dev tools access attempt');
                    this.showSecurityAlert();
                }
            });
        }

        // Override console methods untuk monitoring
        this.overrideConsoleMethods();

        // Setup periodic security checks
        setInterval(() => {
            this.performSecurityCheck();
        }, 30000); // Every 30 seconds
    }

    overrideConsoleMethods() {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => {
            this.analyzeConsoleInput(args);
            originalLog.apply(console, args);
        };

        console.warn = (...args) => {
            this.analyzeConsoleInput(args);
            originalWarn.apply(console, args);
        };

        console.error = (...args) => {
            this.analyzeConsoleInput(args);
            originalError.apply(console, args);
        };
    }

    analyzeConsoleInput(args) {
        const input = args.join(' ').toLowerCase();
        const suspiciousPatterns = [
            'document.cookie',
            'localstorage',
            'sessionstorage',
            'eval(',
            'function(',
            'xmlhttprequest',
            'fetch(',
            '.innerHTML',
            'script>',
            'onerror',
            'onload'
        ];

        const foundSuspicious = suspiciousPatterns.some(pattern =>
            input.includes(pattern)
        );

        if (foundSuspicious) {
            this.logSuspiciousActivity(`Suspicious console input: ${input}`);
        }
    }

    logSuspiciousActivity(activity) {
        this.suspiciousActivity++;

        console.warn(`%c🚨 SECURITY ALERT: ${activity}`, styles.warning);
        console.warn(`%c⚠️ Suspicious Activity Count: ${this.suspiciousActivity}/${this.maxSuspiciousActivity}`, styles.danger);

        if (this.suspiciousActivity >= this.maxSuspiciousActivity) {
            this.triggerSecurityProtocol();
        }
    }

    showSecurityAlert() {
        const alertStyle = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(45deg, #ff4757, #ff6b7a);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 999999;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 0 50px rgba(255, 71, 87, 0.5);
    `;

        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
      <h2>🛡️ KEAMANAN TERDETEKSI</h2>
      <p>Akses developer tools tidak diizinkan!</p>
      <p>Aktivitas ini telah dicatat.</p>
    `;
        alertDiv.style.cssText = alertStyle;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 3000);
    }

    triggerSecurityProtocol() {
        console.clear();
        console.error("%c🚨 SECURITY BREACH DETECTED!", styles.warning);
        console.error("%c🔒 ACTIVATING PROTECTION MODE...", styles.danger);

        // Bisa ditambahkan: redirect, logout, atau tindakan keamanan lainnya
        setTimeout(() => {
            console.clear();
            console.log("%c🛡️ SISTEM DIAMANKAN", styles.success);
        }, 2000);

        this.suspiciousActivity = 0; // Reset counter
    }

    setupAntiDebug() {
        // Anti-debugging technique
        setInterval(() => {
            const startTime = Date.now();
            debugger; // Ini akan memperlambat jika debugger terbuka
            const endTime = Date.now();

            if (endTime - startTime > 100) {
                console.warn("%c🚨 DEBUGGER DETECTED!", styles.warning);
                this.logSuspiciousActivity('Debugger usage detected');
            }
        }, 1000);
    }

    monitorConsoleActivity() {
        // Monitor untuk console commands berbahaya
        const originalEval = window.eval;
        // eslint-disable-next-line no-eval
        window.eval = (code) => {
            console.warn(`%c🚨 EVAL DETECTED: ${code}`, styles.warning);
            this.logSuspiciousActivity(`eval() usage: ${code}`);

            if (this.isDevMode) {
                // eslint-disable-next-line no-eval
                return originalEval(code);
            } else {
                throw new Error('eval() is disabled for security reasons');
            }
        };
    }

    performSecurityCheck() {
        const currentTime = Date.now();
        const runTime = currentTime - this.startTime;

        console.log(`%c🔍 Security Check: ${new Date().toLocaleTimeString()}`, styles.info);
        console.log(`%c⏱️ App Runtime: ${Math.floor(runTime / 1000)}s`, styles.info);
        console.log(`%c🛡️ Security Status: ACTIVE`, styles.success);
    }
}

// ============================================
// 🚀 APPLICATION INITIALIZATION
// ============================================

// Initialize Security System
// const securityGuard = new ConsoleSecurityGuard();

// Additional Security Headers (if needed)
if (!securityGuard.isDevMode) {
    // Prevent iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Clear console periodically in production
    setInterval(() => {
        console.clear();
        console.log("%c🛡️ FORTEK - Console Cleared for Security", styles.success);
    }, 60000); // Every minute
}

// React Application Initialization
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Final Security Message
setTimeout(() => {
    console.log("%c🎉 Aplikasi berhasil dimuat dengan aman!", styles.success);
    console.log("%c🔐 Semua sistem keamanan aktif", styles.info);
    console.log("%c💪 FORTEK - Powered by Advanced Security", styles.subtitle);
}, 4000);