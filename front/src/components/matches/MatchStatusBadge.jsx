const liveStatuses = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"];
const finishedStatuses = ["FT", "AET", "PEN"];

const MatchStatusBadge = ({ statusShort, elapsed }) => {
  const status = statusShort || "NS";
  const isLive = liveStatuses.includes(status);
  const isFinished = finishedStatuses.includes(status);

  const className = isLive
    ? "bg-red-500/15 text-red-300"
    : isFinished
      ? "bg-green-500/15 text-green-300"
      : "bg-[#8b5cf6]/15 text-[#a78bfa]";

  const label = isLive && elapsed ? `${elapsed}'` : status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

export default MatchStatusBadge;
