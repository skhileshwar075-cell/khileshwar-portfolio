import { useListExperience, useListEducation } from "@workspace/api-client-react";
import { Briefcase, GraduationCap, Calendar, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month ?? "1") - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function RevealItem({
  children,
  delayIndex,
}: {
  children: React.ReactNode;
  delayIndex: number;
}) {
  const delays = ["delay-100", "delay-200", "delay-300", "delay-400", "delay-500"] as const;
  const delay = delays[Math.min(delayIndex, delays.length - 1)];
  const ref = useScrollReveal<HTMLDivElement>(delay);
  return <div ref={ref}>{children}</div>;
}

export default function ExperiencePage() {
  const { data: experience = [], isLoading: expLoading } = useListExperience();
  const { data: education = [], isLoading: eduLoading } = useListEducation();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            <span className="text-primary">{"<"}</span>Experience
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in">
            My professional journey and academic background.
          </p>
        </div>

        {/* ── Work Experience ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Work Experience</h2>
          </div>

          {expLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-card animate-pulse rounded-xl border border-border"
                />
              ))}
            </div>
          ) : experience.length === 0 ? (
            <p className="text-muted-foreground">No experience listed yet.</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <RevealItem key={exp.id} delayIndex={idx}>
                    <div className="relative pl-16">
                      {/* Timeline dot */}
                      <div className="absolute left-3.5 top-6 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md shadow-primary/25 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>

                      <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold leading-tight">{exp.position}</h3>
                            <div className="flex items-center gap-1.5 text-primary font-medium mt-0.5">
                              <Building2 className="h-3.5 w-3.5" />
                              {exp.organization}
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-mono">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                            </div>
                            {exp.current && (
                              <Badge variant="default" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">
                                Current
                              </Badge>
                            )}
                          </div>
                        </div>

                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </div>
                        )}

                        {exp.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Education ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Education</h2>
          </div>

          {eduLoading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-card animate-pulse rounded-xl border border-border"
                />
              ))}
            </div>
          ) : education.length === 0 ? (
            <p className="text-muted-foreground">No education listed yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <RevealItem key={edu.id} delayIndex={idx}>
                    <div className="relative pl-16">
                      <div className="absolute left-3.5 top-6 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md shadow-primary/25 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>

                      <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold leading-tight">{edu.degree}</h3>
                            <p className="text-primary font-medium mt-0.5">{edu.institution}</p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-mono">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                            </div>
                            {edu.grade && (
                              <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                GPA: {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
