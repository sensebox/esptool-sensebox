// Sketch types supported by @sensebox/flash-tool, each reachable as /<sketch>
export const SKETCHES = ['circuitpy', 'ota', 'basic', 'standard'] as const
export type Sketch = (typeof SKETCHES)[number]
