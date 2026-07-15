import { FaShieldAlt } from "react-icons/fa";
import AdminAccessCard from "../components/admin/AdminAccessCard";
import AdminMatchDetailHelper from "../components/admin/AdminMatchDetailHelper";
import AdminResponseHistory from "../components/admin/AdminResponseHistory";
import AdminSyncCard from "../components/admin/AdminSyncCard";
import AdminToast from "../components/admin/AdminToast";
import AdminUsefulIdsCard from "../components/admin/AdminUsefulIdsCard";
import PanelCard from "../components/common/PanelCard";
import { useAdminPanelPage } from "../hooks/useAdminPanelPage";

const AdminPanelPage = () => {
  const {
    forms,
    history,
    isAdmin,
    loading,
    presets,
    refreshFixture,
    runningTask,
    runTask,
    setToast,
    syncFixtureDetails,
    syncFixtureDetailsByDate,
    taskCards,
    toast,
    updateForm,
    user,
  } = useAdminPanelPage();

  if(loading || !user || !isAdmin){
    return <AdminAccessCard loading={loading} user={user} isAdmin={isAdmin} />;
  }

  return (
    <div className="relative space-y-6 text-white">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-[#8b5cf6]">
            <FaShieldAlt />
            Admin Panel
          </p>
          <h1 className="mt-1 text-2xl font-bold">Football Data Sync</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Run backend sync actions from one place. Every request returns the backend response so admin can see success,
            API limits, missing data, or validation errors immediately.
          </p>
        </div>

        <PanelCard as="div" className="px-4 py-3">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="font-semibold">{user.username}</p>
          <p className="text-xs uppercase tracking-wide text-[#8b5cf6]">{user.role}</p>
        </PanelCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {taskCards.map((task) => (
            <AdminSyncCard
              key={task.key}
              task={task}
              values={forms[task.key]}
              isRunning={runningTask === task.key}
              onFieldChange={updateForm}
              onRun={runTask}
            />
          ))}
          <AdminMatchDetailHelper
            onRefreshFixture={refreshFixture}
            onSyncAllDetails={syncFixtureDetailsByDate}
            onSyncDetails={syncFixtureDetails}
          />
        </div>

        <aside className="space-y-5">
          <AdminUsefulIdsCard presets={presets} />
          <AdminResponseHistory history={history} />
        </aside>
      </div>
    </div>
  );
};

export default AdminPanelPage;
