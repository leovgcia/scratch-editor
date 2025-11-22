class UIManager {
    constructor(vm) {
        this.vm = vm;
        this.tabs = [];
        this.viewbutton = document.getElementById('switchviewbutton');
        this.viewbutton.addEventListener('click', ()=>{this.switchView();});
        this.createTabs = function(){
            for(let method in this.vm._projectinf_["http-options"]){
                if(this.vm._projectinf_["http-options"][method] === true){
                    this.tabs.push(
                        new BlockView(
                            this.vm, 
                            {
                                reference: `viewer-${method.toLowerCase()}`, 
                                html: (() => {
                                    let sec = document.createElement('section');
                                    sec.id = `viewer-${method.toLowerCase()}`;
                                    sec.name = `viewer-${method.toLowerCase()}`;
                                    sec.classList.add('viewer');
                                    document.getElementById('section2-container').appendChild(sec);
                                    return sec;
                                })()
                            }, 
                            `viewer-${method.toLowerCase()}`)
                    );
                };
            };
        }; this.createTabs();
        
        this.updateSwitchViewButton = function(){
            if(this.viewbutton){
                this.viewbutton.innerText = this.vm.environment.get('_actualview_');
            }
            else{console.warn('No switch view button found to update');}
        };

        this.savebutton = document.getElementById('saveprojectbutton');
        this.savebutton.addEventListener('click', ()=>{
            for(let tab of this.tabs){
                if(tab instanceof BlockView || tab instanceof SourceView){
                    tab.askforsave();
                }
            }
        });

        this.downloadbutton = document.getElementById('export');
        this.downloadbutton.addEventListener('click', ()=>{
            for(let tab in this.tabs){
                if(this.tabs[tab] instanceof View){
                    write_prev(this.tabs[tab].treemanager.threads, `${this.vm.environment.get('name')}_${this.tabs[tab].address.replace('viewer-','')}`);
                }
            };
        });

        this.showprecompilado = document.getElementById('showprecompilado'); this.showprecompilado.innerText = 'Mostrar Precompilado';
        this.showprecompilado.addEventListener('click', ()=>{
            const activeView = this.getActiveView();
            if(activeView && activeView instanceof BlockView){
                const precompilado = activeView.treemanager.threads;
                alert(JSON.stringify(precompilado, null, 2));
            }else{
                alert('La vista activa no es un BlockView o no se encontró una vista activa.');
            }
        });



        this.setView = function(){
            const actualView = localStorage.getItem('_actualview_') || this.tabs[0].properties.reference; //valor por defecto
            this.vm.environment.set('_actualview_', actualView);
            for (let tab of this.tabs) {
                if (tab.properties.html) {tab.properties.html.style.display = 'none';}
                else{console.warn('No HTML element found for tab:', tab);}
            }
            const currentTab = this.tabs.find(tab => tab.properties.reference === actualView);
            if (currentTab && currentTab.properties.html) {
                currentTab.properties.html.style.display = 'inherit';
            }else{console.warn('No HTML element found for current tab:', currentTab);}
            this.updateSwitchViewButton();
        };this.setView();

        this.switchView = function () {
            const actualViewRef = this.vm.environment.get('_actualview_');
            const currentIndex = this.tabs.findIndex(tab => tab.properties.reference === actualViewRef);
            const nextIndex = (currentIndex + 1) % this.tabs.length;
            const nextTab = this.tabs[nextIndex];
            this.tabs.forEach(tab => {if (tab.properties.html) tab.properties.html.style.display = 'none';});
            if (nextTab.properties.html) nextTab.properties.html.style.display = 'inherit';
            this.vm.environment.set('_actualview_', nextTab.properties.reference);
            this.updateSwitchViewButton();
        };

        this.getActiveView = function() {
            const actualViewRef = this.vm.environment.get('_actualview_');
            return this.tabs.find(tab => tab.properties.reference === actualViewRef);
        };
        this.refreshAllViews = function() {
            for (let tab of this.tabs) {
                if (tab instanceof View) {tab.refresh();}
            }
        };
    }
}