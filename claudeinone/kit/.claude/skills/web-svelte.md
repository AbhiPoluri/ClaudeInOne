# Svelte

Reactive compiler for building user interfaces with minimal boilerplate.

## Setup

```bash
npm create vite@latest my-app -- --template svelte
cd my-app
npm install
npm run dev
```

## Basic Component

```svelte
<script>
  let count = 0;
  let name = 'World';

  function increment() {
    count += 1;
  }

  $: doubled = count * 2;
</script>

<style>
  button {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button on:click={increment}>
    Increment
  </button>
</main>
```

## Reactivity

```svelte
<script>
  let todos = [];
  let input = '';

  // Reactive declaration
  $: incomplete = todos.filter(t => !t.completed).length;

  // Reactive statement
  $: if (incomplete === 0) {
    console.log('All done!');
  }

  function addTodo() {
    todos = [...todos, {
      id: Date.now(),
      text: input,
      completed: false
    }];
    input = '';
  }

  function toggleTodo(id) {
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
  }
</script>

<div>
  <input bind:value={input} placeholder="Add todo">
  <button on:click={addTodo}>Add</button>

  <ul>
    {#each todos as todo (todo.id)}
      <li class:done={todo.completed}>
        <input type="checkbox" bind:checked={todo.completed}>
        {todo.text}
      </li>
    {/each}
  </ul>

  <p>Incomplete: {incomplete}</p>
</div>
```

## Component Props

```svelte
<!-- Parent.svelte -->
<script>
  import Card from './Card.svelte';
</script>

<Card title="User Profile" subtitle="View details">
  <p>Card content here</p>
</Card>

<!-- Card.svelte -->
<script>
  export let title;
  export let subtitle = '';
</script>

<div class="card">
  <h2>{title}</h2>
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
  <slot></slot>
</div>
```

## Forms & Binding

```svelte
<script>
  let form = {
    email: '',
    password: '',
    remember: false,
    country: 'US'
  };

  function handleSubmit() {
    console.log('Form data:', form);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="email" bind:value={form.email} required>
  <input type="password" bind:value={form.password} required>
  
  <select bind:value={form.country}>
    <option value="US">United States</option>
    <option value="CA">Canada</option>
    <option value="UK">United Kingdom</option>
  </select>

  <label>
    <input type="checkbox" bind:checked={form.remember}>
    Remember me
  </label>

  <button type="submit">Login</button>
</form>
```

## Lifecycle

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';

  let count = 0;
  let unsubscribe;

  onMount(() => {
    // Component mounted
    const interval = setInterval(() => {
      count += 1;
    }, 1000);

    return () => clearInterval(interval);
  });

  onDestroy(() => {
    // Cleanup
    console.log('Component destroyed');
  });
</script>

<p>Count: {count}</p>
```

## SvelteKit Routing

```typescript
// +page.svelte
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.data.title}</h1>

<!-- +page.server.ts -->
export async function load({ params }) {
  return {
    title: 'Home',
    data: await fetchData()
  };
}
```

## Animations

```svelte
<script>
  import { fade, slide } from 'svelte/transition';

  let visible = true;
</script>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    <p transition:slide>Animated content</p>
  </div>
{/if}

<button on:click={() => visible = !visible}>Toggle</button>
```

## Best Practices

✅ **Reactive declarations** - Use $: for computed values
✅ **Component composition** - Break into small pieces
✅ **Stores** - For shared state across components
✅ **Scoped styles** - CSS is component-scoped by default
✅ **Performance** - Svelte compiles to optimized code

## Resources

- [Svelte Documentation](https://svelte.dev/)
- [SvelteKit](https://kit.svelte.dev/)
