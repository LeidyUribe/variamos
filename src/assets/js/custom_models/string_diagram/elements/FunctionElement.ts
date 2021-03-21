import { mxgraphFactory } from 'ts-mxgraph';
import { ModelElement } from '../../../model/ModelElement';

const {
  mxImage,
  mxCellOverlay,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

export class FunctionElement extends ModelElement {
  public constructor(currentModel:any) {
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
    properties.push(
      {
        id: 'inputs',
        label: 'Inputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: () => {},
      },
      {
        id: 'outputs',
        label: 'Outputs',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
        onChange: () => {},
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
}
