import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Leads from "./pages/leads";
import Employees from "./pages/employees";
import Campaigns from "./pages/campaigns";
import Sales from "./pages/sales";
import AIAssistant from "./pages/ai_assistant";
import LeadDetails from "./pages/lead_details";

import DashboardLayout from "./layouts/dashboard_layout";


// ==================================================
// PROTECTED ROUTE
// ==================================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {

    return <Navigate to="/" replace />;

  }

  return children;

}


// ==================================================
// APP
// ==================================================

function App() {

  return (

    <Routes>


      {/* LOGIN */}

      <Route
        path="/"
        element={<Login />}
      />


      {/* PROTECTED DASHBOARD ROUTES */}

      <Route
        element={

          <ProtectedRoute>

            <DashboardLayout />

          </ProtectedRoute>

        }
      >


        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        <Route
          path="/leads"
          element={<Leads />}
        />


        <Route
          path="/lead/:id"
          element={<LeadDetails />}
        />


        <Route
          path="/employees"
          element={<Employees />}
        />


        <Route
          path="/campaigns"
          element={<Campaigns />}
        />


        <Route
          path="/sales"
          element={<Sales />}
        />


        <Route
          path="/ai"
          element={<AIAssistant />}
        />


      </Route>


      {/* UNKNOWN ROUTES */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />


    </Routes>

  );

}

export default App;