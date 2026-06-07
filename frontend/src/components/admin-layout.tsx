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
  SidebarTrigger,
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
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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

function AdminTopBar() {
  const [location] = useLocation();
  const current = navItems.find((item) => location.startsWith(item.href));
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b bg-background/95 backdrop-blur px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm font-medium text-foreground">
        {current?.label ?? "Admin"}
      </span>
    </header>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data, isLoading } = useGetCurrentUser();
  const currentUser = data?.user ?? null;

  const isLoginPage = location === "/admin/login";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!isLoading && !currentUser && !isLoginPage) {
      setLocation("/admin/login");
    }
  }, [currentUser, isLoading, isLoginPage, setLocation]);

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

  if (!currentUser && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="min-w-0">
              <h2 className="text-sm font-bold leading-none truncate group-data-[collapsible=icon]:hidden">
                Admin Panel
              </h2>
              {currentUser && (
                <p className="text-xs text-muted-foreground truncate mt-0.5 group-data-[collapsible=icon]:hidden">
                  {currentUser.firstName
                    ? `${currentUser.firstName} ${currentUser.lastName ?? ""}`.trim()
                    : currentUser.email ?? ""}
                </p>
              )}
            </div>
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
          <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0" asChild>
            <Link href="/">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="ml-2 group-data-[collapsible=icon]:hidden">View Portfolio</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive/90 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Log out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <main className="flex flex-col flex-1 min-w-0 overflow-hidden bg-background">
        <AdminTopBar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
