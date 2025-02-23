import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function TableCreate() {
  const history = useHistory();

  const [table, setTable] = useState({
    table_name: "",
    capacity: null,
    status: "free",
    reservation_id: null,
  });

  const [error, setError] = useState(null);

  function cancelHandler() {
    history.push("/");
  }

  function submitHandler(event) {
    event.preventDefault();
    if (table.table_name.length >= 2) {
      createTable(table)
        .then(() => {
          history.push("/");
        })
        .catch(setError);
    } else {
      setError({ message: "Table name must be at least 2 characters long" });
    }
  }

  function changeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }

  return (
    <main>
      <h1 className="mb-3">Create a new Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="string"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter the name of the table.
            </small>
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={table.capacity}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        {/* <div className="row mb-3">
          <div className="col-6">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <input
              className="form-control"
              id="status"
              name="status"
              type="string"
              value={table.status}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div> */}
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2 mt-2 btn-sm"
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

export default TableCreate;
