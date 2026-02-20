# WCAG & Accessibility Standards

Web Content Accessibility Guidelines compliance.

## WCAG Levels

```
WCAG 2.1 has three levels:
- Level A: Basic accessibility
- Level AA: Enhanced accessibility (recommended)
- Level AAA: Advanced accessibility
```

## Perceivable

```html
<!-- Images need alt text -->
<img src="dog.jpg" alt="Brown dog playing in park">

<!-- Color not only indicator -->
<label>
  <input type="checkbox"> Required field
</label>
<!-- Don't rely only on color -->

<!-- Captions for video -->
<video>
  <track kind="captions" src="captions.vtt">
</video>

<!-- Sufficient contrast -->
<style>
  body { color: #333; background: #fff; } /* 21:1 ratio */
</style>
```

## Operable

```html
<!-- Keyboard navigation -->
<button>Accessible button</button>
<a href="/page">Link</a>

<!-- Skip navigation -->
<a href="#main" class="skip-link">Skip to main</a>

<!-- Focus visible -->
<style>
  button:focus-visible {
    outline: 2px solid blue;
  }
</style>

<!-- Sufficient time -->
<!-- No auto-refreshing content -->
```

## Understandable

```html
<!-- Clear language -->
<label for="email">Email address</label>
<input id="email" type="email" required>

<!-- Consistent navigation -->
<!-- Menu in same location -->

<!-- Error prevention -->
<input type="email" required>
<span class="error" role="alert">Invalid email</span>
```

## Robust

```html
<!-- Valid HTML -->
<div role="navigation">Menu</div>

<!-- ARIA labels -->
<button aria-label="Close menu">×</button>

<!-- Semantic HTML -->
<nav>Navigation</nav>
<main>Main content</main>
<footer>Footer</footer>
```

## Testing Checklist

- [ ] Keyboard navigation works
- [ ] Color contrast ≥ 4.5:1
- [ ] All images have alt text
- [ ] Form labels associated
- [ ] Focus indicator visible
- [ ] No auto-playing content
- [ ] Heading hierarchy correct
- [ ] Links descriptive

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Best Practices](https://www.w3.org/WAI/ARIA/apg/)
