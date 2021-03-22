import { mxgraph, mxgraphFactory } from 'ts-mxgraph';

import { ModelElement } from '../../../model/ModelElement';
import type { StringDiagramModel } from '../StringDiagramModel';
import {
  functionStyles,
  FUNCTION_SHAPE_STYLE,
  leftVertexStyle,
  objectStyleToStringStyle,
  rightVertexStyle,
} from './functionStyles';
import { stringDiagramLabels } from './getEdgeLabel';

const topLabel = ';verticalLabelPosition=top;verticalAlign=bottom';

const {
  mxPoint,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

function createVertex(
  graph: mxgraph.mxGraph,
  cell: mxgraph.mxCell,
  value: string,
  offsetY: number,
  style: string,
  getVertexOffsetX: (cell: mxgraph.mxCell, vertex: mxgraph.mxCell) => number,
) {
  const vertex = graph.insertVertex(cell, null, value, 0, 0, 10, 16, style);
  vertex.geometry.relative = true;
  vertex.geometry.offset = new mxPoint(getVertexOffsetX(cell, vertex), offsetY - 10);
}

export class FunctionElement extends ModelElement {
  public constructor(currentModel: StringDiagramModel) {
    super(
      'morphism.png',
      'function',
      70,
      70,
      FUNCTION_SHAPE_STYLE,
      'Function',
      currentModel,
    );

    const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
    graph.setTooltips(true);
    stringDiagramLabels(graph);
    graph.getStylesheet().putCellStyle(FUNCTION_SHAPE_STYLE, functionStyles);
    const properties = this.getProperties();
    properties.push(
      {
        id: 'inputs',
        label: 'Inputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: this.createHandler(
          graph,
          objectStyleToStringStyle(leftVertexStyle),
          (_, vertex) => -vertex.geometry.width,
        ),
      },
      {
        id: 'outputs',
        label: 'Outputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: this.createHandler(
          graph,
          objectStyleToStringStyle(rightVertexStyle),
          (cell) => cell.geometry.width,
        ),
      },
      {
        id: 'selected',
        label: 'Morphism',
        defValue: 'false',
        inputType: 'checkbox',
        disabled: 'false',
        display: 'true',
        onChange: this.createMorphismCheckboxHandler(),
      },
    );
    this.setProperties(properties);
  }

  private createHandler(
    graph: mxgraph.mxGraph,
    style: string,
    getVertexOffsetX: (cell: mxgraph.mxCell, vertex: mxgraph.mxCell) => number,
  ) {
    return function handler(this: HTMLElement, event: any) {
      const dataCellId = this.getAttribute('data-cell-id') || '';
      const currentCell = graph.getModel().getCell(dataCellId);

      const attribute: string = event.target.value || '';

      const getOffsetY = (pos: number, total: number) => {
        const section = currentCell.geometry.height / total;
        const offset = section / 2;
        return section * pos - offset;
      };

      const params = attribute
        .split(',');
      params
        .forEach((att, index) => createVertex(
          graph,
          currentCell,
          att,
          getOffsetY(index + 1, params.length),
          style,
          getVertexOffsetX,
        ));
    };
  }

  // FIXME: it's not changing the style
  private createMorphismCheckboxHandler() {
    const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
    return function handler(this: HTMLElement) {
      const dataCellId = this.getAttribute('data-cell-id') || '';
      const currentCell = graph.getModel().getCell(dataCellId);
      let checked = currentCell.getAttribute('selected');
      checked = checked === 'true' ? 'false' : 'true';
      currentCell.setAttribute('selected', checked);

      graph.getModel().beginUpdate();
      if (checked === 'true') {
        currentCell.setStyle(currentCell.getStyle() + topLabel);
      } else {
        currentCell.setStyle(currentCell.getStyle().split(topLabel).join(''));
      }
      graph.getModel().endUpdate();
    };
  }
}
