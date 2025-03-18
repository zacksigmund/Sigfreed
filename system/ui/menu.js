import { Element } from "./element.js";
import { UnstyledButton } from "./unstyled-button.js";

export const Menu = (menuItems) => {
    let menuOpen = false;

    // TODO: focus trap
    const menu = Element(
        "ul",
        { class: "sf-menu", role: "menu" },
        ...Object.entries(menuItems).map(([name, callback]) =>
            Element("li", { role: "menuitem" }, UnstyledButton({}, callback, name))
        )
    );

    const toggleMenu = (e) => {
        if (!menuOpen) {
            menu.style.display = "flex";
            menuOpen = true;
            const offClick = () => {
                if (menuOpen) {
                    menu.style.display = "none";
                    document.body.removeEventListener("click", offClick);
                    menuOpen = false;
                }
            };
            // was propagating to the offClick listener on the same frame otherwise
            requestAnimationFrame(() => {
                document.body.addEventListener("click", offClick);
            });
        }
    };

    return [menu, toggleMenu];
};
