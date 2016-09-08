export default (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    let sTime = new Date();
    img.onload = () => {
          img.onload =  null;
          resolve({
              url : src,
              dom : img,
              time : new Date() - sTime,
              status : 'success'
          });
          img = null;
    };
    img.onerror = () => {
        img.onerror =  null;
        reject({
            url : src,
            dom : img,
            time : new Date() - sTime,
            status : 'error'
        });
        img = null;
    }
    img.src = src;
}
