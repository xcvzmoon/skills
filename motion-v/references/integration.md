# Integration and rendering

## Package identity

Install `motion-v` with the project's package manager. Vue and `@vueuse/core` are peer dependencies in the audited package. Inspect the lockfile before changing versions. Do not install `@vueuse/motion` to satisfy a `motion-v` task; its directive syntax and animation contract differ.

Use explicit imports in ordinary Vue SFCs:

```vue
<script setup lang="ts">
import { motion } from 'motion-v';
</script>

<template>
  <motion.button :while-hover="{ scale: 1.04 }" :while-press="{ scale: 0.97 }">
    Save
  </motion.button>
</template>
```

`motion.div` and `Motion as="div"` are full-feature components. `motion.create(CustomComponent)` creates a motion wrapper; define it once in setup/module scope, and ensure the child forwards attributes and exposes an actual DOM root. `asChild` composes with a child element; verify single-root/ref forwarding when using UI-library wrappers.

## Nuxt

```ts
export default defineNuxtConfig({
  modules: ['motion-v/nuxt'],
  motionV: {
    components: true,
    utilities: true,
    directives: true,
    presets: {
      'fade-in': {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
    },
  },
});
```

The audited module supports Nuxt >=3 and uses `motionV`, not `motion`. Defaults are components/utilities enabled, prefix `''`, directives disabled, presets `{}`. Presets register their own directives even when `directives` is false. Keep presets JSON-serializable: the module generates plugin source using `JSON.stringify`, so function variants do not survive configuration serialization. Put function-bearing presets in a handwritten plugin instead.

The module registers `Motion`, `AnimatePresence`, `LayoutGroup`, `MotionConfig`, `ReorderGroup`, `ReorderItem`, and `M`. It auto-imports a specific utility list, not every export. In this revision `motion`, `m`, `LazyMotion`, `domAnimation`, `domMax`, `AnimateView`, `startTransition`, `useDomRef`, `ScrollOffset`, `useFollowValue`, and `useAnimationControls` require explicit imports unless another configured auto-import system supplies them. Check generated declarations. `prefix` changes component names only.

For Vite auto-components, the default export from `motion-v/resolver` is a resolver factory for `unplugin-vue-components`. It does not replace utility imports or globally register directives. Although its set contains `vMotion`, it is declared as a component resolver; register directives explicitly.

## Directives and presets

Local SFC registration works through a `v`-prefixed binding:

```vue
<script setup lang="ts">
import { createPresetDirective, vMotion } from 'motion-v';

const vFadeIn = createPresetDirective({
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true },
});
</script>

<template>
  <section v-fade-in>Introduction</section>
  <div v-motion="{ initial: { opacity: 0 }, animate: { opacity: 1 } }">Ready</div>
</template>
```

For global Vue registration use `app.use(MotionPlugin, { presets: { 'fade-in': options } })`, or `app.directive('motion', vMotion)` and `app.directive('fade-in', createPresetDirective(options))`.

The fork accepts options in the directive binding and as native-element VNode props. Merge precedence is preset defaults < binding object < VNode props. This is a shallow merge: overriding `animate` replaces that object. Prefer the binding object for native elements to reduce DOM prop collisions; the implementation specifically cleans up properties such as native `Element.animate` after Vue patches them.

`createMotionDirective(featureBundle?, defaultOptions?)` selects a bundle. `createPresetDirective(preset, featureBundle?)` takes arguments in a different order. Defaults use `domMax`. Do not assume `LazyMotion` reduces a full directive's feature bundle.

## SSR and hydration

Components and directives support initial server styles. Keep initial state deterministic across server/client and avoid reading `window`, geometry, or random data in setup. `:initial="false"` starts at the animate state when an entrance effect is unwanted. The directive's `getSSRProps` resolves initial styles; verify SVG attributes separately for the target version.

Do not blanket-wrap all Motion usage in `ClientOnly`. Isolate genuinely browser-only integrations and verify hydrated markup. Reduced-motion media queries are resolved in the browser, so keep server-rendered content usable before that preference is known.

## Feature loading

```vue
<script setup lang="ts">
import { LazyMotion, domAnimation, m } from 'motion-v';
</script>

<template>
  <LazyMotion :features="domAnimation" strict>
    <m.div :animate="{ opacity: 1 }" />
  </LazyMotion>
</template>
```

`domAnimation` covers animation, exit, hover, press, focus, and in-view. `domMax` adds layout/projection, drag, and pan. Pair `m`/`M` with `LazyMotion`; full `motion`/`Motion` already bundles features and undermines this optimization. `strict` helps catch full components inside the boundary. Async `features` may be a promise or function returning a promise of the bundle. Return the bundle itself, not a module namespace. Measure the production bundle before claiming savings.
