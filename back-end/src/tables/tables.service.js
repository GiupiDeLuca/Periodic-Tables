const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

function readTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId });
}

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

module.exports = {
  list,
  create,
  readTable,
  update,
};
