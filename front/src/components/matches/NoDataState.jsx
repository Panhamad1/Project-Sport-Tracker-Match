import { FaDatabase } from "react-icons/fa";

const NoDataState = ({ title = "No Data Yet", message = "There is no saved data for this section yet." }) => {
  return (
    <div className="rounded-lg border border-dashed border-[#2a2a2a] bg-[#111111] p-8 text-center">
      <FaDatabase className="mx-auto text-3xl text-[#8b5cf6]" />
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default NoDataState;
