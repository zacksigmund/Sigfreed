import { Element } from "../../system/ui/index.js";

export class Sticky {
    static name = "Sticky";
    static icon = "apps/sticky/sticky.app.png";
    constructor() {
        this.windowEl = Element("dialog", { class: "sf-sticky" }, "Text");
    }
}
