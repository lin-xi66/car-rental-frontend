import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Camera, Star, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: ''
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.getOrders();
      const orders = res.data || [];
      const completed = orders.filter(o => o.status === 'completed');
      setStats({
        totalOrders: orders.length,
        completedOrders: completed.length,
        totalSpent: completed.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await api.updateProfile(profile);
      setIsEditing(false);
      alert('个人信息更新成功');
    } catch (error) {
      alert('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) {
      alert('两次密码输入不一致');
      return;
    }
    if (password.new.length < 6) {
      alert('密码长度至少6位');
      return;
    }
    setLoading(true);
    try {
      await api.updateProfile({ password: password.new });
      setPassword({ current: '', new: '', confirm: '' });
      alert('密码修改成功');
    } catch (error) {
      alert('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || '用户'}</h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  个人资料
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'password' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  修改密码
                </button>
                <Link
                  to="/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  我的订单
                </Link>
              </nav>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">账户统计</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">总订单</span>
                  <span className="font-bold text-primary-600">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">已完成</span>
                  <span className="font-bold text-green-600">{stats.completedOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">累计消费</span>
                  <span className="font-bold text-orange-600">¥{stats.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">个人资料</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      编辑
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.name || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.email || '-'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{profile.phone || '-'}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? '保存中...' : '保存'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setProfile({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            avatar: ''
                          });
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">修改密码</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                    <input
                      type="password"
                      value={password.current}
                      onChange={e => setPassword({ ...password, current: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                    <input
                      type="password"
                      value={password.new}
                      onChange={e => setPassword({ ...password, new: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                    <p className="text-xs text-gray-400 mt-1">密码长度至少6位</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={e => setPassword({ ...password, confirm: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? '修改中...' : '修改密码'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
