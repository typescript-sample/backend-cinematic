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
exports.FilmRateController = void 0;
var express_ext_1 = require("express-ext");
var FilmRateController = /** @class */ (function (_super) {
    __extends(FilmRateController, _super);
    // validator: Validator<FilmRate>;
    function FilmRateController(log, filmRateService) {
        return _super.call(this, log, filmRateService) || this;
        // this.validator = createValidator<FilmRate>(filmRateModel);
    }
    return FilmRateController;
}(express_ext_1.Controller));
exports.FilmRateController = FilmRateController;
//# sourceMappingURL=film-rate-controller.js.map