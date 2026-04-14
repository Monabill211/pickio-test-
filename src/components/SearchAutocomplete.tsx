import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProducts } from '@/services/productService';
import { matchesSearch } from '@/utils/searchUtils';
import { formatPrice } from '@/utils/formatPrice';

interface SearchSuggestion {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  price: number;
  image: string;
  category?: string;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  className,
  onClose,
}) => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch products for suggestions
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'visible'],
    queryFn: () => getProducts({ visible: true }),
  });

  // Generate suggestions based on search query
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!value.trim() || value.length < 2) return [];

    const query = value.trim();
    const matchedProducts: SearchSuggestion[] = [];

    for (const product of products) {
      if (
        matchesSearch(product.name_ar || '', query) ||
        matchesSearch(product.name_en || '', query) ||
        matchesSearch(product.description_ar || '', query) ||
        matchesSearch(product.description_en || '', query)
      ) {
        matchedProducts.push({
          id: product.id,
          name: language === 'ar' ? product.name_ar : product.name_en,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: product.price,
          image: product.images?.[0] || product.image || '',
          category: product.category,
        });

        // Limit to 8 suggestions
        if (matchedProducts.length >= 8) break;
      }
    }

    return matchedProducts;
  }, [value, products, language]);

  // Show suggestions when typing
  useEffect(() => {
    setIsOpen(value.trim().length >= 2 && suggestions.length > 0);
    setSelectedIndex(-1);
  }, [value, suggestions.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && value.trim()) {
        onSubmit(value.trim());
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (value.trim()) {
          onSubmit(value.trim());
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        onClose?.();
        break;
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange(suggestion.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    navigate(`/product/${suggestion.id}`);
    onClose?.();
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setIsOpen(false);
      onClose?.();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <div className="relative">
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10',
            isRTL ? 'right-3' : 'left-3'
          )}
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          className={cn(
            'h-10 bg-muted/50 border-0',
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          )}
        />

        {/* Suggestions Dropdown */}
        {isOpen && (
          <div
            ref={suggestionsRef}
            className={cn(
              'absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto',
              isRTL ? 'text-right' : 'text-left'
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left',
                      selectedIndex === index && 'bg-muted',
                      isRTL && 'flex-row-reverse text-right'
                    )}
                  >
                    {suggestion.image && (
                      <img
                        src={suggestion.image}
                        alt={suggestion.name}
                        className="h-12 w-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {suggestion.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(suggestion.price)}
                      </p>
                    </div>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 text-muted-foreground flex-shrink-0',
                        isRTL && 'rotate-180'
                      )}
                    />
                  </button>
                ))}
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSubmit(value.trim());
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-muted transition-colors',
                      isRTL && 'flex-row-reverse'
                    )}
                  >
                    <Search className="h-4 w-4" />
                    {isRTL
                      ? `عرض جميع النتائج لـ "${value}"`
                      : `View all results for "${value}"`}
                  </button>
                </div>
              </div>
            ) : value.trim().length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                {isRTL
                  ? 'لا توجد نتائج'
                  : 'No results found'}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchAutocomplete;
