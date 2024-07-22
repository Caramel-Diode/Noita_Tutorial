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

if (new URL(location).searchParams.get("dev") === "1") noitaLib("dev");
var ready = new Promise((res, rej) => addEventListener("DOMContentLoaded", res, { once: true }));
class LocalBlock extends HTMLElement {
    static docStyleSheets = (async () => {
        await ready;
        const default_ = new CSSStyleSheet();
        default_.replaceSync(`:host{display:contents}`);
        /** @type {NodeListOf<HTMLLinkElement>} */
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const styles = document.querySelectorAll("style");
        const styleSheets = [...document.adoptedStyleSheets, default_];
        for (let i = 0; i < links.length; i++) {
            const newStyleSheet = new CSSStyleSheet();
            styleSheets.push(newStyleSheet);
            for (const { cssText } of links[i].sheet.cssRules) newStyleSheet.insertRule(cssText);
        }
        for (let i = 0; i < styles.length; i++) {
            const newStyleSheet = new CSSStyleSheet();
            newStyleSheet.replaceSync(styles[i].innerHTML);
            styleSheets.push(newStyleSheet);
        }
        return Object.freeze(styleSheets);
    })();
    constructor() {
        super();
    }
    async #init() {
        await ready;
        /** @type {HTMLTemplateElement} */
        const template = this.querySelector("template");
        template.remove();
        if (!template) return;
        const content = template.content;
        const shadowRoot = this.attachShadow({ mode: "open" });
        const id_elements = content.querySelectorAll("[id]");
        const ids = [];
        const elements = [];
        for (let i = 0; i < id_elements.length; i++) {
            const element = id_elements[i];
            ids.push(element.id);
            elements.push(element);
            element.toggleAttribute("id");
        }

        const scripts = content.querySelectorAll("script");
        const styles = content.querySelectorAll("style");

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            script.remove();
            Function(...ids, "h", script?.innerHTML ?? "").bind(shadowRoot)(...elements, window.h);
        }
        const adoptedStyleSheets = [...(await LocalBlock.docStyleSheets)];

        for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            style.remove();
            const styleSheet = new CSSStyleSheet();
            styleSheet.replaceSync(style.innerHTML);
            adoptedStyleSheets.push(styleSheet);
        }
        shadowRoot.adoptedStyleSheets = adoptedStyleSheets;
        shadowRoot.append(content);
    }
    async connectedCallback() {
        if (this.hasFinished) return;
        this.hasFinished = true;
        this.#init();
    }
}
customElements.define("local-block", LocalBlock);
class WorkerTemplate extends HTMLTemplateElement {
    constructor() {
        super();
        console.log(this);
        ready.then(() => {
            const script = this.content.querySelector("script");
            const name = this.getAttribute("name");
            const url = URL.createObjectURL(new Blob([script?.innerHTML ?? ""]));
            const worker = new Worker(url, { name });
            this.worker = worker;
            Worker[`$${name}`] = worker;
            worker.call = data => {
                return new Promise((res, rej) => {
                    const uuid = crypto.randomUUID();
                    data.uuid = uuid;
                    const listener = event => {
                        if (event.data.uuid === uuid) {
                            res(event.data);
                            worker.removeEventListener("message", listener);
                        }
                    };
                    worker.addEventListener("message", listener);
                    worker.postMessage(data);
                });
            };
        });
    }
}
customElements.define("web-worker", WorkerTemplate, { extends: "template" });
