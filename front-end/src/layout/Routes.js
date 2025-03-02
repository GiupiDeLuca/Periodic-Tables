import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationCreate from "../reservations/ReservationCreate";
import Search from "../search/Search";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../reservations/SeatReservation"
import TableCreate from "../tables/TableCreate"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());
  const [tables, setTables] = useState([])

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate setDate={setDate} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} tables={tables} setTables={setTables} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation tables={tables} setTables={setTables} />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

// function Routes() {
//   return (
//     <Switch>
//       <Route exact={true} path="/">
//         <Redirect to={"/dashboard"} />
//       </Route>
//       <Route exact={true} path="/reservations">
//         <Redirect to={"/dashboard"} />
//       </Route>
//       <Route path="/dashboard">
//         <Dashboard date={today()} />
//       </Route>
//       <Route>
//         <NotFound />
//       </Route>
//     </Switch>
//   );
// }

// export default Routes;
