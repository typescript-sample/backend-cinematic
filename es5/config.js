"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.config = void 0;
exports.config = {
    //8080
    port: 8080,
    secure: false,
    cookie: false,
    allow: {
        origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'],
        credentials: 'true',
        methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
        headers: 'Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    },
    log: {
        level: 'debug',
        map: {
            time: '@timestamp',
            msg: 'message'
        },
        db: true
    },
    middleware: {
        log: true,
        skips: 'health,log',
        request: 'request',
        response: '',
        status: 'status',
        size: 'size'
    },
    ldap: {
        options: {
            url: 'ldap://ldap.forumsys.com:389'
        },
        dn: 'dc=example,dc=com',
        attributes: ['mail', 'displayName', 'uid'],
        map: {
            id: 'uid'
        },
        users: 'kaka,zinedine.zidane,gareth.bale'
    },
    db: {
        // host: '127.0.0.1',
        // port: 3306,
        // user: 'root',
        // password: 'Root/123',
        // database: 'backoffice',
        user: 'postgres',
        host: 'localhost',
        port: 5432,
        password: '12345678',
        database: 'backoffice',
        multipleStatements: true,
    },
    template: true,
    auth: {
        token: {
            secret: 'secretbackoffice',
            expires: 86400000
        },
        status: {
            success: 1
        },
        payload: {
            id: 'id',
            username: 'username',
            email: 'email',
            userType: 'userType'
        },
        account: {
            displayName: 'displayname'
        },
        userStatus: {
            activated: 'A',
            deactivated: 'D'
        },
        db: {
            status: 'status',
            sql: {
                query: 'select userId as id, username, email, displayname, status from users where username = ?'
            }
        }
    },
    sql: {
        allPrivileges: "\n      select moduleId as id,\n        moduleName as name,\n        resourceKey as resource_key,\n        path,\n        icon,\n        parent,\n        sequence\n      from modules\n      where status = 'A'",
        privileges: "\n      select distinct m.moduleId as id, m.moduleName as name, m.resourceKey as resource,\n        m.path, m.icon, m.parent, m.sequence, rm.permissions\n      from users u\n        inner join userRoles ur on u.userId = ur.userId\n        inner join roles r on ur.roleId = r.roleId\n        inner join roleModules rm on r.roleId = rm.roleId\n        inner join modules m on rm.moduleId = m.moduleId\n      where u.userId = ? and r.status = 'A' and m.status = 'A'\n      order by sequence",
        permission: "\n      select distinct rm.permissions\n      from users u\n        inner join userRoles ur on u.userId = ur.userId\n        inner join roles r on ur.roleId = r.roleId\n        inner join roleModules rm on r.roleId = rm.roleId\n        inner join modules m on rm.moduleId = m.moduleId\n      where u.userId = ? and u.status = 'A' and r.status = 'A' and rm.moduleId = ? and m.status = 'A'\n      order by sequence",
    }
};
exports.env = {
    sit: {
        secure: true,
        log: {
            db: false
        },
        db: {
            database: 'masterdata_sit',
        }
    },
    prd: {
        secure: true,
        log: {
            db: false
        },
        middleware: {
            log: false
        }
    }
};
//# sourceMappingURL=config.js.map