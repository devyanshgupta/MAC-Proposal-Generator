import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ServiceItem } from "@/data/servicesData";

interface CustomServiceFormProps {
  categories: string[];
  billingCycles: string[];
  onAddService: (service: ServiceItem) => void;
}

export const CustomServiceForm = ({ categories, billingCycles, onAddService }: CustomServiceFormProps) => {
  const [service, setService] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [billingCycle, setBillingCycle] = useState<ServiceItem['billingCycle']>('One-off');
  const [category, setCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isNewBillingCycle, setIsNewBillingCycle] = useState(false);
  const [newBillingCycle, setNewBillingCycle] = useState("");

  const handleBillingCycleChange = (value: string) => {
    if (value === 'custom') {
      setIsNewBillingCycle(true);
      setBillingCycle('');
    } else {
      setIsNewBillingCycle(false);
      setBillingCycle(value as ServiceItem['billingCycle']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isNewCategory ? newCategory : category;
    const finalBillingCycle = isNewBillingCycle ? newBillingCycle : billingCycle;

    if (!service || price === "" || !finalCategory || !finalBillingCycle) {
      // Basic validation
      return;
    }

    const newService: ServiceItem = {
      id: `custom-${Date.now()}`, // Add a unique ID for custom services
      service,
      price: Number(price),
      billingCycle: finalBillingCycle as ServiceItem['billingCycle'],
      category: finalCategory,
    };

    onAddService(newService);

    // Reset form
    setService("");
    setPrice("");
    setCategory("");
    setNewCategory("");
    setIsNewCategory(false);
    setBillingCycle('One-off');
    setNewBillingCycle("");
    setIsNewBillingCycle(false);
  };

  return (
    <div className="mt-16 p-8 border-t border-border bg-muted/20 rounded-lg">
      <h3 className="text-2xl font-bold text-foreground mb-6">Add a Custom Service</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            {isNewCategory ? (
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            ) : (
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an existing category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              type="button"
              variant="link"
              className="px-0 h-auto text-sm"
              onClick={() => {
                setIsNewCategory(!isNewCategory);
                setCategory("");
                setNewCategory("");
              }}
            >
              {isNewCategory ? "Or select an existing one" : "Or create a new category"}
            </Button>
          </div>

          {/* Billing Cycle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Billing Cycle</label>
            {isNewBillingCycle ? (
              <Input
                placeholder="Enter new billing cycle"
                value={newBillingCycle}
                onChange={(e) => setNewBillingCycle(e.target.value)}
                required
              />
            ) : (
              <Select onValueChange={handleBillingCycleChange} value={billingCycle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {billingCycles.map((cycle) => (
                    <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                  ))}
                  <SelectItem value="custom">Create a new billing cycle</SelectItem>
                </SelectContent>
              </Select>
            )}
             <Button
              type="button"
              variant="link"
              className="px-0 h-auto text-sm"
              onClick={() => {
                setIsNewBillingCycle(!isNewBillingCycle);
                setBillingCycle('One-off');
                setNewBillingCycle("");
              }}
            >
              {isNewBillingCycle ? "Or select an existing one" : "Or create a new billing cycle"}
            </Button>
          </div>
        </div>

        {/* Service Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Service Description</label>
          <Textarea
            placeholder="e.g., Custom analytics dashboard"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="h-24"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Price</label>
          <Input
            type="number"
            placeholder="e.g., 1500"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            required
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Add Service
        </Button>
      </form>
    </div>
  );
};
