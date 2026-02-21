import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Onboarding from './components/Onboarding/Onboarding';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileMenu from './components/Layout/MobileMenu';
import Dashboard from './components/Dashboard/Dashboard';
import Simulation from './components/Simulation/Simulation';
import Evaluation from './components/Evaluation/Evaluation';
import Community from './components/Community/Community';
import Events from './components/Events/Events';
import Profile from './components/Profile/Profile';
import CasesCollection from './components/CasesCollection/CasesCollection';
import * as authService from './services/authService';

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [openCasesHookHelpOnLoad, setOpenCasesHookHelpOnLoad] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    department: string
  ): Promise<boolean> => {
    const newUser = await authService.register({
      name,
      email,
      password,
      department,
      role: 'learner',
    });

    if (newUser) {
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        setAuthView('login');
        return true;
      }
    }
    return false;
  };

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return (
        <Signup
          onSignup={handleSignup}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLogin={login}
        onNavigateToSignup={() => setAuthView('signup')}
      />
    );
  }

  const handleOnboardingComplete = (nextTab: string = 'evaluation') => {
    setShowOnboarding(false);
    setActiveTab(nextTab);
    setOpenCasesHookHelpOnLoad(nextTab === 'cases');
  };

  const handleLogout = () => {
    logout();
    setShowOnboarding(true);
    setActiveTab('dashboard');
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const getTabTitle = (tab: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      simulation: 'Simulation',
      evaluation: 'Evaluation',
      events: 'Events',
      community: 'Community',
      cases: 'Cases',
    };
    return titles[tab] || 'App';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToSimulation={() => setActiveTab('simulation')} />;
      case 'simulation':
        return <Simulation />;
      case 'evaluation':
        return <Evaluation />;
      case 'events':
        return <Events />;
      case 'community':
        return <Community />;
      case 'cases':
        return (
          <CasesCollection
            initialShowHookHelp={openCasesHookHelpOnLoad}
            onInitialHookHelpHandled={() => setOpenCasesHookHelpOnLoad(false)}
          />
        );
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigateToSimulation={() => setActiveTab('simulation')} />;
    }
  };

  return (
    <div className="min-h-screen bg-light-gray overflow-x-hidden">
      <Header
        title={getTabTitle(activeTab)}
        onMenuToggle={() => {}}
        onProfileClick={() => setActiveTab('profile')}
        onLogout={handleLogout}
        user={user}
      />

      <MobileMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 w-full p-4 sm:p-6 pb-24 lg:pb-6 max-w-7xl mx-auto overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
