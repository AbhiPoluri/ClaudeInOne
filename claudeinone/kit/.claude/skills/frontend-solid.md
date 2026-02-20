# SolidJS

## Overview
SolidJS is a reactive UI library with no virtual DOM — updates are compiled to precise DOM operations for maximum performance.

## Setup

```bash
npx degit solidjs/templates/ts my-app
cd my-app && npm install && npm run dev
```

## Signals (Reactive Primitives)

```tsx
import { createSignal, createEffect, createMemo, Show, For } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);

  createEffect(() => {
    console.log('Count changed:', count());
  });

  return (
    <div>
      <p>Count: {count()}, Doubled: {doubled()}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

## Stores (Complex State)

```tsx
import { createStore } from 'solid-js/store';

interface Todo { id: number; text: string; done: boolean; }

function TodoApp() {
  const [todos, setTodos] = createStore<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos(todos.length, { id: Date.now(), text, done: false });
  };

  const toggleTodo = (id: number) => {
    setTodos(t => t.id === id, 'done', d => !d);
  };

  return (
    <div>
      <button onClick={() => addTodo('New todo')}>Add</button>
      <For each={todos}>
        {(todo) => (
          <div onClick={() => toggleTodo(todo.id)}
               style={{ 'text-decoration': todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </div>
        )}
      </For>
    </div>
  );
}
```

## Async Data with createResource

```tsx
import { createResource, Suspense } from 'solid-js';

async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

function UserProfile(props: { id: string }) {
  const [user] = createResource(() => props.id, fetchUser);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Show when={user()} keyed>
        {(u) => <h1>{u.name}</h1>}
      </Show>
    </Suspense>
  );
}
```

## Best Practices
- Signals are functions — call them `count()` to read, `setCount(n)` to write
- Use `<For>` not `.map()` — it's keyed and efficient
- Use `createMemo` for derived values (like `useMemo` in React)
- Never destructure props — SolidJS tracks property access reactively

## Resources
- [SolidJS docs](https://docs.solidjs.com)
