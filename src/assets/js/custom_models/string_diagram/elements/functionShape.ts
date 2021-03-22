import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxCellRenderer,
  mxRectangleShape,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

export const FUNCTION_SHAPE = 'function_shape';

class FunctionShape extends mxRectangleShape {}

export const registerFunctionShape = () => mxCellRenderer
  .registerShape(FUNCTION_SHAPE, FunctionShape);
