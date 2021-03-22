import type { mxgraph } from 'ts-mxgraph';
import { edgeLabelContainer, setStylesToHTMLElement, edgeLabelContent } from './functionStyles';

function getEdgeLabel(cell: mxgraph.mxCell) {
  const div = document.createElement('div');
  setStylesToHTMLElement(div, edgeLabelContainer);
  const span = document.createElement('span');
  setStylesToHTMLElement(span, edgeLabelContent);
  span.append(cell.source.value);
  div.appendChild(span);
  return div;
}

export const stringDiagramLabels = (graph: mxgraph.mxGraph) => {
  const originalGetLabel = graph.getLabel.bind(graph);

  // FIXME: find another way to modify the label behavior
  /* eslint-disable no-param-reassign */
  // @ts-ignore
  graph.getLabel = (cell: mxgraph.mxCell) => (
    cell.edge ? getEdgeLabel(cell) : originalGetLabel(cell)
  );
  /* eslint-enable no-param-reassign */
};
