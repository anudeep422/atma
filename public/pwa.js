// Registers the service worker and shows an "Install app" button where the browser supports it.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});

let installPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  const btn = document.getElementById("install-app");
  if (btn) btn.classList.remove("hidden");
});
window.addEventListener("appinstalled", () => {
  document.getElementById("install-app")?.classList.add("hidden");
  if (typeof track === "function") track("install");
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("install-app");
  if (!btn) return;
  btn.onclick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => {});
    installPrompt = null;
    btn.classList.add("hidden");
  };
});
