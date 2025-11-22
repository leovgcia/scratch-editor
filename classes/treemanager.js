class TreeManager {
    constructor(vm) {
        this.vm = vm;
        this.threads = [];
        this.recalculateLevels = function() {
            let currentLevel = 0;
            for (let i = 0; i < this.threads.length; i++) {
                const thread = this.threads[i];
                const blockElement = document.getElementById(thread.play);
                if (!blockElement) continue;
                const blockType = blockElement.getAttribute('data-blocktype');
                if (blockType === 'definidor') {
                    thread.level = 0;
                    currentLevel = 0;
                }
                else if (blockType === 'condicional') {
                    thread.level = currentLevel;
                    currentLevel++;
                }
                else {thread.level = currentLevel;}
            }
        };
        this.refix = function () {
            const definidorIndex = this.threads.findIndex(t => t.blockType === 'definidor');
            if (definidorIndex > 0) {
                const [definidorBlock] = this.threads.splice(definidorIndex, 1);
                this.threads.unshift(definidorBlock);
            }
            for (let i in this.threads) {this.threads[i].id = parseInt(i);}
            this.recalculateLevels();
        };
        this.movelineto = function (lineid, to) {
            if (lineid === 0 || to === 0) return;
            const fromIndex = this.threads.findIndex(t => t.id === lineid);
            if (fromIndex === -1 || to < 0 || to >= this.threads.length) return;
            const [line] = this.threads.splice(fromIndex, 1);
            this.threads.splice(to, 0, line);
            this.refix();
        };
        this.addLine = function(precompilado){
            this.threads.push(precompilado);
            const lastIndex = this.threads.length - 1;
            const pushed = this.threads[lastIndex];
            pushed.id = lastIndex;
            this.refix();
        }
    }
}