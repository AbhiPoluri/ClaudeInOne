# Tailwind CSS v4

Utility-first CSS framework for rapid UI development.

## Basic Usage

```html
<div class="flex items-center justify-between p-4 bg-blue-500">
  <h1 class="text-2xl font-bold text-white">Header</h1>
  <button class="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Click Me
  </button>
</div>
```

## Layout

```html
<!-- Flex layout -->
<div class="flex gap-4">
  <div class="flex-1">Sidebar</div>
  <div class="flex-2">Main Content</div>
</div>

<!-- Grid layout -->
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Responsive Grid</div>
</div>
```

## Styling

```html
<!-- Colors -->
<div class="bg-blue-500 text-white">Blue Background</div>

<!-- Shadows & Borders -->
<div class="border border-gray-300 rounded-lg shadow-lg">Card</div>

<!-- Spacing -->
<div class="p-4 m-2">Padded and Margined</div>

<!-- Opacity & Hover -->
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 opacity-80">
  Interactive
</button>
```

## Dark Mode

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Toggles with dark mode
</div>

<!-- In CSS -->
<html class="dark">
  <!-- Content -->
</html>
```

## Custom Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF6B6B',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
};
```

## Best Practices

1. **Use utility classes**
2. **Avoid inline styles**
3. **Create component classes for reuse**
4. **Use @apply for custom components**
5. **Responsive-first design**
6. **Dark mode support**

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
