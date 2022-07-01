"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
exports.userModel = {
    userId: {
        key: true,
        match: 'equal',
        length: 40
    },
    username: {
        required: true,
        length: 255,
        q: true,
        match: 'prefix'
    },
    email: {
        format: 'email',
        required: true,
        length: 120,
        q: true
    },
    displayName: {
        length: 120,
        q: true
    },
    status: {
        match: 'equal',
        length: 1
    },
    gender: {
        length: 1
    },
    phone: {
        format: 'phone',
        required: true,
        length: 14
    },
    title: {
        length: 10
    },
    position: {
        length: 10
    },
    imageURL: {
        length: 255
    },
    createdBy: {},
    createdAt: {
        type: 'datetime'
    },
    updatedBy: {},
    updatedAt: {
        type: 'datetime'
    },
    lastLogin: {
        type: 'datetime'
    },
    roles: {
        type: 'strings',
        ignored: true
    }
};
//# sourceMappingURL=user.js.map