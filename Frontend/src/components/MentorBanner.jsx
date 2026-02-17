import React from "react";

function MentorBanner({ feedback, onDismiss }) {
  if (!feedback || !feedback.show) return null;

  return (
    <div
      style={{
        background: "#f5f7fa",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
      }}
    >
      <div>
        <strong>{feedback.message}</strong>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {feedback.actionLabel && (
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "#1e293b",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {feedback.actionLabel}
          </button>
        )}

        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default MentorBanner;
