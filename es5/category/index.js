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
exports.useCategoryController = exports.useCategoryService = exports.CategoryManager = void 0;
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var category_1 = require("./category");
var category_controller_1 = require("./category-controller");
var sql_category_repository_1 = require("./sql-category-repository");
var CategoryManager = /** @class */ (function (_super) {
    __extends(CategoryManager, _super);
    function CategoryManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return CategoryManager;
}(onecore_1.Manager));
exports.CategoryManager = CategoryManager;
function useCategoryService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('categories', mapper, category_1.categoryModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'categories', category_1.categoryModel, db.driver, query);
    var repository = new sql_category_repository_1.SqlCategoryRepositoy(db);
    return new CategoryManager(builder.search, repository);
}
exports.useCategoryService = useCategoryService;
function useCategoryController(log, db, mapper) {
    return new category_controller_1.CategoryController(log, useCategoryService(db, mapper));
}
exports.useCategoryController = useCategoryController;
//# sourceMappingURL=index.js.map