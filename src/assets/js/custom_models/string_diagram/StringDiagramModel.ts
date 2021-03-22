import { Model } from '../../model/Model';
import { registerFunctionShape } from './elements/functionShape';
import { functionEdgesStyles, objectStyleToStringStyle } from './elements/functionStyles';

registerFunctionShape();
export class StringDiagramModel extends Model {
  public constructor() {
    super(
      'string_diagram',
      ['FunctionElement'],
    );
    let constraints = this.getConstraints();
    constraints = [
      {
        source: 'true',
        type: 'function',
        attr: null,
        value: null,
        min: 0,
        max: null,
        validNeighbors: null,
        countError: 'Only 1 target allowed',
        typeError: 'Only shape targets allowed',
      },

    ];
    this.setConstraints(constraints);

    const relationStyles = this.getRelationStyles();
    relationStyles.push(
      {
        source: [undefined],
        target: [undefined],
        style: objectStyleToStringStyle(functionEdgesStyles),
      },
    );
    this.setRelationStyles(relationStyles);
  }

  public customConstraintsRelations(graph:any, source:any, target:any) {
    const output = source.value;
    const input = target.value;

    let message = {};

    if (!output || !input) message = { message: 'Add types for input/output' };
    else if (output !== input) message = { message: 'Invalid type' };

    return message;
  }
}
