import * as Sentry from '@sentry/react';
import { parse as cookieParse } from 'cookie';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { client } from '@/js/api/client.gen';
import { AuthProvider } from '@/js/contexts/AuthContext';
import { ThemeProvider } from '@/js/contexts/ThemeContext';
import { ToastProvider } from '@/js/hooks/use-toast';
import { Toaster } from '@/js/components/Toaster';
import router from '@/js/routes';

// Configure CSRF token interceptor
client.instance.interceptors.request.use((request) => {
  const { csrftoken } = cookieParse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers['X-CSRFTOKEN'] = csrftoken;
  }
  return request;
});

// Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
