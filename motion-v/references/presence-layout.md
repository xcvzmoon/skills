# Presence, layout, and view transitions

## Exit lifecycle

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
const visible = ref(true);
</script>

<template>
  <button type="button" @click="visible = !visible">Toggle notice</button>
  <AnimatePresence :initial="false">
    <motion.aside
      v-if="visible"
      key="notice"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -8 }"
    >
      Saved
    </motion.aside>
  </AnimatePresence>
</template>
```

Keep the boundary mounted while the child exits. Give changing children stable, distinct keys; index keys break identity during reorder/removal. The fork uses Vue Transition/TransitionGroup integration and tracks exit promises. Re-entering an exiting element aborts its exit session; verify rapid toggles rather than assuming completion fires for aborted exits.

Modes are `sync` (default), `wait` (out-in sequencing, one child), and `popLayout` (remove exiting elements from normal flow while animating). Set a positioned ancestor when absolute positioning needs a containing block. `anchorX` supports left/right anchoring. Test actual DOM roots when wrappers or fragments obscure which element leaves.

The fork has explicit coverage for `v-show`, nested motion nodes, groups, hidden ancestors, and KeepAlive. Preserve Vue directive/lifecycle semantics when modifying these paths. Do not declare `v-show` universally unsupported based on React guidance. Prefer keyed `v-if` for ordinary removal, and inspect the dedicated tests for visibility toggles.

A dialog still needs focus entry/restoration, Escape handling, a name, and background interaction management. AnimatePresence only manages animation lifetime.

## Layout projection

Set `layout` on nodes whose measured size/position changes. Let Vue/CSS determine the final layout; Motion animates between measurements. Use `layout="position"` to move without scaling content, and check supported modes in local types for other needs. `layoutDependency` can restrict measurement to meaningful state changes.

Use matching `layoutId` values to connect shared elements. Namespace repeated widgets with `LayoutGroup id="..."`. LayoutGroup coordinates participating siblings and prevents unrelated instances from sharing identity. Put layout-specific timing in `transition.layout` and general timing in `transition`.

Use `layoutScroll` on participating scroll containers and `layoutRoot` for fixed-position roots when required by measurement. Distinguish scroll offsets from drag offsets. Keep border radius and box shadow in supported Motion styles for scale correction; test text/image distortion. Hidden or detached elements cannot yield useful geometry. Check flex/grid layout, changing ancestor transforms, image loading, and font changes before patching the engine.

## Native view transitions in this fork

`AnimateView` and `startTransition` are exported by the audited revision; verify availability in other versions. These use native snapshot layers rather than layout projection.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AnimateView, startTransition } from 'motion-v';
const expanded = ref(false);
function toggle() {
  startTransition(() => {
    expanded.value = !expanded.value;
  });
}
</script>

<template>
  <button type="button" @click="toggle">Change view</button>
  <AnimateView :transition="{ duration: 0.25 }">
    <section :style="{ width: expanded ? '100%' : '16rem' }">Details</section>
  </AnimateView>
</template>
```

Wrap the state mutation in `startTransition`; the wrapper alone does not capture arbitrary changes. Put one actual DOM element under AnimateView. `enter`, `exit`, `share`, and `update` accept targets or functions receiving transition type labels. A matching `name` pairs exiting/entering instances; names must be unique within each view, and the entering side configures `share`.

`startTransition(update, { types, root })` returns a native ViewTransition or `undefined`. Unsupported browsers/SSR still execute the update. Calls during playback queue and batch, and queued calls return `undefined`; do not assume the mutation runs immediately or unconditionally dereference `.finished`. Root crossfade is suppressed by default; `{ root: true }` opts in. Verify fallback, rapid repeated navigation, and reduced-motion behavior explicitly. Do not assume MotionConfig automatically disables native transitions without source evidence.
