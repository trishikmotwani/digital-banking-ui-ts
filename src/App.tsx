import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';

/**
 * Main Entry Point Component
 * RouterProvider handles the routing logic defined in AppRoutes.ts
 */
const App: React.FC = () => {
  return <RouterProvider router={router} />;
}

export default App;
