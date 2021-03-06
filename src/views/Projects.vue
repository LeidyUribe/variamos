<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>

  <Breadcrumb :navigationList="navigationList" />
  
  <div class="row">
    <div class="col-xl-6 col-lg-6" v-if="projects.length > 0">
      <div class="card shadow mb-4" v-for="(project, index) in projects" :key="project">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <router-link class="m-0 font-weight-bold text-primary" :to="'/projects/'+project.getName()">Project: {{ project.getName() }}</router-link>
            <div class="right-buttons">
              <div class="btn-group">
                <div class="csstooltip">
                  <i v-on:click="exportProject(index, project.getName())" class="fas fa-upload hover-hand"></i>
                  <span class="csstooltiptext">Export this project (json file)</span>
                </div>
                <div class="csstooltip">
                  <i v-on:click="removeProject(index)" class="fas fa-trash-alt hover-hand"></i>
                  <span class="csstooltiptext">Remove this project</span>
                </div>
              </div>
            </div>
        </div>
        <div class="card-body">
          <router-link v-for="model in project.getAvailableModels()" :key="model" :to="'/projects/'+project.getName()+'/'+model" class="btn btn-info marr20">
            {{ getBeautyModelName(model) }}
          </router-link>
        </div>
      </div>

      <!-- import project -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Import a Project</h6>
        </div>

        <div class="card-body">
          <div class="form-group">
            <label><b>Upload the JSON project file:</b></label><br />
            <input type="file" ref="file" v-on:change="importProject" />
          </div>
          <div class="form-group">
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-6 col-lg-6" v-else>
      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Projects</h6>
        </div>
        <div class="card-body">
          Create your first project
        </div>
      </div>

      <!-- import project -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Import a Project</h6>
        </div>

        <div class="card-body">
          <div class="form-group">
            <label><b>Upload the JSON project file:</b></label><br />
            <input type="file" ref="file" v-on:change="importProject" />
          </div>
          <div class="form-group">
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-6 col-lg-6">

      <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Create a New Project</h6>
        </div>

        <div class="card-body">
          <div class="form-group">
            <label><b>Project Name:</b> (Blank spaces not allowed)</label>
            <input type="text" class="form-control" v-model="projectName" placeholder="Enter projectName">
          </div>
          <div class="form-group">
            <label><b>Select available models for current project:</b></label>
            <div class="form-check" v-for="avaModel in avaModels" :key="avaModel">
              <input class="form-check-input" type="checkbox" v-model="projectAvailableModels" :value="avaModel" id="defaultCheck1">
              <label class="form-check-label" for="defaultCheck2">
                {{ getBeautyModelName(avaModel) }}
              </label>
            </div>
          </div>
          <button v-on:click="createProject" class="btn btn-info marr20">Create Project</button>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-6 col-lg-3">

          <!-- export all project -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Export All Existing Projects</h6>
            </div>

            <div class="card-body">
              <div class="form-group">
                  <button v-on:click="exportAllProjects" class="btn btn-info marr20">Export All Projects</button>         
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-lg-3">

          <!-- import project -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Import Multiple Projects</h6>
            </div>

            <div class="card-body">
              <div class="form-group">
                <label><b>Upload the JSON file:</b></label><br />
                <input type="file" id="fileAll" ref="file2" v-on:change="importAllProjectCheck" />
              </div>
              <div class="form-group">
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <GlobalModalPlugin ref="modalPlugin" />

  </div>
</template>

<script lang="ts">
import { Vue, Options, mixins } from 'vue-class-component';
import { Project as ProjectClass } from '@/store/Project';
import Breadcrumb from '@/components/Breadcrumb.vue';
import GlobalVueFunctions from '../mixins/GlobalVueFunctions';

@Options({
  components: {
    Breadcrumb
  }
})
export default class Projects extends mixins(GlobalVueFunctions) {
  public avaModels:any;
  public projectName:string = "";
  public projectAvailableModels:any = [];
  public projects:any = [];
  public $store:any; //references vuex store
  public $modal:any; //references modalPlugin
  public navigationList:any = [
    {
        "title":"Home", "route":"/"
    },
    {
        "title":"Projects", "route":""
    },
  ];

  public beforeMount(){
    this.projects = this.$store.getters.getProjects;
    this.avaModels = this.$store.getters.getConfigApp.getInstalledModels();
  }

  public mounted(){
    this.$modal = <any> this.$refs.modalPlugin; //reference the modal plugin
  }

  //create a new project
  public createProject(){
    if(this.projectName == ""){
      this.$modal.setData("error", "Error", "Please enter a project name");
      this.$modal.click();
    }else if (/\s/.test(this.projectName)) {
      this.$modal.setData("error", "Error", "Blank spaces not allowed in project name");
      this.$modal.click();
    }else if(ProjectClass.checkIfProjectExists(this.projects, this.projectName)){
      this.$modal.setData("error", "Error", "A project with that name already exists");
      this.$modal.click();
    }else{
      if(this.projectAvailableModels.length > 0){
        let project = new ProjectClass(this.projectName, "", this.projectAvailableModels);
        this.$store.commit("addProject",project);
        this.$modal.setData("success", "Success", "Project created successfully");
        this.$modal.click();
      }else{
        this.$modal.setData("error", "Error", "You must select at least one model");
        this.$modal.click();
      }
    }
  }

  public importAllProjectCheck(e:any){
    let store = this.$store;
    let vueComponent = this;
    let confirmAction = function(){
      vueComponent.importAllProjects(e, store);
    }
    let secondaryAction = function(){
      let inputFileAll = document.getElementById("fileAll") as any;
      if(inputFileAll){
        inputFileAll.value = '';
      }
    }
    this.$modal.setData("warning", "Warning", "Are you sure you want to remove ALL current projects?", "confirm", confirmAction, secondaryAction);
    this.$modal.click();
  }

  //remove all projects and import projects from json file
  public importAllProjects(e:any, store:any){
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length){
      return;
    }
    else{
      store.commit("removeAllProjects"); //remove all projects
      let fileToLoad = files[0];
      let fileReader = new FileReader();
      let projects = this.projects;
      fileReader.onload = function(fileLoadedEvent:any) 
      {
        let textFromFileLoaded = fileLoadedEvent.target.result;
        let jsonText = JSON.parse(textFromFileLoaded);
        for (let i = 0; i < jsonText.length; i++) { //import new projects
          if(jsonText[i].hasOwnProperty('name') && jsonText[i].hasOwnProperty('xml') && jsonText[i].hasOwnProperty('availableModels')){
            let project = new ProjectClass(jsonText[i].name, jsonText[i].xml, jsonText[i].availableModels);
            store.commit("addProject",project);
          }
        }
        location.reload(); //reload page
      }
      fileReader.readAsText(fileToLoad, "UTF-8");
    }
  }

  //export existing project (json format)
  public importProject(e:any){
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length){
      return;
    }
    else{
      let fileToLoad = files[0];
      let fileReader = new FileReader();
      let projects = this.projects;
      let modal = this.$modal;
      let store = this.$store;
      fileReader.onload = function(fileLoadedEvent:any) 
      {
        let textFromFileLoaded = fileLoadedEvent.target.result;
        let jsonText = JSON.parse(textFromFileLoaded);
        if(jsonText.hasOwnProperty('name') && jsonText.hasOwnProperty('xml') && jsonText.hasOwnProperty('availableModels')){
          let newProjectName = jsonText.name;
          if(ProjectClass.checkIfProjectExists(projects, newProjectName)){
            modal.setData("error", "Error", "A project called '"+newProjectName+"' already exists");
            modal.click();
          }else{
            let project = new ProjectClass(newProjectName, jsonText.xml, jsonText.availableModels);
            store.commit("addProject",project);
            modal.setData("success", "Success", "Project created successfully");
            modal.click();
          }
        }
        else{
          modal.setData("error", "Error", "Invalid JSON format, it must contain 'name', 'xml', and 'availableModels' keys");
          modal.click();
        }
      }
      fileReader.readAsText(fileToLoad, "UTF-8");
    }
  }

  //export all projects in json format
  public exportAllProjects(){
    let jsonAllProjects = this.$store.getters.getAllProjects;
    this.generateJsonFile(jsonAllProjects, "MultiProject-MultiProjects.json");
  }

  //export project in json format
  public exportProject(index:any, name:any){
    let jsonProject = this.$store.getters.getProjectJson(index);
    this.generateJsonFile(jsonProject, "Project-"+name+".json");
  }

  //generate and download json file
  public generateJsonFile(text:string, filename:string){
    let pseudoelement = document.createElement("a");
    let blob = new Blob([ text ], { type: "application/json" });

    pseudoelement.setAttribute("href", window.URL.createObjectURL(blob));
    pseudoelement.setAttribute("download", filename);
    pseudoelement.dataset.downloadurl = ["application/json", pseudoelement.download, pseudoelement.href].join(":");
    pseudoelement.draggable = true;
    pseudoelement.classList.add("dragout");
    pseudoelement.click();
  }

  //remove selected project
  public removeProject(index:any){
    let store = this.$store;
    let confirmAction = function(){
      store.commit("removeProject", index);
    }
    this.$modal.setData("warning", "Warning", "Are you sure you want to remove this project?", "confirm", confirmAction);
    this.$modal.click();
  }
}
</script>

<style>
.marr20{
  margin-right: 10px;
}

.hover-hand{
  padding-left:5px;
}

.hover-hand:hover{
  cursor: pointer;
}
</style>