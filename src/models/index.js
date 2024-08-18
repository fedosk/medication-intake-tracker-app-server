const createMedicationsTable = require('./medication.model');
const createTokenTable = require('./token.model');
const createUserTable = require('./user.model');

const createDBTables = async () => {
  await createUserTable();
  await createTokenTable();
  await createMedicationsTable();
};

module.exports = createDBTables;
