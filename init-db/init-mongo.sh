mongo --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD <<EOF

var database = '$DB_NAME';

var user = '$DB_USER';

var user_pass = '$DB_PASS';

db = db.getSiblingDB(database);

db.createUser({ user: user, pwd: user_pass, roles: [{ role: "dbOwner", db: database }], mechanisms: ["SCRAM-SHA-1"]});

EOF