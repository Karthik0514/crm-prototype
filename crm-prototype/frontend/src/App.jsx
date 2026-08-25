import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Leads from "./pages/leads";
import Employees from "./pages/employees";
import Campaigns from "./pages/campaigns";
import Sales from "./pages/sales";
import AIAssistant from "./pages/ai_assistant";
import LeadDetails from "./pages/lead_details";
import Profile from "./pages/profile";

import DashboardLayout from "./layouts/dashboard_layout";
import ProtectedRoute from "./components/protected_route";


function App() {

  return (

    <Routes>


      {/* ========================================= */}
      {/* LOGIN */}
      {/* ========================================= */}

      <Route
        path="/"
        element={<Login />}
      />


      {/* ========================================= */}
      {/* PROTECTED CRM ROUTES */}
      {/* ========================================= */}

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


        <Route
          path="/profile"
          element={<Profile />}
        />


      </Route>


    </Routes>

  );

}

export default App;