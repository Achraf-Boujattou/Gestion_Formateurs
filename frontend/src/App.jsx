import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminFormations from './pages/Admin/Formations/AdminFormations';
import FormateurDashboard from './pages/Formateur/FormateurDashboard';
import AssistantDashboard from './pages/Assistant/AssistantDashboard';
import './index.css';

function App() {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        name: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on load
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');

        if (token && role) {
            setAuth({
                isAuthenticated: true,
                role: role,
                name: name
            });
        }
        setLoading(false);
    }, []);

    const PrivateRoute = ({ children, allowedRoles }) => {
        if (loading) return <div>Chargement...</div>;

        if (!auth.isAuthenticated) {
            return <Navigate to="/" />;
        }

        if (allowedRoles && !allowedRoles.includes(auth.role)) {
            return <Navigate to="/" />; // Or unauthorized page
        }

        return children;
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        !auth.isAuthenticated ?
                            <Navigate to="/login" /> :
                            <Navigate to={`/${auth.role}`} />
                    }
                />

                <Route
                    path="/login"
                    element={
                        !auth.isAuthenticated ?
                            <Login setAuth={setAuth} /> :
                            <Navigate to={`/${auth.role}`} />
                    }
                />

                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute allowedRoles={['admin']}>
                            <Routes>
                                <Route index element={<AdminDashboard />} />
                                <Route path="formations" element={<AdminFormations />} />
                                <Route path="utilisateurs" element={<div>Page Utilisateurs (A faire)</div>} />
                                <Route path="parametres" element={<div>Page Paramètres (A faire)</div>} />
                            </Routes>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/formateur/*"
                    element={
                        <PrivateRoute allowedRoles={['formateur']}>
                            <FormateurDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/assistant/*"
                    element={
                        <PrivateRoute allowedRoles={['assistant']}>
                            <AssistantDashboard />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
