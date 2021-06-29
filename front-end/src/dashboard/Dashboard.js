import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { CANCELLED, FINISHED, SEATED } from "../utils/constants";
import { listTables } from "../utils/api";
import { finishTable } from "../utils/api";
import { deleteReservation } from "../utils/api";
import ReservationsList from "../components/ReservationsList";

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

  function finishTableHandler(table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishTable(table_id).then(loadDashboard).catch(setReservationsError);
    }
  }

  function reservationDone(reservation_id) {
    if (window.confirm("Are these people done? This cannot be undone.")) {
      Promise.all([
        updateReservationStatus(reservation_id, FINISHED),
        deleteReservation(reservation_id),
      ])
        .then(loadDashboard)
        .catch(setReservationsError);
    }
  }

  const tablesTableRows = tables
    .sort((a, b) =>
      a.table_name > b.table_name ? 1 : b.table_name > a.table_name ? -1 : 0
    )
    .map((table) => (
      <tr key={table.table_id}>
        <td scope="row">{table.table_id}</td>
        <td className="labelTableName">{table.table_name}</td>
        <td className="labelTableCapacity">{table.capacity}</td>
        <td className="labelTableStatus" data-table-id-status={table.table_id}>
          {table.status}
        </td>
        <td>
          {table.status === "occupied" && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
              data-table-id-finish={table.table_id}
              onClick={() => finishTableHandler(table.table_id)}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h3
          className="mb-0"
          style={{ paddingTop: "24px" }}
        >{`Reservations for ${date}`}</h3>
      </div>
      <div>
        <button
          type="button"
          style={{ backgroundColor: "#211A1E" }}
          className="btn btn-secondary mr-2 mb-2 btn-sm"
          onClick={() => setDate(previous(date))}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#211A1E" }}
          type="button"
          className="btn btn-secondary mr-2 mb-2 btn-sm"
          onClick={() => setDate(today())}
        >
          Today
        </button>
        <button
          style={{ backgroundColor: "#211A1E" }}
          type="button"
          className="btn btn-secondary mr-2 mb-2 btn-sm"
          onClick={() => setDate(next(date))}
        >
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0 && (
        <ReservationsList
          reservations={reservations}
          reservationDone={reservationDone}
          cancelHandler={cancelHandler}
          buttons
        />
      )}
      <h3 style={{ paddingTop: "40px" }}>Floor Plan</h3>

      <table className="table table-light table-hover tableStyle">
        <thead style={{ backgroundColor: "#DBF1FB", color: "#211A1E" }}>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{tablesTableRows}</tbody>
      </table>
    </main>
  );
}

export default Dashboard;
