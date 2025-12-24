import { motion } from "framer-motion";

interface ClientInfoProps {
  clientName: string;
  gstin: string;
  address: string;
  din: string;
  preparedBy: string;
  proposalDate: string;
  greeting: string;
  onFieldChange: (field: string, value: string) => void;
}

export const ClientInfo = ({
  clientName,
  gstin,
  address,
  din,
  preparedBy,
  proposalDate,
  greeting,
  onFieldChange,
}: ClientInfoProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Client Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="client-name" className="text-sm font-medium text-foreground/70 mb-2">
              Client Name
            </label>
            <input
              id="client-name"
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => onFieldChange("name", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="client-gstin" className="text-sm font-medium text-foreground/70 mb-2">
              Client GSTIN
            </label>
            <input
              id="client-gstin"
              type="text"
              placeholder="Enter GSTIN"
              value={gstin}
              onChange={(e) => onFieldChange("gstin", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="client-address" className="text-sm font-medium text-foreground/70 mb-2">
              Client Address
            </label>
            <input
              id="client-address"
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => onFieldChange("address", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="client-din" className="text-sm font-medium text-foreground/70 mb-2">
              Client DIN Number
            </label>
            <input
              id="client-din"
              type="text"
              placeholder="Enter DIN"
              value={din}
              onChange={(e) => onFieldChange("din", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="prepared-by" className="text-sm font-medium text-foreground/70 mb-2">
              Prepared By
            </label>
            <input
              id="prepared-by"
              type="text"
              placeholder="Your firm name"
              value={preparedBy}
              onChange={(e) => onFieldChange("preparedBy", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="proposal-date" className="text-sm font-medium text-foreground/70 mb-2">
              Proposal Date
            </label>
            <input
              id="proposal-date"
              type="date"
              value={proposalDate}
              onChange={(e) => onFieldChange("date", e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col md:col-span-3">
            <label htmlFor="greeting" className="text-sm font-medium text-foreground/70 mb-2">
              Greeting / Message
            </label>
            <textarea
              id="greeting"
              placeholder="Add a short message for the client"
              value={greeting}
              onChange={(e) => onFieldChange("message", e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[96px]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
