/**
 * RastaCamp shared analytics — one GA4 property + Cloudflare Web Analytics across app pages.
 * Config: /rastacamp-analytics.json (gaMeasurementId, cloudflareToken)
 * Per-app label: window.RASTACAMP_SITE.appId / .name (from site-chrome inject)
 */
(function () {
  "use strict";

  if (window.__rcAnalyticsInit) return;
  window.__rcAnalyticsInit = true;

  var siteCfg = window.RASTACAMP_SITE || {};
  var appId =
    siteCfg.appId || (location.hostname.split(".")[0] || "app").replace(/[^a-z0-9_-]/gi, "");
  var appName =
    siteCfg.name ||
    (document.title || "RastaCamp").split("—")[0].split("-")[0].trim();

  function gaId(value) {
    return typeof value === "string" && /^G-[A-Z0-9]+$/i.test(value.trim())
      ? value.trim()
      : "";
  }

  function loadCloudflare(token) {
    if (!token || document.querySelector("script[data-cf-beacon]")) return;
    try {
      var s = document.createElement("script");
      s.defer = true;
      s.src =
        "https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae34746b4dedf0b4dfa099e1781791509496";
      s.setAttribute(
        "data-cf-beacon",
        JSON.stringify({ token: token, spa: true, version: "2024.11.0" }),
      );
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    } catch (_) {}
  }

  function loadGoogle(measurementId) {
    if (!measurementId || window.__rcGaLoaded) return;
    window.__rcGaLoaded = true;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: true,
        page_path: "/" + appId + (location.pathname || "/"),
        page_title: appName + (document.title ? " · " + document.title : ""),
      });
      window.gtag("set", "user_properties", { app_id: appId, app_name: appName });

      var s = document.createElement("script");
      s.async = true;
      s.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(measurementId);
      document.head.appendChild(s);
    } catch (_) {}
  }

  function apply(config) {
    if (!config || typeof config !== "object") return;
    var ga =
      gaId(siteCfg.gaMeasurementId) ||
      gaId(config.gaMeasurementId) ||
      gaId(window.RASTACAMP_GA_MEASUREMENT_ID);
    if (ga) loadGoogle(ga);
    if (config.cloudflareToken) loadCloudflare(String(config.cloudflareToken).trim());
  }

  var inlineGa = gaId(window.RASTACAMP_GA_MEASUREMENT_ID);
  if (inlineGa) loadGoogle(inlineGa);

  fetch("/rastacamp-analytics.json", { cache: "no-store" })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .catch(function () {
      return null;
    })
    .then(apply);
})();
