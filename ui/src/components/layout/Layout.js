import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  const location = useLocation();
  
  React.useEffect(() => {
    // Show error message if redirected with error
    if (location.state?.error) {
      toast.error(location.state.error);
      // Clear the error from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
} 