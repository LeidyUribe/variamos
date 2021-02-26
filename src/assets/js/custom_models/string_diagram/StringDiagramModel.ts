import { Model } from "../../model/Model";

export class StringDiagramModel extends Model {

    public constructor() {
        super(
            "string_diagram",
            ["AtomElement"]
        );

        let constraints = this.getConstraints();
        constraints = [
            {
                "source":"true", "type":"function", "attr":null,
                "value":null, "min":0, "max":null, "validNeighbors":["function"],
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
            
        ];
        this.setConstraints(constraints);

        let relationStyles = this.getRelationStyles();
        relationStyles.push(
            { 
                "type":"and", 
                "source":["function"], 
                "target":["function"],
            }
        );
        this.setRelationStyles(relationStyles);
    }

    public customConstraintsRelations(graph:any, source:any, target:any){
        let returnConstraintRelations = {};

		//only one custom file per component
		if(target.getAttribute("type") == "function"){
			let targetId = target.getId();
			let incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(targetId));
            console.log(incoEgdes)
			for (let j = 0; j < incoEgdes.length; j++) {
				if(incoEgdes[j].source.getAttribute("type")=="custom"){
                    returnConstraintRelations = {
                        "message":"Invalid connection only one Custom. File can be linked for this component"
                    }
                    break;
				}
			}
		}

		return returnConstraintRelations;
	}
}

