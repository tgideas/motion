import getExt from './ext';
/**
 * Get file type
 * @param  {String} url url address
 * @return {String}     file type
 */
export default function type(url) {
    let ext = getExt(url);
    const types = {
      image : ['png','jpg','gif'],
      css : ['css'],
      javascript : ['js'],
      audio : ['mp3','ogg','wav'],
      video : ['mp4']
    };
    for(let k in types){
      if(types[k].indexOf(ext) > -1){
        return k;
      }
    }
    return null;
}
