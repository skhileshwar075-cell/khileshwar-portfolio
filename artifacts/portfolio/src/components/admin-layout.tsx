import { useLocation, Link } from "wouter";
import { useGetCurrentUser } from "@workspace/api-client-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  // useGetCurrentUser returns { user: {...} | null } — unwrap .user
  const { data, isLoading } = useGetCurrentUser();
  const currentUser = data?.user ?? null;

  const isLoginPage = location === "/admin/login";

  useEffect(() => {
    if (!isLoading && !currentUser && !isLoginPage) {
      setLocation("/admin/login");
    }
  }, [currentUser, isLoading, isLoginPage, setLocation]);

  // Show full-screen loader while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated and not on login — redirect handled by useEffect, show nothing
  if (!currentUser && !isLoginPage) {
    return null;
  }

  // On the login page — render it fullscreen (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-3">
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              {currentUser && (
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.firstName
                    ? `${currentUser.firstName} ${currentUser.lastName ?? ""}`.trim()
                    : currentUser.email ?? ""}
                </p>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.startsWith(item.href)}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/">
                <Globe className="mr-2 h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive/90"
              asChild
            >
              <a href="/api/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </a>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
