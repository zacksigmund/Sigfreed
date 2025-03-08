import { Element } from "../ui/element.js";
import { DockIcon } from "./dock-icon.js";
import { initTodo } from "../todo/todo.js";
import { Solitaire } from "../solitaire/solitaire.js";
import styles from "./desktop.css" with { type: "css"};
document.adoptedStyleSheets.push(styles);

export const Desktop = () => {
    return Element("div", {"class": "sf-desktop"},
        Element("div", {"class": "sf-dock"},
            Element("div", {},
                DockIcon("/todo/images/todo.app.png", initTodo),
                DockIcon("/solitaire/images/solitaire.app.png", () => new Solitaire()),
            )
        )
    );
}