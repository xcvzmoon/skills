# Evidence, version boundaries, and maintenance

## Audited source

This skill was researched from the local xcvzmoon/motion-vue fork at commit `1af91b385b5f7cff36a550c2aba4412e3174c944`, package `motion-v` version `2.12.0`. Its origin is [xcvzmoon/motion-vue](https://github.com/xcvzmoon/motion-vue); upstream is [motiondivision/motion-vue](https://github.com/motiondivision/motion-vue). The manifest pins framer-motion/motion-dom to `~14.11.1` and motion-utils to `~14.7.0`. These are evidence for this revision, not dependency-upgrade recommendations.

Use this order when sources disagree: resolved package and local implementation/tests, revision-matched fork documentation, official Vue documentation, then engine documentation for shared internals. React behavior parity does not require React API spelling. The fork's `docs/adr/0001-parity-policy.md` makes Vue naming canonical and rejects compatibility aliases unless explicitly requested.

Official [Vue documentation](https://motion.dev/docs/vue), [component reference](https://motion.dev/docs/vue-motion-component), [gestures](https://motion.dev/docs/vue-gestures), and [scroll guide](https://motion.dev/docs/vue-scroll-animations) provide general usage. They may describe another release. Verify exports locally before using additions, Motion+ components, or examples with malformed Vue syntax.

## Targeted source map

Paths below are relative to the motion-vue checkout. Find that checkout or installed package; do not hardcode the author's machine path.

| Question                             | Source and nearby evidence                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| What is public?                      | `packages/motion/package.json`, `packages/motion/src/index.ts`, component/value/animation barrel exports                              |
| Vue component props and defaults     | `src/components/motion/props.ts`, `types.ts`, `utils.ts`, `src/types/state.ts`                                                        |
| Parent label resolution              | `src/utils/resolve-motion-props.ts`, motion state, variant/variant-inheritance browser specs                                          |
| Nuxt registrations and serialization | `packages/plugins/src/nuxt/index.ts`; resolver in `packages/plugins/src/resolver/index.ts`                                            |
| Directive options, SSR, presets      | `src/directive/index.ts`, `src/directive/__tests__/v-motion.test.ts`, `tests/preset-directive.spec.ts`                                |
| Presence and interrupted exits       | `src/components/animate-presence/`, especially exit-session and use-presence-container; exit-session/keepalive tests                  |
| Layout/projection                    | `src/features/layout/`, state snapshot/update code, `tests/layout-mount.spec.ts`, hidden-ancestor/v-show specs                        |
| Reorder API and keyboard             | `src/components/reorder/Group.vue`, `Item.vue`, `utils.ts`, `__tests__/keyboard*.test.tsx`                                            |
| Auto-scroll and click suppression    | `src/components/reorder/auto-scroll.ts`, group capture handlers, auto-scroll/click-after-drag tests; page-scroll/RTL/grid playgrounds |
| Scroll reactivity and acceleration   | `src/value/use-scroll.ts`, `use-transform.ts`, `scroll/offsets.ts`, unit tests; `tests/useScroll.spec.ts`                             |
| Imperative cleanup and preferences   | `src/animation/hooks/use-animate.ts`, use-reduced-motion, motion-config types/context                                                 |
| Feature bundles                      | `src/features/dom-animation.ts`, `dom-max.ts`, lazy-motion and m implementations/tests                                                |
| Native snapshot transitions          | `src/components/animate-view/`, `types.ts`, `start-transition.ts`, layer tests; `tests/animate-view.spec.ts`                          |
| Working application examples         | `playground/vite/src/views/`, `playground/nuxt/pages/`, Nuxt configuration                                                            |

`src/` entries above abbreviate `packages/motion/src/`. Search exported names with `rg` before reading full modules. Follow the smallest path that settles the contract; do not load every test and playground into context.

## Library maintenance workflow

1. Read checkout instructions and parity policy. Record engine versions and whether a defect belongs to the Vue adapter or shared engine.
2. Trace component/directive options through context resolution into MotionState, VisualElement features, and projection. Check both components and directives when changing shared behavior.
3. Preserve public Vue names, SSR initial styles, parent inheritance, lifecycle cleanup, and feature-bundle boundaries. A React internal assumption about mount order may not hold in Vue.
4. Add a focused failing regression at the appropriate level. Use a browser test for real layout, scroll, pointer, focus, or View Transition behavior; a DOM shim cannot prove browser geometry.
5. Verify the focused test, affected build/types, and relevant neighboring behavior. Explain engine-version limitations and breaking API changes rather than adding speculative aliases.

For freshness, re-audit exports, module defaults, and fork-specific behavior when the resolved version/revision changes. Update this evidence file and affected references together. Keep consumer guidance and source-maintenance guidance distinct so a simple animation task does not become an engine audit.
