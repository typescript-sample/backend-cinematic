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
exports.SqlFilmRepositoy = void 0;
var query_core_1 = require("query-core");
var film_1 = require("./film");
var SqlFilmRepositoy = /** @class */ (function (_super) {
    __extends(SqlFilmRepositoy, _super);
    function SqlFilmRepositoy(db) {
        return _super.call(this, db, 'films', film_1.filmModel) || this;
    }
    return SqlFilmRepositoy;
}(query_core_1.Repository));
exports.SqlFilmRepositoy = SqlFilmRepositoy;
//# sourceMappingURL=sql-film-repository.js.map