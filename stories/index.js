import { storiesOf } from "@storybook/html";
// import { Tree as TreeJSON } from "./demo/tree";
import FileTree from "../src/index";
import "../src/assets/style.scss";
import "./styles/global.scss";
FileTree();
// console.log(style);
storiesOf("Demo", module).add("From JSON", () => {
  const styles = document.getElementById("scssStyle");
  return `<file-tree src="http://localhost:3000/tree" class="dark-theme">
   ${styles.outerHTML}
  </file-tree>`;
});
