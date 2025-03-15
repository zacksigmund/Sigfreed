import { Element } from "./element.js";

export const Button = (attrs, onClick, ...children) => {
    const btn = Element(
        "button",
        { class: "sf-button", ...attrs },
        Element("div", {}, ...children)
    );
    if (onClick) {
        btn.addEventListener("click", onClick);
    }
    return btn;
};
