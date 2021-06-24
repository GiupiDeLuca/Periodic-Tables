import React from "react";
import { BOOKED, SEATED, CANCELLED } from "../../utils/constants";

function ReservationDisplayRow({
  reservation,
  buttons,
  reservationDone,
  cancelHandler,
}) {
  return (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.status}</td>
      {buttons && (
        <td>
          {reservation.status === BOOKED && (
            <button type="button" className="btn btn-secondary mr-1 mb-2">
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Edit
              </a>
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td>
          {reservation.status !== CANCELLED && (
            <button
              type="button"
              className="btn btn-secondary mr-1 mb-2"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => cancelHandler(reservation.reservation_id)}
            >
              Cancel
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td>
          {reservation.status === BOOKED && (
            <button type="button" className="btn btn-secondary mr-1 mb-2">
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Seat
              </a>
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td>
          {reservation.status === SEATED && (
            <button
              type="button"
              className="btn btn-secondary mr-1 mb-2"
              onClick={() => reservationDone(reservation.reservation_id)}
            >
              Done
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td>
          {reservation.status === CANCELLED && (
            <button
              type="button"
              className="btn btn-secondary mr-1 mb-2"
              onClick={() => reservationDone(reservation.reservation_id)}
            >
              Done
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

export default ReservationDisplayRow;
