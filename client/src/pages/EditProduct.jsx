import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [product, setProduct] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'frutas',
    stock: 0,
    promotion: false,
    originalPrice: 0,
    highlight: false
  });

  const [isNew] = useState(id === 'new');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            logout();
            navigate('/login');
            return;
          }

          const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setProduct({
            ...response.data,
            originalPrice: response.data.originalPrice || response.data.price
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          setError(error.response?.data?.message || error.message);
          if (error.response?.status === 401) {
            logout();
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew, navigate, logout]);

  const validateForm = () => {
    const errors = {};

    if (!product.name.trim()) errors.name = 'Nome é obrigatório';
    if (product.price <= 0) errors.price = 'Preço deve ser maior que zero';
    if (product.stock < 0) errors.stock = 'Estoque não pode ser negativo';
    if (product.promotion && product.originalPrice <= product.price) {
      errors.originalPrice = 'Preço original deve ser maior que o preço promocional';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              ['price', 'stock', 'originalPrice'].includes(name) ? parseFloat(value) || 0 :
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        navigate('/login');
        return;
      }

      const productData = {
        ...product,
        originalPrice: product.promotion ? product.originalPrice : undefined
      };

      if (isNew) {
        await axios.post('http://localhost:5000/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (auth.isLoading) return <div className="text-center py-8">Carregando...</div>;
  if (!auth.isAuthenticated || auth.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isNew ? 'Adicionar Novo Produto' : 'Editar Produto'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Nome do Produto*</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded"
              value={product.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          {/* Preço */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="price">Preço (R$)*</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border rounded"
              value={product.price}
              onChange={handleChange}
              required
            />
            {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              className="w-full px-3 py-2 border rounded"
              value={product.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Imagem */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="image">URL da Imagem</label>
            <input
              type="text"
              id="image"
              name="image"
              className="w-full px-3 py-2 border rounded"
              value={product.image}
              onChange={handleChange}
            />
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category">Categoria</label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border rounded"
              value={product.category}
              onChange={handleChange}
            >
              <option value="frutas">Frutas</option>
              <option value="legumes">Legumes</option>
              <option value="verduras">Verduras</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Estoque */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="stock">Estoque</label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              className="w-full px-3 py-2 border rounded"
              value={product.stock}
              onChange={handleChange}
            />
            {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
          </div>

          {/* Destaque */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="highlight"
              name="highlight"
              className="mr-2"
              checked={product.highlight}
              onChange={handleChange}
            />
            <label htmlFor="highlight" className="text-gray-700">Produto em destaque</label>
          </div>

          {/* Promoção */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="promotion"
              name="promotion"
              className="mr-2"
              checked={product.promotion}
              onChange={handleChange}
            />
            <label htmlFor="promotion" className="text-gray-700">Produto em promoção</label>
          </div>

          {/* Preço Original */}
          {product.promotion && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="originalPrice">
                Preço Original (R$)*
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                step="0.01"
                min={product.price + 0.01}
                className="w-full px-3 py-2 border rounded"
                value={product.originalPrice}
                onChange={handleChange}
                required={product.promotion}
              />
              {formErrors.originalPrice && <p className="text-red-500 text-sm mt-1">{formErrors.originalPrice}</p>}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
