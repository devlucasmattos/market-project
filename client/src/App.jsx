import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import EditProduct from './pages/EditProduct';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            } />
            
            <Route path="/edit-product/:id" element={
              <PrivateRoute allowedRoles={['admin']}>
                <EditProduct />
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />

            <Route path="*" element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">404 - Página não encontrada</h1>
                <p>A página que você está procurando não existe.</p>
              </div>
            } />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;