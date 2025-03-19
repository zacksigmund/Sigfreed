import { Element } from "../ui/element.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

export const DockIcon = (name, src, onClick) => {
    return UnstyledButton(
        { class: "sf-dockicon", "aria-label": `Launch ${name} app` },
        onClick,
        Element("img", { src: src })
    );
};
