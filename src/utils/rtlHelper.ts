/**
 * RTL (Right-to-Left) Utilities
 * Provides consistent RTL support across the application
 */

import { cn } from '@/lib/utils';

/**
 * RTL-aware spacing classes
 */
export const rtlSpacing = {
  // Margin
  mrAuto: (isRTL: boolean) => isRTL ? 'ml-auto' : 'mr-auto',
  mlAuto: (isRTL: boolean) => isRTL ? 'mr-auto' : 'ml-auto',
  
  // Padding
  prX: (isRTL: boolean, value: string) => isRTL ? `pl-${value}` : `pr-${value}`,
  plX: (isRTL: boolean, value: string) => isRTL ? `pr-${value}` : `pl-${value}`,
};

/**
 * Get flexbox direction based on RTL
 */
export const getFlexDirection = (isRTL: boolean, reverse: boolean = false): string => {
  if (reverse) {
    return isRTL ? 'flex-row' : 'flex-row-reverse';
  }
  return isRTL ? 'flex-row-reverse' : 'flex-row';
};

/**
 * Get text alignment based on RTL
 */
export const getTextAlign = (isRTL: boolean, align: 'left' | 'right' | 'center' = 'left'): string => {
  if (align === 'center') return 'text-center';
  if (isRTL) {
    return align === 'left' ? 'text-right' : 'text-left';
  }
  return align === 'left' ? 'text-left' : 'text-right';
};

/**
 * Get start position (for positioned elements)
 */
export const getStart = (isRTL: boolean, value: string) => 
  isRTL ? { right: value } : { left: value };

/**
 * Get end position (for positioned elements)
 */
export const getEnd = (isRTL: boolean, value: string) => 
  isRTL ? { left: value } : { right: value };

/**
 * Get margin start (ms) or end (me)
 */
export const getMarginStart = (isRTL: boolean, value: string) => 
  isRTL ? { marginRight: value } : { marginLeft: value };

export const getMarginEnd = (isRTL: boolean, value: string) => 
  isRTL ? { marginLeft: value } : { marginRight: value };

/**
 * Get padding start (ps) or end (pe)
 */
export const getPaddingStart = (isRTL: boolean, value: string) => 
  isRTL ? { paddingRight: value } : { paddingLeft: value };

export const getPaddingEnd = (isRTL: boolean, value: string) => 
  isRTL ? { paddingLeft: value } : { paddingRight: value };

/**
 * Input field icon positioning
 */
export const getInputIconPosition = (isRTL: boolean) => ({
  start: isRTL ? { right: '0.75rem' } : { left: '0.75rem' },
  end: isRTL ? { left: '0.75rem' } : { right: '0.75rem' },
  startClass: isRTL ? 'right-3' : 'left-3',
  endClass: isRTL ? 'left-3' : 'right-3',
  startPaddingClass: isRTL ? 'pr-10' : 'pl-10',
  endPaddingClass: isRTL ? 'pl-10' : 'pr-10',
});

/**
 * Get transform origin for RTL
 */
export const getTransformOrigin = (isRTL: boolean, origin: 'start' | 'end' | 'center' = 'start'): string => {
  if (origin === 'center') return 'origin-center';
  if (isRTL) {
    return origin === 'start' ? 'origin-right' : 'origin-left';
  }
  return origin === 'start' ? 'origin-left' : 'origin-right';
};

/**
 * RTL-aware input field wrapper
 */
export const rtlInputClasses = (isRTL: boolean, hasIcon: 'start' | 'end' | 'both' | 'none' = 'none'): string => {
  let classes = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors';
  
  if (hasIcon === 'start') {
    classes += isRTL ? ' pr-10 pl-3' : ' pl-10 pr-3';
  } else if (hasIcon === 'end') {
    classes += isRTL ? ' pl-10 pr-3' : ' pr-10 pl-3';
  } else if (hasIcon === 'both') {
    classes += isRTL ? ' pr-10 pl-10' : ' pl-10 pr-10';
  }
  
  return classes;
};

/**
 * RTL-aware button row layout
 */
export const getButtonRowClass = (isRTL: boolean, justify: 'start' | 'end' | 'between' | 'center' = 'end'): string => {
  let justifyClass = 'justify-end';
  
  if (justify === 'start') {
    justifyClass = isRTL ? 'justify-end' : 'justify-start';
  } else if (justify === 'end') {
    justifyClass = isRTL ? 'justify-start' : 'justify-end';
  } else if (justify === 'between') {
    justifyClass = 'justify-between';
  } else if (justify === 'center') {
    justifyClass = 'justify-center';
  }
  
  return cn('flex gap-2', justifyClass);
};

/**
 * RTL-aware form label
 */
export const getFormLabelClass = (isRTL: boolean): string => {
  return cn(
    'block text-sm font-medium text-foreground mb-2',
    isRTL ? 'text-right' : 'text-left'
  );
};

/**
 * RTL-aware form field error text
 */
export const getFormErrorClass = (isRTL: boolean): string => {
  return cn(
    'text-xs text-destructive mt-1',
    isRTL ? 'text-right' : 'text-left'
  );
};

/**
 * RTL-aware badge positioning
 */
export const getBadgePositionClass = (isRTL: boolean, position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left'): string => {
  const positionMap = {
    'top-left': isRTL ? 'top-3 right-3' : 'top-3 left-3',
    'top-right': isRTL ? 'top-3 left-3' : 'top-3 right-3',
    'bottom-left': isRTL ? 'bottom-3 right-3' : 'bottom-3 left-3',
    'bottom-right': isRTL ? 'bottom-3 left-3' : 'bottom-3 right-3',
  };
  return 'absolute ' + positionMap[position];
};

/**
 * RTL-aware modal/drawer positioning
 */
export const getModalPositionClass = (isRTL: boolean, side: 'left' | 'right' = 'right'): string => {
  if (side === 'left') {
    return isRTL ? 'left-auto right-0 rounded-l-lg' : 'right-auto left-0 rounded-r-lg';
  }
  return isRTL ? 'right-auto left-0 rounded-r-lg' : 'left-auto right-0 rounded-l-lg';
};

/**
 * RTL-aware card layout
 */
export const getCardLayoutClass = (isRTL: boolean): string => {
  return cn(
    'rounded-2xl border border-border bg-card p-6 shadow-card',
    isRTL ? 'text-right' : 'text-left'
  );
};

/**
 * RTL-aware list item
 */
export const getListItemClass = (isRTL: boolean): string => {
  return cn(
    'flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors',
    isRTL ? 'flex-row-reverse' : 'flex-row'
  );
};

/**
 * RTL-aware grid for items
 */
export const getGridClass = (isRTL: boolean, columns: number = 2): string => {
  return `grid gap-4 ${`grid-cols-${columns}`}`;
};

/**
 * Create inline RTL styles object
 */
export const createRTLStyles = (isRTL: boolean, styles: { rtl: React.CSSProperties; ltr: React.CSSProperties }): React.CSSProperties => {
  return isRTL ? styles.rtl : styles.ltr;
};

/**
 * RTL-aware scroll behavior
 */
export const getScrollDirection = (isRTL: boolean): 'ltr' | 'rtl' => {
  return isRTL ? 'rtl' : 'ltr';
};

/**
 * Combine multiple RTL conditions with cn()
 */
export const cnRtl = (isRTL: boolean, rtlClasses: string, ltrClasses: string, baseClasses?: string): string => {
  return cn(baseClasses || '', isRTL ? rtlClasses : ltrClasses);
};

/**
 * RTL-aware responsive grid
 */
export const getResponsiveGridClass = (isRTL: boolean): string => {
  return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
};

/**
 * RTL-aware form group
 */
export const getFormGroupClass = (isRTL: boolean): string => {
  return cn(
    'space-y-2',
    isRTL ? 'text-right' : 'text-left'
  );
};
