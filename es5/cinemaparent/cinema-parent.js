"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemaParentModel = void 0;
exports.CinemaParentModel = {
    id: {
        key: true,
        length: 40
    },
    name: {
        required: true,
        length: 255,
    },
    aliases: {
        length: 120,
    },
    status: {
        length: 1
    },
    logo: {
        length: 255
    },
    createdBy: {},
    createdAt: {
        column: 'createdat',
        type: 'datetime'
    },
    updatedBy: {},
    updatedAt: {
        column: 'createdat',
        type: 'datetime'
    }
};
//# sourceMappingURL=cinema-parent.js.map