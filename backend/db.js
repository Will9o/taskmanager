const Firebird = require('node-firebird');

const options = {
    host: '127.0.0.1',
    port: 3050,
    database: 'C:/Users/ADMIN/Documents/taskmanager/banco/TM.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true,
    role: null,
    pageSize: 4096
};

module.exports = options;