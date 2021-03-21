import { mxgraph, mxgraphFactory } from 'ts-mxgraph';
import { ModelElement } from '../../../model/ModelElement';
import type { StringDiagramModel } from '../StringDiagramModel';

const {
  mxImage,
  mxCellOverlay,
  mxPoint,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

function createVertex(
  graph: mxgraph.mxGraph,
  cell: mxgraph.mxCell,
  value: any,
  offsetY: number,
  style: string,
  getVertexOffsetX: (cell: mxgraph.mxCell, vertex: mxgraph.mxCell) => number,
) {
  const vertex = graph.insertVertex(cell, null, value, 0, 0, 10, 16, style);
  vertex.geometry.relative = true;
  vertex.geometry.offset = new mxPoint(getVertexOffsetX(cell, vertex), offsetY - 10);
}

const vertexStyle = 'shape=line;verticalAlign=middle;fontSize=10;fontColor=black;strokeColor=black;';
const leftVertexStyle = `${vertexStyle}align=left;routingCenterX=-0.5;spacingLeft=12;`;
const rightVertexStyle = `${vertexStyle}align=right;routingCenterX=0.5;spacingRight=12;`;

export class FunctionElement extends ModelElement {
  public constructor(currentModel: StringDiagramModel) {
    super(
      'morphism.png',
      'function',
      70,
      70,
      'shape=rectangle',
      'Function',
      currentModel,
    );

    const properties = this.getProperties();
    const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
    properties.push(
      {
        id: 'inputs',
        label: 'Inputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: this.createHandler(graph, leftVertexStyle, (_, vertex) => -vertex.geometry.width),
      },
      {
        id: 'outputs',
        label: 'Outputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: this.createHandler(graph, rightVertexStyle, (cell) => cell.geometry.width),
      },
      {
        id: 'selected',
        label: 'Morphism',
        defValue: 'false',
        inputType: 'checkbox',
        disabled: 'false',
        display: 'true',
        onChange: this.getOnChangeSelectedFunction(),
      },
    );
    this.setProperties(properties);
  }

  public getOnChangeSelectedFunction() {
    const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
    const onChangeSelectedFunction = function (this:any) {
      const overlay = new mxCellOverlay(new mxImage('/img/check.png', 16, 16), 'Overlay tooltip');
      const dataCellId = this.getAttribute('data-cell-id');
      if (this.checked) {
        graph.addCellOverlay(graph.getModel().getCell(dataCellId), overlay);
      } else {
        graph.removeCellOverlay(graph.getModel().getCell(dataCellId));
      }
    };
    return onChangeSelectedFunction;
  }

  private createHandler(
    graph: mxgraph.mxGraph,
    style: string,
    getVertexOffsetX: (cell: mxgraph.mxCell, vertex: mxgraph.mxCell) => number,
  ) {
    return function handler(event: any) {
      // @ts-ignore
      const dataCellId: string = this.getAttribute('data-cell-id');
      // @ts-ignore
      const currentCell = graph.getModel().getCell(dataCellId);

      const attribute: string = event.target.value || '';

      if (currentCell.getChildCount() && attribute.length === 0) {
        currentCell.children.forEach((_, index) => {
          console.log(currentCell, index);
          const child = currentCell.remove(index);
          console.log(currentCell, index, child);
        });
      }

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
}
