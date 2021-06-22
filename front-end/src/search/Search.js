import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function Search() {
//   const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [mobile_number, setMobile_number] = useState("")

  const changeHandler = ({ target: { name, value } }) => {
    setMobile_number(value)
  };

    // useEffect(loadDashboard, [phoneNumber]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    loadDashboard();
  };

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.status}</td>
    </tr>
  ));

  return (
    <main>
      <h1 className="mb-3">Find a reservation</h1>
      <ErrorAlert error={reservationsError} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Phone Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="string"
              value={mobile_number}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter a customer's phone number
            </small>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
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
        <tbody>{tableRows}</tbody>
      </table>
    </main>
  );
}

export default Search;

// import React, { useEffect, useState } from "react";
// import ErrorAlert from "../layout/ErrorAlert";

// function Search() {
//   const [error, setError] = useState(null);

//   return (
//     <main>
//       <h1 className="mb-3">Find a reservation</h1>
//       <ErrorAlert error={error} />
//       <div className="row mb-3">
//         <div className="col-6 form-group">
//           <label className="form-label" htmlFor="mobile_number">
//             Phone Number
//           </label>
//           <input
//             className="form-control"
//             id="mobile_number"
//             name="mobile_number"
//             type="string"
//             //   value={reservation.phone_number}
//             //   onChange={changeHandler}
//             required={true}
//           />
//           <small className="form-text text-muted">
//             Enter a customer's phone number
//           </small>
//         </div>
//       </div>
//       <button type="submit" className="btn btn-primary">
//         Find
//       </button>
//     </main>
//   );
// }

// export default Search;
