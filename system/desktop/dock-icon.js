import { Element } from "../ui/element.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

export const DockIcon = (App, hotKey) => {
    const button = UnstyledButton(
        { class: "sf-dockicon", "aria-label": `Open ${App.name} app` },
        () => window.windowManager.open(App),
        Element("img", { src: App.icon })
    );
    document.addEventListener("keydown", (event) => {
        if (event.key == hotKey && event.altKey) {
            window.windowManager.open(App);
        }
    });
    window.bus.on("appStateChanged", () => {
        if (window.windowManager.isOpen(App.name)) {
            button.classList.add("open");
        } else {
            button.classList.remove("open");
        }
    });
    return button;
};
