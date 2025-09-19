import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Star, MapPin, CreditCard, 
  Package, Truck, CheckCircle, LogOut, Bell, Search,
  Filter, Plus, Minus, Eye, Edit, Trash2, Settings
} from 'lucide-react';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'customer') {
      window.location.href = '/';
      return;
    }

    setUser(parsedUser);
    setIsLoading(false);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Load orders
      const ordersResponse = await fetch('http://localhost:8000/api/customers/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.results || ordersData);

      // Load wishlist
      const wishlistResponse = await fetch('http://localhost:8000/api/customers/wishlist/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const wishlistData = await wishlistResponse.json();
      setWishlist(wishlistData.results || wishlistData);

      // Load recommendations
      const recommendationsResponse = await fetch('http://localhost:8000/api/customers/recommendations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const recommendationsData = await recommendationsResponse.json();
      setRecommendations(recommendationsData.results || recommendationsData);

      // Load addresses
      const addressesResponse = await fetch('http://localhost:8000/api/customers/addresses/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const addressesData = await addressesResponse.json();
      setAddresses(addressesData.results || addressesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Package },
    { id: 'orders', name: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'recommendations', name: 'Recommendations', icon: Star },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🌿</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EcoSwitch Customer Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.first_name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <DashboardTab orders={orders} wishlist={wishlist} recommendations={recommendations} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} onRefresh={loadDashboardData} />}
            {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
            {activeTab === 'addresses' && <AddressesTab addresses={addresses} onRefresh={loadDashboardData} />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ orders, wishlist, recommendations }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingBag className="text-blue-600" size={24} />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-2">Keep shopping sustainably!</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
            <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <Heart className="text-red-600" size={24} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Save for later</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Recommendations</p>
            <p className="text-3xl font-bold text-gray-900">{recommendations.length}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Star className="text-yellow-600" size={24} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Personalized for you</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Eco Impact</p>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <div className="text-2xl">🌱</div>
          </div>
        </div>
        <p className="text-sm text-green-600 mt-2">Products saved from landfill</p>
      </div>
    </div>

    {/* Recent Orders */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
      </div>
      <div className="p-6">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        )}
      </div>
    </div>

    {/* Recommendations */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
      </div>
      <div className="p-6">
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="text-gray-400" size={32} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{rec.product_name}</h4>
                <p className="text-sm text-gray-600 mb-2">₹{rec.product_price}</p>
                <p className="text-xs text-green-600">Confidence: {Math.round(rec.confidence_score * 100)}%</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recommendations yet</p>
        )}
      </div>
    </div>
  </div>
);

// Orders Tab Component
const OrdersTab = ({ orders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
    
    {orders.length > 0 ? (
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">₹{order.total_amount}</p>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Items ({order.items?.length || 0})</h4>
              <div className="space-y-2">
                {order.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="text-gray-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">₹{item.total_price}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                View Details
              </button>
              {order.order_status === 'delivered' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No orders yet</h3>
        <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Wishlist Tab Component
const WishlistTab = ({ wishlist, onRefresh }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
    
    {wishlist.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="text-gray-400" size={48} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.product_name}</h3>
              <p className="text-lg font-bold text-green-600 mb-3">₹{item.product_price}</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">
                  Add to Cart
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Heart className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">Your wishlist is empty</h3>
        <p className="text-gray-500 mt-2">Save items you love for later</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Recommendations Tab Component
const RecommendationsTab = ({ recommendations }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
    
    {recommendations.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="text-gray-400" size={48} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{rec.product_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{rec.recommendation_reason}</p>
              <p className="text-lg font-bold text-green-600 mb-3">₹{rec.product_price}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  Confidence: {Math.round(rec.confidence_score * 100)}%
                </span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(rec.confidence_score * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">
                  Add to Cart
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Star className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No recommendations yet</h3>
        <p className="text-gray-500 mt-2">Start shopping to get personalized recommendations</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Addresses Tab Component
const AddressesTab = ({ addresses, onRefresh }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
        <Plus size={20} />
        <span>Add Address</span>
      </button>
    </div>
    
    {addresses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                <p className="text-sm text-gray-600">{address.address_type}</p>
              </div>
              {address.is_default && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Default
                </span>
              )}
            </div>
            
            <div className="text-gray-600 mb-4">
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
              <p className="mt-2">Phone: {address.phone_number}</p>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <MapPin className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No addresses saved</h3>
        <p className="text-gray-500 mt-2">Add an address for faster checkout</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Add Address
        </button>
      </div>
    )}
  </div>
);

// Settings Tab Component
const SettingsTab = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              defaultValue={user?.first_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              defaultValue={user?.last_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default CustomerPortal;












