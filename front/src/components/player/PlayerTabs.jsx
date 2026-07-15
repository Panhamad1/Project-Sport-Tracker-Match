const PlayerTabs = ({ activeTab, onChange, tabs }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm transition-all ${
            activeTab === tab.key
              ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
              : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PlayerTabs;
