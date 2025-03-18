
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface LoteSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const LoteSelector: React.FC<LoteSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <label htmlFor="lote-select" className="text-base md:text-lg">
        Vengo al Lote
      </label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger 
          id="lote-select" 
          className="w-full h-12 mt-1 bg-white border-centauro-blue text-base"
        >
          <SelectValue placeholder="Seleccione un lote" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="14" className="text-base py-3">
            Lote 14
          </SelectItem>
          <SelectItem value="49" className="text-base py-3">
            Lote 49
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LoteSelector;
