import { mxgraph, mxgraphFactory } from 'ts-mxgraph';

import { ModelElement } from '../../../model/ModelElement';
import type { StringDiagramModel } from '../StringDiagramModel';
import {
  functionStyles,
  FUNCTION_SHAPE_STYLE,
  leftVertexStyle,
  objectStyleToStringStyle,
  rightVertexStyle,
  functionStylesTopLabel,
} from './functionStyles';
import { stringDiagramLabels } from './getEdgeLabel';

const {
  mxPoint,
  mxClipboard,
  mxEvent,
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
        onChange: this.createMorphismCheckboxHandler(graph),
      },
    );
    this.setProperties(properties);
    const parents: any = new Object();

    mxEvent.addListener(document, 'copy', function (evt: any) {
      const cells = graph.getSelectionCells();
      var result = graph.getExportableCells(cells);

      for (var i = 0; i < result.length; i++) {
        parents[i] = graph.model.getParent(cells[i]);
      }

      mxClipboard.insertCount = 1;
      mxClipboard.setCells(graph.cloneCells(result));

      return result;

    });

    mxEvent.addListener(document, 'paste', function (evt: any) {
      if (!mxClipboard.isEmpty()) {
        var cells = graph.getImportableCells(mxClipboard.getCells());
        var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
        var parent = graph.getDefaultParent();

        graph.model.beginUpdate();
        try {
          for (var i = 0; i < cells.length; i++) {
            var tmp = (parents != null && graph.model.contains(parents[i])) ?
              parents[i] : parent;
            cells[i] = graph.importCells([cells[i]], delta, delta, tmp)[0];
          }
        }
        finally {
          graph.model.endUpdate();
        }

        // Increments the counter and selects the inserted cells
        mxClipboard.insertCount++;
        graph.setSelectionCells(cells);
      }
    })
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
  private createMorphismCheckboxHandler(graph: mxgraph.mxGraph) {
    return function handler(this: HTMLElement) {
      const dataCellId = this.getAttribute('data-cell-id') || '';
      const currentCell = graph.getModel().getCell(dataCellId);
      let checked = currentCell.getAttribute('selected');
      checked = checked === 'true' ? 'false' : 'true';
      currentCell.setAttribute('selected', checked);

      graph.getModel().beginUpdate();
      if (checked === 'true') {
        currentCell.setStyle(objectStyleToStringStyle(functionStylesTopLabel));
      } else {
        currentCell.setStyle(FUNCTION_SHAPE_STYLE);
      }
      graph.getModel().endUpdate();
    };
  }
}
