# Tailwind CSS v4

Utility-first CSS framework with rapid styling capabilities.

## Setup (Next.js)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      },
      spacing: {
        '128': '32rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
} satisfies Config
```

## Utility Classes

```jsx
export function Button({ variant = 'primary', size = 'md', ...props }) {
  const baseClasses = 'font-semibold rounded-lg transition-colors';
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    />
  );
}
```

## Responsive Design

```jsx
export function Grid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Dark Mode

```jsx
// tailwind.config.ts with darkMode: 'class'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 text-black dark:text-white">
        Content
      </div>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Dark Mode
      </button>
    </>
  );
}
```

## Custom CSS with Tailwind

```css
/* globals.css */
@import "tailwindcss";

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }

  .input-base {
    @apply px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

## Forms

```jsx
export function LoginForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input 
          type="email"
          className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
        Sign In
      </button>
    </form>
  );
}
```

## Performance

```jsx
// Use clsx for conditional classes (lighter than classnames)
import clsx from 'clsx';

export function Card({ highlighted }) {
  return (
    <div className={clsx(
      'p-4 rounded-lg border',
      highlighted && 'border-blue-500 bg-blue-50'
    )}>
      Content
    </div>
  );
}
```

## Best Practices

✅ **Use @layer** - Organize custom utilities
✅ **Extract components** - DRY up repeated patterns
✅ **Responsive-first** - Mobile first approach
✅ **Plugins** - Leverage community plugins
✅ **PurgeCSS** - Automatic unused CSS removal

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
