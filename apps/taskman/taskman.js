import { Element, UnstyledButton, Window } from "../../system/ui/index.js";

export class TaskManager {
    static name = "Task Manager";
    static about = "This is basically just the window manager but it seemed fun.";
    constructor() {
        this.tbody = Element("tbody", {});
        this.windowEl = Window(
            TaskManager.name,
            [["About", "/", () => alert(TaskManager.about)]],
            Element(
                "div",
                { class: "sf-taskman" },
                Element(
                    "table",
                    {},
                    Element("thead", {}, Element("th", {}, "Name"), Element("th", {}, "Kill")),
                    this.tbody
                )
            )
        );
        this.updateTable();
        window.bus.on("appStateChanged", this.updateTable);
    }

    updateTable = () => {
        this.tbody.innerHTML = "";
        const apps = Object.keys(window.windowManager.openApps);
        for (const app of apps) {
            this.tbody.appendChild(
                Element(
                    "tr",
                    {},
                    Element("td", {}, app),
                    Element(
                        "td",
                        {},
                        UnstyledButton(
                            { "aria-label": `Kill ${app} app` },
                            () => window.windowManager.close(app),
                            "🔪"
                        )
                    )
                )
            );
        }
    };
}
