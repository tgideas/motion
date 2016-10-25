/**
 * Create node and set attributes
 * @param  {String} name  Tagname
 * @param  {Object} attrs attributes
 * @return {HTMLElement}       Created Element
 */
export default function createNode(name, attrs) {
    let node = document.createElement(name);
    for (let attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            node.setAttribute(attr, attrs[attr]);
        }
    }
    return node;
}
