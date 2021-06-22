const knex = require("../db/connection");

function list({ date, mobile_number }) {
  return knex("reservations")
    .select("*")
    .modify(function (queryBuilder) {
      if (date) {
        let startOfDay = new Date(date);
        let endOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);
        queryBuilder.whereBetween("reservation_date", [startOfDay, endOfDay]);
      }
      if (mobile_number) {
        queryBuilder
          .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
          )
          .orderBy("reservation_date");
      }
    });
}



function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

function readReservation(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId });
}

function destroy(reservationId) {
  return knex("reservations").where({ reservation_id: reservationId }).del();
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*");
}

module.exports = {
  list,
  create,
  readReservation,
  destroy,
  update,
};
