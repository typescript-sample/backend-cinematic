"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadModel = void 0;
exports.uploadModel = {
    name: 'upload',
    source: 'uploads',
    attributes: {
        userId: {
            key: true,
            match: 'equal',
            length: 40
        },
        data: {
            type: 'primitives'
        },
    }
};
//# sourceMappingURL=UploadModel.js.map