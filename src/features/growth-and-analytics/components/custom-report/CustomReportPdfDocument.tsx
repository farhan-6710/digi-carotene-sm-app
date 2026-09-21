import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { CustomReportDocumentData } from "../../types/customReport";

const colors = {
  primary: "#028595",
  text: "#1a2a2e",
  muted: "#6b7c80",
  border: "#dce4e6",
  card: "#f5f8f9",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    color: colors.text,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sectionCaption: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  stat: {
    width: "30%",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  note: {
    fontSize: 8,
    color: colors.muted,
    marginTop: 4,
  },
  postRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  postCaption: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  postMetric: {
    fontSize: 8,
    color: colors.muted,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: colors.muted,
    textAlign: "center",
  },
});

export function CustomReportPdfDocument({
  data,
}: {
  data: CustomReportDocumentData;
}) {
  return (
    <Document title={data.title} author="Digi Carotene">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>Period: {data.periodLabel}</Text>
        <Text style={styles.subtitle}>Generated: {data.generatedAtLabel}</Text>
        <View style={styles.divider} />

        {data.sections.length === 0 ? (
          <Text style={styles.note}>No account sections to display.</Text>
        ) : (
          data.sections.map((section) => (
            <View key={section.accountId} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.accountName}</Text>
              <Text style={styles.sectionCaption}>{section.platformLabel}</Text>

              {section.stats.length > 0 ? (
                <View style={styles.statsRow}>
                  {section.stats.map((stat) => (
                    <View key={stat.label} style={styles.stat}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {section.topPosts.length > 0 ? (
                <View>
                  <Text style={[styles.statLabel, { marginBottom: 4 }]}>
                    Top posts
                  </Text>
                  {section.topPosts.map((post, index) => (
                    <View
                      key={`${section.accountId}-post-${index}`}
                      style={styles.postRow}
                    >
                      <Text style={styles.postCaption}>{post.caption}</Text>
                      <Text style={styles.postMetric}>{post.detail}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {section.note ? (
                <Text style={styles.note}>{section.note}</Text>
              ) : null}
            </View>
          ))
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Digi Carotene · Confidential · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
