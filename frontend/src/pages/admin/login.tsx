import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const handleLogin = () => {
    window.location.href = `/api/login?returnTo=${encodeURIComponent(window.location.origin + "/admin/dashboard")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription>
            Access the portfolio management system.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4 pb-8">
          <Button onClick={handleLogin} size="lg" className="w-full">
            <LogIn className="mr-2 h-5 w-5" />
            Log in with your account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
