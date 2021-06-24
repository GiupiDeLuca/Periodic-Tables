import React from "react";
import ReservationRow from "./ReservationRow";

function ReservationsList({
  reservations,
  reservationDone,
  cancelHandler,
  buttons,
}) {
  const reservationsTableRows = reservations
    .sort((a, b) =>
      a.reservation_time > b.reservation_time
        ? 1
        : b.reservation_time > a.reservation_time
        ? -1
        : 0
    )
    .map((reservation) => (
      <ReservationRow
        reservation={reservation}
        reservationDone={reservationDone}
        cancelHandler={cancelHandler}
        buttons={buttons}
      />
    ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Reservation Date</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">People</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>{reservationsTableRows}</tbody>
    </table>
  );
}

export default ReservationsList;
