import { mxgraphFactory } from 'ts-mxgraph';
import { FUNCTION_SHAPE } from './functionShape';

const {
  mxConstants,
  mxEdgeStyle,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

export const FUNCTION_SHAPE_STYLE = 'function_shape_style';

export const objectStyleToStringStyle = (styleObject: Record<string, any>) => Object
  .entries(styleObject)
  .map(([key, value]) => `${key}=${value};`)
  .reduce((style, current) => style + current, '');

export const setStylesToHTMLElement = (
  element: HTMLElement,
  styles: Partial<HTMLElement['style']>,
) => Object
  .entries(styles)
  /* eslint-disable no-param-reassign */
  // @ts-ignore
  .forEach(([key, value]) => { element.style[key] = value; });
  /* eslint-enable no-param-reassign */

export const functionStyles = {
  [mxConstants.STYLE_SHAPE]: FUNCTION_SHAPE,
  [mxConstants.STYLE_FILLCOLOR]: 'white',
  [mxConstants.STYLE_FONTCOLOR]: 'black',
  [mxConstants.STYLE_STROKECOLOR]: 'black',
  [mxConstants.STYLE_FONTSIZE]: 22,
  [mxConstants.STYLE_ROUNDED]: 1,
  [mxConstants.STYLE_STROKEWIDTH]: 3,
};

export const functionStylesTopLabel = {
  ...functionStyles,
  [mxConstants.STYLE_VERTICAL_LABEL_POSITION]: 'top',
  [mxConstants.STYLE_VERTICAL_ALIGN]: 'bottom',
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

export const vertexStyle = {
  [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LINE,
  [mxConstants.STYLE_FONTSIZE]: 10,
  [mxConstants.STYLE_FONTCOLOR]: 'black',
  [mxConstants.STYLE_STROKECOLOR]: 'black',
};

export const leftVertexStyle = {
  ...vertexStyle,
  [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_LEFT,
  [mxConstants.STYLE_ROUTING_CENTER_X]: -0.5,
  [mxConstants.STYLE_SPACING_LEFT]: 12,
};

export const rightVertexStyle = {
  ...vertexStyle,
  [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_RIGHT,
  [mxConstants.STYLE_ROUTING_CENTER_X]: 0.5,
  [mxConstants.STYLE_SPACING_RIGHT]: 12,
};

// TODO: define as css styles
export const edgeLabelContainer = {
  backgroundColor: 'white',
  flex: '1',
  alignContent: 'center',
  alignItems: 'center',
};

export const edgeLabelContent = {
  fontSize: '20px',
  color: 'black',
};
