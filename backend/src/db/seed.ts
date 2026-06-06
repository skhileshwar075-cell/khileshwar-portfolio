import { db } from "./index.js";
import {
  settingsTable,
  projectsTable,
  skillsTable,
  experienceTable,
  educationTable,
  certificatesTable,
  blogPostsTable,
} from "./schema/index.js";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.delete(blogPostsTable);
  await db.delete(certificatesTable);
  await db.delete(educationTable);
  await db.delete(experienceTable);
  await db.delete(skillsTable);
  await db.delete(projectsTable);
  await db.delete(settingsTable);

  // Settings
  await db.insert(settingsTable).values({
    siteTitle: "Alex Carter — Portfolio",
    siteDescription: "Full-stack engineer specializing in modern web apps, AI integrations, and cloud-native systems.",
    metaKeywords: "full-stack, react, typescript, node, AI, cloud",
    heroText: "Building with intelligence.",
    heroSubtext: "Computer Science graduate & software engineer shipping thoughtful, performant applications.",
    ownerName: "Alex Carter",
    ownerTitle: "Full-Stack Software Engineer",
    ownerBio: "I'm a full-stack engineer with 4+ years of experience building web applications at scale. I care deeply about developer experience, clean architecture, and products that actually solve problems.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
    resumeUrl: "#",
    primaryColor: "#6366f1",
  });
  console.log("✓ Settings");

  // Projects
  await db.insert(projectsTable).values([
    {
      title: "AI Writing Assistant",
      slug: "ai-writing-assistant",
      shortDescription: "An LLM-powered writing tool that helps users draft, refine, and iterate on long-form content with real-time suggestions.",
      description: "A full-stack web application that integrates OpenAI's GPT-4 to provide contextual writing assistance. Users can create documents, highlight text for targeted rewrites, switch tones, and export polished drafts.",
      problemStatement: "Writers often struggle with blank-page syndrome and inconsistent tone across long documents.",
      solution: "Integrated GPT-4 with a document editor to provide inline suggestions, tone adjustments, and paragraph rewrites on demand.",
      features: "Real-time suggestions, tone control, document history, export to PDF/Markdown, team collaboration",
      techStack: ["React", "TypeScript", "Node.js", "OpenAI API", "PostgreSQL", "TailwindCSS"],
      githubUrl: "https://github.com",
      liveDemoUrl: "#",
      featured: true,
      category: "ai",
      status: "completed",
    },
    {
      title: "DevMetrics Dashboard",
      slug: "devmetrics-dashboard",
      shortDescription: "A real-time engineering analytics dashboard that aggregates GitHub, Jira, and CI/CD data into actionable team insights.",
      description: "Engineering teams lack a single view of their delivery health. DevMetrics pulls from GitHub (PRs, commits), Jira (tickets, sprints), and GitHub Actions (build times, failure rates) into a unified dashboard.",
      problemStatement: "Engineering managers waste hours aggregating data across tools to understand team performance.",
      solution: "Built a polling + webhook pipeline that normalises data from multiple APIs, stores snapshots in Postgres, and visualises trends over configurable time windows.",
      features: "Multi-team support, DORA metrics, PR cycle time, build stability charts, Slack alerts",
      techStack: ["Next.js", "TypeScript", "Recharts", "Drizzle ORM", "PostgreSQL", "GitHub API", "Jira API"],
      githubUrl: "https://github.com",
      featured: true,
      category: "web",
      status: "completed",
    },
    {
      title: "Pocket Budget",
      slug: "pocket-budget",
      shortDescription: "A mobile-first personal finance app with automated transaction categorisation and monthly spending insights.",
      description: "Pocket Budget connects to bank feeds via Plaid, automatically categorises transactions with an ML model, and surfaces spending patterns through visual summaries. Users set monthly budgets per category and get push alerts when nearing limits.",
      problemStatement: "Most budgeting apps require manual entry, leading users to abandon them within weeks.",
      solution: "Automated the entire ingestion and categorisation pipeline so the app is useful from day one without any manual effort.",
      features: "Bank sync via Plaid, ML categorisation, budget goals, monthly reports, dark mode",
      techStack: ["React Native", "Expo", "Plaid API", "FastAPI", "Python", "scikit-learn", "PostgreSQL"],
      githubUrl: "https://github.com",
      featured: true,
      category: "mobile",
      status: "completed",
    },
    {
      title: "OpenDeploy CLI",
      slug: "open-deploy-cli",
      shortDescription: "A Heroku-style deployment CLI for self-hosted servers — push your code, get a URL, done.",
      description: "OpenDeploy is an open-source CLI tool that lets developers deploy containerised apps to any VPS with a single command. It handles Docker builds, reverse proxy config, SSL via Let's Encrypt, and zero-downtime deploys.",
      problemStatement: "Self-hosting is cheaper than PaaS but requires DevOps knowledge most developers don't have.",
      solution: "Abstracted the entire deployment pipeline behind a simple CLI with sane defaults, making it approachable for solo developers.",
      features: "Docker-based deploys, automatic SSL, rollback support, environment variable management, deploy hooks",
      techStack: ["Go", "Docker", "Nginx", "Let's Encrypt", "SSH", "SQLite"],
      githubUrl: "https://github.com",
      featured: false,
      category: "devtools",
      status: "completed",
    },
    {
      title: "Event Hive",
      slug: "event-hive",
      shortDescription: "A community event platform with ticketing, RSVP management, and live check-in via QR codes.",
      description: "Event Hive lets organisers create events, sell or give away tickets, and manage attendee check-in through a companion mobile scanner app. Stripe handles payments; QR codes are generated server-side and verified in real time.",
      problemStatement: "Small community events are underserved by expensive ticketing platforms that take large cuts.",
      solution: "Built a lean, self-hostable ticketing platform with transparent 0% platform fees — organisers only pay Stripe's processing rate.",
      features: "Event creation, Stripe ticketing, QR check-in, attendee CSV export, embeddable ticket widget",
      techStack: ["React", "Express", "Stripe", "PostgreSQL", "QRCode.js", "Redis", "TailwindCSS"],
      githubUrl: "https://github.com",
      featured: false,
      category: "web",
      status: "in-progress",
    },
  ]);
  console.log("✓ Projects");

  // Skills
  await db.insert(skillsTable).values([
    { name: "TypeScript", category: "Languages", level: 92 },
    { name: "JavaScript", category: "Languages", level: 95 },
    { name: "Python", category: "Languages", level: 80 },
    { name: "Go", category: "Languages", level: 65 },
    { name: "SQL", category: "Languages", level: 85 },
    { name: "React", category: "Frontend", level: 93 },
    { name: "Next.js", category: "Frontend", level: 88 },
    { name: "TailwindCSS", category: "Frontend", level: 90 },
    { name: "React Native", category: "Frontend", level: 78 },
    { name: "Node.js", category: "Backend", level: 90 },
    { name: "Express", category: "Backend", level: 88 },
    { name: "FastAPI", category: "Backend", level: 75 },
    { name: "PostgreSQL", category: "Database", level: 85 },
    { name: "Redis", category: "Database", level: 72 },
    { name: "Drizzle ORM", category: "Database", level: 80 },
    { name: "Docker", category: "DevOps", level: 82 },
    { name: "GitHub Actions", category: "DevOps", level: 80 },
    { name: "AWS", category: "DevOps", level: 70 },
    { name: "OpenAI API", category: "AI/ML", level: 85 },
    { name: "scikit-learn", category: "AI/ML", level: 68 },
  ]);
  console.log("✓ Skills");

  // Experience
  await db.insert(experienceTable).values([
    {
      organization: "Veritas Systems",
      position: "Senior Software Engineer",
      startDate: "2023-01",
      endDate: null,
      current: true,
      description: "Lead engineer on the platform team, responsible for the core API and frontend infrastructure serving 50k+ monthly active users. Reduced P95 API latency by 40% through query optimisation and caching strategies. Mentoring two junior engineers.",
    },
    {
      organization: "Codewave Agency",
      position: "Full-Stack Engineer",
      startDate: "2021-06",
      endDate: "2022-12",
      current: false,
      description: "Delivered 12+ client projects across e-commerce, SaaS, and media. Introduced TypeScript and automated testing practices that reduced post-launch bug rate by 60%. Sole engineer on three greenfield projects.",
    },
    {
      organization: "Stackly (YC S21)",
      position: "Software Engineer Intern",
      startDate: "2021-01",
      endDate: "2021-05",
      current: false,
      description: "Built the onboarding flow and analytics pipeline as part of a 6-person engineering team. Shipped a real-time notifications system used by 8,000 users within the first week of launch.",
    },
  ]);
  console.log("✓ Experience");

  // Education
  await db.insert(educationTable).values([
    {
      degree: "B.Sc. Computer Science",
      institution: "University of Manchester",
      startDate: "2018-09",
      endDate: "2021-06",
      grade: "First Class Honours",
      description: "Specialised in distributed systems and machine learning. Final year project: a federated learning framework for privacy-preserving model training across edge devices.",
      current: false,
    },
    {
      degree: "A Levels — Maths, Computer Science, Physics",
      institution: "Northgate Sixth Form College",
      startDate: "2016-09",
      endDate: "2018-06",
      grade: "A* A A",
      description: "Represented the college at the British Informatics Olympiad regional heats.",
      current: false,
    },
  ]);
  console.log("✓ Education");

  // Certificates
  await db.insert(certificatesTable).values([
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-08",
      credentialUrl: "https://aws.amazon.com/certification/",
    },
    {
      title: "Professional Scrum Master I (PSM I)",
      issuer: "Scrum.org",
      issueDate: "2022-11",
      credentialUrl: "https://www.scrum.org/certificates",
    },
    {
      title: "Google Cloud Associate Cloud Engineer",
      issuer: "Google Cloud",
      issueDate: "2023-03",
      credentialUrl: "https://cloud.google.com/certification",
    },
    {
      title: "Meta Front-End Developer Certificate",
      issuer: "Coursera / Meta",
      issueDate: "2022-04",
      credentialUrl: "https://coursera.org",
    },
  ]);
  console.log("✓ Certificates");

  // Blog posts
  const now = new Date();
  await db.insert(blogPostsTable).values([
    {
      title: "Why I Switched From REST to tRPC (And Then Back Again)",
      slug: "rest-vs-trpc-lessons-learned",
      excerpt: "After 18 months of using tRPC across several projects, I've found situations where it shines — and a few where it quietly gets in the way. Here's what I learned.",
      content: `After 18 months of using tRPC across several projects, I've found situations where it shines — and a few where it quietly gets in the way.

## The Honeymoon Phase

The first time I used tRPC on a greenfield Next.js project, the experience felt genuinely magical. End-to-end type safety without code generation, instant feedback in the editor when a backend type changed — it checked every box.

## Where tRPC Shines

For monorepos where the client and server are developed together, tRPC is hard to beat. The feedback loop is tight, and you spend almost no time worrying about contract drift.

## Where It Gets Complicated

The cracks appeared when I needed to expose the same API to a mobile client and a third-party integration. tRPC's transport layer is opaque, making it awkward to consume from outside the JavaScript ecosystem.

## What I Do Now

I default to OpenAPI for anything that might be consumed by more than one client, and I reach for tRPC when I'm building a tightly-coupled Next.js app with no plans for external consumers. Both tools are excellent — the key is matching them to the context.`,
      category: "Engineering",
      tags: ["typescript", "api-design", "trpc", "rest", "backend"],
      published: true,
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Practical RAG: Building a Document Q&A System That Actually Works",
      slug: "practical-rag-document-qa",
      excerpt: "Retrieval-Augmented Generation sounds straightforward until you try to build it. Here's the architecture I landed on after three iterations.",
      content: `Retrieval-Augmented Generation sounds straightforward until you try to build it in production.

## What Everyone Gets Wrong First

The naive approach — chunk documents, embed them, stuff the top-K results into the prompt — works well enough in demos. It falls apart when documents have complex structure, when the answer spans multiple chunks, or when the retrieval step surfaces irrelevant context.

## The Architecture I Landed On

After three iterations I settled on a hybrid retrieval approach: dense vector search for semantic similarity, combined with BM25 keyword search, with a re-ranking step using a cross-encoder. The extra latency (roughly 200ms) is worth it for significantly better recall.

## Chunking Strategy Matters

Overlapping chunks with a 20% overlap window dramatically reduced the "answer cut in half" problem. For structured documents like contracts or reports, parsing the document into logical sections first, then chunking within sections, outperforms fixed-size chunking.

## Lessons Learned

Evaluate early and often. I built a small golden dataset of 50 question-answer pairs in week one and ran every architecture change against it. Without that, I would have shipped a worse system and not known it.`,
      category: "AI",
      tags: ["ai", "rag", "llm", "vector-search", "python"],
      published: true,
      publishedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      title: "The 5 Database Migrations That Taught Me to Always Have a Rollback Plan",
      slug: "database-migrations-rollback-lessons",
      excerpt: "A tour through five real migration incidents, what went wrong, and the practices I now follow religiously before touching a production schema.",
      content: `Schema migrations are one of the highest-risk operations in web engineering. Here are five incidents that shaped how I approach them today.

## Incident 1 — The Rename That Wasn't Atomic

Renaming a column in Postgres is fast, but if your application code doesn't deploy atomically with the migration, you have a window where either the old or new name is expected. I now always use a three-phase approach: add new column, dual-write, remove old column.

## Incident 2 — The Index That Locked the Table

Adding an index without CONCURRENTLY on a table with 50M rows locked it for 90 seconds at peak traffic. Use CREATE INDEX CONCURRENTLY. Always.

## The Checklist I Use Now

1. Write the rollback migration before the forward migration.
2. Test both on a production-sized dataset.
3. Deploy in off-peak hours with a monitoring dashboard open.
4. Never bundle a migration with a large feature deploy.`,
      category: "Engineering",
      tags: ["postgresql", "migrations", "database", "backend", "devops"],
      published: true,
      publishedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: "What Six Months of Pair Programming Taught Me About Code Reviews",
      slug: "pair-programming-code-reviews",
      excerpt: "I spent six months pairing on almost every feature. Here's how it changed my perspective on asynchronous code review culture.",
      content: `For six months at my last role, nearly every feature was built with a pair. It permanently changed how I think about code review.

## The Async Review Problem

Most code review happens asynchronously, long after the key design decisions have been made. By the time a reviewer sees the code, the author is psychologically invested in the approach. Feedback that challenges the architecture lands poorly, gets minimised, and the codebase accumulates small amounts of debt with every merge.

## What Pairing Does Differently

Design discussions happen at the whiteboard, not in PR comments. When two people write the code together, there's no ownership defensiveness — you both made the decisions.

## Finding a Middle Ground

Pure pairing doesn't scale to every team or every task. What I now advocate for: pair on architecture spikes and complex features, use async review for straightforward changes, and spend the time saved on better post-merge retrospectives.`,
      category: "Process",
      tags: ["engineering-culture", "pair-programming", "code-review", "team"],
      published: true,
      publishedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log("✓ Blog posts");

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
