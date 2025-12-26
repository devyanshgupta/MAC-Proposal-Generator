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
    { src: 'fonts/Red_Hat_Display/static/RedHatDisplay-Black.ttf', fontWeight: 'bold' },
  ]
});



const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Open Sauce",
    fontStyle: 'normal',
    color: "#1f2937",
    letterSpacing: 0,
    backgroundColor:"#EDEDED",
    lineHeight: 1.5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingLeft: 80,
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
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    marginBottom: 20,
  },
  mainContainer: {
    flexDirection: "row",
  },
  verticalTitleContainer: {
    width: 80,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexShrink: 0,
    paddingVertical: 20,
    position: "relative",
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
    paddingLeft: 0,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingLeft:10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    //marginLeft: -16,
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
});

const formatCurrency = (value: number) => value.toLocaleString("en-IN");

// Calculate how many services can fit on a page
const SERVICES_PER_PAGE = 8; // Adjust based on your layout needs

interface ProposalServicesDocumentProps {
  services: ProposalService[];
}

export const ProposalServicesDocument = ({ services }: ProposalServicesDocumentProps) => {
  // Split services into pages
  const pages: ProposalService[][] = [];
  for (let i = 0; i < services.length; i += SERVICES_PER_PAGE) {
    pages.push(services.slice(i, i + SERVICES_PER_PAGE));
  }

  // If no services, show empty page
  if (pages.length === 0) {
    pages.push([]);
  }

  return (
    <Document>
      {pages.map((pageServices, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header Row */}
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerText}>Scope of Service</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerText}>Fees (In INR)</Text>
            </View>
          </View>

          {/* Divider Line */}
          <View style={styles.divider} />

          {/* Main Content Area */}
          <View style={styles.mainContainer}>
            {/* Vertical Title */}
            <View style={styles.verticalTitleContainer}>
              <View style={styles.verticalTitleWrapper}>
                <Text style={styles.verticalTitle}>Proposed Services</Text>
              </View>
            </View>

            {/* Services List */}
            <View style={styles.servicesContainer}>
              {pageServices.map((service, index) => {
                const fee = service.discountedPrice ?? service.price;
                return (
                  <View
                    key={service.id}
                    style={[
                      styles.serviceRow,
                      index == pageServices.length-1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <View style={styles.serviceDetails}>
                      <Text style={styles.serviceHeading}>{service.service}</Text>
                      {service.scopeOfWork && (
                        <Text style={styles.serviceDescription}>{service.scopeOfWork}</Text>
                      )}
                    </View>
                    <View style={styles.pricingContainer}>
                      <Text style={styles.serviceFee}>{formatCurrency(fee)}</Text>
                      {service.billingCycle && (
                        <Text style={styles.paymentCycle}>({service.billingCycle})</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ProposalServicesDocument;
