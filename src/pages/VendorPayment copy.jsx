import React, { useEffect, useMemo, useState } from "react";
import { FaWallet } from "react-icons/fa";

/**
 * VendorPayment (UI like the attached card)
 * Changes applied:
 * - BUY  -> RECHARGE
 * - Bitcoin -> Buy Coins
 * - Bitcoin icon -> Wallet icon
 * - LOWEST ASK -> Current Balance / Your Balance
 * - Remove MAX AMOUNT section (left blank / not shown)
 * - Price -> Coin Value (500)
 * - Amount -> 5900 (including tax)
 * - Total -> INR
 * - Note: link will expire before 12AM/11:59 PM + show time left to midnight
 * - Button: Buy Coin 5900
 */
export default function VendorPayment({
  balanceINR = 4688, // current balance
  coinValue = 500, // "Price" replacement
  amountINR = 5900, // tax included
  serviceFeePercent = 0.25, // optional (kept similar to sample)
}) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  const feeINR = useMemo(() => {
    // fee just for display (can be removed if not needed)
    const fee = (Number(amountINR) * Number(serviceFeePercent)) / 100;
    return Math.round(fee);
  }, [amountINR, serviceFeePercent]);

  useEffect(() => {
    let timer;

    const tick = () => {
      try {
        const now = new Date();

        // next midnight (local)
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const diff = Math.max(0, end.getTime() - now.getTime());
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ h, m, s });
      } catch (e) {
        // fail-safe: don’t break UI if date calc fails
        setTimeLeft({ h: 0, m: 0, s: 0 });
      }
    };

    tick();
    timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, []);

  const styles = {
    wrap: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: 12,
    },
    card: {
      width: 380,
      maxWidth: "100%",
      border: "2px solid #1f6fe5",
      borderRadius: 10,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    top: {
      padding: "14px 14px 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    badge: {
      background: "#e8ffe6",
      color: "#1a8f2d",
      //   fontWeight: 700,
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 6,
      border: "1px solid #c7f3c9",
      letterSpacing: 0.4,
    },
    titleBox: { display: "flex", alignItems: "center", gap: 10 },
    title: { fontSize: 22, fontWeight: 700, color: "#2f3a4a", lineHeight: 1.1 },
    subTitle: { fontSize: 12, color: "#7b8796", marginTop: 2 },
    iconBox: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: "#ffb000",
      display: "grid",
      placeItems: "center",
      color: "#fff",
    },
    divider: { borderTop: "1px solid #e9eef6" },

    headerRow: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 0,
    },
    headerCell: { padding: "12px 14px" },
    headerLabel: {
      fontSize: 12,
      fontWeight: 500,
      color: "#8b97a6",
      textTransform: "uppercase",
    },
    headerValue: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 6,
    },
    headerPrice: { fontSize: 22, fontWeight: 800, color: "#111827" },
    headerHint: { fontSize: 12, color: "#8b97a6" },

    rows: { padding: "8px 14px 6px" },
    row: {
      display: "grid",
      gridTemplateColumns: "110px 1fr 60px",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #eef2f8",
      gap: 10,
    },
    label: { fontSize: 14, color: "#3f4959", fontWeight: 500 },
    val: {
      fontSize: 15,
      color: "#111827",
      fontWeight: 800,
      textAlign: "right",
    },
    unit: {
      fontSize: 13,
      color: "#7b8796",
      //   fontWeight: 800,
      textAlign: "right",
    },

    totalRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0px 14px",
      fontWeight: 900,
      color: "#111827",
    },
    totalLeft: { fontSize: 16 },
    totalRight: { display: "flex", alignItems: "baseline", gap: 8 },
    totalValue: { fontSize: 18 },
    totalUnit: { fontSize: 13, color: "#7b8796", fontWeight: 900 },

    fee: {
      padding: "0 14px 10px",
      fontSize: 13,
      color: "#8b97a6",
      //   fontWeight: 700,
    },

    noteBox: {
      padding: "10px 14px 0",
      fontSize: 12.5,
      color: "#5b6678",
      fontWeight: 700,
      lineHeight: 1.35,
    },
    timerPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      //   background: "#f1f6ff",
      //   border: "1px solid #dbe7ff",
      //   padding: "6px 10px",
      //   borderRadius: 999,
      marginTop: 8,
      fontWeight: 900,
      color: "#1f6fe5",
    },

    btnWrap: { padding: 14 },
    btn: {
      width: "100%",
      padding: "14px 14px",
      borderRadius: 8,
      background: "#0b66d9",
      color: "#fff",
      fontWeight: 900,
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      boxShadow: "0 6px 14px rgba(11,102,217,0.25)",
    },
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Top bar */}
        <div style={styles.top}>
          <div style={styles.badge}>RECHARGE</div>

          <div style={styles.titleBox}>
            <div>
              <div style={styles.title}>Buy Coins</div>
              <div style={styles.subTitle}>Secure wallet recharge</div>
            </div>
          </div>

          <div style={styles.iconBox} title="Wallet">
            <FaWallet size={16} />
          </div>
        </div>

        <div style={styles.divider} />

        {/* Balance header */}
        <div style={styles.headerRow}>
          <div style={styles.headerCell}>
            <div style={styles.headerLabel}>CURRENT COIN</div>
            <div style={styles.headerValue}>
              <div style={styles.headerPrice}>25</div>
              {/* <div style={styles.headerHint}>INR</div> */}
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Details */}
        <div style={styles.rows}>
          <div style={styles.row}>
            <div style={styles.label}>Coin Value</div>
            <div style={styles.val}>
              {Number(coinValue).toLocaleString("en-IN")}
            </div>
            {/* <div style={styles.unit}>COIN</div> */}
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Amount</div>
            <div style={styles.val}>
              ₹ {Number(amountINR).toLocaleString("en-IN")}
            </div>
            <div style={styles.unit}>INR</div>
          </div>
        </div>

        {/* Total */}
        <div style={styles.totalRow}>
          <div style={styles.totalLeft}>Total:</div>
          <div style={styles.totalRight}>
            <div style={styles.totalValue}>
              ₹ {Number(amountINR).toLocaleString("en-IN")}
            </div>
            {/* <div style={styles.totalUnit}>INR</div> */}
          </div>
        </div>

        {/* Optional fee line (you can remove if you don’t want it) */}
        {/* <div style={styles.fee}>
          Service fee: {serviceFeePercent}% (₹
          {Number(feeINR).toLocaleString("en-IN")})
        </div> */}
        <div style={styles.fee}>including tax</div>

        {/* Note + timer */}
        <div style={styles.noteBox}>
          Note: Payment link will expire before{" "}
          <b style={styles.timerPill}>
            {pad2(timeLeft.h)}:{pad2(timeLeft.m)}:{pad2(timeLeft.s)}
          </b>
          {/* <b>11:59 PM</b>. */}
          {/* <div style={styles.timerPill}>
            Time left: {pad2(timeLeft.h)}:{pad2(timeLeft.m)}:{pad2(timeLeft.s)}
          </div> */}
        </div>

        {/* CTA */}
        <div style={styles.btnWrap}>
          <button
            style={styles.btn}
            onClick={() => {
              try {
                // hook your payment/recharge logic here
                // e.g., open payment link / call API
                alert(
                  `Proceed to recharge ₹${Number(amountINR).toLocaleString(
                    "en-IN"
                  )}`
                );
              } catch (e) {
                alert("Something went wrong. Please try again.");
              }
            }}
          >
            Buy Coin - ₹ {Number(amountINR).toLocaleString("en-IN")}
          </button>
        </div>
      </div>
    </div>
  );
}
