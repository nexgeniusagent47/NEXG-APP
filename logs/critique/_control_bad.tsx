export default function Bad() {
  return (
    <div style={{ transition: "all 0.3s ease-in-out", fontFamily: "Inter" }}>
      <h1 style={{ fontSize: "12px" }}>Title</h1>
      <img src="/a.png" />
      <button style={{ background: "linear-gradient(90deg,#a78bfa,#7c3aed)", borderRadius: "16px" }}>
        <span style={{ color: "#8b5cf6" }}>Click</span>
      </button>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8">
        <p>Lorem ipsum dolor sit amet — consectetur adipiscing elit — sed do eiusmod.</p>
      </div>
    </div>
  );
}
