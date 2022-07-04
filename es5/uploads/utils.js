"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileName = void 0;
var getFileName = function (url) {
    var arr = url.split('/');
    var fileName = arr[arr.length - 1];
    return fileName;
};
exports.getFileName = getFileName;
//# sourceMappingURL=utils.js.map