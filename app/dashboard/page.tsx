export default function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
          <h2 className="font-semibold text-lg">Analytics</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            View store performance & insights.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
          <h2 className="font-semibold text-lg">Products</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage your product inventory.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
          <h2 className="font-semibold text-lg">AI Assistants</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Customer support, policies & visual search AI tools.
          </p>
        </div>
      </div>
    </div>
  );
}