"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlUploadSerive = void 0;
var pg_extension_1 = require("pg-extension");
var UploadModel_1 = require("./UploadModel");
var SqlUploadSerive = /** @class */ (function () {
    function SqlUploadSerive(pool, directory, storageUpload, storageDelete, param, query, exec, execBatch) {
        var _this = this;
        this.directory = directory;
        this.storageUpload = storageUpload;
        this.storageDelete = storageDelete;
        this.param = param;
        this.query = query;
        this.exec = exec;
        this.execBatch = execBatch;
        pool.connect().then(function (client) { return _this.client = client; });
        this.all = this.all.bind(this);
        this.insert = this.insert.bind(this);
        this.load = this.load.bind(this);
        this.getUser = this.getUser.bind(this);
        this.updateData = this.updateData.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.insertData = this.insertData.bind(this);
        this.deleteData = this.deleteData.bind(this);
    }
    SqlUploadSerive.prototype.all = function () {
        return this.query('select * from uploads order by userid asc', undefined, this.map);
    };
    SqlUploadSerive.prototype.insert = function (upload) {
        return (0, pg_extension_1.save)(this.client, upload, 'uploads', UploadModel_1.uploadModel.attributes);
    };
    SqlUploadSerive.prototype.insertData = function (uploadReq) {
        var _this = this;
        return this.load(uploadReq.userId).then(function (upload) {
            if (upload) {
                upload.data.push(uploadReq.data[0]);
                return _this.insert({ userId: uploadReq.userId, data: upload.data }).then(function (res) { return res; });
            }
            else {
                return _this.insert({ userId: uploadReq.userId, data: [uploadReq.data[0]] }).then(function (res) { return res; });
            }
        }).catch(function (err) {
            console.log(err);
            throw err;
        });
    };
    SqlUploadSerive.prototype.load = function (id) {
        return this.query('select * from uploads where userid = $1', [id]).then(function (uploads) {
            if (!uploads || uploads.length === 0) {
                return {
                    userId: '',
                    data: []
                };
            }
            else {
                return uploads[0];
            }
        })
            .catch(function (e) {
            console.log(e);
            throw e;
        });
    };
    SqlUploadSerive.prototype.uploadFile = function (id, source, type, name, fileBuffer) {
        var _this = this;
        return this.storageUpload(this.directory, name, fileBuffer)
            .then(function (result) {
            return _this.load(id).then(function (upload) {
                if (upload) {
                    upload.data.push({ source: source, type: type, url: result });
                    return _this.insert({ userId: id, data: upload.data }).then(function () { return result; });
                }
                else {
                    return _this.insert({ userId: id, data: [{ source: source, type: type, url: result }] }).then(function () { return result; });
                }
            });
        })
            .catch(function (err) {
            throw err;
        });
    };
    SqlUploadSerive.prototype.deleteFile = function (userId, fileName, url) {
        var _this = this;
        return this.storageDelete(this.directory, fileName).then(function (result) {
            if (result) {
                return _this.load(userId).then(function (upload) {
                    var deleteFile = upload.data.findIndex(function (item) { return item.url === url; });
                    var userImageUrl = upload.data.filter(function (d) { return d.type === 'image'; })[0].url;
                    if (deleteFile > -1 && url !== userImageUrl) {
                        upload.data.splice(deleteFile, 1);
                        return _this.insert({ userId: userId.toString(), data: upload.data }).then(function (res) { return res; });
                    }
                    else if (deleteFile > -1 && url === userImageUrl) {
                        upload.data.splice(deleteFile, 1);
                        return _this.updateData(userId.toString(), upload.data).then(function (res) { return res; });
                    }
                    else {
                        return 1;
                    }
                });
            }
            else
                return 1;
        })
            .catch(function (err) {
            throw err;
        });
    };
    SqlUploadSerive.prototype.getUser = function (id) {
        return this.query('select * from users where userid = $1', [id]).then(function (res) {
            return res[0];
        }).catch(function (e) {
            console.log(e);
            throw e;
        });
    };
    SqlUploadSerive.prototype.updateData = function (userId, data) {
        var imageUrl = data.filter(function (d) { return d.type === 'image'; })[0].url;
        var statementData = { query: 'update uploads set data = $1 where userid = $2', params: [data, userId] };
        var statementUser = { query: 'update users set imageurl = $1 where userid = $2', params: [imageUrl, userId] };
        return this.execBatch([statementData, statementUser]).then(function (r) { return r; }).catch(function (e) {
            console.log(e);
            throw e;
        });
    };
    SqlUploadSerive.prototype.deleteData = function (userId, url) {
        var _this = this;
        return this.load(userId).then(function (upload) {
            var deleteFile = upload.data.findIndex(function (item) { return item.url === url; });
            if (deleteFile > -1) {
                upload.data.splice(deleteFile, 1);
                return _this.insert({ userId: userId.toString(), data: upload.data }).then(function (res) { return res; });
            }
            else {
                return 0;
            }
        }).catch(function (e) {
            throw e;
        });
    };
    return SqlUploadSerive;
}());
exports.SqlUploadSerive = SqlUploadSerive;
//# sourceMappingURL=SqlUploadsService.js.map