import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ProposalResponse } from "@/types/proposal";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1f2937",
    lineHeight: 1.5,
  },
  dateRight: {
    textAlign: "right",
    marginBottom: 20,
  },
  addressBlock: {
    marginBottom: 20,
  },
  subject: {
    fontWeight: "bold",
    marginBottom: 16,
    textDecoration: "underline",
  },
  salutation: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 20,
    textAlign: "justify",
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textDecoration: "underline",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 10,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  cell: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  termsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textDecoration: "underline",
  },
  termItem: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureLine: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  enclosure: {
    marginTop: 20,
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
  const clientName = data.client?.name || "Client Name";
  const cin = data.client?.CIN || "Not Provided";
  const address = data.client?.address || "Address Not Provided";
  const proposalDate = data.proposal?.date || new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long", 
    year: "numeric"
  });
  const message = data.proposal?.message || 
    "We are pleased to submit our proposal for providing professional services to your esteemed organization. Please find below the scope of work along with professional fees and terms and conditions.";

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date - Right aligned */}
        <Text style={styles.dateRight}>{proposalDate}</Text>

        {/* Address Block - Left aligned */}
        <View style={styles.addressBlock}>
          <Text>To,</Text>
          <Text style={styles.bold}>The Board of Directors</Text>
          <Text style={styles.bold}>{clientName}</Text>
          <Text>CIN - {cin}</Text>
          <Text>Address: {address}</Text>
        </View>

        {/* Subject Line */}
        <Text style={styles.subject}>
          Sub.: Scope of Work Offered along with Professional Fees and Terms and Conditions of appointment
        </Text>

        {/* Salutation */}
        <Text style={styles.salutation}>Sir,</Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Services Tables by Category */}
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <View key={category} wrap={false}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.headerCell}>Services</Text>
                </View>
                <View style={{ width: "25%" }}>
                  <Text style={styles.headerCell}>Professional Fees</Text>
                </View>
                <View style={{ width: "25%" }}>
                  <Text style={[styles.headerCell, styles.cellLast]}>Personalised Fees</Text>
                </View>
              </View>

              {/* Table Rows */}
              {categoryServices.map((svc, idx) => {
                const hasCustomPrice = svc.discountedPrice != null && svc.discountedPrice !== svc.price;
                return (
                  <View key={svc.id} style={styles.tableRow}>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.cell}>{svc.service}</Text>
                    </View>
                    <View style={{ width: "25%" }}>
                      <Text style={styles.cell}>{currency(svc.price)}</Text>
                    </View>
                    <View style={{ width: "25%" }}>
                      <Text style={[styles.cell, styles.cellLast]}>
                        {hasCustomPrice ? currency(svc.discountedPrice!) : "-"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Other Terms and Conditions:</Text>
          
          <Text style={styles.termItem}>
            • GST as per applicable rate will be extra. Presently GST rate is 18%.
          </Text>
          
          <Text style={styles.termItem}>
            • All out of pocket expenses shall be reimbursed on actual basis. E.g. ROC Fees, Income Tax, Travel and Conveyance for performing auditing at your office etc.
          </Text>
          
          <Text style={styles.termItem}>
            • Your Company should maintain proper books of accounts, vouchers, bills, and files and provide the same to us on timely manner to enable us to complete the auditing within the prescribed time.
          </Text>
          
          <Text style={styles.termItem}>
            • Company shall also agree and accept to general terms and conditions of Mayur and Company attached herewith.
          </Text>
        </View>

        <Text style={{ marginTop: 16, marginBottom: 40 }}>
          Please send us signed and stamped copy of this letter as a token of your acceptance.
        </Text>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={[styles.signatureLine, styles.bold]}>CA MAYUR GUPTA, FCA</Text>
          <Text style={styles.signatureLine}>PROPRIETOR</Text>
          <Text style={[styles.signatureLine, styles.bold]}>FOR MAYUR AND COMPANY</Text>
          <Text style={styles.signatureLine}>CHARTERED ACCOUNTANTS</Text>
          <Text style={styles.signatureLine}>DATE – {proposalDate}</Text>
          <Text style={styles.signatureLine}>PLACE: DELHI</Text>
          <Text style={styles.signatureLine}>M.NO.503036</Text>
          <Text style={styles.signatureLine}>FRN-021448N</Text>
        </View>

        {/* Enclosure */}
        <Text style={styles.enclosure}>Enc.: a/a</Text>
      </Page>
    </Document>
  );
};
