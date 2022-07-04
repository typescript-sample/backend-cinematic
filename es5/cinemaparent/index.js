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
exports.useCinemaParentController = exports.useCinemaParentService = exports.CinemaParentManager = exports.CinemaParentController = void 0;
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var cinema_parent_1 = require("./cinema-parent");
var cinema_parent_controller_1 = require("./cinema-parent-controller");
Object.defineProperty(exports, "CinemaParentController", { enumerable: true, get: function () { return cinema_parent_controller_1.CinemaParentController; } });
var query_mappers_1 = require("query-mappers");
__exportStar(require("./cinema-parent-controller"), exports);
var sql_cinema_parent_repository_1 = require("./sql-cinema-parent-repository");
var CinemaParentManager = /** @class */ (function (_super) {
    __extends(CinemaParentManager, _super);
    function CinemaParentManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    CinemaParentManager.prototype.test = function (obj, ctx) {
        return new Promise(function () { return 1; });
        // return this.repository.insert(obj, ctx);
    };
    return CinemaParentManager;
}(onecore_1.Manager));
exports.CinemaParentManager = CinemaParentManager;
function useCinemaParentService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('cinemaParent', mapper, cinema_parent_1.CinemaParentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'CinemaParent', cinema_parent_1.CinemaParentModel, db.driver, query);
    var repository = new sql_cinema_parent_repository_1.SqlCinemaParentRepository(db);
    return new CinemaParentManager(builder.search, repository);
}
exports.useCinemaParentService = useCinemaParentService;
function useCinemaParentController(log, db, mapper) {
    return new cinema_parent_controller_1.CinemaParentController(log, useCinemaParentService(db, mapper));
}
exports.useCinemaParentController = useCinemaParentController;
//# sourceMappingURL=index.js.map