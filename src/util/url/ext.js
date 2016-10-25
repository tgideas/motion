/**
 * get extension name
 * @param  {String} url url address
 * @return {String}     extension name
 */
export default function ext(url) {
    return url.match(/\.([^\.]*)$/)[0].substr(1).match(/^[a-zA-Z0-9]+/)[0];
}
