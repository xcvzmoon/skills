# Targets, transitions, and orchestration

## Declarative animation

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { motion } from 'motion-v';

const expanded = ref(false);
</script>

<template>
  <motion.button
    type="button"
    :aria-expanded="expanded"
    :initial="false"
    :animate="{ scale: expanded ? 1.04 : 1 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
    @click="expanded = !expanded"
  >
    Toggle details
  </motion.button>
</template>
```

Use targets for a few local states and variants for reusable states or parent/child coordination. Prefer `x`, `y`, `scale`, and `rotate` over manually concatenated transform strings. Preserve CSS ownership of static positioning; use a wrapper when CSS and Motion both need transforms.

Durations/delays in animation transitions are seconds. Do not infer units from helpers such as the explicitly named `delayInMs`. Tween transitions use `duration`, `ease`, and optional `times`; springs use physical controls (`stiffness`, `damping`, `mass`) or supported duration/bounce controls. Avoid mixing settings without checking which wins. Use per-property transitions when opacity and position need different timing.

Keyframes use arrays, for example `:animate="{ x: [0, 80, 0] }"`. A leading `null` starts at the current value. Match `times` length to the keyframes; use increasing fractions between 0 and 1. Loops use `repeat` and `repeatType`; avoid essential or distracting infinite motion and respect reduced motion.

## Variants

```vue
<script setup lang="ts">
import { motion } from 'motion-v';
import type { MotionProps } from 'motion-v';

const list: MotionProps['variants'] = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: stagger(0.06) } },
};
const item: MotionProps['variants'] = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};
</script>

<template>
  <motion.ul initial="hidden" animate="visible" :variants="list">
    <motion.li v-for="label in ['One', 'Two', 'Three']" :key="label" :variants="item">
      {{ label }}
    </motion.li>
  </motion.ul>
</template>
```

Inherited labels need matching child variant names. A child with its own `animate` takes control; `inherit: false` severs inheritance. Use `custom` for parameterized variant functions, and `AnimatePresence custom` for dynamic exit data that must remain available after removal. Prefer `delayChildren: stagger(...)` in the audited v14 engine. Older versions may use `staggerChildren`; verify their transition types before migrating.

## Imperative animation

`useAnimate` returns `[scope, animate]`. Bind `ref="scope"` to a native root, then call the scoped animate after mount or from an event. Selectors are relative to that root. Returned controls can be awaited for sequencing. The composable stops tracked animations on unmount and reads `MotionConfig.skipAnimations` in this fork.

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useAnimate, stagger } from 'motion-v';

const [scope, animate] = useAnimate<HTMLUListElement>();
onMounted(() => {
  animate('li', { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.05) });
});
</script>

<template>
  <ul ref="scope">
    <li>First</li>
    <li>Second</li>
  </ul>
</template>
```

Use `useAnimationControls()` when several motion components share an imperative controller. Pass it to `:animate`, call `start` only after mount, and use `set`/`stop` as needed. Do not replace a simple reactive target with an imperative controller.

For imported standalone `animate`, cancel/stop work on disposal and scope selectors yourself. A cancelled animation should not trigger stale application work after an awaited sequence. Guard asynchronous follow-up when the component can disappear.

## SVG and advanced transitions

Use `motion.svg`, `motion.path`, and shape components. Distinguish CSS transform `x` from SVG attribute movement (`attrX`, `attrY`, `attrScale` where supported). Path drawing commonly animates normalized `pathLength` from 0 to 1. Use compatible path structures for `d` interpolation; arbitrary shapes do not morph automatically.

The audited fork supports curved-motion `transition.path` through engine exports such as `arc`; verify the actual export and signature before writing one. Its transition type explicitly resolves a collision between motion paths and SVG per-property transition typing. Do not solve that collision with `as any`.
