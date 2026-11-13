# Gestures, drag, and Reorder

## Gestures

Use `whileHover`, `whilePress`, `whileFocus`, `whileDrag`, and `whileInView` for temporary states. Supported callbacks include `@hover-start`, `@hover-end`, `@press-start`, `@press`, `@press-cancel`, `@pan`, `@drag-start`, `@drag`, and `@drag-end`. Pan/drag callbacks receive the event plus info such as point, delta, offset, and velocity; check their types before relying on fields.

Use a real button for an action. Visual press feedback does not replace activation semantics or keyboard support. Hover cannot be the only way to reveal essential controls on touch devices. Give focus a visible style even if an animation is disabled.

## Drag

`drag` enables both axes; `drag="x"`/`"y"` restricts motion. `dragDirectionLock`, `dragElastic`, `dragMomentum`, `dragTransition`, and `dragSnapToOrigin` affect different parts of the interaction. Use `:drag="false"` and `:drag-momentum="false"` for booleans.

Bounds may be an edge object (`{ left, right, top, bottom }`) or a supported element ref. For a native container use `ref<HTMLElement | null>(null)`; use `useDomRef()` when resolving a motion component's DOM element. Pass the ref, not its unresolved value during setup. Recheck bounds when constraints resize or animate. Avoid manually adding scroll displacement to measured geometry without a regression that proves it is needed.

For a separate handle, create `useDragControls()`, pass `:drag-controls="controls"` and `:drag-listener="false"` to the draggable node, then call `controls.start(event)` from the handle's pointerdown. Use appropriate `touch-action` on the drag surface (`pan-y` for a horizontal drag that should preserve vertical scrolling, or `none` where all touch movement belongs to dragging). Keep native scrolling available elsewhere. A drag handle also needs a keyboard alternative.

## Reorder contract

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ReorderGroup, ReorderItem } from 'motion-v';
const items = ref(['Plan', 'Build', 'Review']);
</script>

<template>
  <p id="reorder-help">Space to grab or drop. Arrow keys to move. Escape to cancel.</p>
  <ReorderGroup v-model:values="items" axis="y" aria-describedby="reorder-help">
    <ReorderItem
      v-for="item in items"
      :key="item"
      :value="item"
      :while-drag="{ scale: 1.02 }"
      class="reorder-item"
      :style="{ position: 'relative', touchAction: 'pan-x' }"
    >
      {{ item }}
    </ReorderItem>
  </ReorderGroup>
</template>

<style scoped>
.reorder-item:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>
```

`Reorder.Group` / `Reorder.Item` from the `Reorder` namespace are equivalent alternatives. The group defaults to `ul`, items to `li`; preserve valid list markup when changing `as`.

- Use `v-model:values`, not plain `v-model`. The group takes `values` and calls `onUpdate:values(newOrder, moved)`. With `@update:values`, write the new order back to state. It emits throughout reordering, so debounce or defer expensive persistence separately.
- `:value` must correspond to an entry in `values`. Prefer stable primitive IDs and render labels from a lookup for object-rich lists. Keep object identity stable when using objects. Keys identify items, not positions.
- The fork infers `x`, `y`, or `xy` from measured layouts when `axis` is omitted. Use an explicit axis when product behavior should stay fixed, and `axis="xy"` for intended grid reordering. Do not claim all motion-v releases support this.
- Items already have layout animation and derive drag behavior from the group axis. A positioned item lets its drag z-index take effect. Use a bounded overflow wrapper around the group for ancestor auto-scroll. The audited helper starts at `groupElement.parentElement`, so making only the group scrollable does not make it an auto-scroll target. Use an appropriate motion scroll ancestor with `layoutScroll` when projection needs scroll measurement, and test before adding custom scrolling code.
- This fork includes ancestor/page auto-scroll, RTL-aware keyboard/grid logic, roving tab stops, and keyboard sorting. Horizontal pointer ordering and raw RTL `scrollLeft` behavior still need browser verification; do not promise universal RTL parity. Space grabs/drops; arrows move focus when ungrabbed and reorder when grabbed; Escape restores the pre-grab order; blur drops. Modified shortcuts and events from nested controls are left alone. Do not layer a second key handler over this behavior. Escape rollback is a keyboard transaction; pointer release normally commits. Pointer cancellation needs drag-control cancellation plus an application-owned order snapshot if emitted changes must be undone. Keyboard grabs do not produce pointer drag-start/end callbacks.
- Keep instructions, visible focus, meaningful labels, and announce changed order when users need confirmation. Do not invent unsupported ARIA roles or claim built-in announcements. Test keyboard interaction after keys cause Vue DOM movement.
- Pointer clicks following a reorder drag are suppressed by the group; keyboard activation remains separate. Verify nested links/buttons before adding your own click suppression.

For multi-container transfer, virtualized/unmounted geometry, or arbitrary drag-and-drop, investigate requirements and available capabilities first. Measured Reorder behavior alone does not prove those use cases work.
