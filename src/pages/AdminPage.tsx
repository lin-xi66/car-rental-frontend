import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Loader2,
  X,
  RefreshCw,
  Store,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

// ============ Types ============
interface Stats {
  total_orders: number;
  pending_orders: number;
  active_orders: number;
  completed_orders: number;
  total_revenue: number;
  total_cars: number;
  available_cars: number;
  total_users: number;
}

interface DashboardStats {
  stats: Stats;
  recentOrders: any[];
  monthlyRevenue: { month: string; orders: number; revenue: number }[];
  statusDistribution: { status: string; count: number }[];
}

interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  price_per_day: number;
  deposit: number;
  status: string;
  images: string[];
}

interface Order {
  id: string;
  car_id: string;
  car_name: string;
  car_brand: string;
  car_images: string[];
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  pickup_store_id: string;
  pickup_store_name: string;
  return_store_id: string;
  return_store_name: string;
  pickup_date: string;
  return_date: string;
  total_amount: number;
  deposit_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

// ============ Dashboard Component ============
const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getOrderStats();
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-10 text-gray-500">加载失败</div>;
  }

  const { stats, recentOrders, monthlyRevenue, statusDistribution } = data;

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: '已确认', color: 'bg-blue-100 text-blue-700' },
    active: { label: '租用中', color: 'bg-green-100 text-green-700' },
    completed: { label: '已完成', color: 'bg-gray-100 text-gray-700' },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' }
  };

  const maxRevenue = Math.max(...monthlyRevenue.map(x => x.revenue || 1), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-500 mt-1">欢迎回来，系统运行正常</p>
        </div>
        <button onClick={fetchStats} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总订单数</p>
              <p className="text-2xl font-bold">{stats.total_orders}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">待处理：{stats.pending_orders}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月营收</p>
              <p className="text-2xl font-bold">¥{stats.total_revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">可用车辆</p>
              <p className="text-2xl font-bold">{stats.available_cars}/{stats.total_cars}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">租用中：{stats.active_orders}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">注册用户</p>
              <p className="text-2xl font-bold">{stats.total_users}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">月度营收趋势</h3>
          <div className="h-48 flex items-end justify-around">
            {monthlyRevenue.slice(0, 6).reverse().map(m => (
              <div key={m.month} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                  style={{ height: `${Math.max(10, (m.revenue / maxRevenue) * 160)}px` }}
                />
                <span className="text-sm text-gray-400 mt-2">{m.month?.slice(5)}月</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">订单状态分布</h3>
          <div className="flex items-center justify-around py-4">
            {['completed', 'active', 'pending', 'cancelled'].map(status => (
              <div key={status} className="text-center">
                <div className={`w-16 h-16 rounded-full ${statusConfig[status]?.color} flex items-center justify-center`}>
                  <span className="text-lg font-bold">
                    {statusDistribution.find(s => s.status === status)?.count || 0}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{statusConfig[status]?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold">最近订单</h3>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
            查看全部 <ChevronRight className="inline w-4 h-4" />
          </Link>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentOrders.slice(0, 5).map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img src={order.car_images?.[0] || ''} alt="" className="w-10 h-6 object-cover rounded" />
                    <span className="text-sm">{order.car_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{order.user_name}</td>
                <td className="px-6 py-4 text-sm font-medium text-primary-600">¥{order.total_amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[order.status]?.color}`}>
                    {statusConfig[order.status]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============ Car Management Component ============
const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.getCars();
      setCars(res.data || []);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这辆车吗？')) return;
    try {
      await api.deleteCar(id);
      fetchCars();
    } catch (error) {
      alert('删除失败');
    }
  };

  const filteredCars = cars.filter(c =>
    c.name.includes(searchTerm) || c.brand.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索车型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={() => { setEditingCar(null); setShowModal(true); }}
          className="btn-primary flex items-center ml-4"
        >
          <Plus className="w-5 h-5 mr-2" /> 添加车辆
        </button>
      </div>

      {/* Car List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">品牌/类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日租金</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">押金</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCars.map(car => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={car.images?.[0] || 'https://placehold.co/80x50/1e293b/ffffff?text=Car'}
                      alt={car.name}
                      className="w-16 h-10 object-cover rounded-lg mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{car.name}</span>
                      <p className="text-xs text-gray-400">{car.seats}座 · {car.transmission} · {car.fuel}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.brand} / {car.type}</td>
                <td className="px-6 py-4 text-sm font-medium text-primary-600">¥{car.price_per_day}/天</td>
                <td className="px-6 py-4 text-sm text-gray-600">¥{car.deposit}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    car.status === 'available' ? 'bg-green-100 text-green-700' :
                    car.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {car.status === 'available' ? '可用' : car.status === 'rented' ? '租用中' : '维护中'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => { setEditingCar(car); setShowModal(true); }}
                      className="p-1.5 text-gray-400 hover:text-primary-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <CarModal
          car={editingCar}
          onClose={() => setShowModal(false)}
          onSave={fetchCars}
        />
      )}
    </div>
  );
};

// ============ Car Modal ============
const CarModal: React.FC<{
  car: Car | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ car, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: car?.name || '',
    brand: car?.brand || '',
    type: car?.type || '轿车',
    seats: car?.seats || 5,
    transmission: car?.transmission || '自动挡',
    fuel: car?.fuel || '汽油',
    price_per_day: car?.price_per_day || 200,
    deposit: car?.deposit || 5000,
    description: '',
    features: '',
    images: car?.images?.[0] || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        seats: parseInt(form.seats as unknown as string),
        price_per_day: parseFloat(form.price_per_day as unknown as string),
        deposit: parseFloat(form.deposit as unknown as string),
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        images: [form.images]
      };

      if (car) {
        await api.updateCar(car.id, data);
      } else {
        await api.createCar(data);
      }
      onSave();
      onClose();
    } catch (error) {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">{car ? '编辑车辆' : '添加车辆'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">车型名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品牌 *</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>轿车</option>
                <option>SUV</option>
                <option>MPV</option>
                <option>跑车</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">座位数</label>
              <input
                type="number"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">变速箱</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>自动挡</option>
                <option>手动挡</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">燃油类型</label>
              <select
                value={form.fuel}
                onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>汽油</option>
                <option>柴油</option>
                <option>纯电动</option>
                <option>混合动力</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日租金 *</label>
              <input
                type="number"
                value={form.price_per_day}
                onChange={(e) => setForm({ ...form, price_per_day: parseFloat(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">押金</label>
              <input
                type="number"
                value={form.deposit}
                onChange={(e) => setForm({ ...form, deposit: parseFloat(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
            <input
              type="text"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">配置亮点（逗号分隔）</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="倒车雷达,导航系统,真皮座椅"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ Order Management Component ============
const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.getAllOrders(params);
      setOrders(res.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      alert('状态更新失败');
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: '已确认', color: 'bg-blue-100 text-blue-700' },
    active: { label: '租用中', color: 'bg-green-100 text-green-700' },
    completed: { label: '已完成', color: 'bg-gray-100 text-gray-700' },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">全部状态</option>
          <option value="pending">待确认</option>
          <option value="confirmed">已确认</option>
          <option value="active">租用中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
        <button onClick={fetchOrders} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">租期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={order.car_images?.[0] || 'https://placehold.co/60x40/1e293b/ffffff?text=Car'}
                      alt={order.car_name}
                      className="w-12 h-8 object-cover rounded mr-2"
                    />
                    <div>
                      <p className="text-sm text-gray-900">{order.car_name}</p>
                      <p className="text-xs text-gray-400">{order.car_brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{order.user_name || '未知'}</div>
                  <div className="text-gray-400 text-xs">{order.user_phone || order.user_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{order.pickup_date}</div>
                  <div className="text-gray-400">至 {order.return_date}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-primary-600">¥{order.total_amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                    {statusConfig[order.status]?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="确认"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="取消"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'active')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="开始租用"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {(order.status === 'active') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="完成订单"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">暂无订单</div>
        )}
      </div>
    </div>
  );
};

// ============ User Management Component ============
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      const res = await api.getUsers(params);
      setUsers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索用户..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-medium">{user.name?.[0] || 'U'}</span>
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">暂无用户</div>
        )}
      </div>
    </div>
  );
};

// ============ Store Management Component ============
const StoreManagement: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '上海',
    district: '',
    phone: '',
    hours: '09:00-21:00'
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.getStores();
      setStores(res.data || []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('门店管理功能需要后端支持');
    setShowModal(false);
  };

  const openEdit = (store: any) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      district: store.district,
      phone: store.phone,
      hours: store.hours
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">门店管理</h1>
          <p className="text-gray-500 mt-1">管理租车门店信息</p>
        </div>
        <button
          onClick={() => { setEditingStore(null); setFormData({ name: '', address: '', city: '上海', district: '', phone: '', hours: '09:00-21:00' }); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          添加门店
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无门店数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map(store => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                    营业中
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(store)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Store className="w-4 h-4 mt-0.5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">{editingStore ? '编辑门店' : '添加门店'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">门店名称</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
                  <input type="text" required value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">营业时间</label>
                  <input type="text" required value={formData.hours} onChange={e => setFormData({ ...formData, hours: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">保存</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Settings Component ============
const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">系统设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">租金价格区间</p>
              <p className="text-sm text-gray-500">平台每日租金范围</p>
            </div>
            <span className="text-primary-600 font-medium">¥200 - ¥1000</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">订单超时时间</p>
              <p className="text-sm text-gray-500">订单自动取消时间</p>
            </div>
            <span className="text-primary-600 font-medium">30分钟</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">押金比例</p>
              <p className="text-sm text-gray-500">租金押金比例</p>
            </div>
            <span className="text-primary-600 font-medium">10%</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">营业时间</p>
              <p className="text-sm text-gray-500">门店营业时间</p>
            </div>
            <span className="text-primary-600 font-medium">08:00 - 22:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Main Admin Page ============
const AdminPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, logout } = useAuth();

  const navItems = [
    { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
    { path: '/admin/cars', label: '车辆管理', icon: Car },
    { path: '/admin/orders', label: '订单管理', icon: ClipboardList },
    { path: '/admin/users', label: '用户管理', icon: Users },
    { path: '/admin/stores', label: '门店管理', icon: Store },
    { path: '/admin/settings', label: '系统设置', icon: Settings }
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isLoading, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">驰行管理后台</h1>
        </div>
        <nav className="mt-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="text-sm text-gray-500">
              {user?.username || user?.name} - 管理员
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              退出
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cars" element={<CarManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/stores" element={<StoreManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
