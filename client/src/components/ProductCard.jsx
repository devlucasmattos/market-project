import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const ProductCard = ({ product }) => {
  const { auth } = useAuth();
  const isAdmin = auth.role === 'admin';

  return (
    <div
      className={`card 
        ${isAdmin ? 'admin-logged' : ''} 
        ${product.promotion ? 'promotion-card' : ''} 
        ${product.highlight ? 'highlight-card' : ''}`
      }
    >
      {/* Promotion Ribbon */}
      {product.promotion && (
        <div className="promotion-ribbon">
          <span>Promoção</span>
        </div>
      )}

      {/* Highlight Badge */}
      {product.highlight && (
        <div className="highlight-badge">
          <span>Destaque</span>
        </div>
      )}

      <div className="card-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300?text=Produto'}
          alt={product.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=Produto';
          }}
        />
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>

        {product.description && (
          <p className="card-text" title={product.description}>
            {product.description}
          </p>
        )}

        <div className="card-footer">
          <div className="price-container">
            <div>
              {product.promotion && product.originalPrice && (
                <span className="original-price">
                  R${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={`current-price ${product.promotion ? 'text-danger-500' : 'text-primary-600'}`}>
                R${product.price.toFixed(2)}
              </span>
            </div>

            <span className={`card-badge ${
              product.stock > 0 ? 'badge-in-stock' : 'badge-out-of-stock'
            }`}>
              {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
            </span>
          </div>

          {isAdmin && (
            <Link
              to={`/edit-product/${product._id}`}
              className="btn btn--primary mt-2"
              aria-label={`Editar ${product.name}`}
            >
              Editar produto
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
