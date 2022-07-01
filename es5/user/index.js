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
exports.SqlUserService = exports.UserController = exports.useUserController = exports.useUserService = void 0;
var express_ext_1 = require("express-ext");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var user_1 = require("./user");
__exportStar(require("./user"), exports);
function useUserService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('user', mapper, user_1.userModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'users', user_1.userModel, db.driver, query);
    return new SqlUserService(builder.search, db);
}
exports.useUserService = useUserService;
function useUserController(log, db, mapper) {
    return new UserController(log, useUserService(db, mapper));
}
exports.useUserController = useUserController;
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController(log, userService) {
        var _this = _super.call(this, log, userService) || this;
        _this.userService = userService;
        _this.array = ['status'];
        _this.all = _this.all.bind(_this);
        _this.getUsersOfRole = _this.getUsersOfRole.bind(_this);
        return _this;
    }
    UserController.prototype.all = function (req, res) {
        var _this = this;
        var v = req.query['roleId'];
        if (v && v.toString().length > 0) {
            this.userService.getUsersOfRole(v.toString())
                .then(function (users) { return res.status(200).json(users); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
        else {
            if (this.userService.all) {
                this.userService.all()
                    .then(function (users) { return res.status(200).json(users); })
                    .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
            else {
                res.status(400).end('roleId is required');
            }
        }
    };
    UserController.prototype.getUsersOfRole = function (req, res) {
        var _this = this;
        var id = (0, express_ext_1.queryParam)(req, res, 'roleId');
        if (id) {
            this.userService.getUsersOfRole(id)
                .then(function (users) { return res.status(200).json(users); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    return UserController;
}(express_ext_1.Controller));
exports.UserController = UserController;
var userRoleModel = {
    userId: {
        key: true
    },
    roleId: {
        key: true
    },
};
var SqlUserService = /** @class */ (function (_super) {
    __extends(SqlUserService, _super);
    function SqlUserService(find, db) {
        var _this = _super.call(this, find, db, 'users', user_1.userModel) || this;
        _this.find = find;
        _this.search = _this.search.bind(_this);
        _this.all = _this.all.bind(_this);
        _this.insert = _this.insert.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.patch = _this.patch.bind(_this);
        _this.delete = _this.delete.bind(_this);
        _this.map = (0, query_core_1.buildMap)(user_1.userModel);
        return _this;
    }
    SqlUserService.prototype.getUsersOfRole = function (roleId) {
        if (!roleId || roleId.length === 0) {
            return Promise.resolve([]);
        }
        var q = "\n      select u.*\n      from userRoles ur\n        inner join users u on u.userId = ur.userId\n      where ur.roleId = ".concat(this.param(1), "\n      order by userId");
        return this.query(q, [roleId], this.map);
    };
    SqlUserService.prototype.search = function (s, limit, offset, fields) {
        return this.find(s, limit, offset, fields);
    };
    SqlUserService.prototype.all = function () {
        return this.query('select * from users order by userId asc', undefined, this.map);
    };
    SqlUserService.prototype.load = function (id) {
        var _this = this;
        var stmt = (0, query_core_1.select)(id, 'users', this.primaryKeys, this.param);
        if (!stmt) {
            return Promise.resolve(null);
        }
        return this.query(stmt.query, stmt.params, this.map)
            .then(function (users) {
            if (!users || users.length === 0) {
                return null;
            }
            var user = users[0];
            var q = "select roleId from userRoles where userId = ".concat(_this.param(1));
            return _this.query(q, [user.userId]).then(function (roles) {
                if (roles && roles.length > 0) {
                    user.roles = roles.map(function (i) { return i.roleId; });
                }
                return user;
            });
        });
    };
    SqlUserService.prototype.insert = function (user) {
        var stmts = [];
        var stmt = (0, query_core_1.buildToInsert)(user, 'users', user_1.userModel, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        stmts.push(stmt);
        insertUserRoles(stmts, user.userId, user.roles, this.param);
        return this.execBatch(stmts);
    };
    SqlUserService.prototype.update = function (user) {
        var stmts = [];
        var stmt = (0, query_core_1.buildToUpdate)(user, 'users', user_1.userModel, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        var query = "delete from userRoles where userId = ".concat(this.param(1));
        stmts.push({ query: query, params: [user.userId] });
        insertUserRoles(stmts, user.userId, user.roles, this.param);
        return this.exec(stmt.query, stmt.params);
    };
    SqlUserService.prototype.patch = function (user) {
        return this.update(user);
    };
    SqlUserService.prototype.delete = function (id) {
        var stmts = [];
        var query = "delete from userRoles where userId = ".concat(this.param(1));
        stmts.push({ query: query, params: [id] });
        var stmt = (0, query_core_1.buildToDelete)(id, 'users', this.primaryKeys, this.param);
        if (!stmt) {
            return Promise.resolve(-1);
        }
        stmts.push(stmt);
        return this.execBatch(stmts);
    };
    return SqlUserService;
}(query_core_1.Service));
exports.SqlUserService = SqlUserService;
function insertUserRoles(stmts, userId, roles, param) {
    if (roles && roles.length > 0) {
        var userRoles = roles.map(function (i) {
            var userRole = { userId: userId, roleId: i };
            return userRole;
        });
        var stmt = (0, query_core_1.buildToInsertBatch)(userRoles, 'userRoles', userRoleModel, param);
        if (stmt) {
            stmts.push(stmt);
        }
    }
    return stmts;
}
//# sourceMappingURL=index.js.map