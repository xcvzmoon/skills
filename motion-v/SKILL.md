---
name: motion-v
description: Build, debug, review, and optimize Vue 3 and Nuxt animations with motion-v (Motion for Vue / motion-vue), including the xcvzmoon fork. Use whenever motion-v is installed or requested, or a Vue task involves motion components, variants, AnimatePresence, shared layout, MotionValues, scroll-linked animation, drag, Reorder, preset directives, LazyMotion, or AnimateView. Covers application integration and library maintenance. Do not substitute React Motion, @vueuse/motion, or legacy Motion One APIs; verify the installed version and fork before using newer features.
---

# Motion for Vue

Deliver working Vue behavior against the project's actual `motion-v` version. Use Vue single-file components and `<script setup lang="ts">` unless the project uses another convention. Preserve existing auto-imports, styles, semantics, and package-manager policy.

## Establish the API contract

1. Inspect the consuming package, lockfile, Vue/Nuxt configuration, existing animations, and tests. Identify the resolved `motion-v` version and whether it comes from npm, a workspace, an alias, or a Git fork. A package named `motion-v` does not prove the fork's additions are present.
2. For fork work, locate its checkout and read its package exports, types, implementation, and nearby tests. Prefer those over general web examples. Read [source-map.md](references/source-map.md) for the audited revision, feature evidence, and a targeted search map.
3. Separate declarative state, continuous values, and imperative sequences. Use the smallest API that expresses the interaction; do not add scroll listeners, render-loop state, or a second animation library to reproduce built-in behavior.
4. Load only the references needed for the task:

| Task                                                          | Reference                                             |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| Install, Nuxt, auto-imports, directives, SSR, feature bundles | [integration.md](references/integration.md)           |
| Motion components, variants, transitions, SVG, sequences      | [animation.md](references/animation.md)               |
| Exit, shared layout, KeepAlive, native view transitions       | [presence-layout.md](references/presence-layout.md)   |
| MotionValues, scroll, transforms, springs, in-view            | [values-scroll.md](references/values-scroll.md)       |
| Gestures, drag handles, constraints, Reorder, keyboard        | [gestures-reorder.md](references/gestures-reorder.md) |
| Failure diagnosis, accessibility, performance, verification   | [verification.md](references/verification.md)         |
| Library implementation or unfamiliar/version-sensitive APIs   | [source-map.md](references/source-map.md)             |

## Choose the mechanism

- Animate state with `motion.div`, `motion.button`, or `Motion as="..."` and `initial`, `animate`, `transition`.
- Coordinate descendants with named `variants`; parent labels propagate unless children take control or `inherit` is false.
- Animate conditional removal with a persistent `AnimatePresence` around keyed children. Use `layout` for size/position changes and `layoutId` for shared identity.
- Reveal on entry with `whileInView` and `inViewOptions`. Use `useInView` when Vue state or side effects need visibility.
- Bind continuous scroll/pointer values through MotionValues and `:style`. Use `useAnimate` for scoped DOM sequences and `useAnimationControls` for imperative motion-component targets.
- Use Reorder for a single list or supported measured grid. Check the fork before promising grid, auto-scroll, RTL, or keyboard behavior. Treat cross-container transfer and arbitrary drag-and-drop as separate requirements.
- Use `AnimateView` plus `startTransition` only when the resolved version exports them and native snapshot transitions suit the interaction.

## Keep Vue contracts intact

Use `whilePress`, `onPress`/`@press`, and `inViewOptions`. React examples using `whileTap`, `onTap`, `viewport`, `onReorder`, `.current`, or React hooks need adaptation, not copying. For Reorder use `v-model:values` or `:values` with `@update:values`.

Bind objects, booleans, and numbers with `:`. For example, `:initial="false"` is a boolean; `initial="false"` is a variant label. Vue refs use `.value` in script and unwrap in templates. A MotionValue uses `.get()` and `.set()` and is passed directly inside `:style`; it is not a Vue ref.

Use semantic buttons and links, visible focus, keyboard access, and an explicit reduced-motion policy. Animation completion must not be the only way essential application state advances. Do not animate the same transform through CSS, Vue Transition classes, and Motion simultaneously.

## Implement and verify

1. Define the trigger, states, interruption behavior, and removal timing before choosing easing.
2. Implement the complete interaction, including cleanup and non-pointer operation. Keep DOM-dependent work after mount and server markup deterministic.
3. Verify types/imports against the installed package. Do not invent an export or deep-import private source to bypass a type error.
4. Exercise the relevant cases in [verification.md](references/verification.md). Use the project's own check/test/build commands. Library fixes need focused regression tests; presentation-only changes usually need existing checks and visual inspection.
5. Report changed behavior, validation actually run, and any unresolved browser/version limitation. Distinguish verified facts from assumptions.
