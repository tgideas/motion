import createNode from "../util/dom/createNode";

const firstLink = document.getElementsByTagName('link')[0];
const linkHead = firstScript.parentNode;

export default (href, charset = 'utf-8') => {

  return new Promise((resolve, reject) => {
    let link = createNode('link', {
        charset : charset,
        rel     : 'stylesheet',
        type    : 'text/css',
        href     : href
    });
    let sTime = new Date();
    link.onload = () => {
          link.onload =  null;
          resolve({
              url : href,
              dom : link,
              time : new Date() - sTime,
              status : 'success'
          });
          link = null;
    };
    link.onerror = () => {
        link.onerror =  null;
        reject({
            url : href,
            dom : link,
            time : new Date() - sTime,
            status : 'error'
        });
        link = null;
    }
    linkHead.insertAfter(link, firstLink);
  });

}
