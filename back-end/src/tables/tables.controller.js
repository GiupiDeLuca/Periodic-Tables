const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { OCCUPIED, FREE, FINISHED, SEATED } = require("../constants");

const reservationService = require("../reservations/reservations.service");

const tableDefinition = {
  table_name: "C",
  capacity: 0,
};

function propertiesAreDefined(req, res, next) {
  const table = req.body.data;
  if (!table) {
    return next({ status: 400 });
  }
  const keys = Object.keys(tableDefinition);
  keys.forEach((key) => {
    if (table[key] === undefined) {
      return next({ status: 400, message: key });
    }
  });

  keys.forEach((key) => {
    if (
      key === "table_name" &&
      table[key].length <= tableDefinition.table_name.length
    ) {
      return next({ status: 400, message: key });
    } else if (key === "capacity" && table[key] === 0) {
      return next({ status: 400, message: key });
    }
  });
  next();
}

async function updateDataValidation(req, res, next) {
  const tableRequest = req.body.data;
  const { table_id } = req.params;
  const table = (await service.readTable(table_id))[0];

  if (Object.keys(tableRequest).length === 0) {
    return next({ status: 400 });
  }

  const reservation = await reservationService.readReservation(
    tableRequest.reservation_id
  );
  console.log("tableRequest", tableRequest);
  // if the table is occupied
  if (table.status === OCCUPIED) {
    // and a reservation is trying to be seated
    if (typeof tableRequest.reservation_id === "number") {
      //return an error
      return next({ status: 400, message: "is occupied" });
    }
    //if the table is free
  } else if (table.status === FREE || table.status === null) {
    // and the request is trying to free it
    if (tableRequest.reservation_id === null) {
      //return an error
      return next({ status: 400, message: "not occupied" });
    } else if (
      tableRequest.reservation_id !== null &&
      reservation.length === 0
    ) {
      return next({ status: 404, message: `${tableRequest.reservation_id}` });
    }
  }

  res.locals.table = table;
  if (reservation.length !== 0) {
    res.locals.reservation = reservation[0];
  }

  next();
}

function correctCapacity(req, res, next) {
  const { table } = res.locals;
  if (req.body.data.reservation_id !== null) {
    const { reservation } = res.locals;
    if (reservation.people > table.capacity) {
      return next({ status: 400, message: "capacity" });
    }
  }
  next();
}

function reservationSeatedAtDifferentTable(req, res, next) {
  const { table } = res.locals;
  if (req.body.data.reservation_id !== null) {
    const { reservation } = res.locals;
    if (reservation.status === SEATED) {
      return next({ status: 400, message: "seated" });
    }
  }
  next();
}

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
  if (data.length === 0) {
    return next({ status: 404, message: `${req.params.table_id}` });
  }
  res.json({ data });
}

async function updateTable(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table } = res.locals;
  console.log("table", table);
  console.log("res_id", reservation_id);
  let reservation;
  if (reservation_id === null) {
    reservation = (
      await reservationService.readReservation(table.reservation_id)
    )[0];

    table.status = FREE;
    reservation.status = FINISHED;
    table.reservation_id = null;
  } else {
    reservation = res.locals.reservation;
    
    table.status = OCCUPIED;
    reservation.status = SEATED;
    table.reservation_id = reservation.reservation_id;
  }

  const updateTableData = (await service.update(table))[0];
  const updateReservationData = await reservationService.update(reservation);

  res.status(200).json({ updateTableData });
  
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [propertiesAreDefined, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(readTable)],
  update: [
    asyncErrorBoundary(updateDataValidation),
    correctCapacity,
    reservationSeatedAtDifferentTable,
    asyncErrorBoundary(updateTable),
  ],
};
