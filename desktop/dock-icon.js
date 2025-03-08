import { Element } from "../ui/element.js";
import styles from "./dock-icon.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export const DockIcon = (src, onClick) => {
    const button = Element("button", {"class": "sf-dockicon"},
        Element("img", {src: src})
    );
    button.addEventListener("click", onClick);
    return button;
}