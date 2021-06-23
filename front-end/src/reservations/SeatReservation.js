import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { updateTableSeat } from "../utils/api";
import {updateReservationStatus} from "../utils/api"
import { CANCELLED, SEATED } from "../utils/constants";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, [reservation_id]); // what to put as second param? maybe reserv Id?

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then((data) => {
        setTables(data);
      })
      .catch(setTablesError);

    return () => abortController.abort();
  }

  function cancelHandler() {
    history.push("/");
  }

  function changeHandler({ target: { name, value } }) {
    console.log("value", value);
    setSelectedTable(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    updateTableSeat(selectedTable, reservation_id)
      .then(updateReservationStatus(reservation_id, SEATED))
      .then(loadTables)
      .then(() => history.push("/"))
      .catch(setTablesError);
  }

  console.log("tables!", tables);
  console.log("selectedTable", selectedTable);
  console.log("reserva_id", reservation_id)

  const tablesTableRows = tables.map((table) => (
    <option value={table.table_id} key={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));


  return (
    <main>
      <h1 className="mb-3">Seat Reservation</h1>
      <ErrorAlert error={tablesError} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_id">
              Select a table
            </label>
            <select
              className="form-control"
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              required={true}
            >
              <option>Select a table</option>
              {tablesTableRows}
            </select>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default SeatReservation;

// const TableOption = (table) => (
//   <option value={table.table_id} key={table.table_id}>
//     {table.name} - {table.capacity}
//   </option>
// );

// const DisplayTables = ({ tables, changeHandler }) => (
//   <select
//     className="form-control"
//     id="table_id"
//     name="table_id"
//     value={TableOption}
//     onChange={changeHandler}
//     required={true}
//   >
//     {tables.map((table) => (
//       <TableOption table={table} />
//     ))}
//   </select>
// );

// function SeatReservation({tables, setTables}) {
//   const history = useHistory();

//   const [selectedTable, setSelectedTable] = useState(tables[0]);
//   const [tablesError, setTablesError] = useState(null);

//   function cancelHandler() {
//     history.push("/");
//   }

//   function changeHandler({ target: { name, value } }) {
//     setSelectedTable(value);
//   }

//   //   function submitHandler(event) {

//   //   }

//   console.log("tables!", tables)
//   console.log("selcetedTable", selectedTable)

//   return (
//     <main>
//       <ErrorAlert error={tablesError}/>
//       <h1 className="mb-3">Seat Reservation</h1>
//       {/* <ErrorAlert error={error} /> */}
//       <form className="mb-4">
//         {/* <form onSubmit={submitHandler} className="mb-4"> */}
//         <div className="row mb-3">
//           <div className="col-6 form-group">
//             <label className="form-label" htmlFor="table_id">
//               Select a table
//             </label>
//             <DisplayTables tables={tables} changeHandler={changeHandler} />
//           </div>
//         </div>
//         <div>
//           <button
//             type="button"
//             className="btn btn-secondary mr-2"
//             onClick={cancelHandler}
//           >
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary">
//             Submit
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default SeatReservation;
