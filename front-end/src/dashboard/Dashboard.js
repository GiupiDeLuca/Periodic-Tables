import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { CANCELLED, SEATED } from "../utils/constants";
import { listTables } from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate, tables, setTables }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    Promise.all([
      listReservations({ date }, abortController.signal),
      listTables(abortController.signal),
    ])
      .then(([reservationData, tableData]) => {
        setReservations(reservationData);
        setTables(tableData);
      })
      .catch(setReservationsError);

    // listReservations({ date }, abortController.signal)
    //   .then((data) => {
    //     setReservations(data);
    //   })
    //   .catch(setReservationsError);
    // listTables(abortController.signal)
    //   .then((data) => {
    //     setTables(data);
    //   })

    return () => abortController.abort();
  }

  function cancelHandler(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateReservationStatus(reservation_id, CANCELLED)
        .then(loadDashboard)
        .catch(setReservationsError);
    }
  }

  // function seatHandler(reservation_id) {
  //   updateReservationStatus(reservation_id, SEATED)
  //     .then(loadDashboard)
  //     .catch(setReservationsError);
  // }

  const reservationsTableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.status}</td>
      <td>
        <button type="button" className="btn btn-secondary mr-1 mb-2">
          <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
        </button>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-secondary mr-1 mb-2"
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={() => cancelHandler(reservation.reservation_id)}
        >
          Cancel
        </button>
      </td>
      <td>
        {reservation.status === "booked" && (
          <button
            type="button"
            className="btn btn-secondary mr-1 mb-2"
            // onClick={() => seatHandler(reservation.reservation_id)}
          >
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              Seat
            </a>
          </button>
        )}
      </td>
    </tr>
  ));

  const tablesTableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>{table.status}</td>
    </tr>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-secondary mr-2 mb-2"
          onClick={() => setDate(next(date))}
        >
          Next
        </button>
        <button
          type="button"
          className="btn btn-secondary mr-2 mb-2"
          onClick={() => setDate(previous(date))}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary mr-2 mb-2"
          onClick={() => setDate(today())}
        >
          Today
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
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
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{tablesTableRows}</tbody>
      </table>
    </main>
  );
}

export default Dashboard;

// /**
//  * Defines the dashboard page.
//  * @param date
//  *  the date for which the user wants to view reservations.
//  * @returns {JSX.Element}
//  */
// function Dashboard({ date }) {
//   const [dateQuery, setDateQuery] = useState(date)
//   console.log("date", date)

//   const [reservations, setReservations] = useState([]);
//   const [reservationsError, setReservationsError] = useState(null);

//   useEffect(loadDashboard, [date]);

//   function loadDashboard() {
//     const abortController = new AbortController();
//     setReservationsError(null);
//     listReservations({ date }, abortController.signal)
//       .then(setReservations)
//       .catch(setReservationsError);
//     return () => abortController.abort();
//   }

//   const tableRows = reservations.map((reservation) => (
//     <tr key={reservation.reservation_id}>
//       <th scope="row">{reservation.reservation_id}</th>
//       <td>{reservation.first_name}</td>
//       <td>{reservation.last_name}</td>
//       <td>{reservation.mobile_number}</td>
//       <td>{reservation.reservation_date}</td>
//       <td>{reservation.reservation_time}</td>
//       <td>{reservation.people}</td>
//     </tr>
//   ));

//   return (
//     <main>
//       <h1>Dashboard</h1>
//       <div className="d-md-flex mb-3">
//         <h4 className="mb-0">{`Reservations for ${date}`}</h4>
//       </div>
//       <div>
//         <button
//           type="button"
//           className="btn btn-secondary mr-2 mb-2"
//           onClick={next}
//         >
//           Next
//         </button>
//         <button
//           type="button"
//           className="btn btn-secondary mr-2 mb-2"
//           onClick={previous}
//         >
//           Previous
//         </button>
//         <button
//           type="button"
//           className="btn btn-secondary mr-2 mb-2"
//           onClick={today}
//         >
//           Today
//         </button>
//       </div>
//       <ErrorAlert error={reservationsError} />
//       <table className="table">
//         <thead>
//           <tr>
//             <th scope="col">#</th>
//             <th scope="col">First Name</th>
//             <th scope="col">Last Name</th>
//             <th scope="col">Mobile Number</th>
//             <th scope="col">Reservation Date</th>
//             <th scope="col">Reservation Time</th>
//             <th scope="col">People</th>
//           </tr>
//         </thead>
//         <tbody>{tableRows}</tbody>
//       </table>
//     </main>
//   );
// }

// export default Dashboard;
