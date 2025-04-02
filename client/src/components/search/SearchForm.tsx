import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { searchSchema } from "@shared/schema";

const interestOptions = [
  { value: "Música", label: "Música" },
  { value: "Gastronomia", label: "Gastronomia" },
  { value: "Esportes", label: "Esportes" },
  { value: "Cinema", label: "Cinema" },
  { value: "Arte", label: "Arte" },
  { value: "Viagem", label: "Viagem" },
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Networking", label: "Networking" },
];

const formSchema = searchSchema.extend({
  date: z.date().optional(),
});

type SearchFormValues = z.infer<typeof formSchema>;

const SearchForm = () => {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      interest: "all",
      date: undefined,
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams();
    
    if (values.location) {
      params.append("location", values.location);
    }
    
    if (values.interest && values.interest !== "all") {
      params.append("interest", values.interest);
    }
    
    if (values.date) {
      params.append("date", format(values.date, "yyyy-MM-dd"));
    }
    
    setLocation(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">Localização</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Cidade ou bairro"
                        className="pl-4 pr-10 py-3 bg-neutral-50"
                        {...field}
                      />
                    </FormControl>
                    <MapPin className="h-5 w-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">Data</FormLabel>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full py-3 px-4 bg-neutral-50 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                          }}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">Interesse</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="py-3 bg-neutral-50">
                        <SelectValue placeholder="Selecione um interesse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos os interesses</SelectItem>
                      {interestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out">
            Buscar Amigos
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;
