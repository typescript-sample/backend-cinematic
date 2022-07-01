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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlRoleService = exports.RoleController = exports.useRoleController = exports.useRoleService = void 0;
var express_ext_1 = require("express-ext");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var role_1 = require("./role");
__exportStar(require("./role"), exports);
function useRoleService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('role', mapper, role_1.roleModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'roles', role_1.roleModel, db.driver, query);
    return new SqlRoleService(builder.search, db);
}
exports.useRoleService = useRoleService;
function useRoleController(log, db, mapper) {
    return new RoleController(log, useRoleService(db, mapper));
}
exports.useRoleController = useRoleController;
var RoleController = /** @class */ (function (_super) {
    __extends(RoleController, _super);
    function RoleController(log, roleService) {
        var _this = _super.call(this, log, roleService) || this;
        _this.roleService = roleService;
        _this.array = ['status'];
        _this.all = _this.all.bind(_this);
        _this.assign = _this.assign.bind(_this);
        return _this;
    }
    RoleController.prototype.all = function (req, res) {
        var _this = this;
        if (this.roleService.all) {
            this.roleService.all()
                .then(function (roles) { return res.status(200).json(roles); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
        else {
            res.status(405).end('Method Not Allowed');
        }
    };
    RoleController.prototype.assign = function (req, res) {
        var _this = this;
        var id = (0, express_ext_1.param)(req, res, 'id');
        if (id) {
            var users = req.body;
            if (!Array.isArray(users)) {
                res.status(400).end("'Body must be an array");
            }
            else {
                this.roleService.assign(id, users)
                    .then(function (r) { return res.status(200).json(r); })
                    .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }
    };
    return RoleController;
}(express_ext_1.Controller));
exports.RoleController = RoleController;
var userRoleModel = {
    userId: {
        key: true
    },
    roleId: {
        key: true
    }
};
var roleModuleModel = {
    roleId: {
        key: true
    },
    moduleId: {
        key: true
    },
    permissions: {
        type: 'number'
    }
};
var SqlRoleService = /** @class */ (function (_super) {
    __extends(SqlRoleService, _super);
    function SqlRoleService(find, db) {
        var _this = _super.call(this, find, db, 'users', role_1.roleModel) || this;
        _this.find = find;
        _this.metadata = _this.metadata.bind(_this);
        _this.search = _this.search.bind(_this);
        _this.all = _this.all.bind(_this);
        _this.load = _this.load.bind(_this);
        _this.insert = _this.insert.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.patch = _this.patch.bind(_this);
        _this.delete = _this.delete.bind(_this);
        _this.map = (0, query_core_1.buildMap)(role_1.roleModel);
        _this.roleModuleMap = (0, query_core_1.buildMap)(roleModuleModel);
        return _this;
    }
    SqlRoleService.prototype.metadata = function () {
        return role_1.roleModel;
    };
    SqlRoleService.prototype.search = function (s, limit, offset, fields) {
        return this.find(s, limit, offset, fields);
    };
    SqlRoleService.prototype.all = function () {
        return this.query('select * from roles order by roleId asc', undefined, this.map);
    };
    SqlRoleService.prototype.load = function (id) {
        var _this = this;
        var stmt = (0, query_core_1.select)(id, 'roles', this.primaryKeys, this.param);
        if (!stmt) {
            return Promise.resolve(null);
        }
        return this.query(stmt.query, stmt.params, this.map)
            .then(function (roles) {
            if (!roles || roles.length === 0) {
                return null;
            }
            var role = roles[0];
            var q = "select moduleId, permissions from roleModules where roleId = ".concat(_this.param(1));
            return _this.query(q, [role.roleId], _this.roleModuleMap).then(function (modules) {
                if (modules && modules.length > 0) {
                    role.privileges = modules.map(function (i) { return (i.permissions ? i.moduleId + ' ' + i.permissions.toString(16) : i.moduleId); });
                }
                return role;
            });
        });
    };
    SqlRoleService.prototype.insert = function (role) {
        var stmts = [];
        var stmt = (0, query_core_1.buildToInsert)(role, 'roles', role_1.roleModel, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        stmts.push(stmt);
        insertRoleModules(stmts, role.roleId, role.privileges, this.param);
        return this.exec(stmt.query, stmt.params);
    };
    SqlRoleService.prototype.update = function (role) {
        var stmts = [];
        var stmt = (0, query_core_1.buildToUpdate)(role, 'roles', role_1.roleModel, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        stmts.push(stmt);
        var query = "delete from roleModules where roleId = ".concat(this.param(1));
        stmts.push({ query: query, params: [role.roleId] });
        insertRoleModules(stmts, role.roleId, role.privileges, this.param);
        return this.execBatch(stmts);
    };
    SqlRoleService.prototype.patch = function (role) {
        return this.update(role);
    };
    SqlRoleService.prototype.delete = function (id) {
        var stmts = [];
        var stmt = (0, query_core_1.buildToDelete)(id, 'roles', this.primaryKeys, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        stmts.push(stmt);
        var query = "delete from roleModules where userId = ".concat(this.param(1));
        stmts.push({ query: query, params: [id] });
        return this.execBatch(stmts);
    };
    SqlRoleService.prototype.assign = function (roleId, users) {
        var userRoles = users.map(function (u) {
            return { roleId: roleId, userId: u };
        });
        var stmts = [];
        var q1 = "delete from userRoles where roleId = ".concat(this.param(1));
        stmts.push({ query: q1, params: [roleId] });
        var s = (0, query_core_1.buildToInsertBatch)(userRoles, 'userRoles', userRoleModel, this.param);
        if (s) {
            stmts.push(s);
        }
        return this.execBatch(stmts);
    };
    return SqlRoleService;
}(query_core_1.Service));
exports.SqlRoleService = SqlRoleService;
function insertRoleModules(stmts, roleId, privileges, param) {
    if (privileges && privileges.length > 0) {
        var permissions_1 = 0;
        var modules = privileges.map(function (i) {
            if (i.indexOf(' ') > 0) {
                var s = i.split(' ');
                permissions_1 = parseInt(s[1], 16);
                if (isNaN(permissions_1)) {
                    permissions_1 = 0;
                }
            }
            var ms = { roleId: roleId, moduleId: i, permissions: permissions_1 };
            return ms;
        });
        var stmt = (0, query_core_1.buildToInsertBatch)(modules, 'roleModules', roleModuleModel, param);
        if (stmt) {
            stmts.push(stmt);
        }
    }
    return stmts;
}
//# sourceMappingURL=index.js.map