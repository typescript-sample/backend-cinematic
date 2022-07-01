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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCinemaRateController = exports.useCinemaRateService = exports.CinemaRateManager = exports.useCinemaController = exports.useCinemaService = exports.CinemaManager = exports.CinemaController = void 0;
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var cinema_1 = require("./cinema"); // rate
var cinema_controller_1 = require("./cinema-controller");
Object.defineProperty(exports, "CinemaController", { enumerable: true, get: function () { return cinema_controller_1.CinemaController; } });
var query_mappers_1 = require("query-mappers");
__exportStar(require("./cinema-controller"), exports);
var sql_cinema_repository_1 = require("./sql-cinema-repository");
var sql_cinema_info_repository_1 = require("./sql-cinema-info-repository");
var sql_cinema_rate_repository_1 = require("./sql-cinema-rate-repository");
var cinema_rate_controller_1 = require("./cinema-rate-controller");
var sql_rate_repository_1 = require("../rate/sql-rate-repository");
var CinemaManager = /** @class */ (function (_super) {
    __extends(CinemaManager, _super);
    function CinemaManager(search, repository, infoRepository, rateRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.infoRepository = infoRepository;
        _this.rateRepository = rateRepository;
        _this.search = _this.search.bind(_this);
        return _this;
    }
    ;
    CinemaManager.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (cinema) {
            if (!cinema) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id']; // not take info_id
                        cinema.info = info;
                    }
                    return cinema;
                });
            }
        });
    };
    CinemaManager.prototype.rate = function (rate) {
        return __awaiter(this, void 0, void 0, function () {
            var info, dbInfo, reviewed, res, sumRate, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("rate: ");
                        console.log(rate);
                        console.log("rate.id: " + rate.id);
                        return [4 /*yield*/, this.infoRepository.load(rate.id)];
                    case 1:
                        info = _a.sent();
                        console.log("info");
                        console.log(info);
                        if (!!info) return [3 /*break*/, 4];
                        dbInfo = {
                            'id': rate.id,
                            'rate': 0,
                            'rate1': 0,
                            'rate2': 0,
                            'rate3': 0,
                            'rate4': 0,
                            'rate5': 0,
                            'viewCount': 0,
                        };
                        return [4 /*yield*/, this.infoRepository.insert(dbInfo)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.infoRepository.load(rate.id)];
                    case 3:
                        info = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!info || typeof info[('rate' + rate.rate.toString())] === 'undefined') {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.rateRepository.searchRate(rate)];
                    case 5:
                        reviewed = _a.sent();
                        console.log("reviewed");
                        console.log(reviewed);
                        if (!reviewed) return [3 /*break*/, 6];
                        info['rate' + reviewed.rate.toString()] -= 1;
                        reviewed.rate = rate.rate;
                        reviewed.review = rate.review;
                        console.log("new review");
                        console.log(reviewed);
                        // const res = await this.rateRepository.updateCinemaRate(reviewed);
                        // console.log("res::::" + res);
                        // if (res === false) {
                        //   return false;
                        // }
                        return [2 /*return*/, true];
                    case 6: return [4 /*yield*/, this.rateRepository.insert(rate)];
                    case 7:
                        res = _a.sent();
                        if (res < 1) {
                            return [2 /*return*/, false];
                        }
                        info['rate' + rate.rate.toString()] += 1;
                        sumRate = info.rate1 +
                            info.rate2 * 2 +
                            info.rate3 * 3 +
                            info.rate4 * 4 +
                            info.rate5 * 5;
                        count = info.rate1 +
                            info.rate2 +
                            info.rate3 +
                            info.rate4 +
                            info.rate5;
                        info.rate = sumRate / count;
                        info.viewCount = count;
                        this.infoRepository.update(info);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return CinemaManager;
}(onecore_1.Manager));
exports.CinemaManager = CinemaManager;
function useCinemaService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('cinema', mapper, cinema_1.cinemaModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'cinema', cinema_1.cinemaModel, db.driver, query);
    var repository = new sql_cinema_repository_1.SqlCinemaRepository(db);
    var infoRepository = new sql_cinema_info_repository_1.SqlCinemaInfoRepository(db);
    var rateRepository = new sql_rate_repository_1.SqlRateRepository(db);
    return new CinemaManager(builder.search, repository, infoRepository, rateRepository);
}
exports.useCinemaService = useCinemaService;
function useCinemaController(log, db, mapper) {
    return new cinema_controller_1.CinemaController(log, useCinemaService(db, mapper));
}
exports.useCinemaController = useCinemaController;
var CinemaRateManager = /** @class */ (function (_super) {
    __extends(CinemaRateManager, _super);
    function CinemaRateManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return CinemaRateManager;
}(onecore_1.Manager));
exports.CinemaRateManager = CinemaRateManager;
function useCinemaRateService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('cinemarate', mapper, cinema_1.cinemaRateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'cinemarate', cinema_1.cinemaRateModel, db.driver, query);
    var repository = new sql_cinema_rate_repository_1.SqlCinemaRateRepository(db);
    return new CinemaRateManager(builder.search, repository);
}
exports.useCinemaRateService = useCinemaRateService;
function useCinemaRateController(log, db, mapper) {
    return new cinema_rate_controller_1.CinemaRateController(log, useCinemaRateService(db, mapper));
}
exports.useCinemaRateController = useCinemaRateController;
//# sourceMappingURL=index.js.map