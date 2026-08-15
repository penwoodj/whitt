# Slice 10 Validation — Canvas Manipulation

Fixture: `CanvasOps.stories.tsx` — React Flow canvas, 6 nodes seeded w/ links, physics
sim mocked to deterministic settle. Pointer API heavy.

| Case | Story (`slice10 -- …`) | Play outline | Assert |
|---|---|---|---|
| GRP-01 | `GRP-01 multi-select` | ctrl+click 3 nodes | 3 selected; drag moves all (positions delta equal) |
| GRP-02 | `GRP-02 selection surround` | multi-select | region focus element encloses bounds |
| GRP-03 | `GRP-03 right-click box` | select 3; `[MouseRight]` click selection | group box drawn around bounds |
| GRP-04 | `GRP-04 connected pull` | drag hub node | linked neighbors translate (spring-follow observed) |
| GRP-05 | `GRP-05 standalone node` | create-node action | unconnected bubble; free drag |
| GRP-06 | `GRP-06 drag link` | hover right edge strip; drag to node B | link created on drop |
| GRP-09 | `GRP-09 group prompt context` | form group; focus it | STT tooltip at group side; payload = member refs |
| GRP-10 | `GRP-10 group node-like` | dblClick group | group opens as unit (expansion surface) |
| GRPC-01 | `GRPC-01 click vs drag` | 3px move release | click semantics fired (select), no drag |
| GRPC-02 | `GRPC-02 esc cancels drag` | drag; ESC mid-drag | node returns to origin; no mutation |
| GRPC-03 | `GRPC-03 connection preview` | link-drag to valid/invalid | preview line styled valid vs invalid (class swap) |
| GRPC-04 | `GRPC-04 connection cancel` | link-drag; drop empty | no link; affordance gone |
| GRPC-05 | `GRPC-05 edge delete` | hover edge; click X | edge removed (graph + FS unlink spy) |
| GRPC-06 | `GRPC-06 selection model` | click / ctrl+click / empty-drag lasso / empty-click | select / toggle / lasso-enclose / clear (4 steps) |
| GRPC-07 | `GRPC-07 delete guard` | select node; press Delete | confirm shown naming scope; cancel keeps node |
| GRPC-08 | `GRPC-08 multi-drag coherence` | multi-select; drag one | all translate together; linked neighbors follow |
| GRPC-09 | `GRPC-09 reheat settle` | drag + release | sim restart spy; velocity decays to settle; no overlap (bounds check); sleeps (tick count → 0) |
| GRPC-10 | `GRPC-10 hard group` | soft group; invoke make-permanent | folder-create spy + move spies; box+halo persist after reload (mock) |

(GRP-07 soft/hard semantics covered functionally by GRPC-10 + GRP-09; GRP-08 halo
visual asserted in slice 03; GRP-11 deferred — no validation story, tracked in manifest
as `deferred`.)
