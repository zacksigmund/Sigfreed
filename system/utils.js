export const classes = (...classList) => classList.filter((c) => c).join(" ");
export const range = (count) => Array.from({ length: count }, (_, i) => i);
