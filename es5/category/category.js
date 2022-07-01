"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryModel = void 0;
exports.categoryModel = {
    categoryId: {
        key: true,
        length: 40,
        q: true,
    },
    categoryName: {
        required: true,
        length: 300,
        q: true
    },
    status: {
        match: 'equal',
        length: 1
    },
    createdBy: {},
    createdAt: {
        type: 'datetime'
    },
    updatedBy: {},
    updatedAt: {
        type: 'datetime'
    },
};
//# sourceMappingURL=category.js.map