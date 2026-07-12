const ProfilePlaceholderCard = ({ icon, title, description = "Empty state ready for future UI." }) => {
  return (
    <div className="border border-[#2a2a2a] rounded-lg p-4 bg-[#111111]">
      <div className="flex items-center gap-3 text-gray-200">
        <span className="text-[#8b5cf6]">{icon}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default ProfilePlaceholderCard;
