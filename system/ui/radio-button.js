import { Element } from "./element.js";

export const RadioButton = (attrs, onChange, ...children) => {
    const { checked, ...otherAttrs } = attrs;
    const input = Element("input", otherAttrs);
    input.type = "radio";
    input.checked = checked;
    if (onChange) {
        input.addEventListener("change", onChange);
    }
    const label = Element("label", { class: "sf-radio" }, input, Element("span", {}, ...children));
    return label;
};
