import { useMemo, useState } from "react";
import { useListCertificates } from "@workspace/api-client-react";
import { Award, ExternalLink, Calendar, Search, Eye, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PdfPreview } from "@/components/pdf-preview";

const FILTERS = [
  "All",
  "Web Development",
  "Cloud",
  "AI",
  "Programming",
  "Database",
  "Cyber Security",
  "Other",
] as const;

type FilterCategory = (typeof FILTERS)[number];

type SortOption = "newest" | "oldest" | "issuer" | "title";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month ?? "1") - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function classifyCertificate(cert: any): FilterCategory {
  const text = [cert.title, cert.issuer, cert.description, ...(cert.skills ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(cloud|aws|gcp|azure|serverless|lambda|kubernetes)/.test(text)) return "Cloud";
  if (/(full[\s-]*stack|react|vue|angular|frontend|backend|javascript|typescript|node|tailwind|css|html|ui|ux)/.test(text)) return "Web Development";
  if (/\b(ai|machine learning|ml|llm|artificial intelligence|deep learning|nlp)\b/.test(text)) return "AI";
  if (/(database|postgresql|mongodb|mysql|sql|nosql|redis)/.test(text)) return "Database";
  if (/(cybersecurity|security|penetration|ethical hacking|network security|vulnerability)/.test(text)) return "Cyber Security";
  if (/(programming|coding|python|java|c#|go|ruby|rust)/.test(text)) return "Programming";
  return "Other";
}

function isPdfUrl(url: string | null | undefined) {
  return !!url && (url.startsWith("data:application/pdf") || /\.pdf($|[?#])/i.test(url));
}

export default function Certifications() {
  const { data: certs = [], isLoading } = useListCertificates();
  const [category, setCategory] = useState<FilterCategory>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return certs
      .filter((cert) => {
        const matchesCategory =
          category === "All" || classifyCertificate(cert) === category;

        if (!matchesCategory) {
          return false;
        }

        if (!query) return true;

        const haystack = [
          cert.title,
          cert.issuer,
          cert.description,
          cert.credentialId,
          ...((cert.skills ?? []) as string[]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sort === "issuer") return a.issuer.localeCompare(b.issuer);
        return a.title.localeCompare(b.title);
      });
  }, [certs, category, search, sort]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-primary">{"<"}</span> Certifications <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground text-base sm:text-lg">
            Professional certifications with rich metadata, skills chips, search, filters, and recruiter-ready action buttons.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search by title, issuer, skills, or description"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="issuer">Issuer A-Z</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm transition ${category === filter ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`}
                  onClick={() => setCategory(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Showing</p>
            <p className="mt-2 text-3xl font-bold">{filteredCertificates.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Certificates match your current search, filters, and sort order.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-72 rounded-3xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">No certificates added yet.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create certificates in the admin panel to showcase them here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCertificates.map((cert) => (
              <div key={cert.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative overflow-hidden bg-muted">
                  {cert.imageUrl ? (
                    isPdfUrl(cert.imageUrl) ? (
                      <div className="flex h-56 items-center justify-center bg-muted text-sm text-muted-foreground">
                        <div className="text-center">
                          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold">
                            <Download className="h-4 w-4" /> PDF Certificate
                          </div>
                          <p>Uploaded certificate is a PDF. Preview is available on the detail view.</p>
                        </div>
                      </div>
                    ) : (
                      <img src={cert.imageUrl} alt={cert.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                    )
                  ) : (
                    <div className="flex h-56 items-center justify-center text-muted-foreground">
                      <Award className="h-16 w-16" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
                  >
                    <Eye className="h-4 w-4" /> Preview
                  </button>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {cert.featured && <Badge className="bg-amber-100 text-amber-700">Featured</Badge>}
                    {cert.skills?.slice(0, 2).map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{cert.title}</h2>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(cert.issueDate)}</span>
                    </div>
                    {cert.expirationDate && (
                      <div>Expires {formatDate(cert.expirationDate)}</div>
                    )}
                    {cert.duration && <div>Duration: {cert.duration}</div>}
                    {cert.grade && <div>Grade: {cert.grade}</div>}
                  </div>

                  {cert.description && <p className="text-sm leading-6 text-foreground/90">{cert.description}</p>}

                  <div className="grid gap-2 sm:grid-cols-2">
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full">
                          <ExternalLink className="h-4 w-4" /> View Credential
                        </Button>
                      </a>
                    )}
                    {cert.credentialId && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          await navigator.clipboard.writeText(cert.credentialId);
                          toast.success("Credential ID copied");
                        }}
                      >
                        <Copy className="h-4 w-4" /> Copy ID
                      </Button>
                    )}
                    {cert.imageUrl && (
                      <a href={cert.imageUrl} download target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4" /> Download Certificate
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedCert} onOpenChange={(open) => { if (!open) setSelectedCert(null); }}>
        <DialogContent className="max-w-4xl">
          {selectedCert && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCert.title}</DialogTitle>
                <DialogDescription>{selectedCert.issuer}</DialogDescription>
              </DialogHeader>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl overflow-hidden bg-muted">
                  {selectedCert.imageUrl ? (
                    isPdfUrl(selectedCert.imageUrl) ? (
                      <PdfPreview src={selectedCert.imageUrl} className="min-h-[320px]" fallbackLabel="Open PDF in a new tab" />
                    ) : (
                      <img src={selectedCert.imageUrl} alt={selectedCert.title} className="h-full w-full object-contain" />
                    )
                  ) : (
                    <div className="flex h-80 items-center justify-center text-muted-foreground">
                      <Award className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.featured && <Badge className="bg-amber-100 text-amber-700">Featured</Badge>}
                    {selectedCert.skills?.map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{selectedCert.description}</p>
                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(selectedCert.issueDate)}</div>
                      {selectedCert.expirationDate && <div>Expires {formatDate(selectedCert.expirationDate)}</div>}
                      {selectedCert.duration && <div>Duration: {selectedCert.duration}</div>}
                      {selectedCert.grade && <div>Grade: {selectedCert.grade}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6 gap-2">
                {selectedCert.credentialUrl && (
                  <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                      <ExternalLink className="h-4 w-4" /> Verify Credential
                    </Button>
                  </a>
                )}
                <Button type="button" variant="outline" onClick={() => setSelectedCert(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
