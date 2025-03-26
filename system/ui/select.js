import { Element } from "./element.js";
import { UnstyledButton } from "./unstyled-button.js";

export const Select = (selected, options, onSelect) => {
    let menuOpen = false;
    const name = Element("span", {}, options[selected]);
    const menu = Element(
        "ul",
        { class: "dropdown", role: "listbox" },
        ...Object.entries(options).map(([value, text]) =>
            Element(
                "li",
                { role: "option" },
                UnstyledButton(
                    {},
                    () => {
                        onSelect(value);
                        selected = value;
                        name.innerText = options[value];
                    },
                    text
                )
            )
        )
    );
    const toggleMenu = (e) => {
        if (!menuOpen) {
            menu.style.display = "block";
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
    return UnstyledButton(
        { class: "sf-select" },
        toggleMenu,
        name,
        Element("img", { class: "arrow-light", src: "system/ui/images/dropdown-arrow.png" }),
        Element("img", { class: "arrow-dark", src: "system/ui/images/dropdown-arrow-dark.png" }),
        menu
    );
};
