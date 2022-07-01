"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateModel = void 0;
;
exports.rateModel = {
    id: {
        key: true,
        required: true
    },
    userid: {
        key: true,
        required: true
    },
    rate: {
        type: 'integer',
        min: 1,
        max: 5
    },
    ratetime: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
};
//# sourceMappingURL=rate.js.map