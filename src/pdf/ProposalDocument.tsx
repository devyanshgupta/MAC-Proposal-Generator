import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ProposalResponse } from "@/types/proposal";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  cover: {
    flex: 1,
    justifyContent: "space-between",
  },
  coverHeader: {
    padding: 16,
    borderWidth: 2,
    borderColor: "#22a06b",
    alignSelf: "flex-start",
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    marginTop: 32,
    marginBottom: 4,
  },
  coverSubtitle: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 24,
  },
  coverTagline: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },
  coverFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 48,
  },
  badge: {
    height: 4,
    backgroundColor: "#22a06b",
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6b7280",
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
    color: "#111827",
  },
  introCard: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  messageBox: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 10,
    color: "#1f2937",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  summary: {
    marginTop: 16,
    alignSelf: "flex-end",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    backgroundColor: "#f9fafb",
    minWidth: 180,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

type ProposalDocumentProps = {
  data: ProposalResponse;
};

export const ProposalDocument = ({ data }: ProposalDocumentProps) => {
  const services = data.services ?? [];
  const preparedFor =
    data.proposal?.preparedFor || data.client?.name || "Client";
  const preparedBy = data.proposal?.preparedBy || "Mayur & Company";
  const proposalDate =
    data.proposal?.date || new Date().toISOString().slice(0, 10);
  const message =
    data.proposal?.message ||
    "Thank you for considering our firm. We look forward to delivering value through the services outlined below.";

  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.cover]}>
        <View>
          <View style={styles.coverHeader}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              Mayur & Company
            </Text>
            <Text style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>
              Chartered Accountants
            </Text>
          </View>

          <Text style={styles.coverTitle}>SERVICES</Text>
          <Text style={styles.coverSubtitle}>PROPOSAL</Text>
          <View style={{ height: 180, backgroundColor: "#e0f2fe" }} />
        </View>

        <View>
          <Text style={styles.coverTagline}>A Year of Impact & Innovation</Text>
          <View style={styles.badge} />

          <View style={[styles.coverFooter, { marginTop: 16 }]}>
            <View>
              <Text style={styles.label}>Prepared for</Text>
              <Text style={styles.value}>{preparedFor}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}>Prepared by</Text>
              <Text style={styles.value}>{preparedBy}</Text>
              <Text style={[styles.label, { marginTop: 6 }]}>Date</Text>
              <Text style={styles.value}>{proposalDate}</Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <View style={styles.introCard}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{preparedFor}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{preparedBy}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{proposalDate}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={[styles.label, { marginTop: 12 }]}>GSTIN</Text>
              <Text style={styles.value}>
                {data.client?.gstin || "Not provided"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.label, { marginTop: 12 }]}>DIN</Text>
              <Text style={styles.value}>
                {data.client?.din || "Not provided"}
              </Text>
            </View>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.label}>Message</Text>
            <Text style={{ marginTop: 6, lineHeight: 1.4 }}>{message}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={{ width: "18%" }}>
              <Text style={styles.headerCell}>Category</Text>
            </View>
            <View style={{ width: "32%" }}>
              <Text style={styles.headerCell}>Service</Text>
            </View>
            <View style={{ width: "18%" }}>
              <Text style={styles.headerCell}>Payment Frequency</Text>
            </View>
            <View style={{ width: "16%", alignItems: "flex-end" }}>
              <Text style={styles.headerCell}>Pricing</Text>
            </View>
            <View style={{ width: "16%", alignItems: "flex-end" }}>
              <Text style={styles.headerCell}>Discounted Price</Text>
            </View>
          </View>

          {services.map((svc, idx) => (
            <View
              key={svc.id}
              style={[styles.row, styles.rowBorder]}
              wrap={false}
            >
              <View style={{ width: "18%" }}>
                <Text style={styles.cell}>{svc.category}</Text>
              </View>
              <View style={{ width: "32%" }}>
                <Text style={styles.cell}>{svc.service}</Text>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.cell}>{svc.billingCycle}</Text>
              </View>
              <View style={{ width: "16%", alignItems: "flex-end" }}>
                <Text style={styles.cell}>{currency(svc.price)}</Text>
              </View>
              <View style={{ width: "16%", alignItems: "flex-end" }}>
                <Text style={styles.cell}>
                  {currency(
                    svc.discountedPrice != null ? svc.discountedPrice : svc.price
                  )}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Services</Text>
            <Text style={styles.value}>{data.summary?.count ?? 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>{currency(data.summary?.total ?? 0)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

