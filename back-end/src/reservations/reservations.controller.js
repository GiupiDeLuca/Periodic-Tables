/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function notTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  const reservationString = `${reservation_date}T${reservation_time}:00`

  const reservationDate = new Date(reservationString)

  if (reservationDate.getDay() !== 2) {
    return next();
  }
  next({ status: 400, message: "cannot make a reservation on a Tuesday" });
}

function hasRightTime(req, res, next) {
  // defining constants //
  const reservationTimeString = req.body.data.reservation_time; // "16:59:00"
  const reservationDateString = req.body.data.reservation_date;

  const earliestTimeArray = [10, 30, 0];
  const latestTimeArray = [21, 30, 0];

  const dateTimeString = `${reservationDateString}T${reservationTimeString}:00`;

  // creating date objects//
  const earliestTime = new Date(dateTimeString);
  earliestTime.setHours(...earliestTimeArray);

  const latestTime = new Date(dateTimeString);
  latestTime.setHours(...latestTimeArray);

  const reservation = new Date(dateTimeString);

  const now = new Date();

  // comparing date objects

  if (
    reservation >= earliestTime &&
    reservation <= latestTime &&
    reservation > now
  ) {
    return next();
  }
  next({ status: 400, message: "time slot not available" });
}

async function list(req, res, next) {
  const data = await service.list(req.query);
  if (req.query.mobile_number) {
    if (data.length === 0) {
      next({ status: 404, message: "reservation cannot be found." });
    } else {
      res.json({ data });
    }
  }
  res.json({ data });
}

// async function list(req, res) {
//   console.log("req.query", req.query.mobile_number)
//   const data = await service.list(req.query);
//   res.json({ data });
// }

async function create(req, res) {
  const date = new Date(req.body.data.reservation_date);

  const newReservation = await service.create({
    ...req.body.data,
    reservation_date: date.toUTCString(),
  });

  res.status(201).json({
    data: newReservation,
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(req.params.reservation_id);

  if (reservation) {
    res.locals.reservations = reservation;
    return next();
  }
  next({ status: 404, message: "reservation cannot be found." });
}

async function readReservation(req, res, next) {
  const data = await service.readReservation(
    Number(res.locals.reservations[0].reservation_id)
  );
  res.json({ data });
}

async function destroyReservation(req, res) {
  const data = await service.destroy(res.locals.reservations[0].reservation_id);
  res.status(204).json({ data });
}

async function updateReservation(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservations[0].reservation_id,
  };
  console.log("updateRes", updatedReservation);
  const data = await service.update(updatedReservation);

  res.json({ data });
}

async function statusUpdate(req, res, next) {
  const reservation = res.locals.reservations[0];

  const updateReservation = {
    ...reservation,
    status: req.body.status,
  };

  const data = await service.update(updateReservation);

  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [notTuesday, hasRightTime, asyncErrorBoundary(create)],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(readReservation),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateReservation),
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroyReservation),
  ],
  statusUpdate: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(statusUpdate),
  ],
};
