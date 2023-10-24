let fragment = document.createDocumentFragment();
const appendSpellElements = exp => {
    const arr = noitaLib.spell.queryByExp(exp);
    for (let i = 0; i < arr.length; i++) fragment.append(new noitaLib.spell([arr[i]]));
};

const appendSpellElementsWithSort = exp => {
    const arr = noitaLib.spell.queryByExp(exp);
    const prop = "prob_lv" + exp.match(/[0-9]+/)[0];
    arr.sort((a, b) => b.spawningData[prop] - a.spawningData[prop]);
    for (let i = 0; i < arr.length; i++) fragment.append(new noitaLib.spell([arr[i]]));
};
