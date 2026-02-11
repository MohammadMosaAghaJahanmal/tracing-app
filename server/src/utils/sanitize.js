import sanitizeHtml from "sanitize-html";

export const sanitizeText = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/\u0000/g, "").trim();
};

export const sanitizeRichHtml = (html) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span"]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
      "*": ["style", "class"]
    },
    allowedSchemes: ["http", "https", "data"]
  });
