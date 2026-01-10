import React, { useState, useEffect } from 'react';
import { Save, User, Key, Plus, Trash2, Package, Globe, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import api from '../../../services/api';

const Settings = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [storeSettings, setStoreSettings] = useState({
    siteName: 'Sanatana Parampare',
    currency: 'INR',
    shippingFee: '50',
    freeShippingThreshold: '500',
    contactEmail: 'support@sanatanaparampare.com'
  });

  const [loading, setLoading] = useState({
    profile: false,
    category: false,
    store: false
  });

  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchCategories();
    // Load store settings from localStorage or API if available
    const savedSettings = localStorage.getItem('store_settings');
    if (savedSettings) {
      setStoreSettings(JSON.parse(savedSettings));
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (adminUser.email) {
        const response = await api.get(`/auth/profile?email=${adminUser.email}`);
        setAdminProfile(prev => ({
          ...prev,
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      await api.put(`/auth/profile?email=${adminUser.email}`, {
        name: adminProfile.name,
        phone: adminProfile.phone
      });
      showStatus('success', 'Profile updated successfully!');
      // Update localStorage
      localStorage.setItem('adminUser', JSON.stringify({ ...adminUser, name: adminProfile.name }));
    } catch (error) {
      showStatus('error', 'Failed to update profile.');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (adminProfile.newPassword !== adminProfile.confirmPassword) {
      showStatus('error', 'Passwords do not match!');
      return;
    }
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      await api.post(`/auth/password?email=${adminUser.email}`, {
        currentPassword: adminProfile.currentPassword,
        newPassword: adminProfile.newPassword
      });
      showStatus('success', 'Password updated successfully!');
      setAdminProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      showStatus('error', error.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(prev => ({ ...prev, category: true }));
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
      showStatus('success', 'Category added!');
    } catch (error) {
      showStatus('error', error.response?.data || 'Failed to add category.');
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      showStatus('success', 'Category deleted!');
    } catch (error) {
      showStatus('error', 'Failed to delete category.');
    }
  };

  const handleStoreUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('store_settings', JSON.stringify(storeSettings));
    showStatus('success', 'Store settings saved!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your credentials, categories, and store configuration.</p>
      </div>

      {status.message && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right transition-all ${status.type === 'success' ? 'bg-success/10 border-success text-success' : 'bg-destructive/10 border-destructive text-destructive'
          }`}>
          <div className="flex items-center space-x-2">
            {status.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
            <span className="font-medium">{status.message}</span>
          </div>
        </div>
      )}

      {/* Admin Profile Section */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <User className="text-primary" size={24} />
            <h2 className="text-xl font-heading font-bold">Admin Profile</h2>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                placeholder="Admin Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address (Read-only)</label>
              <Input
                value={adminProfile.email}
                readOnly
                className="bg-muted opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={adminProfile.phone}
                onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                placeholder="Phone"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading.profile}>
                {loading.profile ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>

          <div className="border-t border-border pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="text-accent" size={20} />
              <h3 className="text-lg font-heading font-bold">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="password"
                placeholder="Current Password"
                value={adminProfile.currentPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="New Password"
                value={adminProfile.newPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={adminProfile.confirmPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                required
              />
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="accent" disabled={loading.profile}>
                  {loading.profile ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Category Management Section */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <Package className="text-primary" size={24} />
            <h2 className="text-xl font-heading font-bold">Product Categories</h2>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <Input
              flex={1}
              placeholder="Enter new category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="submit" disabled={loading.category}>
              <Plus size={18} className="mr-2" />
              Add
            </Button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border group hover:border-primary transition-colors">
                <span className="font-medium text-sm truncate">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-muted-foreground hover:text-destructive p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Settings Section */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <Globe className="text-primary" size={24} />
            <h2 className="text-xl font-heading font-bold">Store Configuration</h2>
          </div>
        </div>
        <form onSubmit={handleStoreUpdate} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Name</label>
              <Input
                value={storeSettings.siteName}
                onChange={(e) => setStoreSettings({ ...storeSettings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                value={storeSettings.contactEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency Symbol</label>
              <Input
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipping Fee (₹)</label>
              <Input
                type="number"
                value={storeSettings.shippingFee}
                onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">
              <Save size={18} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Settings;
