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
                "value":null, "min":0, "max":null, "validNeighbors":null,
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
            
        ];
        this.setConstraints(constraints);
    }
}