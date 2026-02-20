# Radix UI

## Overview
Radix UI provides unstyled, accessible, and composable React primitives for building custom design systems.

## Installation

```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover
# Or install individual primitives
```

## Dialog (Modal)

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function Modal({ trigger, title, children }: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <div className="mt-4">{children}</div>
          <Dialog.Close className="absolute top-4 right-4">
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Dropdown Menu

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2">
          <img src={user.avatar} className="w-8 h-8 rounded-full" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white border rounded-md shadow-lg p-1 w-48">
          <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item className="px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer rounded">
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

## Best Practices
- Use `asChild` to pass interaction to custom elements
- Radix handles ARIA, focus management, and keyboard navigation automatically
- Style with Tailwind using `data-[state]` selectors for animated states
- Use shadcn/ui for pre-built Radix components with Tailwind styles

## Resources
- [Radix UI docs](https://www.radix-ui.com/primitives)
- [shadcn/ui](https://ui.shadcn.com) — Radix + Tailwind components
