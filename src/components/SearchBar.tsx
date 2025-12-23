import { Input } from "./ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
