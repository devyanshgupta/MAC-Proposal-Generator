import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { ProposalResponse, AdvancedTerm } from "@/types/engagement";

Font.register({
  family: 'HK Grotesk',
  fonts: [
    { src: '/fonts/hk-grotesk/HKGrotesk-Regular.otf', fontWeight: 'normal' },
    { src: '/fonts/hk-grotesk/HKGrotesk-Bold.otf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Open Sauce',
  fonts: [
    { src: '/fonts/open-sauce/OpenSauceOne-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/open-sauce/OpenSauceTwo-Regular.ttf', fontWeight: 'normal' },
  ]
});

Font.register({
  family: 'Noto Serif Devanagari',
  fonts: [
    { src: '/fonts/Noto_Serif_Devanagari/static/NotoSerifDevanagari-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Noto_Serif_Devanagari/static/NotoSerifDevanagari-Bold.ttf', fontWeight: 'bold' },
  ]
});


Font.registerHyphenationCallback(word => {return [word];});

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 80,
    fontSize: 11,
    fontFamily: "HK Grotesk",
    color: "#1f2937",
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '110%',
    zIndex: -1,
    opacity: 0.15,
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
    lineHeight: 1,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
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
    marginBottom: 10,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  originalPrice: {
    fontSize: 9,
    color: "#9ca3af",
    textDecoration: "line-through",
    marginRight: 6,
  },
  currentPrice: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "bold",
  },
  normalPrice: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "bold",
  },
  billingCycle: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  termsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 15,
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
    lineHeight: 0.75,
  },
  bold: {
    fontWeight: "bold",
  },
  enclosure: {
    marginTop: 20,
  },
  boldHindi: {
    fontFamily: "Noto Serif Devanagari",
  },
  enclosureHindi: {
    fontFamily: "Noto Serif Devanagari",
    fontWeight: "normal",
    fontSize:12,
    wordBreak: 'keep-all',
    lineHeight: 1.2,
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
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 80,
    fontSize: 10,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    //color: "#000",
    //letterSpacing: -0.5,
  },
  advancedTermPointer: {
    marginBottom: 6,
    textAlign: "justify",
    paddingLeft: 10,
    lineHeight: 1,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 0,
    zIndex: 10,
    fontSize: 10,
    color: '#000', // Changed to black as per user edit for visibility
    textAlign: 'left',
  }
});

const formatCurrency = (value: number) => value.toLocaleString("en-IN");

const sanitizeText = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/[\u2018\u2019]/g, "'") // Replace curly single quotes with straight quote
    .replace(/[\u201C\u201D]/g, '"') // Replace curly double quotes with straight quote
    .replace("’", "'")
    .replace("‘", "'")
  //.replace(/[\u2013\u2014]/g, "-"); // Replace en/em dashes with hyphen
};

type ProposalDocumentProps = {
  data: ProposalResponse;
  advancedTermsAndConditions?: AdvancedTerm[];
};


export const defaultTerms = [
  "GST as per applicable rate will be extra. Presently GST rate is 18%.",
  "All out of pocket expenses shall be reimbursed on actual basis.",
  "General Terms and Conditions of Mayur & Company, attached herewith, shall apply."
];

export const ProposalDocument = ({ data, advancedTermsAndConditions }: ProposalDocumentProps) => {
  const services = data.services ?? [];
  const clientName = data.client?.name || "Client Name";
  const clientRepresentative = data.client?.clientRepresentative || "";
  const clientRepresentativePost = data.client?.clientRepresentativePost || "";
  const clientEmail = data.client?.email || "";
  const clientPhone = data.client?.contactNo || "";
  const PAN = data.client?.PAN?.trim() || "";
  const address = data.client?.address || "";
  const proposalDate = data.proposal?.date || new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const message = data.proposal?.message ||
    "We are pleased to submit our proposal for providing professional services to your esteemed organization. Please find below the scope of work along with professional fees and terms and conditions.";
  const para = data.proposal?.para || ""; // Retrieve the new paragraph field

  const entityType = data.client?.entityType;
  const isProprietorshipOrPartnership = entityType === 'proprietorship';
  const isCompany = !isProprietorshipOrPartnership;

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);



  const userTerms = para ? para.split(/\r?\n/).filter(t => t.trim() !== "") : [];
  const terms = userTerms.length > 0 ? userTerms : defaultTerms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background layers - letterhead (page 1 only) + watermark (all pages) */}
        <View
          fixed
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '118.2%', //dont change this
          }}
          render={({ pageNumber }) => (
            <>
              {/* Letterhead - only on page 1, rendered first (bottom layer) */}
              {pageNumber === 1 && (
                <Image src="/letterhead.png" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }} />
              )}
              {/* Watermark - on all pages, rendered second (on top of letterhead) */}
              <Image src="/watermark.png" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '110%',
                opacity: 0.15
              }} />
            </>
          )}
        />

        {/* Page Numbers */}
        <Text
          fixed
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => (
            pageNumber > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
          )}
        />

        {/* Spacer for top margin on first page. Increase height to push text lower on page 1. */}
        <View style={{ height: 120 }} />

        <Text style={styles.dateRight}>{proposalDate}</Text>

        <View style={styles.addressBlock}>
          {data.client?.referenceNumber && (
            <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>Reference Number: {data.client.referenceNumber}</Text>
          )}
          <Text>To,</Text>
          {isCompany && <Text style={styles.bold}>The Board of Directors</Text>}
          <Text style={styles.bold}>{clientName}</Text>
          {clientEmail && <Text>Email: {clientEmail}</Text>}
          {clientPhone && <Text>Phone: {clientPhone}</Text>}
          {PAN && <Text>PAN - {PAN}</Text>}
          {address && <Text>Address: {address}</Text>}
        </View>

        <Text style={styles.subject}>
          Sub.: Scope of Work Offered along with Professional Fees and Terms and Conditions of appointment
        </Text>

        <Text style={styles.salutation}>Sir,</Text>

        <Text style={styles.message}>{sanitizeText(message)}</Text>

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
                const hasLowerPrice = svc.discountedPrice != null && svc.discountedPrice !== svc.price && svc.discountedPrice < svc.price;
                const hasHigherPrice = svc.discountedPrice != null && svc.discountedPrice !== svc.price && svc.discountedPrice > svc.price;
                return (
                  <View key={svc.id} style={styles.tableRow} wrap={false}>
                    <View style={styles.snoCell}>
                      <Text style={styles.snoText}>{idx + 1}.</Text>
                    </View>
                    <View style={styles.scopeCell}>
                      <Text style={styles.serviceTitle}>{sanitizeText(svc.service)}</Text>
                      {svc.scopeOfWork && (
                        <Text style={styles.scopeText}>{sanitizeText(svc.scopeOfWork)}</Text>
                      )}
                    </View>
                    <View style={styles.priceCell}>
                      <View style={styles.priceRow}>
                        {hasLowerPrice ? (
                          <>
                            <Text style={styles.originalPrice}>{formatCurrency(svc.price)}</Text>
                            <Text style={styles.currentPrice}>{formatCurrency(svc.discountedPrice!)}</Text>
                          </>
                        ) : hasHigherPrice ? (
                          <Text style={styles.normalPrice}>{formatCurrency(svc.discountedPrice)}</Text>
                        ) : (
                          <Text style={styles.normalPrice}>{formatCurrency(svc.price)}</Text>
                        )}
                      </View>
                      {svc.billingCycle && (
                        <Text style={styles.billingCycle}>({svc.billingCycle})</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.termsSection} wrap={false}>
          <Text style={styles.termsTitle}>Specific Terms and Conditions:</Text>
          {terms.map((term, idx) => {
            // Remove existing bullets if the user typed them
            const cleanTerm = term.replace(/^-\s*/, '').replace(/^•\s*/, '');
            // Split by markdown bold syntax **text**
            const parts = cleanTerm.split(/(\*\*.*?\*\*)/g);
            return (
              <Text key={idx} style={styles.termItem}>
                • {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <Text key={pIdx} style={styles.bold}>{sanitizeText(part.slice(2, -2))}</Text>;
                  }
                  return <Text key={pIdx}>{sanitizeText(part)}</Text>;
                })}
              </Text>
            );
          })}
        </View>

        <Text style={{ marginTop: 7, marginBottom: 10 }}>
          Please send us signed copy of this Engagement Letter as a token of your acceptance. You may also sign it digitally.
        </Text>

        <View style={styles.signatureContainer} wrap={false}>
          {/* Left Block - CA Mayur Gupta */}
          <View style={styles.signatureBlock}>
            <View style={{ borderTop: '1px solid #333', width: '100%', marginTop: 20, marginBottom: 5 }} />
            <Text style={[styles.signatureLine, styles.bold]}>CA MAYUR GUPTA</Text>
            <Text style={styles.signatureLine}>Proprietor</Text>
            <Text style={[styles.signatureLine, styles.bold]}>Mayur and Company</Text>
            <Text style={styles.signatureLine}>Chartered Accountants</Text>
            <Text style={styles.signatureLine}>Date – {proposalDate}</Text>
            <Text style={styles.signatureLine}>Place: Delhi</Text>
            <Text style={styles.enclosure}>Enc.: a/a</Text>
          </View>

          {/* Right Block - Client */}
          <View style={styles.signatureBlock}>
            <View style={{ borderTop: '1px solid #333', width: '100%', marginTop: 20, marginBottom: 5 }} />
            {isCompany ? (
              <>
                {clientRepresentative ? <Text style={styles.signatureLine}>{clientRepresentative}</Text> : null}
                {clientRepresentativePost ? <Text style={styles.signatureLine}>{clientRepresentativePost}</Text> : null}
                <Text style={[styles.signatureLine, styles.bold]}>For and on behalf of</Text>
                <Text style={[styles.signatureLine, styles.bold]}>The Board of Directors</Text>
                <Text style={[styles.signatureLine, styles.bold]}>{clientName}</Text>
                <Text style={styles.signatureLine}>Authorized Signatory</Text>
              </>
            ) : (
              <Text style={[styles.signatureLine, styles.bold]}>{clientName}</Text>
            )}
            {PAN && <Text style={styles.signatureLine}>PAN - {PAN}</Text>}
            <Text style={styles.signatureLine}>Date – {proposalDate}</Text>
            {address && <Text style={styles.signatureLine}>Address: {address}</Text>}
            {clientEmail && <Text style={styles.signatureLine}>Email: {clientEmail}</Text>}
            {clientPhone && <Text style={styles.signatureLine}>Phone: {clientPhone}</Text>}
          </View>
        </View>
      </Page>

      {advancedTermsAndConditions && advancedTermsAndConditions.length > 0 && (

        <Page size="A4" style={styles.advancedTermsPage}>
          {/* Watermark - zIndex -5 */}
          <View
            fixed
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -5,
            }}
          >
            <Image src="/watermark.png" style={{ width: '100%', height: '100%', opacity: 0.15 }} />
          </View>

          {/* Page Numbers */}
          <Text
            fixed
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => (
              pageNumber > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
            )}
          />

          <Text style={styles.advancedTermsTitle}>General Terms and Conditions</Text>
          {advancedTermsAndConditions.map((term, index) => {
            const headingText = term.heading.replace(/^\d+\.?\s*/, '');
            const toRoman = (num) => {
              const romans = [
                'i', 'ii', 'iii', 'iv', 'v',
                'vi', 'vii', 'viii', 'ix', 'x',
                'xi', 'xii', 'xiii', 'xiv', 'xv',
                'xvi', 'xvii', 'xviii', 'xix', 'xx',
              ];
              return romans[num - 1] || num.toString();
            };
            return (
              <View key={index} style={styles.advancedTermBlock}>
                <Text style={styles.advancedTermHeading}>{`${index + 1}. ${sanitizeText(headingText)}`}</Text>
                {term.points.map((point, pointIndex) => (
                  <Text key={pointIndex} style={styles.advancedTermPointer}>
                    {term.points.length === 1 ? sanitizeText(point) : `${toRoman(pointIndex + 1)}. ${sanitizeText(point)}`}
                  </Text>
                ))}
              </View>
            );
          })}
          <Text style={styles.enclosure}>
            <Text style={styles.bold}>Note:</Text> Clients are hereby informed that they may formally request a translation of the General Terms & Conditions into Hindi language if required. Such requests will be accommodated to the extent feasible, subject to the company’s standard procedures and timelines. In the event of any inconsistencies or ambiguities between the translated General Terms & Conditions and the English version, the English version shall prevail and be deemed authoritative.{'\n\n'}</Text>
            <Text style={styles.enclosureHindi}>
            <Text style={styles.boldHindi}>नोट:</Text> ग्राहकों को एतद्द्वारा सूचित किया जाता है कि वे आवश्यकता होने पर सामान्य नियम और शर्तों के हिंदी अनुवाद के लिए औपचारिक रूप से अनुरोध कर सकते हैं। ऐसे अनुरोधों को कंपनी की मानक प्रक्रियाओं और समय-सीमाओं के अधीन, यथासंभव पूरा किया जाएगा। अनुवादित सामान्य नियम और शर्तों में किसी भी प्रकार की विसंगति होने की स्थिति में, अंग्रेजी संस्करण  ही सर्वोपरि माना जाएगा।</Text>
            <Text style={styles.enclosure}>I hereby confirm that I have read all the above-mentioned General Terms and Conditions of Mayur and Company, Chartered Accountants and agree and accept all the above-mentioned General Terms and Conditions of Mayur and Company, Chartered Accountants.</Text>

          <View style={styles.signatureContainer} wrap={false}>
            {/* Right Block - Client */}
            <View style={styles.signatureBlock}>
              <View style={{ borderTop: '1px solid #333', width: '100%', marginTop: 80, marginBottom: 10 }} />
              {isCompany ? (
                <>
                  {clientRepresentative ? <Text style={styles.signatureLine}>{clientRepresentative}</Text> : null}
                  {clientRepresentativePost ? <Text style={styles.signatureLine}>{clientRepresentativePost}</Text> : null}
                  <Text style={[styles.signatureLine, styles.bold]}>For and on behalf of</Text>
                  <Text style={[styles.signatureLine, styles.bold]}>The Board of Directors</Text>
                  <Text style={[styles.signatureLine, styles.bold]}>{clientName}</Text>
                  <Text style={styles.signatureLine}>Authorized Signatory</Text>
                </>
              ) : (
                <Text style={[styles.signatureLine, styles.bold]}>{clientName}</Text>
              )}
              {PAN && <Text style={styles.signatureLine}>PAN - {PAN}</Text>}
              <Text style={styles.signatureLine}>Date – {proposalDate}</Text>
              {address && <Text style={styles.signatureLine}>Address: {address}</Text>}
              {clientEmail && <Text style={styles.signatureLine}>Email: {clientEmail}</Text>}
              {clientPhone && <Text style={styles.signatureLine}>Phone: {clientPhone}</Text>}
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
};
