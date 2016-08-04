import createNode from "../util/createNode";

const firstScript = document.getElementsByTagName('script')[0];
const scriptHead = firstScript.parentNode;
const re = /ded|co/;
export default (src, charset = 'utf-8') => {
    return new Promise((resolve, reject) => {
        let script = createNode('script', {
            charset : charset,
            async : true,
            src : src
        });
    	let sTime = new Date();
    	script.onload = () => {
            script.onload =  null;
            resolve({
                url : src,
                dom : script,
                time : new Date() - sTime,
                status : 'success'
            });
            script = null;
    	};
        script.onerror = () => {
            script.onerror =  null;
            reject({
                url : src,
                dom : script,
                time : new Date() - sTime,
                status : 'error'
            });
            script = null;
        }
    	scriptHead.insertBefore(script, firstScript);
    });
}
