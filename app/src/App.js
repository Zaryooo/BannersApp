import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthContext from './store/auth-context';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';

function App() {
  const authCtx = useContext(AuthContext);

  return (
      <Layout>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route
            path="/login"
            exact
            element={
              (!authCtx.isLoggedIn && <Login />) ||
              (authCtx.isLoggedIn && <Navigate to='/' />)
            }
          />
          <Route
            path="/registration"
            exact
            element={
              (!authCtx.isLoggedIn && <Registration />) ||
              (authCtx.isLoggedIn && <Navigate to='/' />)
            }
          />
          <Route
            path="/dashboard"
            exact
            element={
              (authCtx.isLoggedIn && <Dashboard />) ||
              (!authCtx.isLoggedIn && <Navigate to='/' />)
            }
          />
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </Layout>
  );
}

export default App;
