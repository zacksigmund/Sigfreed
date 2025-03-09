import { Element } from "./element.js";

export const Button = (attrs, ...children) => {
    return Element("button", { class: "sf-button", ...attrs }, Element("div", {}, ...children));
};
