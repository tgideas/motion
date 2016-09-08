export default function createNode(name, attrs) {
    let node = document.createElement(name);
    for (let attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            node.setAttribute(attr, attrs[attr]);
        }
    }
    return node;
}
