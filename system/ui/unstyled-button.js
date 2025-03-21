import { Element } from "./element.js";

export const UnstyledButton = (attrs, onClick, ...children) => {
    const otherClass = attrs.class;
    delete attrs.class;
    const btn = Element(
        "button",
        { class: "sf-ubutton " + (otherClass || ""), ...attrs },
        ...children
    );
    if (onClick) {
        btn.addEventListener("click", onClick);
    }
    return btn;
};
