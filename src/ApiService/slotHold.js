// Customer-side hold helpers. Wraps the backend's /api/slots/hold +
// /api/slots/release endpoints with a "try each candidate vendor in
// turn" loop so the customer never sees a vendor-by-vendor 409 dance.
//
// Usage:
//   const result = await acquireSlotHold({
//     vendorIds: ["v1", "v2", "v3"],   // from slotsWithVendors[].vendorIds
//     date: "2026-05-04",
//     slotTime: "05:00 PM",
//     durationMinutes: 90,
//     customerId, serviceType,
//   });
//   if (!result.ok) {
//     // result.reason === "all_held"  → every vendor for this slot is taken
//     // result.reason === "transport" → network/Redis problem
//   }

import { API_BASE_URL, API_ENDPOINTS } from "./apiConstants";

export async function acquireSlotHold({
  vendorIds,
  date,
  slotTime,
  durationMinutes,
  customerId,
  serviceType,
}) {
  if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
    return { ok: false, reason: "no_vendor_candidates" };
  }

  for (const vendorId of vendorIds) {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HOLD_SLOT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          date,
          slotTime,
          durationMinutes,
          customerId,
          serviceType,
        }),
      });

      if (res.status === 409) continue; // this vendor just got taken — try next
      if (res.status === 503) return { ok: false, reason: "service_unavailable" };

      const data = await res.json();
      if (data?.success && data?.holdId) {
        return {
          ok: true,
          holdId: data.holdId,
          vendorId,
          expiresInSeconds: data.expiresInSeconds || 600,
        };
      }
    } catch (err) {
      console.error("acquireSlotHold transport error:", err);
      // Try next vendor on network blip; if all fail we'll fall through.
    }
  }

  return { ok: false, reason: "all_held" };
}

export async function releaseSlotHold({ vendorId, date, slotTime, holdId }) {
  if (!vendorId || !date || !slotTime) return false;
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RELEASE_SLOT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, date, slotTime, holdId }),
      keepalive: true, // survive page-unload during navigation/refresh
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}

// Convenience: persist the active hold to sessionStorage so checkout
// pages can release it on cancel/back, even after a page reload.
const HOLD_KEY = "activeSlotHold";

export function persistHold({ holdId, vendorId, date, slotTime, expiresInSeconds }) {
  try {
    sessionStorage.setItem(
      HOLD_KEY,
      JSON.stringify({
        holdId,
        vendorId,
        date,
        slotTime,
        expiresAt: Date.now() + (expiresInSeconds || 600) * 1000,
      }),
    );
  } catch (_) {}
}

export function readPersistedHold() {
  try {
    const raw = sessionStorage.getItem(HOLD_KEY);
    if (!raw) return null;
    const h = JSON.parse(raw);
    if (h.expiresAt && h.expiresAt < Date.now()) {
      sessionStorage.removeItem(HOLD_KEY);
      return null;
    }
    return h;
  } catch (_) {
    return null;
  }
}

export function clearPersistedHold() {
  try {
    sessionStorage.removeItem(HOLD_KEY);
  } catch (_) {}
}

export async function releasePersistedHold() {
  const h = readPersistedHold();
  if (!h) return;
  await releaseSlotHold(h);
  clearPersistedHold();
}
