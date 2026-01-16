import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";

export default function AdminCleaningCatalogEditor() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_PACKAGE_CATALOG}`
      );
      setConfig(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateField = (categoryKey, index, field, value) => {
    try {
      setConfig((prev) => {
        const next = structuredClone(prev);
        next.data[categoryKey][index][field] = value;
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  console.log("config", config?.data);

  const save = async () => {
    try {
      if (!config?.data) return;
      setSaving(true);
      setError("");
      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PACKAGE_CATALOG}?serviceType=deep_cleaning`,
        {
          data: config.data,
        }
      );
      await fetchConfig();
      alert("Saved ✅");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      const errs = e?.response?.data?.errors || [];
      setError(`${msg}${errs.length ? "\n- " + errs.join("\n- ") : ""}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!config) return <div>{error || "No config found"}</div>;

  const categories = Object.keys(config.data || {});

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h2>Cleaning Catalog (v{config.version})</h2>
        <button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error ? (
        <pre
          style={{ background: "#ffecec", padding: 12, whiteSpace: "pre-wrap" }}
        >
          {error}
        </pre>
      ) : null}

      {categories.map((cat) => (
        <div
          key={cat}
          style={{ marginTop: 18, border: "1px solid #ddd", borderRadius: 8 }}
        >
          <div style={{ padding: 12, background: "#f6f6f6" }}>
            <b>Category Key (locked):</b> {cat} -
            {(config.data[cat] || []).length} Packages
          </div>

          <div style={{ padding: 12 }}>
            {(config.data[cat] || []).map((pkg, i) => (
              <div
                key={`${cat}-${i}`}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  backgroundImage: "white",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {/* LOCKED: name */}
                  <div>
                    <label>Name (locked)</label>
                    <input
                      value={pkg.name || ""}
                      disabled
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* EDITABLE: price */}
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      value={pkg.price ?? ""}
                      onChange={(e) =>
                        updateField(cat, i, "price", Number(e.target.value))
                      }
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* LOCKED: duration */}
                  <div>
                    <label>Duration</label>
                    <input
                      value={pkg.duration ?? ""}
                      onChange={(e) =>
                        updateField(cat, i, "duration", Number(e.target.value))
                      }
                      //   disabled
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* LOCKED: teamMembers */}
                  <div>
                    <label>Team Members</label>
                    <input
                      value={pkg.teamMembers ?? ""}
                      onChange={(e) =>
                        updateField(
                          cat,
                          i,
                          "teamMembers",
                          Number(e.target.value)
                        )
                      }
                      //   disabled
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* EDITABLE: reviews */}
                  <div>
                    <label>Reviews</label>
                    <input
                      value={pkg.reviews || ""}
                      onChange={(e) =>
                        updateField(cat, i, "reviews", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* EDITABLE: details */}
                  <div>
                    <label>Details</label>
                    <input
                      value={pkg.details || ""}
                      onChange={(e) =>
                        updateField(cat, i, "details", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* EDITABLE: extras */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Extras</label>
                    <input
                      value={pkg.extras || ""}
                      onChange={(e) =>
                        updateField(cat, i, "extras", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
