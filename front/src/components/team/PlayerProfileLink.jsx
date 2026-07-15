import { Link } from "react-router-dom";

const PlayerProfileLink = ({ children, className, player }) => {
  if(player?.api_player_id){
    return (
      <Link to={`/players/${player.api_player_id}`} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
};

export default PlayerProfileLink;
