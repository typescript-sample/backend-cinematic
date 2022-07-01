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
exports.CinemaController = void 0;
var express_ext_1 = require("express-ext");
var cinema_1 = require("./cinema");
var xvalidators_1 = require("xvalidators");
var CinemaController = /** @class */ (function (_super) {
    __extends(CinemaController, _super);
    function CinemaController(log, cinemaService) {
        var _this = _super.call(this, log, cinemaService) || this;
        _this.cinemaService = cinemaService;
        _this.array = ["status"];
        _this.all = _this.all.bind(_this);
        _this.rate = _this.rate.bind(_this);
        _this.validator = (0, xvalidators_1.createValidator)(cinema_1.cinemaRateModel);
        return _this;
    }
    CinemaController.prototype.all = function (req, res) {
        var _this = this;
        if (this.cinemaService.all) {
            this.cinemaService.all()
                .then(function (cinemas) { return res.status(200).json(cinemas); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    CinemaController.prototype.rate = function (req, res) {
        var _this = this;
        var rate = req.body;
        console.log("add rate req: ");
        console.log(rate);
        rate.ratetime = new Date();
        this.validator.validate(rate).then(function (errors) {
            if (errors && errors.length > 0) {
                res.status((0, express_ext_1.getStatusCode)(errors)).json(errors).end();
            }
            else {
                _this.cinemaService.rate(rate).then(function (rs) {
                    res.json(rs).end();
                }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
    };
    return CinemaController;
}(express_ext_1.Controller));
exports.CinemaController = CinemaController;
//# sourceMappingURL=cinema-controller.js.map