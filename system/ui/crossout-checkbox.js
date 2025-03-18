import { Checkbox } from "./checkbox.js";
import { Element } from "./element.js";

export const CrossoutCheckbox = (attrs, onChange, ...children) => {
    return Checkbox(
        { class: "sf-crossout-checkbox", ...attrs },
        onChange,
        Element("span", {}, ...children)
    );
};
