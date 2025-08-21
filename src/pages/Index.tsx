
import { CricketProvider, useCricket } from "../context/CricketContext";
import PublicScoreboard from "../components/PublicScoreboard";
import AdminDashboard from "../components/AdminDashboard";
import MatchSetup from "../components/MatchSetup";

const MatchView = () => {
  const { state } = useCricket();
  
  if (!state.isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">No Match Setup Found</h2>
          <p className="text-muted-foreground mb-6">Please set up a match to continue.</p>
          <a href="/setup" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 inline-block">
            Setup Match
          </a>
        </div>
      </div>
    );
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
