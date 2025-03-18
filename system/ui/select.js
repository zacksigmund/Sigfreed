import { Element } from "../ui/element.js";

export const Select = (selected, options, onSelect) => {
    let menuOpen = false;
    const name = Element("span", {}, options[selected]);
    const menu = Element(
        "ul",
        { class: "dropdown", role: "listbox" },
        ...Object.entries(options).map(([value, text]) => {
            const menuButton = Element("button", {}, text);
            menuButton.addEventListener("click", (e) => {
                onSelect(value);
                selected = value;
                name.innerText = options[value];
            });
            return Element("li", { role: "option" }, menuButton);
        })
    );
    const button = Element(
        "button",
        { class: "sf-select" },
        name,
        Element("img", { src: "system/ui/images/dropdown-arrow.png" }),
        menu
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
    button.addEventListener("click", toggleMenu);
    return button;
};
