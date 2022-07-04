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
exports.useFilmRateController = exports.useFilmRateService = exports.FilmRateManager = exports.useFilmController = exports.useFilmService = exports.FilmManager = void 0;
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var film_1 = require("./film");
var film_controller_1 = require("./film-controller");
var sql_film_repository_1 = require("./sql-film-repository");
var sql_film_info_repository_1 = require("./sql-film-info-repository");
var sql_film_rate_repository_1 = require("./sql-film-rate-repository");
var uuid_1 = require("uuid");
var film_rate_controller_1 = require("./film-rate-controller");
var FilmManager = /** @class */ (function (_super) {
    __extends(FilmManager, _super);
    function FilmManager(search, repository, infoRepository, rateRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.infoRepository = infoRepository;
        _this.rateRepository = rateRepository;
        return _this;
    }
    ;
    FilmManager.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (film) {
            if (!film) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        film.info = info;
                    }
                    return film;
                });
            }
        });
    };
    FilmManager.prototype.rate = function (rate) {
        return __awaiter(this, void 0, void 0, function () {
            var info, dbInfo, dbRate, res, res, sumRate, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoRepository.load(rate.filmId)];
                    case 1:
                        info = _a.sent();
                        if (!!info) return [3 /*break*/, 4];
                        dbInfo = {
                            'id': rate.filmId,
                            'rate': 0,
                            'rate1': 0,
                            'rate2': 0,
                            'rate3': 0,
                            'rate4': 0,
                            'rate5': 0,
                            'rate6': 0,
                            'rate7': 0,
                            'rate8': 0,
                            'rate9': 0,
                            'rate10': 0,
                            'viewCount': 0,
                        };
                        return [4 /*yield*/, this.infoRepository.insert(dbInfo)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.infoRepository.load(rate.filmId)];
                    case 3:
                        info = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!info || typeof info[('rate' + rate.rate.toString())] === 'undefined') {
                            return [2 /*return*/, false];
                        }
                        if (!rate.id) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.rateRepository.load(rate.id)];
                    case 5:
                        dbRate = _a.sent();
                        if (!dbRate) {
                            return [2 /*return*/, false];
                        }
                        info['rate' + dbRate.rate.toString()] -= 1;
                        dbRate.rate = rate.rate;
                        console.log("rate.rate" + rate.rate);
                        return [4 /*yield*/, this.rateRepository.update(dbRate)];
                    case 6:
                        res = _a.sent();
                        if (res < 1) {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 9];
                    case 7:
                        rate.id = (0, uuid_1.v4)();
                        return [4 /*yield*/, this.rateRepository.insert(rate)];
                    case 8:
                        res = _a.sent();
                        if (res < 1) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 9;
                    case 9:
                        info['rate' + rate.rate.toString()] += 1;
                        sumRate = info.rate1 +
                            info.rate2 * 2 +
                            info.rate3 * 3 +
                            info.rate4 * 4 +
                            info.rate5 * 5 +
                            info.rate6 * 6 +
                            info.rate7 * 7 +
                            info.rate8 * 8 +
                            info.rate9 * 9 +
                            info.rate10 * 10;
                        count = info.rate1 +
                            info.rate2 +
                            info.rate3 +
                            info.rate4 +
                            info.rate5 +
                            info.rate6 +
                            info.rate7 +
                            info.rate8 +
                            info.rate9 +
                            info.rate10;
                        info.rate = sumRate / count;
                        info.viewCount = count;
                        this.infoRepository.update(info);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return FilmManager;
}(onecore_1.Manager));
exports.FilmManager = FilmManager;
function useFilmService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('film', mapper, film_1.filmModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'films', film_1.filmModel, db.driver, query);
    var repository = new sql_film_repository_1.SqlFilmRepositoy(db);
    var infoRepository = new sql_film_info_repository_1.SqlFilmInfoRepositoy(db);
    var rateRepository = new sql_film_rate_repository_1.SqlFilmRateRepositoy(db);
    return new FilmManager(builder.search, repository, infoRepository, rateRepository);
}
exports.useFilmService = useFilmService;
function useFilmController(log, db, mapper) {
    return new film_controller_1.FilmController(log, useFilmService(db, mapper));
}
exports.useFilmController = useFilmController;
var FilmRateManager = /** @class */ (function (_super) {
    __extends(FilmRateManager, _super);
    function FilmRateManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return FilmRateManager;
}(onecore_1.Manager));
exports.FilmRateManager = FilmRateManager;
function useFilmRateService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('filmrate', mapper, film_1.filmRateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'filmrate', film_1.filmRateModel, db.driver, query);
    var repository = new sql_film_rate_repository_1.SqlFilmRateRepositoy(db);
    return new FilmRateManager(builder.search, repository);
}
exports.useFilmRateService = useFilmRateService;
function useFilmRateController(log, db, mapper) {
    return new film_rate_controller_1.FilmRateController(log, useFilmRateService(db, mapper));
}
exports.useFilmRateController = useFilmRateController;
//# sourceMappingURL=index.js.map