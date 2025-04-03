import { Element, UnstyledButton } from "../../system/ui/index.js";

export class Note {
    constructor(id, newSticky) {
        this.moving = false;
        this.id = id;

        const dragger = Element("div", { class: "dragger" });

        const note = Element(
            "textarea",
            {
                class: "note",
                "aria-label": "Note text",
                placeholder: "Write something...",
            },
            localStorage.getItem(`Sticky.${id}`) ?? ""
        );

        note.addEventListener("blur", () => {
            localStorage.setItem(`Sticky.${id}`, note.value);
        });

        const deleteButton = UnstyledButton({ "aria-label": "Delete sticky note" }, null, "×");

        const firstButton = newSticky
            ? UnstyledButton({ "aria-label": "New sticky note" }, newSticky, "+")
            : UnstyledButton({ "aria-label": "Hide sticky note" }, null, "-");

        const windowEl = Element(
            "dialog",
            { class: "sf-sticky" },
            Element("div", { class: "menubar" }, firstButton, dragger, deleteButton),
            note
        );

        if (!newSticky) {
            firstButton.addEventListener("click", () => {
                windowEl.parentElement.removeChild(windowEl);
            });
        }

        deleteButton.addEventListener("click", () => {
            localStorage.removeItem(`Sticky.${id}`);
            localStorage.removeItem(`window.Sticky.${this.id}`);
            const parent = windowEl.parentElement;
            parent.removeChild(windowEl);
            if (parent.childElementCount === 0) {
                window.windowManager.close("Sticky");
            }
        });

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
        localStorage.setItem(`window.Sticky.${this.id}`, JSON.stringify({ top, left }));
    };

    loadLocation = () => {
        const locationValue = JSON.parse(localStorage.getItem(`window.Sticky.${this.id}`));
        if (locationValue === null) {
            return {
                top: 100,
                left: 200,
            };
        }
        return locationValue;
    };
}
