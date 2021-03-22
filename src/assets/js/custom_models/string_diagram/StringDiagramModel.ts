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
        source: ['function'],
        target: ['function'],
        style: objectStyleToStringStyle(functionEdgesStyles),
      },
    );
    this.setRelationStyles(relationStyles);
  }

  public customConstraintsRelations(graph:any, source:any, target:any) {
    let returnConstraintRelations = {};

    const output = source.value;
    const input = target.value;

    if (!output || !input) returnConstraintRelations = { message: 'Add types for input/output' };

    // output === input ?
    //   undefined :
    //   returnConstraintRelations = { message: 'Invalid type' };

    return returnConstraintRelations;
  }
}
