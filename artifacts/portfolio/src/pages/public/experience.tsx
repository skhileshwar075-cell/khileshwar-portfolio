import { useListExperience, useListEducation } from "@workspace/api-client-react";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month ?? "1") - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperiencePage() {
  const { data: experience = [], isLoading: expLoading } = useListExperience();
  const { data: education = [], isLoading: eduLoading } = useListEducation();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Experience
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            My professional journey and academic background.
          </p>
        </div>

        {/* Work Experience */}
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
                <div key={i} className="h-36 bg-card animate-pulse rounded-xl border border-border" />
              ))}
            </div>
          ) : experience.length === 0 ? (
            <p className="text-muted-foreground">No experience listed yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={exp.id} className="relative pl-16">
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-primary border-2 border-background shadow" />
                    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className="text-primary font-medium">{exp.organization}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                          </div>
                          {exp.current && (
                            <Badge variant="default" className="text-xs">Current</Badge>
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
                        <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Education */}
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
                <div key={i} className="h-32 bg-card animate-pulse rounded-xl border border-border" />
              ))}
            </div>
          ) : education.length === 0 ? (
            <p className="text-muted-foreground">No education listed yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-16">
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-primary border-2 border-background shadow" />
                    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-primary font-medium">{edu.institution}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                          </div>
                          {edu.grade && (
                            <span className="text-sm text-muted-foreground">GPA: {edu.grade}</span>
                          )}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
