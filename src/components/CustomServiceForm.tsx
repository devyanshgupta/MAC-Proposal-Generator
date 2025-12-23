import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ServiceItem } from "@/data/servicesData";

interface CustomServiceFormProps {
  categories: string[];
  onAddService: (service: ServiceItem) => void;
}

export const CustomServiceForm = ({ categories, onAddService }: CustomServiceFormProps) => {
  const [service, setService] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [billingCycle, setBillingCycle] = useState<ServiceItem['billingCycle']>('One-off');
  const [category, setCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || price === "" || (!category && !newCategory)) {
      // Basic validation
      return;
    }

    const finalCategory = isNewCategory ? newCategory : category;
    if (!finalCategory) return;

    const newService = {
      service,
      price: Number(price),
      billingCycle,
      category: finalCategory,
    };

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });
      const addedService = await response.json();
      onAddService(addedService);

      // Reset form
      setService("");
      setPrice("");
      setCategory("");
      setNewCategory("");
      setIsNewCategory(false);
    } catch (error) {
      console.error("Error adding service:", error);
    }
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
            <Select onValueChange={(value: ServiceItem['billingCycle']) => setBillingCycle(value)} value={billingCycle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="One-off">One-off</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
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
