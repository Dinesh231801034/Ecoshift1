import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
    {/* Image */}
    <div className="relative">
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-5xl">🌿</div>
        )}
      </div>
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 border border-green-200">
        Eco Friendly
      </div>
      <div className="absolute top-3 right-3 bg-green-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
        ⭐ {product.rating}
      </div>
    </div>

    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{product.brand}</p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xl font-bold text-green-700">{product.price}</span>
        <span className="text-xs text-gray-400">{product.category}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {product.tags.slice(0, 3).map((tag, i) => (
          <span 
            key={i} 
            className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
        {product.tags.length > 3 && (
          <span className="text-xs text-gray-400 py-1">
            +{product.tags.length - 3} more
          </span>
        )}
      </div>
      
      {product.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {product.description}
        </p>
      )}
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={openModal}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          View Details
        </button>
        <button className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200">
          💚
        </button>
      </div>
    </div>

    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
        <div
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-100 to-blue-100 border-b border-green-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Product Image */}
            <div className="mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-lg text-gray-600">{product.brand}</p>
              </div>

              {/* Rating as Sustainability Score */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-green-700">Sustainability Score:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">🌿</span>
                  <span className="text-xl font-bold text-green-600">{product.rating}/5</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">Price:</span>
                <span className="text-2xl font-bold text-green-600">{product.price}</span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description:</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Alternatives */}
              {product.alternatives && product.alternatives.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Replaces:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      {product.alternatives.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>🛒</span>
                <span>Buy Now - {product.price}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ProductCard;
