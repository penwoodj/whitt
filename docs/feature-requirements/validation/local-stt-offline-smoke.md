# Local STT Offline Smoke Contract

Status: `offline-pending`. T9 owns required real-browser smoke. No pass claim yet.

1. Serve Vite dev and preview with COOP `same-origin` and COEP `require-corp`.
2. Preload `browser-whisper@1.1.0` runtime plus selected model.
3. Reload with external requests blocked.
4. Feed deterministic 16 kHz mono Float32 PCM.
5. Assert transcript result, zero cloud requests, and cached model/runtime reuse.

Passing adapter, fake, unit, or Storybook tests do not prove offline behavior.
No offline claim until browser smoke passes in both dev and preview with external
requests blocked.
