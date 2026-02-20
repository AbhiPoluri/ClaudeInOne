# Framer Motion

## Overview
Framer Motion is a production-ready animation library for React with declarative animations and gestures.

## Setup

```bash
npm install framer-motion
```

## Basic Animations

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Simple fade in
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
  Content
</motion.div>

// Slide in from bottom
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  Card
</motion.div>

// Exit animation with AnimatePresence
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

## Variants (Stagger Children)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.ul variants={containerVariants} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>{item.name}</motion.li>
  ))}
</motion.ul>
```

## Gestures

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>

// Drag
<motion.div
  drag
  dragConstraints={{ left: 0, right: 200, top: 0, bottom: 200 }}
  dragElastic={0.1}
  className="w-20 h-20 bg-blue-500 rounded-full cursor-grab"
/>
```

## Layout Animations

```tsx
// Animate layout changes automatically
<motion.div layout layoutId="card">
  {isExpanded ? <ExpandedView /> : <CollapsedView />}
</motion.div>
```

## Best Practices
- Use `spring` transitions for natural-feeling animations
- Use `AnimatePresence` for exit animations
- Reduce motion with `useReducedMotion()` for accessibility
- Use `layoutId` for shared element transitions between routes

## Resources
- [Framer Motion docs](https://www.framer.com/motion/)
