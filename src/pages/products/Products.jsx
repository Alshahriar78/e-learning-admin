import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, Box, DollarSign, Package, MoreVertical } from 'lucide-react';
import { productApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    fileUrl: ''
  });
  const [adding, setAdding] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await productApi.create(newProduct); // POST request
      setProducts(prev => [...prev, res.data]); // Add new product to list
      setShowModal(false);
      setNewProduct({ name: '', description: '', price: '', fileUrl: '' });
    } catch (err) {
      console.error('Failed to add product', err);
      alert('Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh] text-gray-500">Loading products...</div>;

  return (
    <div className="space-y-6 px-3 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage your inventory and sales performance</p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600 text-white border-none">
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold">{products.length} Items</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <h3 className="text-2xl font-bold">{products.reduce((acc, p) => acc + (p.sales || 0), 0)}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Box size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low Stock</p>
              <h3 className="text-2xl font-bold">{products.filter(p => p.stock && p.stock < 20).length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Download</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.description}</td>
                  <td className="px-4 py-3 font-semibold">৳ {product.price}</td>
                  <td className="px-4 py-3">
                    <a
                      href={product.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Download
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.fileUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, fileUrl: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
