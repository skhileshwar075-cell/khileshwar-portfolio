import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { PublicLayout } from "@/components/public-layout";
import { AdminLayout } from "@/components/admin-layout";
import { ThemeProvider } from "@/components/theme-provider";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminSkills from "@/pages/admin/skills";
import AdminExperience from "@/pages/admin/experience";
import AdminEducation from "@/pages/admin/education";
import AdminCertificates from "@/pages/admin/certificates";
import AdminBlog from "@/pages/admin/blog";
import AdminContacts from "@/pages/admin/contacts";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSettings from "@/pages/admin/settings";

import Home from "@/pages/public/home";
import About from "@/pages/public/about";
import Projects from "@/pages/public/projects";
import ProjectDetail from "@/pages/public/project-detail";
import Skills from "@/pages/public/skills";
import ExperiencePage from "@/pages/public/experience";
import Certifications from "@/pages/public/certifications";
import Blog from "@/pages/public/blog";
import BlogPost from "@/pages/public/blog-post";
import Education from "@/pages/public/education";
import Contact from "@/pages/public/contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <AdminGuard>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin">
            <Redirect to="/admin/dashboard" />
          </Route>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/skills" component={AdminSkills} />
          <Route path="/admin/experience" component={AdminExperience} />
          <Route path="/admin/education" component={AdminEducation} />
          <Route path="/admin/certificates" component={AdminCertificates} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/contacts" component={AdminContacts} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route component={NotFound} />
        </Switch>
      </AdminGuard>
    );
  }

  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/skills" component={Skills} />
        <Route path="/experience" component={ExperiencePage} />
        <Route path="/education" component={Education} />
        <Route path="/certifications" component={Certifications} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
