class EnvironmentManager{
    constructor(vm){
        this.vm = vm;
        this.vars = {};
        this.set = function (key, value) {
            this.vars[key] = value;localStorage.setItem(key, value);
        };
        this.get = function(key){
            return this.vars[key]
        };
        this.getVars = function(){
            return this.vars
        };
        this.deleteVar = function(key){
            delete this.vars[key];
            localStorage.removeItem(key);
        }
        this.rebuild_file = function(){
            const cursor = 'threadaddress:';
            try{
                const storedAddresses = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if(key.startsWith(cursor)){
                        storedAddresses.push(key);
                    }
                }
                if(storedAddresses.length === 0){
                    console.log('No se encontraron addresses registradas. Creando bloques iniciales...');
                    this.vm.uimanager.tabs.forEach(tab => {
                        createBlock(tab.address, tab, this);
                    });
                    return;
                }
                storedAddresses.forEach(key => {
                    const address = key.replace(cursor, "");
                    const tab = this.vm.uimanager.tabs.find(t => t.address === address);
                    
                    if (!tab) {
                        console.warn(`No se encontró un tab con address "${address}"`);
                        return;
                    }

                    const loaded = JSON.parse(localStorage.getItem(key));
                    
                    if(loaded && loaded.length > 0){
                        tab.treemanager.threads = loaded;
                        tab.treemanager.refix();
                    }else{
                        createBlock(address, tab, this);
                    }
                });

                this.vm.uimanager.refreshAllViews();
            }catch(err){
                console.error('Error rebuilding file from localStorage:', err);
            }
        };
        this.saveProject = function(address, individualtreemanager){
            localStorage.setItem(address, JSON.stringify(individualtreemanager));
        };
        this.load_project = function(){
            for(let _property_ in this.vm._projectinf_){
                this.vars[_property_] = this.vm._projectinf_[_property_];
                localStorage.setItem(_property_, this.vm._projectinf_[_property_]);
            };
            document.title = `endpoint: ${this.vm._projectinf_["name"]}`
        };this.load_project();
    }
}