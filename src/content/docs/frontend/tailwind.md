---
title: Tailwind CSS
description: A utility-first CSS framework for rapidly building custom user interfaces.
cheatsheet:
  slug: tailwind
  section: frontend
  summary: A compact guide to Tailwind CSS — utility classes, layout, and configuration.
  topicVersion: "3.4"
  verifiedAgainst:
    - label: Tailwind CSS Documentation
      url: https://tailwindcss.com/docs/installation
  lastVerified: 2026-07-27
  difficulty: beginner
  tags: [css, framework, design, styling]
---

## Mental model

Tailwind provides low-level utility classes that map directly to CSS properties, allowing you to build designs directly in your markup. Instead of creating custom CSS classes, you combine utilities to style elements, enforcing consistency and reducing context switching.

## Spacing (Padding & Margin)

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `p-4` | `padding: 1rem;` | Padding on all sides |
| `px-4` | `padding-left: 1rem; padding-right: 1rem;` | Padding on x-axis (left/right) |
| `mt-2` | `margin-top: 0.5rem;` | Margin top |

Tailwind's default spacing scale is proportional: `1` equals `0.25rem` (4px). Utilities follow a predictable pattern: property (`m`, `p`) + optional side (`t`, `r`, `b`, `l`, `x`, `y`) + scale value.

```html
<div class="pt-6 pb-8 px-4 mt-2">
  Content here
</div>
```

> **Tip:** You can use negative values for margins by prefixing with a dash, like `-mt-4`.

## Sizing (Width & Height)

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `w-64` | `width: 16rem;` | Fixed width |
| `w-full` | `width: 100%;` | Full width of parent |
| `h-screen` | `height: 100vh;` | Full viewport height |

Sizing uses the same proportional scale as spacing. Fractional values (`w-1/2`, `w-2/3`) and special values (`full`, `screen`, `auto`) provide flexible dimensions.

```html
<div class="w-1/2 h-48 max-w-sm">
  Fixed height, fluid width
</div>
```

> **Gotcha:** `w-screen` will cause a horizontal scrollbar if the page has a vertical scrollbar. Prefer `w-full` for block elements.

## Flexbox

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `flex` | `display: flex;` | Defines a flex container |
| `flex-col` | `flex-direction: column;` | Stack items vertically |
| `justify-between`| `justify-content: space-between;` | Space items evenly |

Flexbox utilities control layout, alignment, and distribution of space. Apply `flex` to a parent container, then use modifiers on the parent or children to dictate the layout.

```html
<div class="flex flex-row justify-between">
  <div>Logo</div>
  <div class="flex gap-4">
    <a href="#">Nav 1</a>
    <a href="#">Nav 2</a>
  </div>
</div>
```

> **Note:** The `gap-{size}` utility is supported in both flex and grid layouts.

## Grid Layout

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `grid` | `display: grid;` | Defines a grid container |
| `grid-cols-3` | `grid-template-columns: repeat(3, minmax(0, 1fr));` | 3 equal columns |
| `col-span-2` | `grid-column: span 2 / span 2;` | Span 2 columns |

Grid utilities provide a 12-column grid system out of the box. Use `grid-cols-{n}` to define columns, and `col-span-{n}` on children to span multiple tracks.

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="col-span-2">Main Content</div>
  <div>Sidebar</div>
</div>
```

## Typography

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `text-lg` | `font-size: 1.125rem; line-height: 1.75rem;` | Large text |
| `font-bold` | `font-weight: 700;` | Bold text |
| `text-center` | `text-align: center;` | Center align |

Typography utilities bundle sensible defaults for `font-size` and `line-height`. You can control color, weight, tracking, and leading with separate utilities.

```html
<h1 class="text-2xl font-bold text-gray-900">
  Headline
</h1>
<p class="text-sm leading-relaxed text-gray-600">
  Body text goes here.
</p>
```

> **Tip:** The `truncate` utility handles overflow, text-overflow, and white-space in one class.

## Colors & Backgrounds

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `text-blue-500` | `color: rgb(59 130 246);` | Text color |
| `bg-red-100` | `background-color: rgb(254 226 226);` | Background color |
| `border-gray-200`| `border-color: rgb(229 231 235);` | Border color |

Tailwind includes an extensive color palette. Colors range from `50` (lightest) to `950` (darkest). Apply colors to text, backgrounds, borders, rings, and more.

```html
<button class="bg-blue-600 text-white rounded-md">
  Click Me
</button>
```

## Responsive Design

| Utility | CSS equivalent | Meaning |
|---|---|---|
| `sm:` | `@media (min-width: 640px)` | Small screens and up |
| `md:` | `@media (min-width: 768px)` | Medium screens and up |
| `lg:` | `@media (min-width: 1024px)` | Large screens and up |

Tailwind uses a mobile-first approach. Unprefixed utilities apply to all screen sizes. Prefix utilities with breakpoint names (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to apply them at specific widths and above.

```html
<div class="w-full md:w-1/2 lg:w-1/3 p-4">
  Responsive card
</div>
```

> **Warning:** Never use a breakpoint prefix without a base (unprefixed) class to define the default mobile state.

## States & Interactions

| Utility | Meaning |
|---|---|
| `hover:` | Applies when element is hovered |
| `focus:` | Applies when element has focus |
| `active:` | Applies when element is active (clicked) |

State modifiers function exactly like responsive prefixes. They allow you to style elements under specific interactive conditions without writing custom CSS selectors.

```html
<button class="bg-blue-500 hover:bg-blue-600">
  Interactive Button
</button>
```

## Further reading

- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Arbitrary Values in Tailwind](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
