import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Se não tiver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // Decodifica o token para verificar a role
    const { role } = jwtDecode(token);
    
    // Se a rota requer roles específicas e o usuário não tem acesso
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    // Token inválido - limpa o storage e redireciona
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default PrivateRoute;