# Accessibility Testing

Ensuring applications are usable by everyone.

## Automated Testing

```typescript
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Manual Testing Checklist

```
Keyboard Navigation:
✓ All interactive elements are keyboard accessible
✓ Tab order is logical
✓ Focus is visible
✓ Can close modals with ESC

Color & Contrast:
✓ Text contrast ratio ≥ 4.5:1 (normal text)
✓ Text contrast ratio ≥ 3:1 (large text)
✓ Information is not conveyed by color alone

Screen Readers:
✓ Page has proper heading hierarchy
✓ Images have alt text
✓ Form labels are associated with inputs
✓ Dynamic content is announced
```

## Screen Reader Testing

```typescript
// Semantic HTML
<form>
  <label htmlFor="email">Email:</label>
  <input id="email" type="email" required />

  <label htmlFor="password">Password:</label>
  <input id="password" type="password" required />

  <button type="submit">Sign In</button>
</form>

// ARIA when semantic HTML isn't enough
<button aria-label="Close menu">×</button>
<div role="alert">{errorMessage}</div>
<div aria-live="polite">{statusMessage}</div>
```

## WebAIM Tools

```bash
# Install accessibility testing tools
npm install -D @testing-library/jest-dom axe-core jest-axe pa11y

# Run pa11y
pa11y http://localhost:3000
```

## Color Contrast Checker

```typescript
function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;

    const [rs, gs, bs] = [r, g, b].map(x => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Usage
const ratio = getContrastRatio('#333333', '#ffffff');
console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);
```

## Best Practices

✅ **Use semantic HTML** - `<button>` not `<div onClick>`
✅ **Alt text for images** - Describe image content
✅ **Form labels** - Associate with inputs
✅ **Keyboard navigation** - Navigate without mouse
✅ **Color not only** - Don't convey info via color alone
✅ **Focus visible** - Clear focus indicator
✅ **Sufficient contrast** - WCAG AA standard

## Resources

- [WebAIM](https://webaim.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
