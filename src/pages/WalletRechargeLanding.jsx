import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import VendorPayment from "./VendorPayment";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import GlobalLoader from "../utils/GlobalLoader";

export default function WalletRechargeLanding() {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const ref = searchParams.get("ref");
  const [state, setState] = useState({
    loading: true,
    status: "loading", // loading | active | expired | paid | invalid | error
    message: "",
    linkExpiry: null,
    data: null,
    vendorName: "",
    vendorPhone: "",
  });

  const timeLeftText = useMemo(() => {
    if (!state.linkExpiry) return "";
    const diff = new Date(state.linkExpiry).getTime() - Date.now();
    if (diff <= 0) return "00:00";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [state.linkExpiry]);

  useEffect(() => {
    const validate = async () => {
      try {
        if (!vendorId || !ref) {
          setState({
            loading: false,
            status: "invalid",
            message: "Invalid link. Missing vendorId or ref.",
            linkExpiry: null,
            data: null,
          });
          return;
        }
        const res = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.VALIDATE_URL}`,
          { params: { vendorId, ref } },
        );

        const payload = res?.data || {};
        console.log("payload", payload);

        // ✅ EXPECTED BACKEND RESPONSE SHAPE:
        // { ok:true, status:"active", linkExpiry, coinsToAdd, baseAmount, gstPercent, currentCoins }
        // { ok:false, status:"expired" }
        // { ok:false, status:"paid" }  OR { ok:false, status:"inactive" }

        if (payload.ok && payload.status === "active") {
          setState({
            loading: false,
            status: "active",
            message: "",
            linkExpiry: payload.linkExpiry,
            data: payload,
            vendorName: payload.vendorname,
            vendorPhone: payload.vendorPhone,
          });
          return;
        }

        if (payload.status === "expired") {
          setState({
            loading: false,
            status: "expired",
            message: payload.message || "This payment link has expired.",
            linkExpiry: payload.linkExpiry || null,
            data: payload,
            vendorName: payload.vendorname,
            vendorPhone: payload.vendorPhone,
          });
          return;
        }

        if (payload.status === "paid" || payload.status === "inactive") {
          setState({
            loading: false,
            status: "paid",
            message:
              payload.message || "This payment link is already used / paid.",
            linkExpiry: payload.linkExpiry || null,
            data: payload,
            vendorName: payload.vendorname,
            vendorPhone: payload.vendorPhone,
          });
          return;
        }

        setState({
          loading: false,
          status: "error",
          message: payload.message || "Unable to validate link.",
          linkExpiry: payload.linkExpiry || null,
          data: payload,
          vendorName: payload.vendorname,
          vendorPhone: payload.vendorPhone,
        });
      } catch (err) {
        setState({
          loading: false,
          status: "error",
          message:
            err?.response?.data?.message ||
            "Server error while validating link.",
          linkExpiry: null,
          data: null,
          vendorName: "",
          vendorPhone: "",
        });
      }
    };

    validate();
  }, [vendorId, ref]);

  console.log("state", state);

  if (state.loading) return <GlobalLoader />;

  if (state.status === "invalid") {
    return (
      <PageShell title="Invalid Link" desc={state.message} variant="warn" />
    );
  }

  if (state.status === "expired") {
    return (
      <PageShell
        title="Link Expired"
        desc={state.message}
        variant="danger"
        action={<button onClick={() => window.location.reload()}>Retry</button>}
      />
    );
  }

  if (state.status === "paid") {
    return (
      <PageShell title="Already Paid" desc={state.message} variant="success" />
    );
  }

  if (state.status === "error") {
    return (
      <PageShell
        title="Something went wrong"
        desc={state.message}
        variant="danger"
        action={<button onClick={() => window.location.reload()}>Retry</button>}
      />
    );
  }

  // ✅ ACTIVE => Show payment UI
  const payload = state.data || {};

  return (
    <VendorPayment
      vendorId={vendorId}
      refCode={ref}
      linkExpiry={state.linkExpiry}
      timeLeftText={timeLeftText}
      // optionally pass data coming from backend:
      coinsToAdd={payload.coinsToAdd ?? 500}
      baseAmount={payload.baseAmount ?? 5000}
      gstPercent={payload.gstPercent ?? 18}
      currentCoins={payload.currentCoins ?? 0}
      vendorName={payload.vendorName}
      vendorPhone={payload.vendorPhone}
      //   onPayNow={onPayNow}
      //   busy={paying}
    />
  );
}

/* Small helper UI */
function PageShell({ title, desc, variant = "info", action = null }) {
  const bg =
    variant === "danger"
      ? "#ffe8e8"
      : variant === "success"
        ? "#e9ffe8"
        : variant === "warn"
          ? "#fff6db"
          : "#eef5ff";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: bg,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 18,
          borderRadius: 14,
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p style={{ marginTop: 10, color: "#444" }}>{desc}</p>
        {action ? <div style={{ marginTop: 14 }}>{action}</div> : null}
      </div>
    </div>
  );
}
