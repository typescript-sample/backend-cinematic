"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogModel = void 0;
exports.auditLogModel = {
    id: {
        key: true,
        length: 40
    },
    resource: {
        column: 'resourceType',
        match: 'equal'
    },
    userId: {
        required: true,
        length: 40,
        match: 'equal'
    },
    ip: {},
    action: {
        match: 'equal'
    },
    timestamp: {
        type: 'datetime'
    },
    status: {
        match: 'equal',
        length: 1
    },
    remark: {}
};
//# sourceMappingURL=audit-log.js.map