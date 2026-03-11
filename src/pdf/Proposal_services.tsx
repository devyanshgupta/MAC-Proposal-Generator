import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ProposalService } from "@/types/engagement";

Font.register({
  family: 'HK Grotesk',
  fonts: [
    { src: '/fonts/hk-grotesk/HKGrotesk-Regular.otf', fontWeight: 'normal' },
    { src: '/fonts/hk-grotesk/HKGrotesk-Bold.otf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Atkinson Hyperlegible',
  fonts: [
    { src: '/fonts/Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf', fontWeight: 'bold' },
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
  family: 'Red Hat Display',
  fonts: [
    { src: '/fonts/Red_Hat_Display/static/RedHatDisplay-Black.ttf', fontWeight: 'bold' },
  ]
});

const PAGE_PADDING = 50;
const LEFT_GUTTER = 80;
const HEADER_ROW_HEIGHT = 22;
const HEADER_GAP = 8;
const DIVIDER_GAP = 20;
const HEADER_BLOCK_HEIGHT = HEADER_ROW_HEIGHT + HEADER_GAP + DIVIDER_GAP;
const CONTENT_LEFT = PAGE_PADDING + LEFT_GUTTER;

const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE_PADDING + HEADER_BLOCK_HEIGHT,
    paddingRight: PAGE_PADDING,
    paddingBottom: PAGE_PADDING,
    paddingLeft: CONTENT_LEFT,
    fontSize: 11,
    fontFamily: "Open Sauce",
    fontStyle: 'normal',
    color: "#1f2937",
    letterSpacing: 0,
    backgroundColor: "#EDEDED",
    lineHeight: 1.5,
  },
  headerContainer: {
    position: "absolute",
    top: PAGE_PADDING,
    left: CONTENT_LEFT,
    right: PAGE_PADDING,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: HEADER_ROW_HEIGHT,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    textAlign: "right",
  },
  headerText: {
    fontSize: 14,
    fontFamily: "Open Sauce",
    fontWeight: "bold",
    color: "#1f3728",
  },
  divider: {
    position: "absolute",
    top: PAGE_PADDING + HEADER_ROW_HEIGHT + HEADER_GAP,
    left: CONTENT_LEFT,
    right: PAGE_PADDING,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  verticalTitleContainer: {
    position: "absolute",
    top: PAGE_PADDING + HEADER_BLOCK_HEIGHT,
    left: PAGE_PADDING,
    width: LEFT_GUTTER,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexShrink: 0,
  },
  verticalTitleWrapper: {
    position: "absolute",
    width: 600,
    height: 80,
    left: -295,
    top: 330,
    fontFamily: "Atkinson Hyperlegible",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  verticalTitle: {
    fontSize: 68,
    fontWeight: "bold",
    fontFamily: "Atkinson Hyperlegible",
    color: "#244333",
    textAlign: "center",
    transform: "rotate(-90deg)",
    transformOrigin: "center center",
    whiteSpace: "nowrap",
    letterSpacing: -3,
  },
  servicesContainer: {
    flex: 1,
  },
  serviceRow: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingLeft: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    //marginLeft: -16,
  },
  serviceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceDetails: {
    flex: 1,
    paddingRight: 0,
  },
  serviceHeading: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Open Sauce",
    marginBottom: 4,
    letterSpacing: -0.5,
    color: "#000",
  },
  serviceDescription: {
    fontSize: 10,
    fontFamily: "Open Sauce",
    color: "#000",
    letterSpacing: -0.5,
    lineHeight: 1.4,
  },
  pricingContainer: {
    width: 100,
    textAlign: "right",
    flexShrink: 0,
  },
  serviceFee: {
    fontSize: 16,
    fontFamily: "Red Hat Display",
    fontWeight: "bold",
    color: "#244333",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  paymentCycle: {
    fontSize: 9,
    fontFamily: "Open Sauce",
    letterSpacing: -0.5,
    color: "#000",
  },
  notesSection: {
    marginTop: 20,
    padding: 10,
    marginRight: 0,
    textAlign: "right",
  },
  notesHeading: {
    fontSize: 28.5714285712,
    fontFamily: "Red Hat Display",
    fontWeight: "bold",
    marginBottom: 25,
    color: "#244333",
  },
  notesParagraph: {
    fontSize: 10,
    color: "#000",
    lineHeight: 1.4,
    marginBottom: 4,
    letterSpacing: -0.5,
    textAlign: "right",
  },
  bulletRow: {
    flexDirection: 'row-reverse',
    marginBottom: 4,
    letterSpacing: -0.5,
    justifyContent: 'flex-start',
  },
  bullet: {
    width: 10,
    fontSize: 12,
    textAlign: 'right',
    letterSpacing: -0.5,
    marginLeft: 5,
  },
  bulletContent: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  boldText: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
});

const formatCurrency = (value: number) => value.toLocaleString("en-IN");

const sanitizeText = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/[\u2018\u2019]/g, "'") // Replace curly single quotes with straight quote
    .replace(/[\u201C\u201D]/g, '"') // Replace curly double quotes with straight quote
    .replace(/[\u2013\u2014]/g, "-"); // Replace en/em dashes with hyphen
};

interface ProposalServicesDocumentProps {
  services: ProposalService[];
  para?: string;
}

const renderFormattedText = (text: string) => {
  const sanitizedText = sanitizeText(text);
  const lines = sanitizedText.split('\n');

  return lines.map((line, lineIndex) => {
    const trimmedLine = line.trim();
    const isBullet = trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•');

    let content = isBullet ? trimmedLine.substring(1).trim() : trimmedLine;

    // Simple bold parser for **text**
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={partIndex} style={styles.boldText} hyphenationCallback={(word) => [word]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={partIndex} hyphenationCallback={(word) => [word]}>{part}</Text>;
    });

    if (isBullet) {
      return (
        <View key={lineIndex} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletContent}>{renderedParts}</Text>
        </View>
      );
    }

    return (
      <Text key={lineIndex} style={styles.notesParagraph} hyphenationCallback={(word) => [word]}>
        {renderedParts}
      </Text>
    );
  });
};

export const ProposalServicesDocument = ({ services, para }: ProposalServicesDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header Row */}
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Scope of Service</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerText}>Fees (In INR)</Text>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} fixed />

        {/* Vertical Title */}
        <View style={styles.verticalTitleContainer} fixed>
          <View style={styles.verticalTitleWrapper}>
            <Text style={styles.verticalTitle}>Proposed Services</Text>
          </View>
        </View>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.map((service, index) => {
            const fee = service.discountedPrice ?? service.price;
            return (
              <View
                key={service.id}
                style={[
                  styles.serviceRow,
                  index === services.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
                minPresenceAhead={48}
              >
                <View style={styles.serviceHeaderRow} wrap={false}>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceHeading}>{sanitizeText(service.service)}</Text>
                  </View>
                  <View style={styles.pricingContainer}>
                    <Text style={styles.serviceFee}>{formatCurrency(fee)}</Text>
                    {service.billingCycle && (
                      <Text style={styles.paymentCycle}>({service.billingCycle})</Text>
                    )}
                  </View>
                </View>
                {service.scopeOfWork && (
                  <Text style={styles.serviceDescription}>{sanitizeText(service.scopeOfWork)}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Notes from CA */}
        {para && (
          <View style={styles.notesSection}>
            <Text style={styles.notesHeading}>Notes from the CA</Text>
            <View>
              {renderFormattedText(para)}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ProposalServicesDocument;
