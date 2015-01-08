/**
 * 
 * @auther SM@K<smali.kazmi@hotmail.com>
 * @description website: smak.pk
 */

var SmartPhone = {
    getUserAgent: function() {
        return navigator.userAgent;
    },
    isAndroid: function() {
        return this.getUserAgent().match(/Android/i);
    },
    isBlackBerry: function() {
        return this.getUserAgent().match(/BlackBerry/i);
    },
    isIOS: function() {
        return this.getUserAgent().match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return this.getUserAgent().match(/Opera Mini/i);
    },
    isWindows: function() {
        return this.isWindowsDesktop() || this.isWindowsMobile();
    },
    isWindowsMobile: function() {
        return this.getUserAgent().match(/IEMobile/i);
    },
    isWindowsDesktop: function() {
        return this.getUserAgent().match(/WPDesktop/i); ;
    },
    isAny: function() {
        var foundAny = false;
        var getAllMethods = Object.getOwnPropertyNames(SmartPhone).filter(function(property) {
            return typeof SmartPhone[property] == 'function';
        });

        for (var index in getAllMethods) {
            if (getAllMethods[index] === 'getUserAgent' || getAllMethods[index] === 'isAny' || getAllMethods[index] === 'isWindows') {
                continue;
            }
            if (SmartPhone[getAllMethods[index]]()) {
                foundAny = true;
                break;
            }
        }
        return foundAny;
    }
};