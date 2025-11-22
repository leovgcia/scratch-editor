class CategoryManager{
    constructor(vm, classcategory, opclsd){
        this.baseColor = null;
        this.vm = vm;
        this.group = document.createElement('details'); this.group.open = opclsd;  this.group.id = `${classcategory}:id`; this.group.open = true;
        this.label = document.createElement('span');this.label.innerText = classcategory;
        const summary = document.createElement('summary');summary.appendChild(this.label);this.group.appendChild(summary);
        this.setColorTo = function (color, obj = this.label) {
            this.baseColor = color;
            if (obj == this.label) {obj.style.color = color;} 
            else {
                const normal = toRGBA(this.baseColor, 0.8); const hover = toRGBA(this.baseColor, 1);
                obj.style.setProperty('--block-color', normal); obj.style.setProperty('--block-hover', hover);
                obj.classList.add('allblock');
            }
        };
        this.addBlocksToGroup = function (blocklist, vm) {
            for (let i = 0; i < blocklist.length; i++) {
                const blockfunction = blocklist[i];
                const bloque = new Block(vm);
                this.setColorTo(this.baseColor, bloque.html);
                bloque.addPropertiesFromManifest(blockfunction);
                bloque.makeDraggable(true);
                bloque.render(this.group);
            }
        };
    }
}