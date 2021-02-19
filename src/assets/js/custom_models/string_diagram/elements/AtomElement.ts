import { ModelElement } from "../../../model/ModelElement";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class AtomElement extends ModelElement {
    public constructor(currentModel:any){
        super(
            "morphism.png",
            "atom",
            50,
            50,
            "shape=rectangle",
            "Atom",
            currentModel
        );

        let properties = this.getProperties();
        properties.push(
            { 
                "id":"selected", "label": "Selected", "defValue":"false", 
                "inputType":"checkbox", "disabled":"false", "display":"true", 
                "onChange":this.getOnChangeSelectedFunction()
            }
        );
        this.setProperties(properties);
    }
    public getOnChangeSelectedFunction(){
        let graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        let onChangeSelectedFunction = function(this:any){
            let overlay = new mxCellOverlay(new mxImage("/img/check.png", 16, 16), 'Overlay tooltip');
            let dataCellId = this.getAttribute("data-cell-id");
            if(this.checked){
				graph.addCellOverlay(graph.getModel().getCell(dataCellId), overlay);
            }else{
				graph.removeCellOverlay(graph.getModel().getCell(dataCellId));
			}
        }
        return onChangeSelectedFunction;
    }
}