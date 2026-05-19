# 🚀 Interactive DSA Pathfinding & Labyrinth Visualizer

A sleek, minimal, high-performance web application designed to benchmark and visualize classic graph traversal and maze generation algorithms in real-time. Built with a digital-first, high-contrast dark aesthetic to make core computer science concepts visually intuitive.

## 🛠️ Tech Stack & Architecture
- **Frontend Framework:** React / Vite (Lightning-fast HMR and bundling)
- **Styling:** Custom CSS3 Matrix Grid (Zero UI-blocking rendering loops)
- **State Management:** Asynchronous event queues for non-blocking UI frame updates

## 🧠 Algorithms Implemented

### 🔍 Pathfinders
1. **A* Search (Weighted):** Uses a Manhattan Distance heuristic ($f(n) = g(n) + h(n)$) to navigate directly toward the target, significantly reducing explored nodes compared to unguided variants.
2. **Dijkstra's Algorithm (Weighted):** The golden standard for shortest paths; explores uniformly outward in expanding waves.
3. **Breadth-First Search (BFS) (Unweighted):** Guarantees the shortest path on unweighted graphs using a FIFO queue.
4. **Depth-First Search (DFS) (Unweighted):** Traverses aggressively down individual memory branches using a LIFO stack—excellent for visualizing worst-case path routing.

### 🧱 Maze Generators
- **Recursive Division:** A fractal-based geometric generator that splits chambers recursively with walls while algorithmically maintaining exactly one open, valid clearance path to guarantee solvability.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
