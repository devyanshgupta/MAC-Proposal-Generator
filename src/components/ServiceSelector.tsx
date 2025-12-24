import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import { CategoryHeading } from "./CategoryHeading";
import { ServiceItem } from "./ServiceItem";
import { TotalBar } from "./TotalBar";
import { ClientInfo } from "./ClientInfo";
import { CustomServiceForm } from "./CustomServiceForm";
import { SearchBar } from "./SearchBar";
import { ServiceItem as ServiceItemType } from "@/data/servicesData";
import { ProposalDocument } from "@/pdf/ProposalDocument";
import { ProposalPayload, ProposalResponse } from "@/types/proposal";

export const ServiceSelector = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [allServices, setAllServices] = useState<ServiceItemType[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    gstin: "",
    address: "",
    din: "",
    preparedBy: "Mayur & Company Chartered Accountants",
    message: "Thank you for considering our firm. We look forward to delivering value through the services outlined below.",
    date: new Date().toISOString().slice(0, 10),
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setAllServices(data);
        const categories = [...new Set(data.map((s: ServiceItemType) => s.category))];
        setAllCategories(categories as string[]);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const getServicesByCategory = (category: string) =>
    allServices.filter(s =>
      s.category === category &&
      s.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;
    if (!contentRef.current) return;

    const container = contentRef.current;
    const containerTop = container.scrollTop;
    const anchor = containerTop + 96;

    let closestCategory = 0;
    let closestDistance = Infinity;

    categoryRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const distance = Math.abs(ref.offsetTop - anchor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCategory = index;
      }
    });

    setActiveCategory(closestCategory);
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToCategory = (index: number) => {
    const ref = categoryRefs.current[index];
    if (!ref) return;

    setActiveCategory(index);
    isScrollingRef.current = true;

    ref.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCustomPrices(prevPrices => {
          const newPrices = { ...prevPrices };
          delete newPrices[id];
          return newPrices;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCustomPriceChange = (id: string, price: number) => {
    setCustomPrices(prev => ({ ...prev, [id]: price }));
  };

  const addService = (service: ServiceItemType) => {
    setAllServices(prev => [...prev, service]);
    if (!allCategories.includes(service.category)) {
      setAllCategories(prev => [...prev, service.category]);
    }
    setSelectedServices(prev => new Set(prev).add(service.id));
  };

  const getCategorySelectionState = (category: string) => {
    const services = getServicesByCategory(category);
    const selectedCount = services.filter(s => selectedServices.has(s.id)).length;
    
    if (selectedCount === 0) return { checked: false, indeterminate: false };
    if (selectedCount === services.length && services.length > 0) return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
  };

  const toggleCategory = (category: string) => {
    const services = getServicesByCategory(category);
    const { checked } = getCategorySelectionState(category);
    
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (checked) {
        services.forEach(service => next.delete(service.id));
      } else {
        services.forEach(service => next.add(service.id));
      }
      return next;
    });
  };

  const calculateTotal = () => {
    return allServices.reduce((total, service) => {
      if (selectedServices.has(service.id)) {
        return total + (customPrices[service.id] ?? service.price);
      }
      return total;
    }, 0);
  };

  const handleClientFieldChange = (field: string, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const buildProposalPayload = (): ProposalPayload => {
    const selected = allServices.filter(s => selectedServices.has(s.id));
    return {
      client: {
        name: clientInfo.name,
        gstin: clientInfo.gstin,
        address: clientInfo.address,
        din: clientInfo.din,
      },
      proposal: {
        preparedFor: clientInfo.name || "Client",
        preparedBy: clientInfo.preparedBy,
        date: clientInfo.date,
        message: clientInfo.message,
      },
      services: selected.map((svc) => ({
        id: svc.id,
        category: svc.category,
        service: svc.service,
        billingCycle: svc.billingCycle,
        price: svc.price,
        discountedPrice: customPrices[svc.id] ?? svc.price,
      })),
    };
  };

  const handleGeneratePdf = async () => {
    if (selectedServices.size === 0) {
      alert("Select at least one service to generate a proposal.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = buildProposalPayload();
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate proposal data");
      }

      const normalized: ProposalResponse = await response.json();
      const blob = await pdf(<ProposalDocument data={normalized} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proposal-${payload.proposal.date || "today"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrepareProposal = async () => {
    if (!clientInfo.name || clientInfo.name.trim() === "") {
      alert("Please enter a client name to prepare the proposal.");
      return;
    }

    setIsPreparing(true);
    try {
      const response = await fetch("/api/proposal_letter/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: clientInfo.name }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate proposal letter");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proposal-${clientInfo.name.replace(/\s+/g, "_")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to prepare proposal. Please try again.");
    } finally {
      setIsPreparing(false);
    }
  };

  const filteredCategories = allCategories.filter(category => 
    getServicesByCategory(category).length > 0
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Company Logo" className="h-8 w-8" />
            <span className="font-bold text-foreground text-lg">
              Mayur & Company Chartered Accountants
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Service Proposal Maker
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        <aside className="w-72 lg:w-80 shrink-0 sticky top-20 h-[calc(100vh-120px)] hidden md:flex flex-col -ml-4 pl-0 pr-4 py-4 overflow-hidden">
          <div className="px-4 mb-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <nav className="space-y-2 overflow-y-auto">
            {filteredCategories.map((category, index) => {
              const selectionState = getCategorySelectionState(category);
              return (
                <CategoryHeading
                  key={category}
                  category={category}
                  isActive={index === activeCategory}
                  distance={Math.abs(index - activeCategory)}
                  onClick={() => scrollToCategory(index)}
                  checked={selectionState.checked}
                  indeterminate={selectionState.indeterminate}
                  onCheckboxChange={(e) => {
                    e.stopPropagation();
                    toggleCategory(category);
                  }}
                />
              );
            })}
          </nav>
        </aside>

        <main 
          ref={contentRef}
          className="flex-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide px-6 lg:px-12 py-8 scroll-pt-24 pb-24"
        >
          <ClientInfo
            clientName={clientInfo.name}
            gstin={clientInfo.gstin}
            address={clientInfo.address}
            din={clientInfo.din}
            preparedBy={clientInfo.preparedBy}
            proposalDate={clientInfo.date}
            greeting={clientInfo.message}
            onFieldChange={handleClientFieldChange}
          />
          <div className="md:hidden mb-8">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {filteredCategories.map((category, categoryIndex) => {
            const services = getServicesByCategory(category);
            if (services.length === 0) return null;
            
            return (
              <div
                key={category}
                ref={el => categoryRefs.current[allCategories.indexOf(category)] = el}
                className="mb-16"
              >
                <motion.h2 
                  className="md:hidden text-2xl font-bold text-foreground mb-6 sticky top-0 bg-background/95 backdrop-blur-sm py-3 -mx-6 px-6 border-b border-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {category}
                </motion.h2>

                <div className="divide-y divide-border/50">
                  <AnimatePresence mode="popLayout">
                    {services.map((service, serviceIndex) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: serviceIndex * 0.05 }}
                      >
                        <ServiceItem
                          id={service.id}
                          service={service.service}
                          price={customPrices[service.id] ?? service.price}
                          originalPrice={service.price}
                          billingCycle={service.billingCycle}
                          isSelected={selectedServices.has(service.id)}
                          onToggle={() => toggleService(service.id)}
                          onCustomPriceChange={(newPrice) => handleCustomPriceChange(service.id, newPrice)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
          
          <CustomServiceForm categories={allCategories} onAddService={addService} />
        </main>
      </div>

      <TotalBar 
        total={calculateTotal()} 
        selectedCount={selectedServices.size}
        onGeneratePdf={handleGeneratePdf}
        onPrepareProposal={handlePrepareProposal}
        isGenerating={isGenerating}
        isPreparing={isPreparing}
      />
    </div>
  );
};