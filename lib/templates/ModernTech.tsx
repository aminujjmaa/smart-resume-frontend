import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

type TextStyleProp = Style | Style[];
type ViewStyleProp = Style | Style[];

type ResumeLine = {
  kind: "text" | "heading" | "bullet";
  text: string;
};

type ResumeSection = {
  title: string;
  lines: ResumeLine[];
};

type ParsedResume = {
  name: string;
  contact: string;
  sections: ResumeSection[];
};

type LineStyles = {
  role: TextStyleProp;
  paragraph: TextStyleProp;
  bulletRow: ViewStyleProp;
  bulletIcon: TextStyleProp;
  bulletText: TextStyleProp;
};

const SKILL_TERMS = ["skills", "competencies", "expertise", "stack"];
const EDUCATION_TERMS = ["education", "certification", "publication"];
const SUPPORTING_TERMS = ["projects", "architecture", "open source", "metrics", "reliability"];

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parseContent(content: string): ParsedResume {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const name = cleanText(lines[0] || "Your Name");
  const contact = cleanText(lines[1] || "email@example.com | 123-456-7890 | linkedin.com/in/you");
  const sections: ResumeSection[] = [];
  let current: ResumeSection | null = null;

  const ensureSection = () => {
    if (!current) {
      current = { title: "Profile", lines: [] };
      sections.push(current);
    }
    return current;
  };

  lines.slice(2).forEach((line) => {
    if (line.startsWith("# ")) {
      current = { title: cleanText(line.replace(/^#\s+/, "")), lines: [] };
      sections.push(current);
      return;
    }

    if (line.startsWith("## ")) {
      ensureSection().lines.push({ kind: "heading", text: cleanText(line.replace(/^##\s+/, "")) });
      return;
    }

    if (line.startsWith("- ")) {
      ensureSection().lines.push({ kind: "bullet", text: cleanText(line.replace(/^-\s+/, "")) });
      return;
    }

    ensureSection().lines.push({ kind: "text", text: cleanText(line) });
  });

  return {
    name,
    contact,
    sections: sections.length ? sections : [{ title: "Summary", lines: [{ kind: "text", text: "Add your resume summary here." }] }],
  };
}

function titleMatches(section: ResumeSection, terms: string[]) {
  const title = section.title.toLowerCase();
  return terms.some((term) => title.includes(term));
}

function pickSections(sections: ResumeSection[], terms: string[]) {
  return sections.filter((section) => titleMatches(section, terms));
}

function omitSections(sections: ResumeSection[], terms: string[]) {
  return sections.filter((section) => !titleMatches(section, terms));
}

function collectBullets(sections: ResumeSection[], limit: number) {
  return sections
    .flatMap((section) => section.lines.filter((line) => line.kind === "bullet").map((line) => line.text))
    .slice(0, limit);
}

function renderLines(lines: ResumeLine[], lineStyles: LineStyles, bullet = "-") {
  return lines.map((line, index) => {
    if (line.kind === "heading") {
      return <Text key={`${line.text}-${index}`} style={lineStyles.role}>{line.text}</Text>;
    }

    if (line.kind === "bullet") {
      return (
        <View key={`${line.text}-${index}`} style={lineStyles.bulletRow}>
          <Text style={lineStyles.bulletIcon}>{bullet}</Text>
          <Text style={lineStyles.bulletText}>{line.text}</Text>
        </View>
      );
    }

    return <Text key={`${line.text}-${index}`} style={lineStyles.paragraph}>{line.text}</Text>;
  });
}

function renderSection(
  section: ResumeSection,
  index: number,
  titleStyle: TextStyleProp,
  lineStyles: LineStyles,
  sectionStyle: ViewStyleProp = styles.section,
  bullet = "-"
) {
  return (
    <View key={`${section.title}-${index}`} style={sectionStyle}>
      <Text style={titleStyle}>{section.title}</Text>
      {renderLines(section.lines, lineStyles, bullet)}
    </View>
  );
}

function renderSidebarSections(sections: ResumeSection[], titleStyle: TextStyleProp, lineStyles: LineStyles) {
  return sections.map((section, index) => renderSection(section, index, titleStyle, lineStyles, styles.sidebarSection));
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingRight: 38,
    paddingBottom: 34,
    paddingLeft: 38,
    fontFamily: "Helvetica",
    fontSize: 9.6,
    lineHeight: 1.34,
    color: "#243042",
    backgroundColor: "#ffffff",
  },
  edgePage: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  header: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d7dee8",
  },
  name: {
    fontSize: 23,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  contact: {
    fontSize: 8.6,
    color: "#64748b",
  },
  contactRight: {
    width: 190,
    textAlign: "right",
    fontSize: 8.5,
    color: "#64748b",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10.8,
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  role: {
    fontSize: 10.2,
    fontWeight: 700,
    color: "#172033",
    marginBottom: 3,
    marginTop: 2,
  },
  paragraph: {
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2.6,
  },
  bulletIcon: {
    width: 10,
    color: "#2563eb",
    fontWeight: 700,
  },
  bulletText: {
    flex: 1,
  },

  classicPage: {
    paddingTop: 38,
    paddingRight: 44,
    paddingBottom: 38,
    paddingLeft: 44,
    fontFamily: "Times-Roman",
    fontSize: 10.2,
    lineHeight: 1.3,
    color: "#1f2933",
  },
  classicHeader: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  classicName: {
    fontFamily: "Times-Bold",
    fontSize: 25,
    color: "#111827",
    marginBottom: 4,
  },
  classicContact: {
    fontSize: 8.8,
    color: "#4b5563",
    textAlign: "center",
  },
  classicTitle: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: "#111827",
    marginBottom: 4,
    borderBottomWidth: 0.6,
    borderBottomColor: "#9ca3af",
    paddingBottom: 2,
    textTransform: "uppercase",
  },
  classicRole: {
    fontFamily: "Times-Bold",
    fontSize: 10.7,
    color: "#111827",
    marginBottom: 3,
    marginTop: 2,
  },
  classicBulletIcon: {
    width: 10,
    color: "#111827",
  },

  twoColumn: {
    flexDirection: "row",
    minHeight: "100%",
  },
  sidebar: {
    width: 158,
    paddingTop: 34,
    paddingRight: 18,
    paddingBottom: 34,
    paddingLeft: 18,
    backgroundColor: "#0f766e",
    color: "#ffffff",
  },
  sidebarDark: {
    backgroundColor: "#172033",
  },
  sidebarAmber: {
    backgroundColor: "#92400e",
  },
  sidebarName: {
    fontSize: 19,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 7,
  },
  sidebarContact: {
    fontSize: 7.8,
    color: "#d7f7f2",
    marginBottom: 18,
  },
  sidebarSection: {
    marginBottom: 12,
  },
  sidebarTitle: {
    fontSize: 8.8,
    fontWeight: 700,
    color: "#ccfbf1",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  sidebarParagraph: {
    fontSize: 8.4,
    color: "#ecfeff",
    marginBottom: 3,
  },
  sidebarRole: {
    fontSize: 8.8,
    fontWeight: 700,
    color: "#ffffff",
    marginTop: 2,
    marginBottom: 2,
  },
  sidebarBulletIcon: {
    width: 8,
    color: "#a7f3d0",
  },
  sidebarBulletText: {
    flex: 1,
    fontSize: 8.2,
    color: "#ecfeff",
  },
  mainColumn: {
    flex: 1,
    paddingTop: 34,
    paddingRight: 34,
    paddingBottom: 34,
    paddingLeft: 28,
  },
  tealTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#0f766e",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  startupHeader: {
    marginBottom: 18,
  },
  startupName: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 5,
  },
  startupContact: {
    fontSize: 8.5,
    color: "#6b7280",
  },
  splitSection: {
    flexDirection: "row",
    marginBottom: 10,
  },
  splitTitle: {
    width: 92,
    fontSize: 8.8,
    fontWeight: 700,
    color: "#e11d48",
    textTransform: "uppercase",
    paddingTop: 1,
  },
  splitBody: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 14,
  },

  pivotBanner: {
    backgroundColor: "#fff7ed",
    borderLeftWidth: 4,
    borderLeftColor: "#f97316",
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 10,
    paddingLeft: 12,
    marginBottom: 15,
  },
  pivotName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#7c2d12",
    marginBottom: 3,
  },
  pivotContact: {
    fontSize: 8.5,
    color: "#9a3412",
  },
  pivotTitle: {
    fontSize: 10.4,
    fontWeight: 700,
    color: "#c2410c",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  seniorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderTopWidth: 3,
    borderTopColor: "#475569",
    paddingTop: 13,
    paddingRight: 14,
    paddingBottom: 13,
    paddingLeft: 14,
    marginBottom: 15,
  },
  seniorName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
  },
  seniorTitle: {
    fontSize: 10.3,
    fontWeight: 700,
    color: "#475569",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  seniorSide: {
    width: 150,
    paddingTop: 4,
    paddingLeft: 18,
  },
  seniorMain: {
    flex: 1,
    paddingRight: 18,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },

  productHeader: {
    backgroundColor: "#fff1f2",
    borderBottomWidth: 2,
    borderBottomColor: "#be123c",
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 12,
    paddingLeft: 14,
    marginBottom: 13,
  },
  productName: {
    fontSize: 23,
    fontWeight: 700,
    color: "#881337",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 10.4,
    fontWeight: 700,
    color: "#be123c",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  metricRow: {
    flexDirection: "row",
    marginBottom: 13,
  },
  metricBox: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#fecdd3",
    backgroundColor: "#fff7f8",
    paddingTop: 7,
    paddingRight: 8,
    paddingBottom: 7,
    paddingLeft: 8,
    marginRight: 6,
  },
  metricNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: "#be123c",
    marginBottom: 2,
  },
  metricText: {
    fontSize: 7.6,
    color: "#4b5563",
  },

  devopsPage: {
    fontFamily: "Courier",
    fontSize: 9.2,
    lineHeight: 1.32,
  },
  devopsHeader: {
    backgroundColor: "#0f172a",
    paddingTop: 17,
    paddingRight: 20,
    paddingBottom: 15,
    paddingLeft: 20,
    marginBottom: 14,
  },
  devopsName: {
    fontFamily: "Courier-Bold",
    fontSize: 21,
    color: "#67e8f9",
    marginBottom: 5,
  },
  devopsContact: {
    fontSize: 8.4,
    color: "#cbd5e1",
  },
  devopsTitle: {
    fontFamily: "Courier-Bold",
    fontSize: 10.2,
    color: "#0891b2",
    marginBottom: 5,
    textTransform: "uppercase",
  },
});

const standardLineStyles: LineStyles = {
  role: styles.role,
  paragraph: styles.paragraph,
  bulletRow: styles.bulletRow,
  bulletIcon: styles.bulletIcon,
  bulletText: styles.bulletText,
};

const classicLineStyles: LineStyles = {
  role: styles.classicRole,
  paragraph: styles.paragraph,
  bulletRow: styles.bulletRow,
  bulletIcon: styles.classicBulletIcon,
  bulletText: styles.bulletText,
};

const sidebarLineStyles: LineStyles = {
  role: styles.sidebarRole,
  paragraph: styles.sidebarParagraph,
  bulletRow: styles.bulletRow,
  bulletIcon: styles.sidebarBulletIcon,
  bulletText: styles.sidebarBulletText,
};

function ModernTech({ resume }: { resume: ParsedResume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name}</Text>
          <Text style={styles.contact}>{resume.contact}</Text>
        </View>
        {resume.sections.map((section, index) => renderSection(section, index, styles.sectionTitle, standardLineStyles))}
      </Page>
    </Document>
  );
}

function ExecutiveClassic({ resume }: { resume: ParsedResume }) {
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.classicPage]}>
        <View style={styles.classicHeader}>
          <Text style={styles.classicName}>{resume.name}</Text>
          <Text style={styles.classicContact}>{resume.contact}</Text>
        </View>
        {resume.sections.map((section, index) => renderSection(section, index, styles.classicTitle, classicLineStyles))}
      </Page>
    </Document>
  );
}

function DataSciencePro({ resume }: { resume: ParsedResume }) {
  const sidebarSections = pickSections(resume.sections, [...SKILL_TERMS, ...EDUCATION_TERMS]);
  const mainSections = omitSections(resume.sections, [...SKILL_TERMS, ...EDUCATION_TERMS]);

  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.edgePage]}>
        <View style={styles.twoColumn}>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarName}>{resume.name}</Text>
            <Text style={styles.sidebarContact}>{resume.contact}</Text>
            {renderSidebarSections(sidebarSections, styles.sidebarTitle, sidebarLineStyles)}
          </View>
          <View style={styles.mainColumn}>
            {mainSections.map((section, index) => renderSection(section, index, styles.tealTitle, standardLineStyles))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function StartupMinimal({ resume }: { resume: ParsedResume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.startupHeader}>
          <Text style={styles.startupName}>{resume.name}</Text>
          <Text style={styles.startupContact}>{resume.contact}</Text>
        </View>
        {resume.sections.map((section, index) => (
          <View key={`${section.title}-${index}`} style={styles.splitSection}>
            <Text style={styles.splitTitle}>{section.title}</Text>
            <View style={styles.splitBody}>{renderLines(section.lines, standardLineStyles)}</View>
          </View>
        ))}
      </Page>
    </Document>
  );
}

function CareerPivot({ resume }: { resume: ParsedResume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pivotBanner}>
          <Text style={styles.pivotName}>{resume.name}</Text>
          <Text style={styles.pivotContact}>{resume.contact}</Text>
        </View>
        {resume.sections.map((section, index) => renderSection(section, index, styles.pivotTitle, standardLineStyles))}
      </Page>
    </Document>
  );
}

function SeniorEngineer({ resume }: { resume: ParsedResume }) {
  const sideSections = pickSections(resume.sections, [...SKILL_TERMS, ...SUPPORTING_TERMS, ...EDUCATION_TERMS]);
  const mainSections = omitSections(resume.sections, [...SKILL_TERMS, ...SUPPORTING_TERMS, ...EDUCATION_TERMS]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.seniorHeader}>
          <Text style={styles.seniorName}>{resume.name}</Text>
          <Text style={styles.contactRight}>{resume.contact}</Text>
        </View>
        <View style={styles.twoColumn}>
          <View style={styles.seniorMain}>
            {mainSections.map((section, index) => renderSection(section, index, styles.seniorTitle, standardLineStyles))}
          </View>
          <View style={styles.seniorSide}>
            {renderSidebarSections(sideSections, styles.seniorTitle, standardLineStyles)}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function ProductLeader({ resume }: { resume: ParsedResume }) {
  const metrics = collectBullets(resume.sections, 3);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{resume.name}</Text>
          <Text style={styles.contact}>{resume.contact}</Text>
        </View>
        {metrics.length > 0 && (
          <View style={styles.metricRow}>
            {metrics.map((metric, index) => (
              <View key={`${metric}-${index}`} style={styles.metricBox}>
                <Text style={styles.metricNumber}>0{index + 1}</Text>
                <Text style={styles.metricText}>{metric}</Text>
              </View>
            ))}
          </View>
        )}
        {resume.sections.map((section, index) => renderSection(section, index, styles.productTitle, standardLineStyles))}
      </Page>
    </Document>
  );
}

function DevOpsInfra({ resume }: { resume: ParsedResume }) {
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.devopsPage]}>
        <View style={styles.devopsHeader}>
          <Text style={styles.devopsName}>{resume.name}</Text>
          <Text style={styles.devopsContact}>{resume.contact}</Text>
        </View>
        {resume.sections.map((section, index) => renderSection(section, index, styles.devopsTitle, standardLineStyles))}
      </Page>
    </Document>
  );
}

export default function ResumeTemplate({ content, templateId }: Readonly<{ content: string; templateId?: string }>) {
  const resume = parseContent(content);

  switch (templateId) {
    case "executive-classic":
      return <ExecutiveClassic resume={resume} />;
    case "data-science":
      return <DataSciencePro resume={resume} />;
    case "startup-minimal":
      return <StartupMinimal resume={resume} />;
    case "career-change":
      return <CareerPivot resume={resume} />;
    case "senior-engineer":
      return <SeniorEngineer resume={resume} />;
    case "product-manager":
      return <ProductLeader resume={resume} />;
    case "devops-infra":
      return <DevOpsInfra resume={resume} />;
    default:
      return <ModernTech resume={resume} />;
  }
}
