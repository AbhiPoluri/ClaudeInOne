# HTML & CSS Fundamentals

Core web technologies for structure and styling.

## HTML5 Semantic Markup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Article Title</h1>
      <section>
        <h2>Section Heading</h2>
        <p>Content here...</p>
      </section>
    </article>

    <aside>
      <h3>Related</h3>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 Company</p>
  </footer>
</body>
</html>
```

## CSS Flexbox

```css
/* Flexible layout */
.container {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.item {
  flex: 1; /* Grow equally */
  flex-basis: 200px; /* Minimum size */
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

## CSS Grid

```css
/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  grid-auto-rows: auto;
}

.grid-item {
  grid-column: span 1;
}

/* Named grid areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
}

header { grid-area: header; }
aside { grid-area: sidebar; }
main { grid-area: main; }
footer { grid-area: footer; }
```

## Accessibility (a11y)

```html
<!-- Semantic HTML -->
<button>Click me</button> <!-- Not <div onClick="..."> -->

<!-- ARIA labels -->
<img src="logo.png" alt="Company Logo">
<button aria-label="Close menu">×</button>

<!-- Form labels -->
<label for="email">Email:</label>
<input id="email" type="email" required>

<!-- Skip navigation -->
<a href="#main" class="sr-only">Skip to main</a>

<!-- Color contrast -->
<style>
  body { color: #333; background: #fff; } /* 21:1 ratio */
</style>
```

## Responsive Design

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    width: 90%;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}

/* Responsive typography */
html {
  font-size: clamp(16px, 2.5vw, 20px);
}

h1 {
  font-size: clamp(28px, 8vw, 48px);
}
```

## CSS Custom Properties

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --spacing-unit: 1rem;
  --border-radius: 0.5rem;
}

body {
  color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
}

button {
  border-radius: var(--border-radius);
  background: var(--primary-color);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #60a5fa;
    --secondary-color: #34d399;
  }
}
```

## Performance

```css
/* Optimize animations */
.animated {
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
  animation: slide 0.3s ease-out;
}

/* Avoid expensive operations */
/* Bad: Many reflows */
/* Good: Batch updates */
.parent {
  contain: layout style paint;
}

/* Critical CSS inline */
<style>
  /* Above-fold critical styles */
</style>
<link rel="stylesheet" href="main.css">
```

## Best Practices

✅ **Semantic HTML** - Use meaningful tags
✅ **Mobile-first** - Design for small screens first
✅ **Accessibility** - WCAG standards
✅ **Responsive** - Works on all screen sizes
✅ **Performance** - Minimal CSS, avoid layout thrashing

## Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)
