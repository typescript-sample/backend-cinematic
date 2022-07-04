"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = exports.useAuditLogController = void 0;
var express_ext_1 = require("express-ext");
var query_core_1 = require("query-core");
var audit_log_1 = require("./audit-log");
function useAuditLogController(log, db) {
    var builder = new query_core_1.SearchBuilder(db.query, 'auditlog', audit_log_1.auditLogModel, db.driver);
    return new AuditLogController(log, builder.search);
}
exports.useAuditLogController = useAuditLogController;
var AuditLogController = /** @class */ (function (_super) {
    __extends(AuditLogController, _super);
    function AuditLogController(log, search) {
        var _this = _super.call(this, log, search) || this;
        _this.array = ['status'];
        _this.dates = ['timestamp'];
        return _this;
    }
    return AuditLogController;
}(express_ext_1.SearchController));
exports.AuditLogController = AuditLogController;
//# sourceMappingURL=index.js.map