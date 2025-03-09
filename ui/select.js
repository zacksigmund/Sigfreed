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
                e.stopPropagation();
                menu.style.display = "none";
                menuOpen = false;
                onSelect(value);
                selected = value;
                name.innerText = options[value];
            });
            return Element("li", { role: "option" }, menuButton);
        })
    );
    const button = Element("button", { class: "sf-select" }, name, Element("span", {}, "🔻"), menu);
    const toggleMenu = (e) => {
        if (!menuOpen) {
            menu.style.display = "block";
            e.stopPropagation();
            menuOpen = true;
            const offClick = () => {
                if (menuOpen) {
                    menu.style.display = "none";
                    document.body.removeEventListener("click", offClick);
                    menuOpen = false;
                }
            };
            document.body.addEventListener("click", offClick);
        }
    };
    button.addEventListener("click", toggleMenu);
    return button;
};
