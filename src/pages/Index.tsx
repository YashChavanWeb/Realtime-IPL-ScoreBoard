
import { useState } from "react";
import { CricketProvider } from "../context/CricketContext";
import PublicScoreboard from "../components/PublicScoreboard";
import AdminDashboard from "../components/AdminDashboard";

const Index = () => {
  return (
    <CricketProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        {/* Public Scoreboard */}
        <PublicScoreboard />
        
        {/* Admin Dashboard */}
        <AdminDashboard />
      </div>
    </CricketProvider>
  );
};

export default Index;
