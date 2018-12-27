import html from "./html";

export default function(strings, ...values) {
  return document.createRange().createContextualFragment(html(strings, ...values));
}
