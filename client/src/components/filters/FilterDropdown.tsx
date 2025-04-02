import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface FilterDropdownProps {
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterChange?: (filter: string, value: string) => void;
  currentFilters?: Record<string, string>;
}

export default function FilterDropdown({
  sortValue,
  onSortChange,
  onFilterChange,
  currentFilters = {},
}: FilterDropdownProps) {
  const handleVerificationFilter = (value: string) => {
    if (onFilterChange) {
      onFilterChange("verified", value);
    }
  };

  const handleRatingFilter = (value: string) => {
    if (onFilterChange) {
      onFilterChange("minRating", value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar por
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sortValue} onValueChange={onSortChange}>
          <DropdownMenuRadioItem value="rating">Melhor avaliação</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price_asc">Menor preço</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price_desc">Maior preço</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="reviews">Mais avaliações</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Filtros</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex flex-col w-full">
              <span className="mb-1">Verificação</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={currentFilters.verified === "true" ? "default" : "outline"}
                  onClick={() => handleVerificationFilter("true")}
                  className="text-xs h-7"
                >
                  Verificados
                </Button>
                <Button 
                  size="sm" 
                  variant={currentFilters.verified === "all" ? "default" : "outline"}
                  onClick={() => handleVerificationFilter("all")}
                  className="text-xs h-7"
                >
                  Todos
                </Button>
              </div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <div className="flex flex-col w-full">
              <span className="mb-1">Avaliação mínima</span>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    size="sm"
                    variant={currentFilters.minRating === rating.toString() ? "default" : "outline"}
                    onClick={() => handleRatingFilter(rating.toString())}
                    className="text-xs h-7 w-7 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
