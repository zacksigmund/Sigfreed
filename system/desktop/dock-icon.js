import { Element } from "../ui/element.js";

export const DockIcon = (src, onClick) => {
    const button = Element("button", { class: "sf-dockicon" }, Element("img", { src: src }));
    button.addEventListener("click", onClick);
    return button;
};
