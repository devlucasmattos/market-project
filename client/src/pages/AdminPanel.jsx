import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && (!auth.isAuthenticated || auth.role !== 'admin')) {
      navigate('/login');
    }

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          logout();
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Erro ao carregar produtos');
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [auth, navigate, logout]);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Erro ao excluir produto');
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  if (auth.isLoading) return <div className="container p-4">Carregando...</div>;
  if (!auth.isAuthenticated || auth.role !== 'admin') return null;

  if (loading) return <div className="container p-4">Carregando produtos...</div>;

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <Link
          to="/edit-product/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar Produto
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Preço</th>
              <th className="py-3 px-4 text-left">Categoria</th>
              <th className="py-3 px-4 text-left">Estoque</th>
              <th className="py-3 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">
                  {product.promotion ? (
                    <span className="flex flex-col">
                      <span className="text-red-500 font-semibold">R${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">R${product.originalPrice?.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span>R${product.price.toFixed(2)}</span>
                  )}
                </td>
                <td className="py-3 px-4 capitalize">{product.category}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;