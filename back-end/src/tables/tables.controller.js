const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { OCCUPIED, FREE, BOOKED } = require("../constants");
const reservationService = require("../reservations/reservations.service");

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
  console.log("dataread", data);
  res.json({ data });
}

async function finishOccupiedTableValidation(req, res, next) {
  const table = await service.readTable(req.params.table_id);

  if (
    table[0].reservation_id === null ||
    (table[0].reservation_id && table[0].status === OCCUPIED)
  ) {
    return next();
  }

  next({ status: 400, message: "you can only finish an occupied table" });
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
  const updatedTableData = await service.update(updatedTable);

  const reservation = await reservationService.readReservation(
    updatedTableData[0].reservation_id
  );

  if (
    reservation.length === 0 ||
    updatedTableData[0].capacity >= reservation[0].people
  ) {
    res.json({ updatedTableData });
  } else {
    const reversedTableUpdate = {
      ...updatedTableData[0],
      status: FREE,
      reservation_id: null,
    };
    const reservationUpdate = {
      ...reservation[0],
      status: BOOKED,
    };
    await service.update(reversedTableUpdate);
    await reservationService.update(reservationUpdate);
    next({
      status: 400,
      message: `please select a table that can hold at least ${reservation[0].people} people`,
    });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(readTable)],
  update: [
    asyncErrorBoundary(finishOccupiedTableValidation),
    asyncErrorBoundary(updateTable),
  ],
};
