import { Element } from "../ui/element.js";
import styles from "./select.css" with { type: "css" }
document.adoptedStyleSheets.push(styles);

export const Select = (selected, options, onSelect) => {
    let menuOpen = false;
    const name = Element("span", {}, options[selected]);
    const button = Element("button", { "class": "sf-select" },
        name,
        Element("span", {}, "🔻")
    );
    const toggleMenu = (e) => {
        if (!menuOpen) {
            e.stopPropagation();
            menuOpen = true;
            const menu = Element("ul", { "class": "dropdown", role: "listbox" },
                ...Object.entries(options).map(([value, text]) => {
                    const menuButton = Element("button", {}, text);
                    menuButton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        try{
                            button.removeChild(menu);
                        } catch {}
                        menuOpen = false;
                        onSelect(value);
                        selected = value;
                        name.innerText = options[value];
                    });
                    return Element("li", {role: "option"}, menuButton);
                })
            );
            const offClick = () => {
                if (menuOpen) {
                    button.removeChild(menu);
                    document.body.removeEventListener("click", offClick);
                    menuOpen = false;
                }
            }
            document.body.addEventListener("click", offClick)
            button.appendChild(menu);
        }
    }
    button.addEventListener("click", toggleMenu);
    return button;
}