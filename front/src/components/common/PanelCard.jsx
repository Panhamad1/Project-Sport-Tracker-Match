const PanelCard = ({ children, className = "", as: Component = "section" }) => {
  return (
    <Component className={`bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg ${className}`}>
      {children}
    </Component>
  );
};

export default PanelCard;
