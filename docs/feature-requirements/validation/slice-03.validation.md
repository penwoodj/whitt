# Slice 03 Validation — Light Language

Fixture: `LightLanguage.stories.tsx` — matrix host rendering ball / bar / halo / group
ring in each state; FakeAudioContext level script (0 → 0.5 → 0.9 → silence);
`prefers-reduced-motion` parameter variant.

| Case | Story (`slice03 -- …`) | Play outline | Assert |
|---|---|---|---|
| VOX-02 | `VOX-02 recording color shift` | idle → recording | computed color/glow token differs from idle |
| VOX-03 | `VOX-03 volume breathing` | level script 0.2→0.9 | breathing class on; sampled transform scale grows w/ level |
| EXP-02 | `EXP-02 ball becomes halo` | expand node | halo element wraps modal; ball element hidden |
| EXP-04 | `EXP-04 bar of light` | expand node | bar at modal top; soft-corner radius token |
| EXP-08 | `EXP-08 bar breathes tooltip-closed` | record; close tooltip | bar still has breathing animationName |
| EXE-11 | `EXE-11 edges breathe executing` | mock exec start/stop | edges animationName set while running, `none` when idle |
| EXE-12 | `EXE-12 border animation eventual` | executing | border-beam class present (polish tier — assert class only) |
| EXE-14 | `EXE-14 morph loader` | executing | loader icon element cycles (≥2 icon names observed over ~3s, transform crossfade) |
| GRP-08 | `GRP-08 grouping halo` | form group | halo ring element wraps selection box |
| LGT-01 | `LGT-01 token table states` | render matrix all states | every element resolves glow from same token CSS vars (no ad-hoc colors) |
| LGT-02 | `LGT-02 amplitude curve` | level steps 0/0.5/0.9 w/ smoothing | scale = idle + L·k within tolerance; sub-gate level = still |
| LGT-03 | `LGT-03 silence stillness` | level → silence | animation paused/still scale; recording state color retained |
| LGT-04 | `LGT-04 morph cadence` | executing 4s | icon step ~1.2s; only transform/opacity animate (no layout props) |
| LGT-05 | `LGT-05 halo geometry` | expand node; form group | same halo component both cases (testid shared); inherits state glow |
| LGT-06 | `LGT-06 perf 100 bubbles` | render 100-node story; RAF-count frames | no frame > 16ms budget over sampled window (allow GC outliers); sprite cache hit (no per-frame gradient creation — spy on createRadialGradient in canvas tier) |
| LGT-07 | `LGT-07 reduced motion` | reduced-motion param | no animationName on breathing elements; state badge text present |
| LGT-08 | `LGT-08 bar rest state` | idle expanded | bar unanimated; hover brightens (filter/opacity change) before tooltip |
