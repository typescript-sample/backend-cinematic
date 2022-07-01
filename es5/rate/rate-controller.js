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
exports.RateController = void 0;
var express_ext_1 = require("express-ext");
var rate_1 = require("./rate");
var xvalidators_1 = require("xvalidators");
var RateController = /** @class */ (function (_super) {
    __extends(RateController, _super);
    function RateController(log, rateService) {
        var _this = _super.call(this, log, rateService) || this;
        _this.rateService = rateService;
        _this.all = _this.all.bind(_this);
        _this.load = _this.load.bind(_this);
        _this.validator = (0, xvalidators_1.createValidator)(rate_1.rateModel);
        return _this;
    }
    RateController.prototype.all = function (req, res) {
        var _this = this;
        if (this.rateService.all) {
            this.rateService.all()
                .then(function (rates) { return res.status(200).json(rates); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    RateController.prototype.load = function (req, res) {
        var _this = this;
        var rate = req.body;
        console.log(JSON.stringify(rate));
        this.validator.validate(rate).then(function (errors) {
            if (errors && errors.length > 0) {
                res.status((0, express_ext_1.getStatusCode)(errors)).json(errors).end();
            }
            else {
                _this.rateService.searchRate(rate).then(function (rs) {
                    res.json(rs).end();
                }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }).catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
    };
    return RateController;
}(express_ext_1.Controller));
exports.RateController = RateController;
//# sourceMappingURL=rate-controller.js.map