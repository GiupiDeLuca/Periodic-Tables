const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { OCCUPIED, FREE } = require("../constants");

async function create(req, res) {
  const newTable = await service.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
  });
}

async function readTable(req, res, next) {
  const data = await service.readTable(req.params.table_id);
  res.json({ data });
}

async function updateTable(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    table_id: req.params.table_id,
  };
  if (updatedTable.reservation_id) {
    updatedTable.status = OCCUPIED;
  } else {
    updatedTable.status = FREE;
  }
  const data = await service.update(updatedTable);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(readTable)],
  update: [asyncErrorBoundary(updateTable)],
};
