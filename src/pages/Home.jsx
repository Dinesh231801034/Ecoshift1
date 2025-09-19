import ProductCard from "../components/ProductCard";
import ecoProducts from "../data/ecoProducts"; 


const Home = ({ setCurrentPage }) => {
  // Show only first 6 products on home page
  const featuredProducts = ecoProducts.slice(0, 6);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-100 via-green-50 to-green-200 py-16 w-full">
        <div className="w-full text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-6">
            🌿 Discover Eco-Friendly
            <br />
            <span className="text-green-600">Alternatives</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Personalized sustainable products curated for your lifestyle and location.
            Make the switch to eco-friendly alternatives that are good for you and the planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🔍 Get Personalized Recommendations
            </button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌱</div>
        <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>♻️</div>
        <div className="absolute bottom-16 left-20 text-3xl animate-bounce" style={{animationDelay: '1s'}}>🌍</div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-blue-100 w-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Why Choose EcoSwitch?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Personalized</h3>
              <p className="text-gray-600">
                Get recommendations based on your location, shopping habits, and product preferences.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Verified Brands</h3>
              <p className="text-gray-600">
                All products are from trusted, certified sustainable brands across India.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-purple-800 mb-3">Local Availability</h3>
              <p className="text-gray-600">
                Find eco-friendly products available in your city with local delivery options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 w-full">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              ♻️ Featured Eco Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover some of our most popular sustainable alternatives, loved by eco-conscious consumers across India.
            </p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-green-900 text-white w-full">
        <div className="w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make the Switch?
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Join thousands of Indians who have already switched to sustainable living. 
            Get personalized recommendations in just 2 minutes.
          </p>
          
          
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-green-200">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Free recommendations</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Local availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Trusted brands</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
