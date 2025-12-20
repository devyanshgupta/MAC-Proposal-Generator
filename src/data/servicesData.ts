export interface ServiceItem {
  id: string;
  category: string;
  service: string;
  price: number;
}

export const servicesData: ServiceItem[] = [
  // Web Development
  { id: "web-1", category: "Web Development", service: "Custom landing page design & development", price: 2500 },
  { id: "web-2", category: "Web Development", service: "E-commerce store setup with payment integration", price: 8000 },
  { id: "web-3", category: "Web Development", service: "Progressive web app development", price: 12000 },
  { id: "web-4", category: "Web Development", service: "API integration & backend services", price: 5000 },
  { id: "web-5", category: "Web Development", service: "Website performance optimization", price: 1500 },

  // Mobile Apps
  { id: "mobile-1", category: "Mobile Apps", service: "iOS native application development", price: 25000 },
  { id: "mobile-2", category: "Mobile Apps", service: "Android native application development", price: 22000 },
  { id: "mobile-3", category: "Mobile Apps", service: "Cross-platform React Native app", price: 18000 },
  { id: "mobile-4", category: "Mobile Apps", service: "App store submission & optimization", price: 800 },
  { id: "mobile-5", category: "Mobile Apps", service: "Push notification system integration", price: 2000 },

  // Brand Identity
  { id: "brand-1", category: "Brand Identity", service: "Logo design with brand guidelines", price: 3500 },
  { id: "brand-2", category: "Brand Identity", service: "Complete visual identity package", price: 8000 },
  { id: "brand-3", category: "Brand Identity", service: "Brand strategy & positioning", price: 5000 },
  { id: "brand-4", category: "Brand Identity", service: "Stationery & collateral design", price: 2000 },

  // UI/UX Design
  { id: "ux-1", category: "UI/UX Design", service: "User research & persona development", price: 4000 },
  { id: "ux-2", category: "UI/UX Design", service: "Wireframing & prototyping", price: 3500 },
  { id: "ux-3", category: "UI/UX Design", service: "High-fidelity UI design", price: 6000 },
  { id: "ux-4", category: "UI/UX Design", service: "Design system creation", price: 8000 },
  { id: "ux-5", category: "UI/UX Design", service: "Usability testing & iteration", price: 3000 },

  // Marketing
  { id: "mkt-1", category: "Marketing", service: "Social media strategy & management", price: 2500 },
  { id: "mkt-2", category: "Marketing", service: "Content marketing & copywriting", price: 3000 },
  { id: "mkt-3", category: "Marketing", service: "SEO optimization package", price: 4000 },
  { id: "mkt-4", category: "Marketing", service: "Email marketing campaigns", price: 1800 },
  { id: "mkt-5", category: "Marketing", service: "Paid advertising management", price: 2000 },

  // Consulting
  { id: "cons-1", category: "Consulting", service: "Technical architecture review", price: 3500 },
  { id: "cons-2", category: "Consulting", service: "Digital transformation strategy", price: 10000 },
  { id: "cons-3", category: "Consulting", service: "Product roadmap planning", price: 5000 },
  { id: "cons-4", category: "Consulting", service: "Team training & workshops", price: 2500 },

  // Cloud Services
  { id: "cloud-1", category: "Cloud Services", service: "AWS/GCP infrastructure setup", price: 6000 },
  { id: "cloud-2", category: "Cloud Services", service: "CI/CD pipeline implementation", price: 4000 },
  { id: "cloud-3", category: "Cloud Services", service: "Database design & optimization", price: 5000 },
  { id: "cloud-4", category: "Cloud Services", service: "Security audit & hardening", price: 7000 },
  { id: "cloud-5", category: "Cloud Services", service: "24/7 monitoring & maintenance", price: 3000 },

  // Analytics
  { id: "ana-1", category: "Analytics", service: "Analytics setup & configuration", price: 2000 },
  { id: "ana-2", category: "Analytics", service: "Custom dashboard development", price: 4500 },
  { id: "ana-3", category: "Analytics", service: "Data visualization & reporting", price: 3500 },
  { id: "ana-4", category: "Analytics", service: "Conversion optimization", price: 3000 },
];

export const categories = [...new Set(servicesData.map(s => s.category))];

export const getServicesByCategory = (category: string) => 
  servicesData.filter(s => s.category === category);
