import React, { useMemo, useState } from "react";
import logo from "../assets/logohomjee.svg";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import WalletSuccesModal from "./WalletSuccesModal";

export default function VendorPayment({
  vendorId,
  currentCoins = 0,
  coinsToAdd = 500,
  baseAmount = 5000,
  gstPercent = 18,
  currencySymbol = "₹",
}) {
  const { gstAmount, finalAmount } = useMemo(() => {
    const safeBase = Number(baseAmount) || 0;
    const safeGst = Number(gstPercent) || 0;
    const gstAmountCalc = Math.round((safeBase * safeGst) / 100);
    const finalAmountCalc = safeBase + gstAmountCalc;
    return { gstAmount: gstAmountCalc, finalAmount: finalAmountCalc };
  }, [baseAmount, gstPercent]);
  const [paying, setPaying] = useState(false);
  const [showSuccesModal, setShowSuccesModal] = useState(false);

  const formatINR = (n) =>
    `${currencySymbol} ${Number(n).toLocaleString("en-IN")}`;

  const handlePay = async () => {
    setShowSuccesModal(true);
    // try {
    //   if (!vendorId) {
    //     alert("VendorId missing");
    //     return;
    //   }
    //   if (paying) return;

    //   setPaying(true);

    //   const url = `${API_BASE_URL}${API_ENDPOINTS.RECHARGE_WALLET}`;
    //   console.log("Recharge URL:", url, "payload:", { vendorId });

    //   const res = await axios.post(url, { vendorId });

    //   console.log("Recharge response:", res?.data);

    //   if (res?.data?.status === "success") {
    //     console.log("Res", res?.data);
    //     setShowSuccesModal(true);
    //     // alert("Wallet recharged successfully ✅");
    //     return;
    //   }

    //   alert(res?.data?.message || "Recharge failed");
    // } catch (err) {
    //   console.log("Recharge error:", err?.response?.data || err?.message);
    //   alert(err?.response?.data?.message || "Server error");
    // } finally {
    //   setPaying(false);
    // }
  };

  const styles = {
    wrap: {
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    walletCard: {
      backgroundColor: "#0f6a97",
      padding: 14,
      margin: 10,
      overflow: "hidden",
      boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
      minHeight: 130,
      position: "relative",
      borderRadius: 14,
    },
    highlight: {
      position: "absolute",
      right: -30,
      top: -20,
      width: 160,
      height: 90,
      zIndex: 1,
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 28,
      transform: "rotate(20deg)",
    },
    cointxt: { fontSize: 14, fontWeight: "600", color: "#d3d3d3" },
    card: { width: "100%", padding: 18 },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 2px",
      color: "#2e2e2e",
      fontSize: 14,
      fontWeight: 600,
    },
    left: { color: "#3b3b3b" },
    right: { color: "#2b2b2b" },
    dash: { borderTop: "2px dotted rgba(0,0,0,0.18)", margin: "10px 0" },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 2px",
      color: "#1f1f1f",
      fontSize: 14.5,
      fontWeight: 800,
    },
    btn: {
      marginTop: 14,
      width: "100%",
      height: 48,
      borderRadius: 10,
      border: "none",
      background: paying ? "#ff6b6b" : "#e91515",
      color: "#fff",
      fontSize: 15,
      fontWeight: 800,
      cursor: paying ? "not-allowed" : "pointer",
      boxShadow: "0 10px 18px rgba(233,21,21,0.22)",
    },
    small: { fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.55)" },
  };

  return (
    <div className="app-wrapper" style={styles.wrap}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 53, width: 138 }} />
      </div>

      <div style={styles.walletCard}>
        <div style={styles.highlight} />
        <div style={styles.cointxt}>Your Coin Balance</div>

        <div className="mt-2" style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#ffffff59",
              border: "3px solid #ffffff59",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 47,
                height: 47,
                borderRadius: "50%",
                backgroundColor: "#F6C10E",
              }}
            />
          </div>

          <span
            style={{
              marginLeft: 10,
              color: "#f1f1f1",
              fontSize: 28,
              fontWeight: "600",
            }}
          >
            {currentCoins}
          </span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <div style={styles.left}>Coins to Add</div>
          <div style={styles.right}>{coinsToAdd}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.left}>Amount (exclusive Govt. Tax)</div>
          <div style={styles.right}>{formatINR(baseAmount)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.left}>Govt. Tax ({gstPercent}% GST)</div>
          <div style={styles.right}>{formatINR(gstAmount)}</div>
        </div>

        <div style={styles.dash} />

        <div style={styles.totalRow}>
          <div>Final Payable Amount</div>
          <div>{formatINR(finalAmount)}</div>
        </div>

        <button style={styles.btn} onClick={handlePay} disabled={paying}>
          {paying ? "Processing..." : "Pay Now"}
        </button>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <span style={styles.small}>Taxes included as per GST rules</span>
        </div>
      </div>
      <WalletSuccesModal
        show={showSuccesModal}
        // bookingData={bookingData}
        // paidAmount={payAmount}
        onClose={() => setShowSuccesModal(false)}
      />
    </div>
  );
}
