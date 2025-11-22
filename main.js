document.addEventListener("DOMContentLoaded", function(){
    vm = mapLibreries();
    renderMenu(document.getElementById('pane.blocksmenu'), vm);
    vm.environment.rebuild_file();
});