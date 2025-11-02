import { createBrowserRouter } from 'react-router';

import { AuthProvider } from '@/js/contexts/AuthContext';
import { Layout } from '@/js/components/Layout';
import { ErrorBoundary } from '@/js/components/ErrorBoundary';
import Dashboard from '@/js/pages/Dashboard';
import Home from '@/js/pages/Home';
import Login from '@/js/pages/Login';
import Signup from '@/js/pages/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { 
        index: true, 
        Component: Home,
        errorElement: <ErrorBoundary />,
      },
      { 
        path: 'dashboard', 
        Component: Dashboard,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  { 
    path: '/login', 
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
  },
  { 
    path: '/signup', 
    element: (
      <AuthProvider>
        <Signup />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

export default router;
