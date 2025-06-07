
import { CricketProvider, useCricket } from "../context/CricketContext";
import PublicScoreboard from "../components/PublicScoreboard";
import AdminDashboard from "../components/AdminDashboard";
import MatchSetup from "../components/MatchSetup";

const MatchView = () => {
  const { state } = useCricket();
  
  if (!state.isSetupComplete) {
    return <MatchSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Public Scoreboard */}
      <PublicScoreboard />
      
      {/* Admin Dashboard */}
      <AdminDashboard />
    </div>
  );
};

const Index = () => {
  return (
    <CricketProvider>
      <MatchView />
    </CricketProvider>
  );
};

export default Index;
