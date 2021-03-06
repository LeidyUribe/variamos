import { mxgraphFactory } from "ts-mxgraph";
const { mxEvent, mxCellAttributeChange } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigProperties {
    
    private vGraph:any; //VariaMos Graph

    public constructor(vGraph:any) {
        this.vGraph = vGraph;
    }

    //initialize element properties
    public initializeProperties(){
        let configPropertiesObject = this;
        let selChanges = this.selectionChanged;
        const graph = this.vGraph.getGraph();

        if(graph.getSelectionModel().eventListeners.length > 3){ //remove previous listeners
            graph.getSelectionModel().eventListeners.pop();
            graph.getSelectionModel().eventListeners.pop();
        }

        graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender:any, evt:any){
            selChanges(configPropertiesObject);
        });
    }

    //method to display properties when element selected (cell)
    public selectionChanged(configPropertiesObject:any){
        configPropertiesObject.vGraph.getGraph().container.focus();
        configPropertiesObject.vGraph.getDivProperties().innerHTML = "";
        let cell = configPropertiesObject.vGraph.getGraph().getSelectionCell();
        let elements = configPropertiesObject.vGraph.getCurrentModel().elements;
        if(cell != null){
            if(cell.value.attributes){
                let currentType = cell.getAttribute("type");
                let currentProperties = [];
                let attrs = cell.value.attributes;

                if(cell.isVertex()){ //get properties for current vertex
                    for (let i = 0; i < elements.length; i++){
                        if(elements[i].type == currentType){
                            currentProperties = elements[i].properties;
                        }
                    }
                }

                if(cell.isEdge()){ //get properties for current edge
                    currentProperties = configPropertiesObject.vGraph.getCurrentModel().relationProperties;
                }

                configPropertiesObject.setIdProperty(cell);

                for (let i = 0; i < attrs.length; i++){
                    for (let j = 0; j < currentProperties.length; j++){
                        if(currentProperties[j].id == attrs[i].nodeName){
                            switch (currentProperties[j].inputType) {
                                case "text":
                                    configPropertiesObject.createTextField(configPropertiesObject.vGraph.getGraph(), attrs[i], cell, currentProperties[j]);
                                    break;
                                case "select":
                                    configPropertiesObject.createSelectField(configPropertiesObject.vGraph.getGraph(), attrs[i], cell, currentProperties[j]);
                                    break;
                                case "checkbox":
                                    configPropertiesObject.createCheckboxField(configPropertiesObject.vGraph.getGraph(), attrs[i], cell, currentProperties[j]);
                                    break;
                                default:
                                    configPropertiesObject.createTextField(configPropertiesObject.vGraph.getGraph(), attrs[i], cell, currentProperties[j]);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    //set the porperty id, for vertex is id, for edge is source plus target
    public setIdProperty(cell:any){
        let idSection = document.createElement('div');
        idSection.className = "property-id-section";
        if(cell.isVertex()){
            idSection.innerText = "ID: "+cell.getId();
        }else{
            idSection.innerText = "Source: "+cell.source.getId()+" - Target: "+cell.target.getId();
        }
        this.vGraph.getDivProperties().appendChild(idSection);
    }

    //create a checkbox field
    public createCheckboxField(graph:any, attribute:any, cell:any, currentProperties:any){
        let input = document.createElement('input');	
	    input.setAttribute('type', "checkbox");
        input.id = "property-" + attribute.nodeName;

        if (attribute.nodeValue == "true")
        {
            input.checked = true;
        }

        input.className = "form-control";
        input.value = attribute.nodeValue;
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, currentProperties.display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    //create a select field
    public createSelectField(graph:any, attribute:any, cell:any, currentProperties:any){
        let values = currentProperties.inputValues;
        let input = document.createElement("select");
        input.id = "property-" + attribute.nodeName;

        for (let i = 0; i < values.length; i++){
            let option = document.createElement("option");
            option.setAttribute("value", values[i]);
            option.innerText = values[i];
            if (values[i] == attribute.nodeValue){
                option.setAttribute("selected", "selected");
            }
            input.appendChild(option);
        }

        input.className="form-control";        
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, currentProperties.display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    //create a text field
    public createTextField(graph:any, attribute:any, cell:any, currentProperties:any){
        let input = document.createElement('input');	
	    input.setAttribute('type', "text");
        input.id = "property-" + attribute.nodeName;
        input.className = "form-control";
        input.value = attribute.nodeValue;
        let display =  this.checkCustomDisplay(cell, currentProperties);       
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    //verify if the property should be displayed or not
    public checkCustomDisplay(cell:any, currentProperties:any){
        if(currentProperties.display){
            if(currentProperties.display == "basedOnPropertyValue"){
                if(currentProperties.displayIfValue == cell.getAttribute(currentProperties.displayCheckProperty)){
					return "true";
				}else{
                    return "false";
                }
            }else if(currentProperties.display == "false"){
                return "false";
            }
        }
        return "true";
    }

    //create a general div in which the input is stored
    public createField(attribute:any, input:any, label:any, disabled:any, display:any){
        let tr = document.createElement('div');

        if(disabled == "true"){ //disable input
            input.disabled = true;
        }

        if(display == "true"){
            tr.style.display = "";
        }else{
            tr.style.display = "none";
        }

        tr.className = "div-property-field";
        tr.id = "tr-" + attribute.nodeName;
        let td = document.createElement('div');
        td.innerText = label+": ";
        tr.appendChild(td);
        td.appendChild(input);
        tr.appendChild(td);
        this.vGraph.getDivProperties().appendChild(tr);
    }

    //execute actions if the content of the input is changed
    public executeApplyHandler(graph:any, input:any, cell:any, attributeNodeName:any, currentProperties:any){
        this.applyCustomFunctions(input, cell, currentProperties);
        let applyHandler = function(){
            let oldValue = cell.getAttribute(attributeNodeName, '');
            let newValue = input.value;

            if(input.type == "checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
            }
            
            if (newValue != oldValue){ //verify value modified from the form
                graph.getModel().beginUpdate();
                try{
                    let edit = new mxCellAttributeChange(cell, attributeNodeName, newValue); //change to newValue
                    graph.getModel().execute(edit);

                    //update clon cell if exists
                    let clon = graph.getModel().getCell("clon"+cell.getId());
					if(clon){
						let edit2 = new mxCellAttributeChange(clon, attributeNodeName, newValue);
						graph.getModel().execute(edit2);
					}
                }
                catch(error){
                    console.log(error);
                }
				finally{
					graph.getModel().endUpdate();
				}
            }
        }
        mxEvent.addListener(input, 'focusout', applyHandler);
    }

    //apply the actions to the inputs
    public applyCustomFunctions(input:any, cell:any, currentProperties:any){
        if(currentProperties.onChange){
            input.setAttribute("data-cell-id",cell.getId());
            input.onchange = currentProperties.onChange;
        }

        if(currentProperties.customTypeText){
            input.setAttribute('type', currentProperties.customTypeText);
        }
    }
}