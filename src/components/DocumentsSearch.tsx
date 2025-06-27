
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface DocumentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DocumentsSearch = ({ searchTerm, onSearchChange }: DocumentsSearchProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar documentos por número, cliente o empresa..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSearch;
