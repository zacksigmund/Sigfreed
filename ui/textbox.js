import { Element } from "./element.js";
import styles from "./textbox.css" with { type: "css" }
document.adoptedStyleSheets.push(styles);

export const Textbox = (attrs) => {
    const input = Element("input", attrs);
    input.type = "text";
    input.addEventListener("input", updateSelection);
    input.addEventListener("keyup", updateSelection);
    input.addEventListener("pointermove", updateSelection);

    return Element("label", {"class": "sf-textbox"},
        input,
        Element("span", { "aria-hidden": "true" },
            Element("span"),
            Element("span")
        )
    );
}

const updateSelection = (event) => {
    const t = event.target;
    t.nextElementSibling.children[0].innerHTML = t.value.slice(0, t.selectionStart);
    const selection = t.nextElementSibling.children[1];
    const hasSelection = t.selectionStart === t.selectionEnd;
    selection.innerHTML = t.value.slice(t.selectionStart, hasSelection ? t.selectionEnd + 1 : t.selectionEnd) || '&nbsp;&nbsp;';
    hasSelection ? selection.classList.add("blink") : selection.classList.remove("blink");
}