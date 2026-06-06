import { useGetAnalyticsSummary, useGetProjectViews } from "@workspace/api-client-react";
import { Users, Eye, Download, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string; }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const { data: summary, isLoading: summaryLoading } = useGetAnalyticsSummary();
  const { data: projectViews = [], isLoading: pvLoading } = useGetProjectViews();

  const maxViews = Math.max(...projectViews.map((p) => p.views), 1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Portfolio performance overview</p>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-card animate-pulse rounded-xl border border-border" />)}
        </div>
      ) : summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Visitors" value={summary.totalVisitors} icon={Users} color="bg-blue-500/10 text-blue-500" />
            <StatCard label="Today" value={summary.todayVisitors} icon={TrendingUp} color="bg-green-500/10 text-green-500" />
            <StatCard label="This Week" value={summary.weeklyVisitors} icon={Eye} color="bg-purple-500/10 text-purple-500" />
            <StatCard label="This Month" value={summary.monthlyVisitors} icon={BarChart3} color="bg-orange-500/10 text-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Resume Downloads" value={summary.resumeDownloads} icon={Download} color="bg-pink-500/10 text-pink-500" />
            <StatCard label="Contact Submissions" value={summary.contactSubmissions} icon={MessageSquare} color="bg-yellow-500/10 text-yellow-500" />
          </div>
        </>
      )}

      {/* Project Views */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Project Views</h2>
        {pvLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}</div>
        ) : projectViews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No project view data yet.</p>
        ) : (
          <div className="space-y-4">
            {projectViews.map((p) => (
              <div key={p.projectId}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium truncate max-w-xs">{p.projectTitle}</span>
                  <span className="text-muted-foreground shrink-0 ml-2">{p.views} views</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(p.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
