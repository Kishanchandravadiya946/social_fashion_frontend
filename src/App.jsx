// Import necessary dependencies
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router';

// App component
const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
