class VM {
    constructor() {
        this._projectinf_ = projectinf;
        this.environment = null;
        this.uimanager = null;
    }
}

const mapLibreries = () => {
    const vm = new VM();
    vm.environment = new EnvironmentManager(vm);
    vm.uimanager = new UIManager(vm);
    return vm;
};
