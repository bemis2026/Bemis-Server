export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(12,12,14,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "9999px",
          border: "2px solid rgba(255,255,255,0.18)",
          borderTopColor: "rgba(255,255,255,0.78)",
          animation: "bemis-spin 0.8s linear infinite",
        }}
      />
      {/* keyframe globals.css'te (W3C: gövdede <style> geçersizdi) */}
    </div>
  );
}
