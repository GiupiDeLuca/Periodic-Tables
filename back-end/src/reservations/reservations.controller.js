/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reservationDefinition = {
  first_name: "",
  last_name: "",
  mobile_number: "518-555-5555",
  reservation_date: "1972-01-01",
  reservation_time: "00:00:01",
  people: 1,
};

function propertiesAreDefined(req, res, next) {
  const reservation = req.body.data;
  if (!reservation) {
    return next({ status: 400 });
  }
  const keys = Object.keys(reservationDefinition);
  keys.forEach((key) => {
    if (!reservation[key]) {
      return next({ status: 400, message: key });
    }
  });
  const { reservationTimeString, reservationDateString } = reservation; // "16:59:00"
  const reservationString = `${reservationTimeString}T${reservationDateString}:00`;
  res.locals.dateTimeString = reservationString;

  keys.forEach((key) => {
    if (
      key === "people" &&
      (typeof reservation[key] !== "number" ||
        reservation[key] < reservationDefinition.people)
      // (!isNaN(reservation[key]) ||
      //   reservation[key] < reservationDefinition.people)
    ) {
      return next({ status: 400, message: key });
    } else if (
      key === "reservation_date" &&
      new Date(reservation.reservation_date).toDateString() === "Invalid Date"
    ) {
      return next({ status: 400, message: key });
    } else if (key === "reservation_time") {
      const reservationTime = reservation[key];
      const timeArray = reservationTime.split(":");
      if (
        timeArray.length !== 2 ||
        isNaN(timeArray[0]) ||
        isNaN(timeArray[1])
      ) {
        return next({ status: 400, message: key });
      }
    }
  });

  return next();
}

function notTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  const reservationString = `${reservation_date}T${reservation_time}:00`;

  res.locals.dateTimeString = reservationString;

  const reservationDate = new Date(reservationString);

  if (reservationDate.getDay() !== 2) {
    return next();
  }
  next({ status: 400, message: "closed" });
}

function notClosed(req, res, next) {
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

  if (reservation >= earliestTime && reservation <= latestTime) {
    return next();
  }
  next({ status: 400, message: "closed" });
}

function notPast(req, res, next) {
  const now = new Date();
  const reservation = new Date(res.locals.dateTimeString);

  if (reservation > now) {
    return next();
  }
  next({ status: 400, message: "future" });
}

function phoneValidation(mobile_number) {
  if (mobile_number.length < 10) {
    return false;
  }
  const justNumbers = mobile_number.match(/\d+/g);
  if (justNumbers && justNumbers.join("").length < 10) {
    return false;
  }
  return true;
}

async function list(req, res, next) {
  if (req.query.mobile_number) {
    if (!phoneValidation(req.query.mobile_number)) {
      next({ status: 400, message: "enter a valid phone number" });
    }
  }
  const data = await service.list(req.query);
  if (req.query.mobile_number && data.length === 0) {
    next({ status: 404, message: "reservation cannot be found." });
  } else {
    return res.json({ data });
  }
  res.json({ data });
}

async function create(req, res) {
  const date = new Date(req.body.data.reservation_date);

  const reservationStrings = res.locals.dateTimeString.split("T");

  const reservationDate = reservationStrings[0];
  const reservationTime = reservationStrings[1];

  const newReservation = await service.create({
    ...req.body.data,
    reservation_date: date.toUTCString(),
  });
  
  res.status(201).json({
    data: [
      {
        ...newReservation[0],
        reservation_date: reservationDate,
        reservation_time: reservationTime,
      },
    ],
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(req.params.reservation_id);
  if (reservation.length === 1) {
    res.locals.reservations = reservation;
    return next();
  }
  next({ status: 404, message: `${req.params.reservation_id}` });
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
  create: [
    propertiesAreDefined,
    notTuesday,
    notClosed,
    notPast,
    asyncErrorBoundary(create),
  ],
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
