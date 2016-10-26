import createNode from "../util/dom/createNode";

const firstLink = document.getElementsByTagName('link')[0];
const linkHead = firstLink ? firstLink.parentNode : document.head;

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
    firstLink ? linkHead.insertAfter(link, firstLink) : linkHead.appendChild(link);
  });

}
