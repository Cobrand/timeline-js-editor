module.exports = {
    "port":8080, // default is 8080
    "db":{
        "host":"localhost",
        "dialect":"mariadb",//'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
        "database":"database_name",
        "username":"username",
        "password":"password",
        "storage": "db.sqlite"
    }
}
