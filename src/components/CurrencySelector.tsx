import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency } from "@/services/metalApi";

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-24 bg-card/50 border-primary/20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover border-primary/20">
        <SelectItem value="INR" className="hover:bg-primary/10">
          INR
        </SelectItem>
        <SelectItem value="USD" className="hover:bg-primary/10">
          USD
        </SelectItem>
      </SelectContent>
    </Select>
  );
}