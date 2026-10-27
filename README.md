# AlgoTales

**Data structures and algorithms told as stories, not as slideshows.**

AlgoTales walks you through a concept one step at a time: the algorithm moves, a narration panel explains what it is thinking, and the matching line of code lights up beside it. Four concepts are playable today — binary search, stack, linked list and binary tree.

🔗 **Live:** [algo-tales.vercel.app](https://algo-tales.vercel.app)

![AlgoTales banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Why

Most algorithm visualisers animate the data structure and stop there. You see the pointers move but not the reasoning, and the code that produces the movement stays in a separate tab. AlgoTales keeps the three views — animation, narration, code — on one screen and steps all of them together, so the mental model builds in the same pass as the syntax.

## What you get

- **Three screens** — a landing page, a concept menu, and a full-screen visualiser for the concept you pick
- **Playback controls** — play, pause, step forward, reset, and a speed slider from slow-motion to quick
- **Step timeline** — every step of the run, listed, so you can jump back to the moment you lost the thread
- **Thought bubbles** — the algorithm's current decision in plain English ("the target is larger than the midpoint, so drop the left half")
- **Code sync** — the source line for the current step is highlighted as it executes
- **Editable inputs** — binary search takes your own sorted array and target; the visualiser re-plans the run for the values you type

## Concepts

| Concept | What the visualiser shows |
|---|---|
| Binary search | Left/right/mid pointers converging, with a linear-scan comparison so the speed-up is visible |
| Stack | Push and pop on a LIFO structure, with the top pointer tracked |
| Linked list | Node creation, traversal and pointer rewiring |
| Binary tree | Insertion and traversal across a two-child tree |

## Stack

- **React 19** + **TypeScript**
- **Vite 6** for dev and build
- **Tailwind CSS 4** for styling, with CSS custom properties for the neon theme
- **Motion** (Framer Motion) for the step animations and page transitions
- **lucide-react** for icons

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the build
npm run lint     # tsc --noEmit (type check)
```

## Project layout

```
src/
  App.tsx                        # landing → menu → visualiser routing (view state, no router)
  pages/
    LandingPage.tsx              # hero, animated particles
    MenuPage.tsx                 # concept picker
    VisualizationPage.tsx        # shell that drives a visualiser: playback, speed, steps
  components/
    ControlsPanel.tsx            # play / pause / step / reset / speed
    LearnPanel.tsx               # concept explanation
    StoryPanel.tsx               # narration for the current step
    visualizers/                 # BinarySearch, Stack, LinkedList, BinaryTree
    enhancements/                # StepTimeline, ThoughtBubble, CodeSyncPanel
```

Each visualiser is a self-contained component that receives `isPlaying`, `speed`, `stepTrigger` and `resetTrigger`, computes its own step list, and reports progress back up through `onStoryUpdate` / `onComplete`. Adding a fifth concept means adding one file under `visualizers/` and one entry in `MenuPage`.

## Status and next steps

- Started as a Google AI Studio scaffold — `@google/genai` is still listed in `package.json` but nothing in `src/` imports it, so it can be dropped
- No automated tests yet; the step generators are pure functions over an input array, which makes them the right place to start
- Candidate concepts: queue, hash map, quicksort partitioning, BFS/DFS on the existing tree renderer

## Licence

Not yet licensed. Open an issue if you want to reuse this.
