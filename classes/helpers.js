function write_precompilado(block, level=0){
    if(block){
        const target = {
            level: level,
            play: block.id, 
            from_lib: block.parentElement ? block.parentElement.id.replace(':id','') : ''
        };
        const inputs = block.querySelectorAll('input');
        const values = [];
        inputs.forEach((input, index) => {values[index] = input.value;});
        
        target["args"] = values;
        return target;
    }else{
        return null;
    }
}

function toRGBA(color, alpha = 1) {
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    const rgbaMatch = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!rgbaMatch) return `rgba(0,0,0,${alpha})`;
    const [_, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function decode_literal(vm, value) {
    if (typeof value !== 'string') return value;
    value = value.trim();
    if (!value.startsWith('<!') || !value.endsWith('>') || !value.includes(':')) {
        return value;
    }
    const inner = value.slice(2, -1);
    const parts = inner.split(':');
    const tag = parts[0];
    const datatype = parts[1] || '';
    const param = parts[2] || '';
    let element;
    switch (tag) {
        case 'var': 
            let requestedvar = datatype.trim();
            element = document.createElement('input'); 
            element.style.fontWeight = 'bold';
            element.readOnly = true;
            element.style.border = 'none';
            element.style.height = '100%';
            element.style.background = 'transparent';
            element.style.fontWeight = 'bold';
            element.value = `${vm.environment.get(requestedvar) || null}`;
            break;
        case 'input':
            const io = new IO(vm);
            if (param) io.set("value", param);
            element = io.html;
            break;

        /*case 'select':
            element = document.createElement('select');
            const options = datatype.split('=');
            for (const opt of options) {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                element.appendChild(option);
            }
            break;

        case 'textarea':
            element = document.createElement('textarea');
            if (datatype) element.placeholder = datatype;
            break;*/
        default:
            return value;
    }
    return element;
}

function cloneBlockUI(obj){
    const clon = obj.cloneNode(true);
    return clon;
}

function renderMenu(htmldom, vm){
    const fragment = document.createDocumentFragment();
    for(let _classcategory_ in manifests){
        const category = new CategoryManager(vm, _classcategory_);
        for(let _classproperty_ in manifests[_classcategory_]){
            if(_classproperty_ == "color"){category.setColorTo(manifests[_classcategory_][_classproperty_])};
            if(_classproperty_ == "blocks"){category.addBlocksToGroup(manifests[_classcategory_][_classproperty_], vm)};
        };
        fragment.appendChild(category.group);
    }
    if(htmldom){
        htmldom.appendChild(fragment);
    } else {
        return fragment
    }
};


function createBlock(address, tab, sourceclass){
    const dowhat = `do_${address.replace('viewer-','')}`;
    const bloquedeseado = document.getElementById(dowhat);
    const target = write_precompilado(bloquedeseado);
    tab.treemanager.addLine(target);
    tab.treemanager.refix();
    sourceclass.vm.uimanager.refreshAllViews();
}

function write_prev(jsArray, nombreArchivo) {
  const jsonString = JSON.stringify(jsArray, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pre_${nombreArchivo}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
