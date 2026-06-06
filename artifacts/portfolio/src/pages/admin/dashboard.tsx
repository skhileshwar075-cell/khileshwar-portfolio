import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Code2, FileText, Mail, BarChart3, Award } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!summary) return null;

  const stats = [
    { label: "Total Projects", value: summary.totalProjects, icon: FolderKanban, link: "/admin/projects" },
    { label: "Total Skills", value: summary.totalSkills, icon: Code2, link: "/admin/skills" },
    { label: "Blog Posts", value: summary.totalBlogPosts, icon: FileText, link: "/admin/blog" },
    { label: "Certificates", value: summary.totalCertificates, icon: Award, link: "/admin/certificates" },
    { label: "Unread Contacts", value: summary.unreadContacts, icon: Mail, link: "/admin/contacts" },
    { label: "Total Visitors", value: summary.totalVisitors, icon: BarChart3, link: "/admin/analytics" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your portfolio metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link}>
            <Card className="hover-elevate transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured Projects</span>
                <span className="font-bold">{summary.featuredProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Published Posts</span>
                <span className="font-bold">{summary.publishedPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Draft Posts</span>
                <span className="font-bold">{summary.draftPosts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
