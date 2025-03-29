import { Element } from "../ui/element.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

export const DockIcon = (App) => {
    return UnstyledButton(
        { class: "sf-dockicon", "aria-label": `Launch ${App.name} app` },
        () => window.windowManager.launch(App),
        Element("img", { src: App.icon })
    );
};
