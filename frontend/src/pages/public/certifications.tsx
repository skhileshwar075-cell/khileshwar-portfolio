import { useListCertificates } from "@workspace/api-client-react";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month ?? "1") - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Certifications() {
  const { data: certs = [], isLoading } = useListCertificates();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Certifications
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Professional certifications and credentials that validate my skills across
            cloud computing, web development, and AI.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <p className="text-muted-foreground">No certifications listed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">{cert.issuer}</p>

                    <div className="flex items-center gap-3">
                      {cert.issueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(cert.issueDate)}
                        </div>
                      )}
                      {cert.expirationDate && (
                        <div className="text-xs text-muted-foreground">
                          Expires: {formatDate(cert.expirationDate)}
                        </div>
                      )}
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Credential
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
