import { generateTerrain } from "./valley-cross-terrain";

self.onmessage = (e: MessageEvent<{ cells: number; trees: number }>) => {
  const data = generateTerrain(e.data.cells, e.data.trees);
  (self as unknown as Worker).postMessage(data, [
    data.positions.buffer,
    data.normals.buffer,
    data.colors.buffer,
    data.index.buffer,
    data.treeMatrices.buffer,
    data.treeColors.buffer,
  ]);
};
