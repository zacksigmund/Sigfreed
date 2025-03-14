import { Element } from "./element.js";

export const Checkbox = (attrs, ...children) => {
    const { checked, ...otherAttrs } = attrs;
    const input = Element("input", otherAttrs);
    input.type = "checkbox";
    input.checked = checked;
    const label = Element(
        "label",
        { class: "sf-checkbox" },
        input,
        Element("span", {}, ...children)
    );
    return label;
};
