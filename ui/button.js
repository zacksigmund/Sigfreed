import { Element } from "./element.js";
import styles from "./button.css" with { type: "css" }
document.adoptedStyleSheets.push(styles);

export const Button = (attrs, ...children) => {
    return Element("button", {"class": "sf-button", ...attrs},
        Element("div", {}, ...children)
    );
}