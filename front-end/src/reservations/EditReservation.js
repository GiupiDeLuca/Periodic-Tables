import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { updateReservation } from "../utils/api";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservationsError, setReservationsError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  });

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation({ reservation_id }, abortController.signal)
      .then((reservationData) => {
        return setReservation(reservationData);
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // useEffect(() => {
  //   const abortController = new AbortController();

  //   fetch(`http://localhost:5000/reservations/${reservation_id}`, {
  //     signal: abortController.signal,
  //   })
  //     .then((response) => response.json())
  //     .then((payload) => {
  //       if (payload.data && payload.data.length > 0) {
  //         let payloadReservation = payload.data[0];
  //         setReservation(
  //           formatReservationTime(formatReservationDate(payloadReservation))
  //         );
  //       }
  //     });
  //   return () => {
  //     abortController.abort();
  //   };
  // }, [reservation_id]);

  function changeHandler({ target: { name, value } }) {
    setReservation({
      ...reservation,
      [name]: name === "people" ? Number(value) : value,
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    updateReservation(reservation).then(() => setReservation(reservation))
    history.push("/");
  }

  function cancelHandler() {
    history.push("/");
  }

  return (
    <main>
      <h1 className="ml-3">Edit reservation</h1>
      <ErrorAlert error={reservationsError} />
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="string"
              value={reservation.first_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter your first name.
            </small>
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="string"
              value={reservation.last_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter your last name.
            </small>
          </div>
        </div>
        <div className="mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Phone Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="string"
              value={reservation.mobile_number}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">Enter mobile number.</small>
          </div>
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="reservation_date">
              Reservation Date
            </label>
            <input
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              type="date"
              value={reservation.reservation_date}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="reservation_time">
              Reservation Time
            </label>
            <input
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              type="time"
              value={reservation.reservation_time}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="people">
              Size of the party
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              min="1"
              value={reservation.people}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2 ml-3 btn-sm"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ backgroundColor: "#211A1E" }}
            className="btn btn-primary btn-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditReservation;
