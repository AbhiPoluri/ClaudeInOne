# Vue 3

Progressive JavaScript framework with reactive data binding and component-based architecture.

## Composition API (Recommended)

```javascript
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const doubled = computed(() => count.value * 2);

    const increment = () => {
      count.value++;
    };

    onMounted(() => {
      console.log('Component mounted');
    });

    return { count, doubled, increment };
  }
}
```

## Template Syntax

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+1</button>
    
    <div v-if="count > 5">Count is high!</div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
    
    <input v-model="message" />
  </div>
</template>
```

## Reactive Data

```javascript
import { ref, reactive, watch } from 'vue';

// ref for single values
const count = ref(0);

// reactive for objects
const state = reactive({
  user: { name: 'John', age: 30 },
  posts: []
});

// Watch for changes
watch(() => state.user.age, (newAge, oldAge) => {
  console.log(`Age changed from ${oldAge} to ${newAge}`);
});
```

## Props & Emits

```vue
<!-- Parent -->
<MyComponent :user="currentUser" @update="handleUpdate" />

<!-- Child -->
<script setup>
defineProps({
  user: { type: Object, required: true }
});
const emit = defineEmits(['update']);
</script>
```

## Pinia State Management

```javascript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
});

// Use in component
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();
counter.increment();
```

## Lifecycle Hooks

- `onBeforeMount`, `onMounted` - Mounting
- `onBeforeUpdate`, `onUpdated` - Updating
- `onBeforeUnmount`, `onUnmounted` - Unmounting

## Best Practices

1. Use Composition API for new projects
2. Keep components focused and reusable
3. Use Pinia for state management
4. Leverage reactive data binding
5. Use TypeScript for type safety

## Nuxt (Vue Meta-Framework)

Nuxt provides: file-based routing, server-side rendering, API routes, auto-imports.

```
app/
├── pages/
│   ├── index.vue        # /
│   └── about.vue        # /about
├── components/          # Auto-imported
└── server/
    └── routes/
        └── api.ts       # /api/*
```

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Nuxt Documentation](https://nuxt.com/)
