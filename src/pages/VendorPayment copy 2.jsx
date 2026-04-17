import React, { useMemo } from "react";
import logo from "../assets/logohomjee.svg";

export default function VendorPayment({
  coinsToAdd = 500,
  baseAmount = 5000, // Amount (exclusive Govt. Tax)
  gstPercent = 18,
  currencySymbol = "₹",
  onPayNow,
  busy = false,
}) {
  const { gstAmount, finalAmount } = useMemo(() => {
    const safeBase = Number(baseAmount) || 0;
    const safeGst = Number(gstPercent) || 0;

    const gstAmountCalc = Math.round((safeBase * safeGst) / 100);
    const finalAmountCalc = safeBase + gstAmountCalc;

    return { gstAmount: gstAmountCalc, finalAmount: finalAmountCalc };
  }, [baseAmount, gstPercent]);

  const formatINR = (n) => {
    try {
      return `${currencySymbol} ${Number(n).toLocaleString("en-IN")}`;
    } catch (e) {
      return `${currencySymbol} ${n}`;
    }
  };

  const handlePay = async () => {
    try {
      if (busy) return;

      if (typeof onPayNow === "function") {
        await onPayNow({
          coinsToAdd,
          baseAmount,
          gstPercent,
          gstAmount,
          finalAmount,
        });
        return;
      }

      // default fallback
      alert(`Pay Now: ${formatINR(finalAmount)}`);
    } catch (err) {
      alert(err?.message || "Payment failed. Please try again.");
    }
  };

  const styles = {
    wrap: {
      //   width: "100%",
      //   display: "flex",
      //   justifyContent: "center",
      //   padding: 14,
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    walletCard: {
      backgroundColor: "#F6C10E",
      padding: 14,
      margin: 10,
      overflow: "hidden",
      // shadow
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      minHeight: 110,
    },
    // highlight: {
    //   position: "absolute",
    //   right: -70,
    //   top: -30,
    //   width: 160,
    //   height: 160,
    //   backgroundColor: "rgba(10, 85, 29, 0.69)",
    //   borderRadius: 28,
    //   transform: [{ rotate: "20deg" }],
    // },
    coinSymbol: {
      color: "red",
    },
    card: {
      width: "100vw",
      //   maxWidth: "100%",
      //   background: "#f7f7f7",
      //   borderRadius: 14,
      padding: 18,
      //   boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
      //   border: "1px solid rgba(0,0,0,0.06)",
    },
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
    dash: {
      borderTop: "2px dotted rgba(0,0,0,0.18)",
      margin: "10px 0",
    },
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
      background: busy ? "#ff6b6b" : "#e91515",
      color: "#fff",
      fontSize: 15,
      fontWeight: 800,
      cursor: busy ? "not-allowed" : "pointer",
      boxShadow: "0 10px 18px rgba(233,21,21,0.22)",
    },
    small: { fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.55)" },
  };

  return (
    <div style={styles.wrap}>
      <img
        src={logo}
        alt="Logo"
        style={{ height: "53px", marginRight: "10px", width: "138px" }}
      />
      <div style={styles.walletCard}>
        <div style={styles.highlight} />
        <div style={styles.coinSymbol}>₹</div>
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

        <button style={styles.btn} onClick={handlePay} disabled={busy}>
          {busy ? "Processing..." : "Pay Now"}
        </button>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <span style={styles.small}>Taxes included as per GST rules</span>
        </div>
      </div>
    </div>
  );
}
