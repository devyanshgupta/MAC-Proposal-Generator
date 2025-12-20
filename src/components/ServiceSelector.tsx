import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryHeading } from "./CategoryHeading";
import { ServiceItem } from "./ServiceItem";
import { TotalBar } from "./TotalBar";
import { categories, getServicesByCategory, ServiceItem as ServiceItemType } from "@/data/servicesData";

export const ServiceSelector = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const container = contentRef.current;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    let closestCategory = 0;
    let closestDistance = Infinity;

    categoryRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const elementTop = ref.offsetTop - container.offsetTop;
      const distance = Math.abs(elementTop - containerTop - containerHeight / 4);
      
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
    if (ref && contentRef.current) {
      contentRef.current.scrollTo({
        top: ref.offsetTop - contentRef.current.offsetTop,
        behavior: "smooth"
      });
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    categories.forEach(category => {
      getServicesByCategory(category).forEach(service => {
        if (selectedServices.has(service.id)) {
          total += service.price;
        }
      });
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-lg font-semibold text-foreground">Service Configurator</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Panel - Categories */}
        <aside className="w-64 lg:w-80 shrink-0 sticky top-20 h-[calc(100vh-120px)] hidden md:flex flex-col justify-center px-6 py-8">
          <nav className="space-y-3">
            {categories.map((category, index) => (
              <CategoryHeading
                key={category}
                category={category}
                isActive={index === activeCategory}
                distance={Math.abs(index - activeCategory)}
                onClick={() => scrollToCategory(index)}
              />
            ))}
          </nav>
        </aside>

        {/* Middle & Right Panel - Services with Prices */}
        <main 
          ref={contentRef}
          className="flex-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide px-6 lg:px-12 py-8"
        >
          {categories.map((category, categoryIndex) => {
            const services = getServicesByCategory(category);
            
            return (
              <div
                key={category}
                ref={el => categoryRefs.current[categoryIndex] = el}
                className="mb-16 last:mb-32"
              >
                {/* Mobile category header */}
                <motion.h2 
                  className="md:hidden text-2xl font-bold text-foreground mb-6 sticky top-0 bg-background/95 backdrop-blur-sm py-3 -mx-6 px-6 border-b border-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {category}
                </motion.h2>

                {/* Services list */}
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
                          price={service.price}
                          isSelected={selectedServices.has(service.id)}
                          onToggle={() => toggleService(service.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </main>
      </div>

      {/* Total Bar */}
      <TotalBar 
        total={calculateTotal()} 
        selectedCount={selectedServices.size}
      />
    </div>
  );
};
