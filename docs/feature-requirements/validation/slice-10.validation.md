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
| GRPX-01 | `GRPX-01 soft group dual persistence` | create soft group | localStorage entry exists; .whitt folder entry exists in closest parent |
| GRPX-02 | `GRPX-02 left-click pan vs right-click lasso` | left-drag empty / right-drag empty | left-drag pans canvas; right-drag creates lasso selection |
| GRPX-03 | `GRPX-03 selection halo + icon outside border` | select nodes | halo surrounds selection; + icon visible upper-right OUTSIDE border on hover/click |
| GRPX-04 | `GRPX-04 + icon tooltip menu actions` | hover/click + icon | tooltip appears with "Make Folder", "Speak to Selected", other actions |
| GRPX-05 | `GRPX-05 Make Folder visual transformation` | select "Make Folder" | halo border pronounced/harsher; center glow more solid/less opaque |
| GRPX-06 | `GRPX-06 Make Folder file system action` | invoke "Make Folder" | folder created; files moved; new blank .md node at top level with selection |
| GRPX-07 | `GRPX-07 group detail panel with full graph view` | speak to group | detail panel opens; first section = full-size graph view of contents |
| GRPX-08 | `GRPX-08 unfocused group bubble + halo + mini-window` | unfocus group | node = bubble of light; halo present; inner graph zoomed-out mini-window visible |
| GRPX-09 | `GRPX-09 editable deterministic group titles` | edit group title | title stored dash-case-lowercase; persists in .whitt state or folder name |
| GRPX-10 | `GRPX-10 debounced file system reflection` | change group structure | FS update after debounce delay; live memory graph provides speed |
| GRPX-11 | `GRPX-11 double-right-click expand group` | double-right-click group | group expands; STT NOT started |
| GRPX-12 | `GRPX-12 double-left-click expand + record` | double-left-click group | group expands; STT starts; tooltip upper-right around node |
| GRPX-13 | `GRPX-13 Flatten Folder action` | invoke "Flatten Folder" | folder removed; files moved to parent; group reverts to soft or dissolved |

(GRP-07 soft/hard semantics covered functionally by GRPC-10 + GRP-09; GRP-08 halo
visual asserted in slice 03; GRP-11 deferred — no validation story, tracked in manifest
as `deferred`.)
