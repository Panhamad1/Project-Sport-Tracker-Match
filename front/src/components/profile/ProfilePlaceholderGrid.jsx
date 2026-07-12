import ProfilePlaceholderCard from "./ProfilePlaceholderCard";

const ProfilePlaceholderGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {items.map((item) => (
        <ProfilePlaceholderCard
          key={item.path}
          icon={item.icon}
          title={item.label}
        />
      ))}
    </div>
  );
};

export default ProfilePlaceholderGrid;
