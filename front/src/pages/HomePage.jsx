const HomePage = () => {
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to FootHub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Live Matches</h3>
          <p className="text-gray-400">3 matches currently live</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Today's Results</h3>
          <p className="text-gray-400">12 matches completed</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Top Teams</h3>
          <p className="text-gray-400">Updated rankings</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;