import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Leads from "./pages/leads";
import Employees from "./pages/employees";
import Campaigns from "./pages/campaigns";
import Sales from "./pages/sales";
import AIAssistant from "./pages/ai_assistant";
import LeadDetails from "./pages/lead_details";

import DashboardLayout from "./layouts/dashboard_layout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<DashboardLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/lead/:id" element={<LeadDetails />} />
        <Route path="/employees" element={<Employees />} />

        <Route path="/campaigns" element={<Campaigns />} />

        <Route path="/sales" element={<Sales />} />

        <Route path="/ai" element={<AIAssistant />} />

      </Route>

    </Routes>
  );
}

export default App;