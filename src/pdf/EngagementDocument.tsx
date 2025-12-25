import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ProposalResponse, AdvancedTerm } from "@/types/engagement";

Font.register({
  family: 'HK Grotesk',
  fonts: [
    { src: '/fonts/hk-grotesk/HKGrotesk-Regular.otf', fontWeight: 'normal' },
    { src: '/fonts/hk-grotesk/HKGrotesk-Bold.otf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "HK Grotesk",
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
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#6b7280",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
  },
  snoHeader: {
    width: "8%",
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  scopeHeader: {
    width: "52%",
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  priceHeader: {
    width: "40%",
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "right",
  },
  snoCell: {
    width: "8%",
    fontSize: 10,
  },
  scopeCell: {
    width: "52%",
    fontSize: 10,
    paddingRight: 8,
  },
  serviceTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  scopeText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  priceCell: {
    width: "40%",
    fontSize: 10,
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 8,
    color: "#9ca3af",
    textDecoration: "line-through",
    marginRight: 6,
  },
  currentPrice: {
    fontSize: 11,
    color: "#16a34a",
    fontWeight: "bold",
  },
  normalPrice: {
    fontSize: 10,
    color: "#374151",
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
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBlock: {
      width: '45%',
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
  snoCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
  },
  snoText: {
    fontSize: 8,
    color: "#6b7280",
    fontFamily: "Helvetica",
  },
  advancedTermsPage: {
    padding: 50,
    fontSize: 10,
    fontFamily: "HK Grotesk",
    color: "#1f2937",
    lineHeight: 1.6,
  },
  advancedTermsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textDecoration: "underline",
  },
  advancedTermBlock: {
    marginBottom: 12,
  },
  advancedTermHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  advancedTermPointer: {
    marginBottom: 6,
    textAlign: "justify",
    paddingLeft: 10,
  },
});

const formatCurrency = (value: number) => value.toLocaleString("en-IN");

type ProposalDocumentProps = {
  data: ProposalResponse;
  termsAndConditions?: string[];
  advancedTermsAndConditions?: AdvancedTerm[];
};

export const ProposalDocument = ({ data, termsAndConditions, advancedTermsAndConditions }: ProposalDocumentProps) => {
  const services = data.services ?? [];
  const clientName = data.client?.name || "Client Name";
  const clientEmail = data.client?.email || "";
  const clientPhone = data.client?.contactNo || "";
  const cin = data.client?.CIN?.trim() || "";
  const address = data.client?.address || "";
  const proposalDate = data.proposal?.date || new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const message = data.proposal?.message ||
    "We are pleased to submit our proposal for providing professional services to your esteemed organization. Please find below the scope of work along with professional fees and terms and conditions.";

  const isIndividual = !cin;

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const defaultTerms = [
    "GST as per applicable rate will be extra. Presently GST rate is 18%.",
    "All out of pocket expenses shall be reimbursed on actual basis. E.g. ROC Fees, Income Tax, Travel and Conveyance for performing auditing at your office etc.",
    "Your Company should maintain proper books of accounts, vouchers, bills, and files and provide the same to us on timely manner to enable us to complete the auditing within the prescribed time.",
    "Company shall also agree and accept to general terms and conditions of Mayur and Company attached herewith."
  ];

  const terms = termsAndConditions && termsAndConditions.length > 0 ? termsAndConditions : defaultTerms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.dateRight}>{proposalDate}</Text>

        <View style={styles.addressBlock}>
          <Text>To,</Text>
          {!isIndividual && <Text style={styles.bold}>The Board of Directors</Text>}
          <Text style={styles.bold}>{clientName}</Text>
          {clientEmail && <Text>Email: {clientEmail}</Text>}
          {clientPhone && <Text>Phone: {clientPhone}</Text>}
          {!isIndividual && <Text>CIN - {cin}</Text>}
          {address && <Text>Address: {address}</Text>}
        </View>

        <Text style={styles.subject}>
          Sub.: Scope of Work Offered along with Professional Fees and Terms and Conditions of appointment
        </Text>

        <Text style={styles.salutation}>Sir,</Text>

        <Text style={styles.message}>{message}</Text>

        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.snoHeader}>S.No.</Text>
                <Text style={styles.scopeHeader}>Scope of Work</Text>
                <Text style={styles.priceHeader}>Professional Fees (In INR)</Text>
              </View>

              {categoryServices.map((svc, idx) => {
                const hasCustomPrice = svc.discountedPrice != null && svc.discountedPrice !== svc.price;
                return (
                  <View key={svc.id} style={styles.tableRow} wrap={false}>
                    <View style={styles.snoCell}>
                      <Text style={styles.snoText}>{idx + 1}.</Text>
                    </View>
                    <View style={styles.scopeCell}>
                      <Text style={styles.serviceTitle}>{svc.service}</Text>
                      {svc.scopeOfWork && (
                        <Text style={styles.scopeText}>{svc.scopeOfWork}</Text>
                      )}
                    </View>
                    <View style={styles.priceCell}>
                      {hasCustomPrice ? (
                        <>
                          <Text style={styles.originalPrice}>{formatCurrency(svc.price)}</Text>
                          <Text style={styles.currentPrice}>{formatCurrency(svc.discountedPrice!)}</Text>
                        </>
                      ) : (
                        <Text style={styles.normalPrice}>{formatCurrency(svc.price)}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.termsSection} wrap={false}>
          <Text style={styles.termsTitle}>General Terms and Conditions:</Text>
          {terms.map((term, idx) => (
            <Text key={idx} style={styles.termItem}>• {term}</Text>
          ))}
        </View>

        <Text style={{ marginTop: 16, marginBottom: 40 }}>
          Please send us signed and stamped copy of this letter as a token of your acceptance.
        </Text>

        <View style={styles.signatureContainer} wrap={false}>
            {/* Left Block - CA Mayur Gupta */}
            <View style={styles.signatureBlock}>
                <View style={{ borderTop: '1px solid #333', width: '100%', marginTop: 80, marginBottom: 10 }} />
                <Text style={[styles.signatureLine, styles.bold]}>CA MAYUR GUPTA, FCA</Text>
                <Text style={styles.signatureLine}>PROPRIETOR</Text>
                <Text style={[styles.signatureLine, styles.bold]}>FOR MAYUR AND COMPANY</Text>
                <Text style={styles.signatureLine}>CHARTERED ACCOUNTANTS</Text>
                <Text style={styles.signatureLine}>DATE – {proposalDate}</Text>
                <Text style={styles.signatureLine}>PLACE: DELHI</Text>
                <Text style={styles.signatureLine}>M.NO.503036</Text>
                <Text style={styles.signatureLine}>FRN-021448N</Text>
            </View>

            {/* Right Block - Client */}
            <View style={styles.signatureBlock}>
                <View style={{ borderTop: '1px solid #333', width: '100%', marginTop: 80, marginBottom: 10 }} />
                {!isIndividual && <Text style={[styles.signatureLine, styles.bold]}>For and on behalf of</Text>}
                {!isIndividual && <Text style={[styles.signatureLine, styles.bold]}>The Board of Directors</Text>}
                <Text style={[styles.signatureLine, styles.bold]}>{clientName}</Text>
                {!isIndividual && <Text style={styles.signatureLine}>Authorized Signatory</Text>}
                {!isIndividual && <Text style={styles.signatureLine}>CIN - {cin}</Text>}
                <Text style={styles.signatureLine}>Date – {proposalDate}</Text>
                {address && <Text style={styles.signatureLine}>Address: {address}</Text>}
                {clientEmail && <Text style={styles.signatureLine}>Email: {clientEmail}</Text>}
                {clientPhone && <Text style={styles.signatureLine}>Phone: {clientPhone}</Text>}
            </View>
        </View>
        <Text style={styles.enclosure}>Enc.: a/a</Text>
      </Page>

      {advancedTermsAndConditions && advancedTermsAndConditions.length > 0 && (
        <Page size="A4" style={styles.advancedTermsPage}>
          <Text style={styles.advancedTermsTitle}>Terms and Conditions</Text>
          {advancedTermsAndConditions.map((term, index) => (
            <View key={index} style={styles.advancedTermBlock}>
              <Text style={styles.advancedTermHeading}>{term.heading}</Text>
              {term.points.map((point, pointIndex) => (
                <Text key={pointIndex} style={styles.advancedTermPointer}>
                  • {point}
                </Text>
              ))}
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
};
