import { FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

const SearchInput = ({
  placeholder = 'Tìm kiếm...',
  value: externalValue,
  onChange,
  debounceMs = 300,
  className = '',
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue, debounceMs]);

  return (
    <div className={`flex items-center bg-white rounded-xl px-3 py-2.5 gap-2 border border-slate-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all ${className}`}>
      <FiSearch className="text-slate-400 text-sm flex-shrink-0" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder-slate-400"
      />
    </div>
  );
};

export default SearchInput;
