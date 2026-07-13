import { FaDatabase, FaSpinner, FaSyncAlt } from "react-icons/fa";
import PanelCard from "../common/PanelCard";

const AdminSyncCard = ({ task, values, isRunning, onFieldChange, onRun }) => {
  return (
    <PanelCard className="p-5 h-fit self-start">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-[#8b5cf6]/15 text-[#a78bfa] rounded-lg">
          <FaDatabase />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{task.title}</h2>
          <p className="text-gray-400 text-sm mt-1">{task.description}</p>
        </div>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          onRun(task);
        }}
      >
        {task.fields.map((field) => (
          <label key={field.name} className="text-sm text-gray-300">
            {field.label}
            {field.type === "select" ? (
              <select
                value={values[field.name]}
                onChange={(event) => onFieldChange(task.key, field.name, event.target.value)}
                className="mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
                required
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={values[field.name]}
                onChange={(event) => onFieldChange(task.key, field.name, event.target.value)}
                className="mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
                required
              />
            )}
          </label>
        ))}

        <button
          type="submit"
          disabled={isRunning}
          className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#3f315f] disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          {isRunning ? (
            <>
              <FaSpinner className="animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <FaSyncAlt />
              {task.submitLabel}
            </>
          )}
        </button>
      </form>
    </PanelCard>
  );
};

export default AdminSyncCard;
