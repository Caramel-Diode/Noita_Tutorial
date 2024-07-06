noitaLib("dev");
let fragment = document.createDocumentFragment();
const appendSpellElements = exp => {
    const arr = noitaLib.Spell.queryByExp(exp);
    for (let i = 0; i < arr.length; i++) fragment.append(new noitaLib.Spell([arr[i]]));
};

const appendSpellElementsWithSort = exp => {
    const arr = noitaLib.Spell.queryByExp(exp);
    const prop = "prob_lv" + exp.match(/[0-9]+/)[0];
    arr.sort((a, b) => b.spawn[prop] - a.spawn[prop]);
    for (let i = 0; i < arr.length; i++) fragment.append(new noitaLib.Spell([arr[i]]));
};
