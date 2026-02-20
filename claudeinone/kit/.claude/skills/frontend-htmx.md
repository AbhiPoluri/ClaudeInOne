# HTMX

## Overview
HTMX extends HTML with AJAX, WebSockets, and SSE attributes — no JavaScript required for common patterns.

## Core Attributes

```html
<!-- GET request on click, swap into #result -->
<button hx-get="/api/users" hx-target="#result" hx-swap="innerHTML">
  Load Users
</button>
<div id="result"></div>

<!-- POST form, replace form with response -->
<form hx-post="/api/users" hx-target="#user-list" hx-swap="beforeend">
  <input name="email" type="email" required />
  <input name="name" required />
  <button type="submit">Add User</button>
</form>

<!-- Delete with confirmation, remove row -->
<tr id="user-1">
  <td>John</td>
  <td>
    <button hx-delete="/api/users/1"
            hx-confirm="Delete this user?"
            hx-target="#user-1"
            hx-swap="outerHTML">Delete</button>
  </td>
</tr>

<!-- Live search with debounce -->
<input type="search" name="q"
       hx-get="/api/search"
       hx-trigger="keyup changed delay:300ms"
       hx-target="#results" />
```

## Server Response (Express/Node.js)

```typescript
import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));

// Return HTML fragments
app.get('/api/users', async (req, res) => {
  const users = await db.user.findMany();
  const html = users.map(u => `<li>${u.name} (${u.email})</li>`).join('');
  res.send(`<ul>${html}</ul>`);
});

app.post('/api/users', async (req, res) => {
  const user = await db.user.create({ data: req.body });
  res.send(`<li id="user-${user.id}">${user.name}</li>`);
});

app.delete('/api/users/:id', async (req, res) => {
  await db.user.delete({ where: { id: req.params.id } });
  res.send(''); // Empty response removes the element
});
```

## Loading Indicators

```html
<button hx-get="/api/slow-data" hx-target="#result">
  Load Data
  <span class="htmx-indicator">Loading...</span>
</button>
```

```css
.htmx-indicator { display: none; }
.htmx-request .htmx-indicator { display: inline; }
```

## Best Practices
- Return HTML fragments, not JSON
- Use `hx-boost` on `<a>` and `<form>` tags to progressively enhance all links
- Combine with Alpine.js for local state that doesn't need server round-trips
- Use `HX-Trigger` response header to trigger events after requests

## Resources
- [HTMX docs](https://htmx.org/docs/)
