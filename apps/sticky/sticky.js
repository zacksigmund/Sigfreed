import { Element, UnstyledButton } from "../../system/ui/index.js";

export class Sticky {
    static name = "Sticky";
    static icon = "apps/sticky/sticky.app.png";
    constructor() {
        this.moving = false;

        const newSticky = () => {
            // new sticky
        };
        const deleteSticky = () => window.windowManager.close(Sticky.name);

        const dragger = Element("div", { class: "dragger" });

        const note = Element(
            "textarea",
            {
                class: "note",
                "aria-label": "Note text",
                placeholder: "Write something...",
            },
            localStorage.getItem(Sticky.name) ?? ""
        );

        note.addEventListener("blur", () => {
            localStorage.setItem(Sticky.name, note.value);
        });

        const windowEl = Element(
            "dialog",
            { class: "sf-sticky" },
            Element(
                "div",
                { class: "menubar" },
                UnstyledButton({ "aria-label": "New sticky note" }, newSticky, "+"),
                dragger,
                UnstyledButton({ "aria-label": "Delete sticky note" }, deleteSticky, "×")
            ),
            note
        );

        // window movement
        dragger.addEventListener("mousedown", () => {
            this.moving = true;
            dragger.classList.add("dragging");
        });
        window.addEventListener("mousemove", (event) => {
            if (!this.moving) return;

            windowEl.style.top = `${windowEl.offsetTop + event.movementY}px`;
            if (windowEl.offsetTop < 0) {
                windowEl.style.top = 0;
            } else if (windowEl.offsetTop + windowEl.clientHeight > window.innerHeight) {
                windowEl.style.top = `${window.innerHeight - windowEl.clientHeight}px`;
            }

            windowEl.style.left = `${windowEl.offsetLeft + event.movementX}px`;
            if (windowEl.offsetLeft < 0) {
                windowEl.style.left = 0;
            } else if (windowEl.offsetLeft + windowEl.clientWidth > window.innerWidth) {
                windowEl.style.left = `${window.innerWidth - windowEl.clientWidth}px`;
            }
        });
        window.addEventListener("mouseup", (event) => {
            if (!this.moving) return;
            windowEl.style.top = `${windowEl.offsetTop + event.movementY}px`;
            windowEl.style.left = `${windowEl.offsetLeft + event.movementX}px`;
            this.moving = false;
            dragger.classList.remove("dragging");
            this.saveLocation(windowEl.offsetTop, windowEl.offsetLeft);
        });

        const { top, left } = this.loadLocation();
        windowEl.style.top = `${top}px`;
        windowEl.style.left = `${left}px`;

        this.windowEl = windowEl;
    }

    saveLocation = (top, left) => {
        localStorage.setItem(`window.${Sticky.name}`, JSON.stringify({ top, left }));
    };

    loadLocation = () => {
        const locationValue = JSON.parse(localStorage.getItem(`window.${Sticky.name}`));
        if (locationValue === null) {
            return {
                top: 100,
                left: 200,
            };
        }
        return locationValue;
    };
}
