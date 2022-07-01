"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleModel = void 0;
exports.roleModel = {
    roleId: {
        key: true,
        length: 40,
        q: true
    },
    roleName: {
        required: true,
        length: 255,
        q: true,
        match: 'prefix'
    },
    status: {
        match: 'equal',
        length: 1
    },
    remark: {
        length: 255,
        q: true
    },
    createdBy: {},
    createdAt: {
        type: 'datetime'
    },
    updatedBy: {},
    updatedAt: {
        type: 'datetime'
    },
    privileges: {
        type: 'strings',
        ignored: true
    }
};
//# sourceMappingURL=role.js.map