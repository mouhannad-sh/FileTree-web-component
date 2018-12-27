import Wire from "./wire";
import findParent from "./utils/findParent";
import hasClassName from "./utils/hasClassName";
// import getBounds from "./utils/getBounds";

class FileTree extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const styles = this.querySelector("style");
    if (styles) this.shadowRoot.appendChild(document.importNode(styles, true));
    this.shadowRoot.addEventListener("click", e => {
      const { target: element } = e;

      const fileParent = findParent(element, el => hasClassName(el, "ft-file"));
      if (fileParent) return undefined;

      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      if (folderParent) {
        // const children = folderParent.querySelector(".ft-children");
        // const { height } = getBounds(children).NBounds;
        // if (height) {
        //   children.style.height = height + "px";
        // }
        // setTimeout(() => {
        folderParent.classList.toggle("ft-collapsed");
        // });
      }
    });

    this.dragTimer = null;

    this.shadowRoot.addEventListener("drag", e => {
      // e.preventDefault();
      console.log("clear enter");
      const { target: element } = e;
      const fileParent = findParent(element, el => hasClassName(el, "ft-file"));
      // console.log(folderParent, element);
      if (fileParent) {
        this.draggedEl = fileParent;
      }
    });

    this.shadowRoot.addEventListener("dragenter", e => {
      e.preventDefault();
      console.log("clear enter");
      const { target: element } = e;
      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      // console.log(folderParent, element);
      if (folderParent) {
        clearTimeout(this.dragTimer);
        console.log("timeout");
        this.dragTimer = setTimeout(() => {
          console.log("in timeout");
          folderParent.classList.remove("ft-collapsed");
        }, 500);
      }
    });

    this.shadowRoot.addEventListener("dragover", e => {
      e.preventDefault();
      const { target: element } = e;
      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      if (folderParent) {
        folderParent.classList.add("ft-dragover");
        this.dragTarget = folderParent;
      }
    });
    this.shadowRoot.addEventListener("dragleave", e => {
      const { target: element } = e;
      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      folderParent.classList.remove("ft-dragover");
      if (!folderParent.isEqualNode(this.dragTarget)) {
        clearTimeout(this.dragTimer);
      }
    });
    this.shadowRoot.addEventListener("dragend", e => {
      const { target: element } = e;
      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      if (folderParent) {
        folderParent.classList.remove("ft-dragover");
        clearTimeout(this.dragTimer);
      }
    });
    this.shadowRoot.addEventListener("drop", e => {
      const { target: element } = e;
      clearTimeout(this.dragTimer);
      const folderParent = findParent(element, el => hasClassName(el, "ft-folder"));
      if (folderParent) {
        folderParent.classList.remove("ft-dragover");
        clearTimeout(this.dragTimer);
        const file = findParent(this.draggedEl, el => (hasClassName(el, "ft-file") ? el : false));
        folderParent.querySelector(".ft-children").appendChild(file);
      }
    });
  }

  set src(v) {
    this.setAttribute("src", JSON.stringify(v));
  }
  get src() {
    return this.getAttribute("src");
  }

  get loading() {
    return JSON.parse(this.getAttribute("loading"));
  }
  set loading(v) {
    this.setAttribute("loading", JSON.stringify(v));
  }

  async connectedCallback() {
    await this.fetchJSONData(this.src);
  }

  static get observedAttributes() {
    return ["src", "loading", "tree"];
  }

  fetchJSONData = async src => {
    this.loading = true;
    const json = await (await fetch(src)).json();
    const c = connectTree(json);
    this.JSONTree = json;
    this.tree = c.children[0];
    this.loading = false;
  };

  attributeChangedCallback(attr, oldValue, newVal) {
    String(this[attr]) !== newVal && (this[attr] = newVal);
    this.render();
  }

  render() {
    if (this.loading) {
      this.shadowRoot.appendChild(Wire`<p class="loader">Loading</p>`);
    } else if (this.tree) {
      const loaderElement = this.shadowRoot.querySelector(".loader");
      if (loaderElement) this.shadowRoot.removeChild(loaderElement);
      if (this.classList.contains("dark-theme")) this.tree.classList.add("dark-theme");
      this.shadowRoot.appendChild(this.tree);
    }
  }
}

export default () => window.customElements.define("file-tree", FileTree);

export function connectTree(tree = [], selector = "") {
  if (!tree) return console.error("tree cannot be empty");
  // if (!selector) return console.error("You need a selector ");

  let wire = Wire``;
  tree.forEach((item, idx) => {
    const { key, title, folder, extraClasses, children } = item;
    let nodeType = "file";
    if (folder) {
      nodeType = "folder";
    }

    wire.append(Wire`<div class="ft-node ft-${nodeType}" draggable="true">
      <div class="ft-presentation flex">
      ${
        nodeType === "folder"
          ? `<i class='ft-icon ft-caret-icon'>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg></i>`
          : ""
      }
      <a>${title}</a>
      </div>
      <div class="ft-children">
        ${[].slice
          .call(connectTree(children, selector).children)
          .map(i => i.outerHTML)
          .join("")}
      </div>
    </div>`);
  });

  return wire;
}
