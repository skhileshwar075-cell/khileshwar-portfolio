import { useListEducation } from "@workspace/api-client-react";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function Education() {
  const { data: education = [], isLoading } = useListEducation();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Education
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            My academic background and the institutions that shaped my thinking.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : education.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No education entries yet.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="relative md:pl-20">
                  <div className="hidden md:flex absolute left-0 top-6 w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-primary font-medium mt-0.5">{edu.institution}</p>
                      </div>
                      {edu.grade && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {edu.grade}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(edu.startDate)} — {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                      {edu.current && (
                        <Badge variant="outline" className="ml-2 text-xs">Enrolled</Badge>
                      )}
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
      </div>
    </div>
  );
}
