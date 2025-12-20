import { motion } from "framer-motion";

export const ClientInfo = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="client-name" className="text-sm font-medium text-foreground/70 mb-2">
              Client Name
            </label>
            <input
              id="client-name"
              type="text"
              placeholder="Enter client name"
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
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
