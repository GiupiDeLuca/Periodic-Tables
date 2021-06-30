import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { makeReservation } from "../utils/api";

function ReservationCreate({ setDate }) {
  const history = useHistory();

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    status: "booked",
  });

  const [error, setError] = useState(null);

  function cancelHandler() {
    history.push("/");
  }

  function submitHandler(event) {
    event.preventDefault();
    console.log("reservation", reservation);
    makeReservation(reservation)
      .then(() => {
        setDate(reservation.reservation_date);
        history.push("/");
      })
      .catch(setError);
  }

  function changeHandler({ target: { name, value } }) {
    if (name === "mobile_number") {
      // console.log("value1", value)
      // // value = new AsYouType('US').input(value)
      // // phoneNumber.formatInternational() === "+1 213 373 4253";
      // // phoneNumber.formatNational() === "(213) 373-4253";
      // console.log("value2", value)
    }
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: name === "people" ? +value : value,
    }));
  }

  return (
    <main>
      <h1 className="mb-3 ml-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
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
        {/* <div className="col-6">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <input
              className="form-control"
              id="status"
              name="status"
              type="string"
              value={reservation.status}
              onChange={changeHandler}
              required={true}
            />
          </div> */}
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2 mt-2 ml-3 btn-sm"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ backgroundColor: "#211A1E" }}
            className="btn btn-primary mt-2 btn-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationCreate;
