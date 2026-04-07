/**
 * Dynamically loads leaflet.heat from CDN.
 * Called once in main.jsx before the app mounts.
 */
export function loadLeafletHeat() {
  return new Promise((resolve) => {
    if (window.L && window.L.heatLayer) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.onload = resolve;
    script.onerror = resolve; // graceful fallback — heatmap just won't render
    document.head.appendChild(script);
  });
}
