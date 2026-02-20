import { useState } from 'react';

// UI imports
import './assets/fonts/fonts.css';
import theme from './theme';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import Header from './components/Header.jsx';
import ButtonBar from './components/ButtonBar.jsx';
import ServiceGrid from './components/ServiceGrid.jsx';
import ModalForm from './components/ModalForm.jsx';
import LoginPage from './components/LoginPage.jsx';

// Hooks
import { useServices } from './hooks/useServices.js';
import { useAutoRefresh } from './hooks/useAutoRefresh.js';

function App() {
  // Login page
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('token')));
  const [loginLoading, setLoginLoading] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('user'));

  const handleLogin = async () => {
    setLoginLoading(true);
    // ADD LOGIN LOGIC - CURRENTLY JUST SETS LOGIN FLAGS TO TRUE
    setLoggedIn(true);
    setUser(localStorage.getItem('user'));
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser('');
  };

  // Load services from database on mount
  // Set logic for load(), resetToDefaults(), add/deleteService()
  const {
    services,
    lastUpdated,
    loading,
    load,
    resetToDefaults,
    addService,
    deleteService,
    getLastLoadAt,
    isLoading,
  } = useServices();

  // Auto-refresh
  useAutoRefresh({ load, getLastLoadAt, isLoading });

  // Handler for "Reset to Default" button
  const onResetToDefaults = async () => {
    // Confirmation to avoid accidental resets
    const ok = window.confirm('Reset services to defaults? This will remove all your custom services.');
    if (!ok) return;

    try {
      await resetToDefaults();
    } catch (err) {
      console.error("Reset to defaults failed:", err);
      alert("Reset failed. See console for details.")
    }
  };

  // Handler for "Delete Service" button
  const onDeleteService = async (serviceName) => {
    try {
      await deleteService(serviceName);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // Modal form local states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcUrl, setNewSvcUrl] = useState('');
  const [newSvcType, setNewSvcType] = useState('');
  // Manual entry
  const [newSvcJson, setNewSvcJson] = useState('');
  const [newSvcExpected, setNewSvcExpected] = useState('');
  // SpeedQueen
  const [newSvcToken, setNewSvcToken] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newOrgId, setNewOrgId] = useState('');
  
  // Handlers for "Add Service" modal form
  const openModal = () => {
    setIsModalOpen(true);
    setFormError('');
    setNewSvcName('');
    setNewSvcUrl('');
    setNewSvcJson('');
    setNewSvcExpected('');
    setNewSvcToken('');
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitNewService = async (e) => {
    e?.preventDefault();
    setFormError('');

    const name = newSvcName.trim();
    const url = newSvcUrl.trim();

    if (!name) {
      setFormError('Please provide a service name.');
      return;
    }

    // Determine service type
    if (newSvcType === 'manual') {
      const path = newSvcJson.trim();
      const expected = typeof newSvcExpected === 'string' ? newSvcExpected.trim() : newSvcExpected;
    
      if (!url) {
        setFormError('Please provide a URL.');
        return;
      }

      const success = expected === 'true' ? true : expected === 'false' ? false : expected;

      try {
        await addService({ service: name, url, type: 'manual', data: {path, success} });
        setIsModalOpen(false);
      } catch (err) {
        setFormError(err?.response?.data?.message || 'Failed to add manual service.');
      }
    } else if (newSvcType === 'speedqueen') {
      if (!newSvcToken || !newUserId) {
        setFormError('SpeedQueen service data could not be found.');
        return;
      }

      try {
        await addService({
          service: name,
          url,
          type: 'speedqueen',
          data: {
            token: newSvcToken.trim(),
            user_id: newUserId.trim(),
            org_id: newOrgId.trim(),
          }
        });
        setIsModalOpen(false);
      } catch (err) {
        setFormError(err?.response?.data?.message || 'Failed to add SpeedQueen service.');
      }
    } else {
      setFormError('Failed to set service type.')
    }
  };


  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

          {/* Show only login page if not logged in */}
          {!loggedIn ? (
            <LoginPage onLogin={handleLogin} loading={loginLoading} />
          ) : (
            <>
              <Header onReset={onResetToDefaults} loggedIn={loggedIn} user={user} onLogout={handleLogout} />

              <Container maxWidth="md">
                <Box sx={{ mt: 3 }}>
                  <ButtonBar 
                    lastUpdated={lastUpdated} 
                    loading={loading} onReload={load}
                    onOpenModal={openModal}  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <ServiceGrid services={services} onDelete={onDeleteService} />
                </Box>

                {/* Modal popup "add service" form */}
                <ModalForm 
                  isModalOpen={isModalOpen}
                  onCloseModal={closeModal}
                  onSubmitNewService={onSubmitNewService}

                  newSvcName={newSvcName}
                  setNewSvcName={setNewSvcName}
                  newSvcUrl={newSvcUrl}
                  setNewSvcUrl={setNewSvcUrl}
                  newSvcType={newSvcType}
                  setNewSvcType={setNewSvcType}

                  newSvcJson={newSvcJson}
                  setNewSvcJson={setNewSvcJson}
                  newSvcExpected={newSvcExpected}
                  setNewSvcExpected={setNewSvcExpected}

                  newSvcToken={newSvcToken}
                  setNewSvcToken={setNewSvcToken}
                  newUserId={newUserId}
                  setNewUserId={setNewUserId}
                  newOrgId={newOrgId}
                  setNewOrgId={setNewOrgId}

                  formError={formError}
                  setFormError={setFormError}
                />
              </Container>      
            </>
          )}

      </ThemeProvider>
    </>
  );
}

export default App;
