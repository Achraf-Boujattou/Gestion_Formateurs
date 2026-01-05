import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Public/Home/Home';
import RegisterFormation from './pages/Public/Register/RegisterFormation';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ForgotPassword from './components/Login/ForgotPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminFormations from './pages/Admin/Formations/AdminFormations';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminInscriptions from './pages/Admin/Inscriptions/AdminInscriptions';
import AdminGroupes from './pages/Admin/Groupes/AdminGroupes';
import AdminEvaluations from './pages/Admin/Evaluations/AdminEvaluations';
import AdminCandidatures from './pages/Admin/Candidatures/AdminCandidatures';
import EvaluationForm from './pages/Public/Evaluation/EvaluationForm';
import JoinAsTrainer from './pages/Public/Join/JoinAsTrainer';
import FormateurDashboard from './pages/Formateur/FormateurDashboard';
import MyCourses from './pages/Formateur/MyCourses';
import MyStudents from './pages/Formateur/MyStudents';
import AssistantDashboard from './pages/Assistant/AssistantDashboard';
import Entreprises from './pages/Common/Entreprises/Entreprises';
import Planning from './pages/Common/Planning/Planning';
import './index.css';

function App() {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        name: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use sessionStorage instead of localStorage: 
        // Persists on Refresh (F5) but clears when tab/browser is closed.
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        const name = sessionStorage.getItem('name');

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
            return <Navigate to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(auth.role)) {
            return <Navigate to="/" />; // Back to public home
        }

        return children;
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register-formation/:id" element={<RegisterFormation />} />
                <Route path="/evaluation/:formationId" element={<EvaluationForm />} />
                <Route path="/join-as-trainer" element={<JoinAsTrainer />} />

                <Route
                    path="/login"
                    element={
                        !auth.isAuthenticated ?
                            <Login setAuth={setAuth} /> :
                            <Navigate to={`/${auth.role}`} replace />
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute allowedRoles={['admin']}>
                            <Routes>
                                <Route index element={<AdminDashboard />} />
                                <Route path="formations" element={<AdminFormations />} />
                                <Route path="utilisateurs" element={<AdminUsers />} />
                                <Route path="entreprises" element={<Entreprises />} />
                                <Route path="planning" element={<Planning />} />
                                <Route path="inscriptions" element={<AdminInscriptions />} />
                                <Route path="groupes" element={<AdminGroupes />} />
                                <Route path="evaluations" element={<AdminEvaluations />} />
                                <Route path="candidatures" element={<AdminCandidatures />} />
                                <Route path="parametres" element={<div>Page Paramètres (A faire)</div>} />
                            </Routes>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/formateur/*"
                    element={
                        <PrivateRoute allowedRoles={['formateur']}>
                            <Routes>
                                <Route index element={<FormateurDashboard />} />
                                <Route path="cours" element={<MyCourses />} />
                                <Route path="etudiants" element={<MyStudents />} />
                            </Routes>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/assistant/*"
                    element={
                        <PrivateRoute allowedRoles={['assistant']}>
                            <Routes>
                                <Route index element={<AssistantDashboard />} />
                                <Route path="entreprises" element={<Entreprises />} />
                                <Route path="planning" element={<Planning />} />
                                <Route path="inscriptions" element={<AdminInscriptions />} />
                                <Route path="groupes" element={<AdminGroupes />} />
                                <Route path="evaluations" element={<AdminEvaluations />} />
                            </Routes>
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
