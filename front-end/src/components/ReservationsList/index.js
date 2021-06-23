import React from "react";
import ReservationRow from "./ReservationRow"

function ReservationsList({reservations, reservationDone, cancelHandler, buttons}) {

    const reservationsTableRows = reservations.map((reservation) => (
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
    )

}

export default ReservationsList