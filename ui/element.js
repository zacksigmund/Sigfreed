export const Element = (name, attrs, ...children) => {
    const element = document.createElement(name);
    if (attrs) {
        Object.entries(attrs).map(([key, val]) => element.setAttribute(key, val));
    }
    if (children) {
        children.map(child => element.appendChild(typeof child === "string" ? document.createTextNode(child) : child));
    }
    return element;
}