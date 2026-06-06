import { Link, useLocation } from "wouter";
import { useTheme } from "./theme-provider";
import { useGetCurrentUser, useGetSettings } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { Moon, Sun, Menu, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { data: user } = useGetCurrentUser();
  const { data: settings } = useGetSettings();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/experience", label: "Experience" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const moreLinks = [
    { href: "/education", label: "Education" },
    { href: "/certifications", label: "Certifications" },
  ];

  const allLinks = [...links, ...moreLinks];

  const ownerName = settings?.ownerName ?? "Portfolio";

  return (
    <div className="min-h-[100dvh] flex flex-col w-full">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center mx-auto px-4 md:px-6">
          <Link href="/" className="mr-8 flex items-center space-x-2 shrink-0">
            <span className="font-bold text-lg tracking-tight">
              {ownerName.split(" ")[0]}
              <span className="text-primary">.dev</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  location === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/education"
              className={`transition-colors hover:text-foreground ${
                location === "/education" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Education
            </Link>
            <Link
              href="/certifications"
              className={`transition-colors hover:text-foreground ${
                location === "/certifications" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Certs
            </Link>
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  Admin
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation links</SheetDescription>
                <div className="flex flex-col space-y-1 mt-8">
                  {allLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                        location === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="mt-4"
                    >
                      <Button variant="outline" className="w-full">
                        Go to Admin
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-3 max-w-xs">
              <div>
                <p className="font-bold text-lg">
                  {ownerName.split(" ")[0]}
                  <span className="text-primary">.dev</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {settings?.ownerTitle ?? "Software Engineer"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {settings?.githubUrl && (
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {settings?.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {settings?.twitterUrl && (
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Portfolio</p>
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/projects", label: "Projects" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Background</p>
                {[
                  { href: "/skills", label: "Skills" },
                  { href: "/experience", label: "Experience" },
                  { href: "/education", label: "Education" },
                  { href: "/certifications", label: "Certifications" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">More</p>
                {[
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {ownerName}. All rights reserved.
            </p>
            <p>Built with React, TypeScript &amp; Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
