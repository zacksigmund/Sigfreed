import { Element } from "../ui/element.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

export const DockIcon = (App) => {
    return UnstyledButton(
        { class: "sf-dockicon", "aria-label": `Open ${App.name} app` },
        () => window.windowManager.open(App),
        Element("img", { src: App.icon })
    );
};
