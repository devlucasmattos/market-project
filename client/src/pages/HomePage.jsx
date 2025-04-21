import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const fetchedProducts = response.data;

        // Garantir persistência do destaque e promoção (assumindo que já vem do backend)
        // Ordenar: destaque primeiro, depois promoção, depois os demais
        const sortedProducts = [...fetchedProducts].sort((a, b) => {
          // Destaque tem maior prioridade que promoção
          if (a.highlight && !b.highlight) return -1;
          if (!a.highlight && b.highlight) return 1;

          // Dentro da mesma prioridade, quem tiver promoção vem primeiro
          if (a.promotion && !b.promotion) return -1;
          if (!a.promotion && b.promotion) return 1;

          return 0;
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert--error">{error}</div>
      </div>
    );
  }

  // Produtos em promoção
  const promotedProducts = products.filter(product => product.promotion);

  // Produtos não promocionais
  const regularProducts = products.filter(product => !product.promotion);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Produtos do Mercado</h1>

      {/* Seção de Promoções */}
      {promotedProducts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-primary-700">Promoções Especiais</h2>
          <div className="products-grid mb-12">
            {promotedProducts.map(product => (
              <ProductCard key={`promo-${product._id}`} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Seção de Produtos Regulares */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Nossos Produtos</h2>
      <div className="products-grid">
        {regularProducts.map(product => (
          <ProductCard key={`regular-${product._id}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
