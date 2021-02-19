import { Model } from "../../model/Model";

export class StringDiagramModel extends Model {

    public constructor() {
        super(
            "string_diagram",
            ["AtomElement"]
        );
    }
}