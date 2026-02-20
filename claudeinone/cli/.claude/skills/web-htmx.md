# HTMX

Modern interactions with HTML attributes.

## Setup

```html
<script src="https://unpkg.com/htmx.org"></script>
```

## Basic Usage

```html
<!-- Load content on click -->
<button hx-get="/api/users" hx-target="#users">
  Load Users
</button>
<div id="users"></div>

<!-- Form submission -->
<form hx-post="/api/users" hx-target="#result">
  <input name="email" type="email" required>
  <button type="submit">Add User</button>
</form>
<div id="result"></div>

<!-- Polling -->
<div hx-get="/api/status" hx-trigger="every 2s">
  Status will update every 2 seconds
</div>

<!-- Swapping strategies -->
<div hx-get="/content" hx-swap="innerHTML swap:1s">
  Replace content with 1s animation
</div>

<div hx-get="/append" hx-swap="beforeend">
  Append to existing content
</div>
```

## Server Response

```typescript
app.get('/api/users', (req, res) => {
  const html = `
    <div class="user-list">
      <div class="user">John Doe</div>
      <div class="user">Jane Smith</div>
    </div>
  `;
  res.send(html);
});

app.post('/api/users', (req, res) => {
  // Process form data
  const html = '<div class="success">User added!</div>';
  res.send(html);
});
```

## Advanced Features

```html
<!-- Validation feedback -->
<form hx-post="/validate" hx-trigger="change">
  <input name="username" hx-validate="/api/check-username">
  <span id="error"></span>
</form>

<!-- Progress indicator -->
<form hx-post="/upload" hx-indicator="#spinner">
  <input type="file" name="file">
  <div id="spinner" class="htmx-indicator">Uploading...</div>
</form>

<!-- History -->
<button hx-push-url="true" hx-get="/page/1">
  Page 1
</button>

<!-- Request headers -->
<button hx-get="/data" hx-headers='{"X-Custom": "value"}'>
  Get Data
</button>
```

## Best Practices

✅ **Progressive enhancement** - Works without JS
✅ **Server-side rendering** - Minimal client-side state
✅ **Accessibility** - Semantic HTML
✅ **Performance** - Lightweight library (14kb)
✅ **Simplicity** - HTML-driven interactions

## Resources

- [HTMX Documentation](https://htmx.org/)
- [Examples](https://htmx.org/examples/)
