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
exports.SqlCinemaRepository = void 0;
var query_core_1 = require("query-core");
var cinema_1 = require("./cinema");
var SqlCinemaRepository = /** @class */ (function (_super) {
    __extends(SqlCinemaRepository, _super);
    function SqlCinemaRepository(db) {
        return _super.call(this, db, 'cinema', cinema_1.cinemaModel) || this;
    }
    return SqlCinemaRepository;
}(query_core_1.Repository));
exports.SqlCinemaRepository = SqlCinemaRepository;
//# sourceMappingURL=sql-cinema-repository.js.map