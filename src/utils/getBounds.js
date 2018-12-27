/**
 * returns the rendered bounds rect values of the targeted element
 *
 * @function getBounds
 * @param  {HTMLNode} targetNode HTML Node element
 * @return {Object} {description}
 */
export default function getBounds(targetNode) {
  const bounds = targetNode.getBoundingClientRect();
  const styleValidator = {
    set: (obj, prop, val) => {
      const number = Number(val);
      if (!isNaN(number)) {
        obj[prop] = `${number}px;`;
        return true;
      }
      throw new TypeError(`The value { ${val} } for object Styles[${prop}] is invalid!`);
    }
  };
  const styles = new Proxy({}, styleValidator);
  const top = bounds.top + window.scrollY;
  const bottom = document.body.scrollHeight - (window.scrollY + bounds.bottom);
  styles.left = bounds.left;
  styles.width = bounds.width;
  styles.top = top;
  styles.bottom = bottom;
  styles.height = bounds.height;
  // const stylesString = JSON.stringify(styles).replace(/({|}|"|,)/gi, "");
  return {
    bounds: styles,
    NBounds: {
      left: bounds.left,
      right: bounds.right,
      width: bounds.width,
      height: bounds.height,
      top: top,
      bottom: bottom
    },
    originalBounds: bounds,
    boundsString: styles
  };
}
