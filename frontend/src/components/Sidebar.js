export default function Sidebar() {
  return (
    <div className="w-48 bg-gray-800 text-white h-screen p-4 flex flex-col gap-4">
      <h1 className="text-lg font-bold border-b border-gray-600 pb-2">
       imrasoft SAGE
      </h1>
      <nav className="flex flex-col gap-2 text-sm">
        <a href="#" className="bg-gray-700 rounded px-3 py-2">📊 Tableau de bord</a>
      </nav>
    </div>
  );
}