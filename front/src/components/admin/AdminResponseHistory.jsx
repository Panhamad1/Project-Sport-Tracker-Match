import PanelCard from "../common/PanelCard";

const shortText = (value, maxLength = 180) => {
  if(!value){
    return "";
  }

  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
};

const AdminResponseHistory = ({ history }) => {
  return (
    <PanelCard className="p-5 h-fit max-h-[520px] overflow-hidden">
      <h2 className="font-semibold">Latest Responses</h2>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500 mt-3">No sync request yet.</p>
      ) : (
        <div className="space-y-3 mt-4 max-h-[440px] overflow-y-auto pr-1">
          {history.map((item) => (
            <article key={item.id} className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.task}</p>
                  <p className="text-xs text-gray-500">{item.time} - HTTP {item.status}</p>
                  {item.attempt && (
                    <p className="text-xs text-[#a78bfa] mt-2 break-words">
                      Tried: {item.attempt}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                  item.ok ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"
                }`}>
                  {item.ok ? "success" : "failed"}
                </span>
              </div>

              {item.message && (
                <p className="text-xs text-gray-300 mt-3 break-words">{shortText(item.message)}</p>
              )}

              {item.resultItems?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {item.resultItems.map((resultItem, index) => (
                    <div key={`${item.id}-${resultItem.label}-${index}`} className="border border-[#2a2a2a] rounded p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-300">{resultItem.label}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                          resultItem.status === "failed"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-green-500/15 text-green-300"
                        }`}>
                          {resultItem.status}
                        </span>
                      </div>
                      {resultItem.countLabel && (
                        <p className="text-xs text-[#a78bfa] mt-1">{resultItem.countLabel}</p>
                      )}
                      {resultItem.message && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{shortText(resultItem.message, 140)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </PanelCard>
  );
};

export default AdminResponseHistory;
