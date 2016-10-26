export default (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    let sTime = Date.now();
    img.onload = () => {
      img.onload =  null;
      resolve({
          url : src,
          dom : img,
          time : Date.now() - sTime,
          status : 'success'
      });
      img = null;
    };
    img.onerror = () => {
      img.onerror =  null;
      reject({
          url : src,
          dom : img,
          time : Date.now() - sTime,
          status : 'error'
      });
      img = null;
    }
    img.src = src;
  })
}
