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
exports.FilmController = void 0;
var express_ext_1 = require("express-ext");
var film_1 = require("./film");
var xvalidators_1 = require("xvalidators");
var FilmController = /** @class */ (function (_super) {
    __extends(FilmController, _super);
    function FilmController(log, filmService) {
        var _this = _super.call(this, log, filmService) || this;
        _this.filmService = filmService;
        _this.array = ["status"];
        _this.all = _this.all.bind(_this);
        _this.rate = _this.rate.bind(_this);
        _this.validator = (0, xvalidators_1.createValidator)(film_1.filmRateModel);
        return _this;
    }
    FilmController.prototype.all = function (req, res) {
        var _this = this;
        if (this.filmService.all) {
            this.filmService.all()
                .then(function (films) { return res.status(200).json(films); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    FilmController.prototype.rate = function (req, res) {
        var _this = this;
        var rate = req.body;
        rate.rateTime = new Date();
        this.validator.validate(rate).then(function (errors) {
            if (errors && errors.length > 0) {
                res.status((0, express_ext_1.getStatusCode)(errors)).json(errors).end();
            }
            else {
                _this.filmService.rate(rate).then(function (rs) {
                    res.json(rs).end();
                }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
    };
    return FilmController;
}(express_ext_1.Controller));
exports.FilmController = FilmController;
//# sourceMappingURL=film-controller.js.map