export function useServiceWorker() {
  if ("serviceWorker" in navigator === false) return;

  const configurationVersion = 1;
  const serviceWorkerUrl = `/service-worker.js?configuration=${encodeURIComponent(
    `/service-worker-configuration.json?v=${configurationVersion}`
  )}`;
  navigator.serviceWorker
    .register(serviceWorkerUrl, { scope: "/", type: "module" })
    .then((registration) => registration.update());
}
