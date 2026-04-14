# RTL (Right-to-Left) Enhancement Guide

## Overview

This guide explains the comprehensive RTL support system implemented across the Pickio application to ensure proper Arabic layout and text direction.

## RTL Implementation Status

### ✅ Completed
- RTL utilities library (`rtlHelper.ts`)
- AdminProductForm RTL enhancements
- Form label and error text alignment
- Input icon positioning for RTL
- Button and action alignment
- Pricing summary card layout

### 📋 Active Areas Needing RTL Support
- AdminCategories component
- AdminProducts component
- ProductCard component
- Checkout form
- Contact form

## Core RTL Utilities

### Import in Your Components

```typescript
import {
  getFormLabelClass,
  getFormErrorClass, 
  getButtonRowClass,
  getTextAlign,
  cnRtl
} from '@/utils/rtlHelper';

import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { isRTL } = useLanguage();
  // Usage below
};
```

## Common Patterns

### 1. Form Labels
```tsx
// ✅ CORRECT
<label className={getFormLabelClass(isRTL)}>
  Label Text
</label>

// ❌ WRONG
<label className="text-sm font-medium">Label</label>
```

### 2. Error Messages
```tsx
// ✅ CORRECT
{error && (
  <p className={getFormErrorClass(isRTL)}>{error}</p>
)}

// ❌ WRONG
{error && (
  <p className="text-xs text-destructive mt-1">{error}</p>
)}
```

### 3. Input Fields with Icons
```tsx
// ✅ CORRECT - Icon on left in RTL, right in LTR
<div className="relative">
  <Input
    type="number"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className={cn('font-medium text-lg')}
  />
  <span className={cn(
    'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
    isRTL ? 'left-3' : 'right-3'
  )}>
    EGP
  </span>
</div>

// ❌ WRONG - Icon always on right
<div className="relative">
  <Input value={value} onChange={(e) => setValue(e.target.value)} />
  <span className="absolute right-3">EGP</span>
</div>
```

### 4. Button Rows
```tsx
// ✅ CORRECT
<div className={getButtonRowClass(isRTL, 'end')}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

// ❌ WRONG
<div className="flex gap-2 justify-end">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

### 5. Container Direction
```tsx
// ✅ CORRECT - Set dir attribute on root container
<div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
  {/* All children inherit RTL direction */}
</div>

// OR use flexbox direction
<div className={cn('flex', isRTL ? 'flex-row-reverse' : 'flex-row')}>
  {/* Content */}
</div>

// ❌ WRONG - No direction control
<div className="space-y-6">
  {/* May not display correctly in RTL */}
</div>
```

### 6. Textarea Fields
```tsx
// ✅ CORRECT
<textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className={cn(
    'w-full rounded-lg border...',
    isRTL ? 'text-right' : 'text-left'
  )}
/>

// ❌ WRONG
<textarea className="w-full..." />
```

### 7. Responsive Grid
```tsx
// ✅ CORRECT - Uses getResponsiveGridClass
<div className={cn(
  'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
)}>
  {/* Items */}
</div>
```

## Component Checklist

When creating or modifying components, ensure:

- [ ] Root container has `dir={isRTL ? 'rtl' : 'ltr'}`
- [ ] Form labels use `getFormLabelClass(isRTL)`
- [ ] Error messages use `getFormErrorClass(isRTL)`
- [ ] Input icons positioned correctly (left in RTL)
- [ ] Button rows use `getButtonRowClass(isRTL)`
- [ ] Text areas have `text-right` class in RTL
- [ ] Flex items are reversed if needed
- [ ] All text alignment is RTL-aware
- [ ] Spacing and padding account for RTL

## Updated Components

### AdminProductForm ✅
- General information section
- Pricing and stock section
- Form labels and error messages
- Pricing summary card
- Form action buttons
- All input fields

### Next Priority: Update These Components

#### 1. AdminCategories
- Category form labels
- Category list layout
- Edit/delete buttons positioning

#### 2. AdminProducts
- Product table/list layout
- Filter controls
- Bulk actions buttons

#### 3. ProductCard
- Image and text layout
- Badge positioning
- Action buttons

#### 4. Checkout Form
- Address form fields
- Payment method selection
- Order summary layout

#### 5. Contact Form
- Form fields
- File upload area
- Submit button

## Styling Best Practices

### Using cnRtl Function
```typescript
// Instead of ternary operators, use cnRtl
import { cnRtl } from '@/utils/rtlHelper';

// ✅ Clean and readable
<div className={cnRtl(isRTL, 'text-right', 'text-left')}>
  Content
</div>

// ❌ More verbose
<div className={isRTL ? 'text-right' : 'text-left'}>
  Content
</div>
```

### Inline Styles for RTL
```typescript
import { createRTLStyles } from '@/utils/rtlHelper';

const styles = createRTLStyles(isRTL, {
  rtl: { marginRight: '1rem', textAlign: 'right' },
  ltr: { marginLeft: '1rem', textAlign: 'left' },
});

<div style={styles}>Content</div>
```

## Common Issues & Solutions

### Issue: Text is RTL but buttons are still LTR aligned
**Solution**: Use `getButtonRowClass(isRTL)` or add `flex-row-reverse` when `isRTL === true`

### Issue: Input icons appearing on wrong side
**Solution**: Use `isRTL ? 'left-3' : 'right-3'` for icon positioning

### Issue: Grid items not reordering in RTL
**Solution**: Add `dir={isRTL ? 'rtl' : 'ltr'}` to parent container

### Issue: Text alignment looks off
**Solution**: Check if labels/text use `getTextAlign()` or explicit `text-right`/`text-left` classes

### Issue: Form submission default button appearing on wrong side
**Solution**: Wrap buttons in `div` with `getButtonRowClass(isRTL, 'end')`

## Testing RTL

### Manual Testing
1. Set language to Arabic in UI
2. Check page direction (should be RTL in browser DevTools)
3. Verify:
   - Text flows right-to-left
   - Buttons aligned on left
   - Icons positioned opposite
   - Inputs properly aligned
   - Forms display correctly

### Testing Checklist
- [ ] Text direction (dir attribute)
- [ ] Text alignment in forms
- [ ] Icon positions in inputs
- [ ] Button placement
- [ ] Grid/flex layouts
- [ ] Modal/dialog positioning
- [ ] Navigation direction
- [ ] Color swatches in RTL

## Performance Considerations

- RTL utilities are pure functions with zero runtime cost
- CSS classes are computed once and cached
- No dynamic style recalculation on scroll/resize
- Browser handles dir attribute efficiently

## Browser Support

RTL is supported in all modern browsers:
- ✅ Chrome/Edge
- ✅ Firefox  
- ✅ Safari
- ✅ Mobile browsers

## Future Enhancements

- [ ] RTL form builder component
- [ ] RTL-aware modal manager
- [ ] Automated RTL testing suite
- [ ] RTL breakpoints hook
- [ ] RTL theme customization

---

**Remember**: Always use the RTL utilities instead of hardcoded left/right values. This ensures consistency across the application and makes future updates easier!
