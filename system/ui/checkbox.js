import { classes } from "../utils.js";
import { Element } from "./element.js";

export const Checkbox = (attrs, onChange, ...children) => {
    const { checked, ...otherAttrs } = attrs;
    const otherClass = attrs.class;
    delete attrs.class;
    const input = Element("input", otherAttrs);
    input.type = "checkbox";
    input.checked = checked;
    if (onChange) {
        input.addEventListener("change", onChange);
    }
    const label = Element(
        "label",
        { class: classes("sf-checkbox", otherClass) },
        input,
        Element("span", {}, ...children)
    );
    return label;
};
