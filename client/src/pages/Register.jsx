import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // URL completa para o endpoint de registro
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('Registro realizado com sucesso! Faça login.');
        navigate('/login');
      }
    } catch (error) {
      // Tratamento mais detalhado dos erros
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Dados inválidos');
        } else if (error.response.status === 409) {
          setError('Este email já está cadastrado');
        } else {
          setError('Erro no servidor. Tente novamente mais tarde.');
        }
      } else {
        setError('Não foi possível conectar ao servidor');
      }
      console.error('Erro no registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar Admin</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Senha (mínimo 6 caracteres):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength="6"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;