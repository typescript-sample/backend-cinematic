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
exports.CategoryController = void 0;
var express_ext_1 = require("express-ext");
var CategoryController = /** @class */ (function (_super) {
    __extends(CategoryController, _super);
    function CategoryController(log, categoryService) {
        var _this = _super.call(this, log, categoryService) || this;
        _this.categoryService = categoryService;
        _this.array = ["status"];
        _this.all = _this.all.bind(_this);
        return _this;
    }
    CategoryController.prototype.all = function (req, res) {
        var _this = this;
        var v = req.query['categoryName'];
        if (v && v.toString()) {
        }
        else {
            if (this.categoryService.all) {
                this.categoryService.all()
                    .then(function (categories) { return res.status(200).json(categories); }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }
    };
    return CategoryController;
}(express_ext_1.Controller));
exports.CategoryController = CategoryController;
//# sourceMappingURL=category-controller.js.map