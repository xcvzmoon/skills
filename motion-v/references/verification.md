# Verification and diagnosis

## Accessibility and rendering cost

Wrap a suitable subtree in `<MotionConfig reduced-motion="user">` for user preference. The audited default is `reducedMotion: 'never'`, so respecting the preference requires an explicit policy. The canonical prop is `reducedMotion`; the fork retains deprecated `reduceMotion`, but new code should use the canonical form. `useReducedMotion()` returns a Vue boolean ref for choosing reduced targets, disabling parallax, or changing application behavior. The config does not mean every opacity or native view animation disappears. Test the actual effect.

Use `skipAnimations` when final targets should apply immediately; this fork also wires it into `useAnimate`. Keep application state updates independent of animation promises and completion callbacks. Repeated/transient movement should be optional and should not trap focus or block reading.

Prefer transforms and opacity for ordinary visual motion. Layout projection handles real layout changes, but measurement and complex effects still cost time. Avoid per-frame Vue renders, unbounded observers, global selectors, permanent `will-change` everywhere, and expensive filter/shadow animation without profiling. Test low-end devices where relevant. Report measured bundle/runtime improvements, not assumed numbers.

## Diagnose from the failing contract

| Symptom                       | First checks                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| No animation                  | Bound object/boolean syntax, target differs from initial, reduced-motion/skip config, installed export, LazyMotion bundle |
| Child variants ignored        | Matching labels, own animate prop, `inherit=false`, parent context, delayed insertion                                     |
| Exit skipped                  | Boundary remains mounted, stable child keys, actual DOM root, exit target, mode, interrupted exit                         |
| Layout jumps/distorts         | Measurable geometry, CSS transform conflicts, hidden ancestors, scroll/fixed roots, scale correction                      |
| Scroll progress frozen        | Real scrollable container, target ref, offsets, reactive options, actual scroll length                                    |
| Drag jumps after scrolling    | Bounds/ref resolution, coordinate spaces, layoutScroll, constraint changes, pointer events                                |
| Reorder snaps back            | New values written to state, stable keys/value identities, correct axis, rendered geometry                                |
| Keyboard reorder fails        | Item focused rather than nested control, event modifiers/defaultPrevented, key spelling, duplicate handlers               |
| Directive behaves differently | Global/local registration, shallow precedence, native VNode prop collisions, preset serialization                         |
| Hydration mismatch            | Initial values differ, browser access in setup, non-deterministic IDs, SVG attrs, custom root forwarding                  |
| Full bundle remains           | Full motion components or default directive imported, domMax selected, static imports defeating split                     |
| AnimateView ghosts/late state | Mutation inside startTransition, unique names, queued updates, browser support, root layer policy                         |

Reproduce the smallest failing interaction before changing internals. Read nearby tests and prove the cause. For fork fixes, preserve Vue lifecycle and engine ownership; avoid duplicating projection or presence bookkeeping in application code.

## Verification matrix

Choose checks based on behavior changed; do not run an entire browser suite for a prose adjustment.

- Run the consumer's existing type check, lint, and relevant tests/build. Check auto-import declarations as well as source imports.
- For entrances/exits: mount, toggle, rapid reversal, remove several children, and unmount during playback. Verify final DOM and callback count, not only a frame screenshot.
- For layout: expand/collapse, sibling movement, shared IDs across repeated widgets, scrolling/fixed ancestors, and changing dimensions.
- For scroll: page and element containers, late refs, reactive axis/offset changes, unmount cleanup, and content length changes.
- For drag/Reorder: pointer and touch, scroll during drag, constraints resizing, keyboard Space/arrows/Escape, RTL, nested controls, and release-click behavior.
- For SSR/Nuxt: production render/hydration, directive registration, no browser-only setup access, and usable content before animation.
- For accessibility: reduced motion, visible focus, keyboard-only completion, focus restoration, and no essential hover-only information.
- For AnimateView: supported browser, unsupported fallback, rapid queued updates, shared-name uniqueness, and root crossfade policy.

In the audited library checkout, scripts use pnpm: `pnpm --filter motion-v exec vitest run <test-path>` for a focused non-watch unit run, `pnpm build` for the package build, and `pnpm exec playwright test <spec-path>` for an appropriate browser regression. Inspect current scripts/config first; the test script itself starts Vitest in watch mode. Do not apply the skills repository's Vite+ commands to this fork unless it adopts that toolchain.
