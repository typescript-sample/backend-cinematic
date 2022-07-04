"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
var express_ext_1 = require("express-ext");
var utils_1 = require("./utils");
var UploadController = /** @class */ (function () {
    function UploadController(log, uploadService) {
        this.log = log;
        this.uploadService = uploadService;
        this.all = this.all.bind(this);
        this.load = this.load.bind(this);
        this.upload = this.upload.bind(this);
        this.insertData = this.insertData.bind(this);
        this.remove = this.remove.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.getImageUser = this.getImageUser.bind(this);
        this.updateData = this.updateData.bind(this);
    }
    UploadController.prototype.all = function (req, res) {
        var _this = this;
        this.uploadService.all()
            .then(function (roles) { return res.status(200).json(roles); })
            .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
    };
    UploadController.prototype.load = function (req, res) {
        var _this = this;
        var id = req.params.id;
        this.uploadService.load(id).then(function (data) {
            if (data) {
                return res.status(200).json(data.data);
            }
            else {
                return res.status(200).json([]);
            }
        }).catch(function (e) {
            return (0, express_ext_1.handleError)(e, res, _this.log);
        });
    };
    UploadController.prototype.upload = function (req, res) {
        var _this = this;
        if (!req || !req.file)
            return;
        var fileName = req.file.originalname;
        var fileBuffer = req.file.buffer;
        var fileType = req.file.mimetype;
        var type = fileType.split('/')[0];
        var _a = req.body, id = _a.id, source = _a.source;
        var name = "".concat(id.toString(), "_") + fileName;
        this.uploadService.uploadFile(id, source, type, name, fileBuffer).then(function (result) {
            return res.status(200).json(result);
        }).catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
    };
    UploadController.prototype.remove = function (req, res) {
        var _this = this;
        var _a = req.query, _b = _a.url, url = _b === void 0 ? "" : _b, _c = _a.userId, userId = _c === void 0 ? "" : _c;
        var fileName = (0, utils_1.getFileName)(url.toString());
        this.uploadService.deleteFile(userId.toString(), fileName, url.toString()).then(function (result) {
            return res.status(200).json(result);
        }).catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
    };
    UploadController.prototype.insertData = function (req, res) {
        var _this = this;
        var uploadReq = req.body;
        if (!uploadReq) {
            return res.status(400).send('require');
        }
        else {
            this.uploadService.insertData(uploadReq).then(function (result) {
                return res.status(200).json(result);
            }).
                catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
        }
    };
    UploadController.prototype.deleteData = function (req, res) {
        var _this = this;
        var _a = req.query, url = _a.url, userId = _a.userId;
        if (url && userId) {
            this.uploadService.deleteData(userId.toString(), url.toString())
                .then(function (result) { return res.status(200).json(result); })
                .catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
        }
        else {
            return res.status(400).send('require');
        }
    };
    UploadController.prototype.getImageUser = function (req, res) {
        var _this = this;
        var id = req.params.id;
        if (!id) {
            return res.status(400).send('require');
        }
        else {
            return this.uploadService.getUser(id).then(function (r) {
                return res.status(200).json(r);
            }).catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
        }
    };
    UploadController.prototype.updateData = function (req, res) {
        var _this = this;
        var _a = req.body, data = _a.data, userId = _a.userId;
        var dataUpdate = data;
        if (dataUpdate && userId) {
            return this.uploadService.updateData(userId, dataUpdate).then(function (r) {
                return res.status(200).json(r);
            }).catch(function (e) { return (0, express_ext_1.handleError)(e, res, _this.log); });
        }
        else {
            return res.status(400).send('require');
        }
    };
    return UploadController;
}());
exports.UploadController = UploadController;
//# sourceMappingURL=UploadController.js.map