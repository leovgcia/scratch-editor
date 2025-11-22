class Block {
    constructor(vm) {
        this.vm = vm;
        this.ios = [];
        this.properties = {};
        this.html = document.createElement('div');
        this.render = function(group){group.appendChild(this.html);};
        this.dragstartlistener = (e)=>{
            try {
                e.dataTransfer.setData('text/plain', this.html.id);
                e.dataTransfer.setData('application/x-block-id', this.html.id);
                e.dataTransfer.setData('block-id', this.html.id);
            } catch (err) {console.error('Drag dataTransfer setData error:', err);}
        };
        this.makeDraggable = function(bool){
            if(!bool){
                this.html.draggable = false;this.html.classList.remove('makedraggable');this.properties["isDraggable"] = false;
                this.html.removeEventListener('dragstart', this.dragstartlistener);
            }else{
                this.html.draggable = true;this.properties["isDraggable"] = true;this.html.classList.add('makedraggable');
                if(!this.html.id || this.html.id === ''){this.html.id = `block-${Math.random().toString(36).slice(2,9)}`;}
                this.html.addEventListener("dragstart", this.dragstartlistener);
            }
        };this.makeDraggable(true);
        this.addPropertiesFromManifest = function(blockmanifest){
            for (let _blockproperty_ in blockmanifest) {
                this.properties[_blockproperty_] = blockmanifest[_blockproperty_];
                if (_blockproperty_ == "internal_function"){this.html.id = blockmanifest[_blockproperty_];};
                if (_blockproperty_ == "blocktype") {
                    this.html.setAttribute("data-blocktype", blockmanifest[_blockproperty_]);
                    this.properties["blocktype"] = blockmanifest[_blockproperty_];
                };
                if (_blockproperty_ == "label") {
                    const rawLabel = blockmanifest[_blockproperty_];
                    const parts = rawLabel.split(/(<\![^>]+>)/g);
                    for (const part of parts) {
                        if (typeof part === 'string' && part.startsWith('<!') && part.endsWith('>')) {
                            const element = decode_literal(this.vm, part);
                            if (element instanceof HTMLElement) {this.html.appendChild(element);
                            } else {this.html.appendChild(document.createTextNode(String(element)));}
                        } else if (part !== undefined && part !== null && part !== '') {
                            this.html.appendChild(document.createTextNode(part));
                        }
                    }
                };
            }
        }
    }
}

class InteractiveBlock{
    constructor(vm, htmlcrudo, threadid, viewer){
        this.vm = vm;
        this.viewer = viewer;
        this.properties = {};
        this.ios = [];
        this.html = cloneBlockUI(htmlcrudo);
        this.html.dataset.threadId = threadid;
        this.dragstartlistener = (e)=>{
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.html.dataset.threadId);
            this.html.style.opacity = '0.5';
        };
        this.dragendlistener = (e)=>{
            this.html.style.opacity = '1';
        };
        this.dragleavelistener = (e)=>{
            this.html.style.borderTop = 'none';
        };
        this.dragoverlistener = (e)=>{
            e.preventDefault();
            const rect = this.html.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const height = rect.height;
            if (offsetY < height / 2) {
                this.html.style.borderTop = '3px solid rgb(161, 161, 161)';
                this.html.style.borderBottom = 'none';
            } else {
                this.html.style.borderBottom = '3px solid rgb(161, 161, 161)';
                this.html.style.borderTop = 'none';
            }
            e.dataTransfer.dropEffect = 'move';
        };
        this.droplistener = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.html.style.borderTop = 'none';
            let draggedThreadId = parseInt(e.dataTransfer.getData('text/plain'));
            const menuBlockId = e.dataTransfer.getData('application/x-block-id') || e.dataTransfer.getData('block-id');
            // Caso 1: Se está arrastrando un bloque desde el menú (no existe thread)
            if (isNaN(draggedThreadId) && menuBlockId) {
                let menuBlockElement = document.getElementById(menuBlockId);
                if (!menuBlockElement) {menuBlockElement = document.querySelector(`[id="${menuBlockId}"]`);}
                if (menuBlockElement) {
                    const targetIndex = this.viewer.treemanager.threads.findIndex(t => t.id === parseInt(this.html.dataset.threadId));
                    if (targetIndex !== -1) {
                        if (this.html.getAttribute('data-blocktype') === 'definidor') {
                            alert('No se puede añadir un nuevo evento dentro de otro. Crea un subevento o colócalo fuera del bloque definidor.');
                            return;
                        };
                        const newtarget = write_precompilado(menuBlockElement, 0);
                        this.viewer.treemanager.threads.splice(targetIndex, 0, newtarget);
                        this.viewer.treemanager.refix();
                        this.vm.uimanager.refreshAllViews();
                    }
                }
            }
            // Caso 2: Se está arrastrando un thread existente
            else if (!isNaN(draggedThreadId)) {
                const targetThreadId = parseInt(this.html.dataset.threadId);
                if (draggedThreadId !== targetThreadId) {
                    const targetIndex = this.viewer.treemanager.threads.findIndex(t => t.id === targetThreadId);
                    if (targetIndex !== -1) {
                        if (this.html.getAttribute('data-blocktype') === 'definidor') {
                            alert('No se puede añadir un nuevo evento dentro de otro. Crea un subevento o colócalo fuera del bloque definidor.');
                            return;
                        }
                        this.viewer.treemanager.movelineto(draggedThreadId, targetIndex);
                        this.vm.uimanager.refreshAllViews();
                    }
                }
            }
        };
        this.contextmenulistener = (e)=>{
            e.preventDefault();
            if(this.html.getAttribute('data-blocktype') == "definidor"){return;} 
            this.html.remove();
            const idx = this.viewer.treemanager.threads.findIndex(t => t.id == this.html.dataset.threadId);
            if (idx !== -1) {this.viewer.treemanager.threads.splice(idx, 1);this.viewer.treemanager.refix();}
            this.vm.uimanager.refreshAllViews();
        };
        this.makeDraggable = function(bool){
            if(!bool){
                this.html.draggable = false;
                this.html.removeEventListener("dragstart", this.dragstartlistener);
                this.html.removeEventListener("dragend", this.dragendlistener);
                this.html.removeEventListener("dragleave", this.dragleavelistener);
                this.html.removeEventListener("dragover", this.dragoverlistener);
                this.html.removeEventListener("drop", this.droplistener);
                this.html.removeEventListener("contextmenu", this.contextmenulistener);
            }else{
                this.html.draggable = true;
                this.html.addEventListener("dragstart", this.dragstartlistener);
                this.html.addEventListener("dragend", this.dragendlistener);
                this.html.addEventListener("dragleave", this.dragleavelistener);
                this.html.addEventListener("dragover", this.dragoverlistener);
                this.html.addEventListener("drop", this.droplistener);
                this.html.addEventListener("contextmenu", this.contextmenulistener);
            }
        };this.makeDraggable(true)
    }
}

class IO{
    constructor(vm){
        this.html = document.createElement('input');
        this.html.type = 'text';
        this.set = function(property, value){
            this.properties[property] = value;
            if(property === "value"){
                this.html.value = value;
            };
        };
        this.vm = vm;
        this.properties = {};
        this.dragoverlistener = (e)=>{
            e.preventDefault();
            this.html.style.border = '3px solid rgb(161, 161, 161)';
        };
        this.makeDraggable = function(bool){
            if(!bool){this.html.removeEventListener('dragover',this.dragoverlistener);
            }else{this.html.addEventListener('dragover',this.dragoverlistener);}
        };
    }
}