class View{
    constructor(vm, viewmanifest, projectaddress){
        this.address = projectaddress;
        this.treemanager = new TreeManager(vm);
        this.vm = vm;
        this.properties = viewmanifest;
        this.askforsave = function(){
            this.vm.environment.saveProject(`threadaddress:${this.address}`,this.treemanager.threads);
        };
        this.activateCanvas = function(){
            this.properties.html.classList.add('active-dropzone');
        };
        this.deactivateCanvas = function(){
            this.properties.html.classList.remove('active-dropzone');
        };
        this.dragenter = (e)=>{
            e.preventDefault();
            this.activateCanvas();
        };
        this.dragleave = (e)=>{
            e.preventDefault();
            this.deactivateCanvas();
        };
        this.dragover = (e)=>{
            e.preventDefault();
        };
        this.drop = (e)=>{
            e.preventDefault();
            this.activateCanvas();
            const blockId = e.dataTransfer.getData('application/x-block-id') || e.dataTransfer.getData('block-id') || e.dataTransfer.getData('text/plain') || '';
            if (!blockId) {this.deactivateCanvas();return;}
            let blockElement = document.getElementById(blockId);
            if (!blockElement){
                blockElement = document.querySelector(`[id="${blockId}"]`);
            }
            if(blockElement){
                if(blockElement.getAttribute('data-blocktype') == "definidor"){
                    alert('No se puede añadir un nuevo evento dentro de otro. Crea un subevento o colócalo fuera del bloque definidor.');
                    this.deactivateCanvas();
                    return;
                }
                const target = write_precompilado(blockElement, 0);
                this.treemanager.addLine(target);
                this.vm.uimanager.refreshAllViews();
                this.deactivateCanvas();
                console.log('Recomponiendo canvas en View');
            }
        };
        this.allowDragging = function(bool){
            if(!bool){
                console.log('Dragging no permitido en este viewer');
                this.properties.html.removeEventListener('dragenter',this.dragenter);
                this.properties.html.removeEventListener('dragleave',this.dragleave);
                this.properties.html.removeEventListener('dragover', this.dragover);
                this.properties.html.removeEventListener('drop', this.drop);
            }else{
                this.properties.html.addEventListener('dragenter',this.dragenter);
                this.properties.html.addEventListener('dragleave',this.dragleave);
                this.properties.html.addEventListener('dragover', this.dragover);
                this.properties.html.addEventListener('drop', this.drop);
            }
        };this.allowDragging(true);
    }
}

class BlockView extends View {
    constructor(vm, manifest, projectaddress){
        super(vm, manifest, projectaddress);
        this.addLineToBlocks = function(block){
            this.properties.html.appendChild(block);
        };
        this.refresh = function() {
            const children = Array.from(this.properties.html.children);
            children.forEach(child => {if (child.classList.contains('allblock')) {child.remove();}});
            for (let i = 0; i < this.treemanager.threads.length; i++) {
                const thread = this.treemanager.threads[i];
                const blockElement = document.getElementById(thread.play);
                if (blockElement) {
                    const cloned = new InteractiveBlock(this.vm, blockElement, thread.id, this);
                    cloned.html.setAttribute('data-level', thread.level || 0);
                    this.addLineToBlocks(cloned.html);
                }
            }
        };
        this.add = function(block){this.addLineToBlocks(block);}
    }
}