"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.HealthController2 = exports.health = exports.Checker2 = void 0;
var https = require('https');
function getHealth(url, timeout) {
    return new Promise(function (resolve) {
        https.get(url, { rejectUnauthorized: false }, function (res) {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            var data = '';
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                console.log(data);
                resolve({ statusCode: res.statusCode, data: { data: data }, statusMessage: res.statusMessage });
            });
        }).on('error', function (e) {
            var error = { statusCode: 500, statusMessage: e };
            return error;
        });
        setTimeout(function () { return resolve({ statusCode: 408, statusMessage: 'Time out' }); }, timeout);
    });
}
var Checker2 = /** @class */ (function () {
    function Checker2(service, url, timeout) {
        this.service = service;
        this.url = url;
        this.timeout = (timeout ? timeout : 4200);
        this.check = this.check.bind(this);
        this.name = this.name.bind(this);
        this.build = this.build.bind(this);
    }
    Checker2.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                obj = {};
                return [2 /*return*/, getHealth(this.url, this.timeout).then(function (r) { return obj = r; })];
            });
        });
    };
    Checker2.prototype.name = function () {
        return this.service;
    };
    Checker2.prototype.build = function (data, err) {
        if (err) {
            if (!data) {
                data = {};
            }
            data['error'] = err;
        }
        return data;
    };
    return Checker2;
}());
exports.Checker2 = Checker2;
function health(checkers) {
    return __awaiter(this, void 0, void 0, function () {
        var p, sub, r, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = { status: 'UP' };
                    p.details = {};
                    sub = { status: 'UP' };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, checkers[0].check()];
                case 2:
                    r = _a.sent();
                    if (r && r.statusCode == 200) {
                        sub.status = 'UP';
                    }
                    if (r && r.statusCode != 200) {
                        sub.status = 'DOWN';
                        sub.data = r.statusMessage;
                        p.status = 'DOWN';
                    }
                    p.details[checkers[0].name()] = __assign({}, sub);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    sub.status = 'DOWN';
                    p.status = 'DOWN';
                    sub.data = { error: err_1 };
                    p.details[checkers[0].name()] = sub;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, p];
            }
        });
    });
}
exports.health = health;
var HealthController2 = /** @class */ (function () {
    function HealthController2(checkers) {
        this.checkers = checkers;
        this.check = this.check.bind(this);
    }
    HealthController2.prototype.check = function (req, res) {
        health(this.checkers).then(function (r) {
            if (r.status === 'UP') {
                return res.status(200).json(r).end();
            }
            else {
                return res.status(500).json(r).end();
            }
        });
    };
    return HealthController2;
}());
exports.HealthController2 = HealthController2;
//# sourceMappingURL=index.js.map