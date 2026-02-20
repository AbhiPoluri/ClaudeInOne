# SvelteKit

Compiler-based framework that writes less code with true reactivity.

## Reactive Variables

```svelte
<script>
  let count = 0;
  
  // Reactive assignment (compiler magic)
  $: doubled = count * 2;
  
  // Reactive statement
  $: if (count > 5) {
    console.log('Count is high!');
  }
  
  function increment() {
    count++; // Direct mutation, triggers reactivity
  }
</script>

<button on:click={increment}>
  Clicks: {count}, Doubled: {doubled}
</button>
```

## Component Props

```svelte
<script>
  export let user;
  export let age = 18; // Default value
</script>

<p>{user}, age {age}</p>
```

## Stores (Reactive)

```javascript
// stores.js
import { writable, derived } from 'svelte/store';

export const count = writable(0);
export const doubled = derived(count, $count => $count * 2);

// In component
<script>
  import { count, doubled } from './stores';
</script>

<p>{$count}</p>
<p>{$doubled}</p>
```

## SvelteKit Routing

```
src/routes/
├── +page.svelte         # /
├── about/
│   └── +page.svelte     # /about
├── posts/
│   ├── +page.svelte     # /posts
│   └── [id]/
│       └── +page.svelte # /posts/[id]
└── api/
    └── users/
        └── +server.js   # API route
```

## Form Actions

```svelte
<!-- +page.svelte -->
<form method="POST">
  <input name="title" required />
  <button>Submit</button>
</form>

<!-- +page.server.js -->
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    // Process data
    return { success: true };
  }
};
```

## Animations & Transitions

```svelte
<script>
  import { fade, slide } from 'svelte/transition';
</script>

<div transition:fade={{ duration: 300 }}>
  Fading in/out
</div>

<div transition:slide={{ duration: 400 }}>
  Sliding in/out
</div>
```

## Best Practices

1. Embrace compiler reactivity
2. Use stores for shared state
3. Keep components simple
4. Leverage TypeScript
5. Use +server.js for API routes

## Resources

- [SvelteKit Docs](https://kit.svelte.dev/)
- [Svelte Tutorial](https://svelte.dev/tutorial)
