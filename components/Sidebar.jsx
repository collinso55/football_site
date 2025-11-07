// app/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <div className="w-60 min-h-screen bg-[#111] text-white p-4">
      <ul className="space-y-3">
        <li>Home</li>
        <li>Teams</li>
        <li>Fixtures</li>
        <li>Standings</li>
        <li>News</li>
      </ul>
    </div>
  );
}
