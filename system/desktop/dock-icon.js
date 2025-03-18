import { Element } from "../ui/element.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

export const DockIcon = (src, onClick) => {
    return UnstyledButton({ class: "sf-dockicon" }, onClick, Element("img", { src: src }));
};
