import { Element } from "../../system/ui/index.js";
import { Note } from "./note.js";

export class Sticky {
    static name = "Sticky";
    static icon = "apps/sticky/sticky.app.png";
    constructor() {
        let stickyCount = parseInt(localStorage.getItem(`${Sticky.name}.count`) ?? 1);
        const newSticky = () => {
            const note = new Note(stickyCount, newSticky).windowEl;
            this.windowEl.appendChild(note);
            note.show();
            localStorage.setItem(`${Sticky.name}.count`, ++stickyCount);
        };
        const notes = Array.from(Array(stickyCount))
            .map((_, i) =>
                localStorage.getItem(`${Sticky.name}.${i}`) ? new Note(i, newSticky).windowEl : null
            )
            .filter((x) => x);

        this.windowEl = Element("div", {}, ...notes);
        this.windowEl.show = () => notes.map((note) => note.show());
        if (notes.length === 0) newSticky();
    }
}
