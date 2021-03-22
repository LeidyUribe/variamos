import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxConstants,
  mxCellRenderer,
  mxRectangleShape,
  mxEdgeStyle,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

export const FUNCTION_SHAPE = 'function_shape';
export const FUNCTION_SHAPE_STYLE = 'function_shape_style';

export const functionStyles = {
  [mxConstants.STYLE_SHAPE]: FUNCTION_SHAPE,
  [mxConstants.STYLE_FILLCOLOR]: 'white',
  [mxConstants.STYLE_FONTCOLOR]: 'black',
  [mxConstants.STYLE_STROKECOLOR]: 'black',
  [mxConstants.STYLE_FONTSIZE]: 22,
  [mxConstants.STYLE_ROUNDED]: 1,
  [mxConstants.STYLE_STROKEWIDTH]: 3,
};

export const functionEdgesStyles = {
  [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_CONNECTOR,
  [mxConstants.STYLE_ROUNDED]: 1,
  [mxConstants.STYLE_STROKECOLOR]: 'black',
  [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
  [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
  [mxConstants.STYLE_EDGE]: mxEdgeStyle.ElbowConnector,
  [mxConstants.STYLE_ENDARROW]: mxConstants.ARROW_CLASSIC,
  [mxConstants.STYLE_STROKEWIDTH]: 3,
  [mxConstants.STYLE_LABEL_WIDTH]: 90,
  [mxConstants.STYLE_VERTICAL_LABEL_POSITION]: mxConstants.ALIGN_TOP,
};

export const ObjectStyleToStringStyle = (styleObject: Record<string, any>) => Object
  .entries(styleObject)
  .map(([key, value]) => `${key}=${value};`)
  .reduce((style, current) => style + current, '');

function FunctionShape() {}

// @ts-ignore
FunctionShape.prototype = new mxRectangleShape();
FunctionShape.prototype.constructor = FunctionShape;

export function registerFunctionShape() {
  mxCellRenderer.registerShape(FUNCTION_SHAPE, FunctionShape);
}
