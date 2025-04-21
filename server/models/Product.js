const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true,
    minlength: [2, 'O nome deve ter pelo menos 2 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'A descrição não pode exceder 1000 caracteres']
  },
  image: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: 'URL da imagem inválida'
    }
  },
  category: {
    type: String,
    required: [true, 'A categoria é obrigatória'],
    enum: {
      values: ['frutas', 'verduras', 'laticinios', 'carnes', 'bebidas', 'outros'],
      message: 'Categoria inválida'
    }
  },
  stock: {
    type: Number,
    required: [true, 'O estoque é obrigatório'],
    min: [0, 'O estoque não pode ser negativo'],
    default: 0
  },
  promotion: {
    type: Boolean,
    default: false
  },
  originalPrice: {  // Adicionado para compatibilidade com frontend
    type: Number,
    min: [0, 'O preço original não pode ser negativo'],
    validate: {
      validator: function(v) {
        if (this.promotion) return v && v > this.price;
        return true;
      },
      message: 'Preço original deve ser maior que o preço atual quando em promoção'
    }
  },
  highlight: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para cálculo do desconto
productSchema.virtual('discountPercentage').get(function() {
  if (this.promotion && this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);