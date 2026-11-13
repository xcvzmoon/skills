# MotionValues and scroll

## Two reactive systems

Vue refs drive component state; MotionValues drive animation values without a component render per frame. Create composables in setup so Vue owns their watches and cleanup.

```ts
import { useMotionValue, useTransform, useMotionValueEvent } from 'motion-v';

const x = useMotionValue(0);
const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
useMotionValueEvent(x, 'change', (latest) => {
  // Update application state only when a meaningful threshold changes.
});
x.set(40);
const current = x.get();
```

Bind `:style="{ x, opacity }"` on a motion component. Do not bind `x.get()` there when continuous updates are needed; that is a snapshot. `watch(x, ...)` does not subscribe to MotionValue changes. Use `useMotionValueEvent` (unsubscribes on unmount) or clean up `.on()` manually.

`useTransform` accepts range mapping, a transformer function, an array of MotionValues, or a function reading `.get()` values. Range arrays must have equal lengths and monotonic inputs; keep output types/formats compatible. This fork also supports a Vue ref for the input range and an object of output ranges yielding multiple MotionValues. Do not assume output arrays are reactive just because the input range is.

`useSpring(source, config)` follows a number/string or MotionValue with spring smoothing; config can be a Vue ref. The audited fork also exports `useFollowValue(source, options)` for broader follow behavior. A Vue ref is not the source MotionValue: bridge explicit state changes if needed. `useVelocity` derives velocity, `useTime` supplies elapsed time, and `useMotionTemplate` builds a reactive string. Avoid render-loop bridges into Vue state for purely visual output.

## Scroll-linked progress

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { motion, useScroll, useTransform } from 'motion-v';
const target = ref<HTMLElement | null>(null);
const { scrollYProgress } = useScroll({
  target,
  offset: ['start end', 'end start'],
});
const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
</script>

<template>
  <section ref="target">
    <motion.div :style="{ y }">Scroll-linked content</motion.div>
  </section>
</template>
```

`useScroll` returns MotionValues `scrollX`, `scrollY`, `scrollXProgress`, `scrollYProgress`, plus fork additions `scrollXLength` and `scrollYLength`. Remaining vertical distance is `scrollYLength.get() - scrollY.get()`. Progress is normalized; absolute offsets and lengths are pixels.

`container` is the scrolling element; `target` is the measured subject within it. Offset strings describe target/container intersections: `start end` means target start at container end. A scroll container needs bounded dimensions and overflow. Use an untransformed wrapper as target if moving the observed node creates feedback.

The options accept an object, ref, or getter. For changing primitives use `useScroll(() => ({ container, target, axis: axis.value, offset: offsets.value }))` rather than capturing their initial values. Element refs may resolve after mount; tracking is attached with a post-flush watch and cleaned up on change.

The fork exports `ScrollOffset.Enter`, `.Exit`, `.Any`, and `.All`. Native timeline acceleration is opportunistic and browser-dependent; recognized offset ranges and supported output mappings can accelerate, while other cases use JS tracking. Do not promise compositor execution for every transform chain or add an extra requestAnimationFrame loop. Springs deliberately introduce lag, so use them only when that is desired.

## Scroll-triggered state

Use `whileInView` with `:in-view-options="{ once: true, amount: 0.25 }"` for a reveal. Options include `root`, `margin`, `amount`, and `once`. Use `useInView(elementRef, options)` for Vue state; it returns a boolean ref and accepts reactive options. Observe the intended ancestor root and distinguish viewport margins from scroll offsets.

A reveal should not leave essential content permanently transparent if hydration or scripting fails. For reduced motion, remove spatial movement or show the final state immediately. Avoid capturing an unresolved `.value` from a DOM ref during setup; pass the ref itself.
