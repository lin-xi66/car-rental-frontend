import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, Car, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, adminLogin } = useAuth();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    loginAccount: '',
    password: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateUser = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!formData.loginAccount) {
      newErrors.loginAccount = '请输入手机号或邮箱';
    } else if (!emailRegex.test(formData.loginAccount) && !phoneRegex.test(formData.loginAccount)) {
      newErrors.loginAccount = '请输入正确的手机号或邮箱';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdmin = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdminMode) {
      if (!validateAdmin()) return;
      setIsLoading(true);
      const success = await adminLogin(formData.username, formData.password);
      setIsLoading(false);
      if (success) {
        navigate('/admin');
      } else {
        setErrors({ general: '用户名或密码错误' });
      }
    } else {
      if (!validateUser()) return;
      setIsLoading(true);
      const success = await login(formData.loginAccount, formData.password);
      setIsLoading(false);
      if (success) {
        navigate('/');
      } else {
        setErrors({ general: '账号或密码错误' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-200 transition-shadow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">驰行</span>
              <span className="text-2xl font-bold text-primary-600">租车</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-gray-500 mb-8">登录您的账号，开始租车之旅</p>

          {/* Login Mode Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
                setErrors({});
                setFormData({ loginAccount: '', password: '', username: '' });
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                !isAdminMode
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
              用户登录
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                setErrors({});
                setFormData({ loginAccount: '', password: '', username: '' });
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                isAdminMode
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              管理员登录
            </button>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isAdminMode ? (
              /* Admin: Username */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="请输入管理员用户名"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.username
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                    }`}
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>
            ) : (
              /* User: Phone or Email */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号 / 邮箱</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.loginAccount}
                    onChange={(e) => setFormData({ ...formData, loginAccount: e.target.value })}
                    placeholder="请输入手机号或邮箱"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.loginAccount
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                    }`}
                  />
                </div>
                {errors.loginAccount && <p className="mt-1 text-sm text-red-500">{errors.loginAccount}</p>}
              </div>
            )}

            {/* Password - Common */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember & Forgot - User mode only */}
            {!isAdminMode && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-gray-600">记住我</span>
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  忘记密码？
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : isAdminMode ? '管理员登录' : '登录'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">或者</span>
            </div>
          </div>

          {/* Register Link - User mode only */}
          {!isAdminMode && (
            <p className="text-center text-gray-600">
              还没有账号？
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold ml-1">
                立即注册
              </Link>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          登录即表示同意
          <a href="#" className="text-primary-600 hover:underline mx-1">服务条款</a>
          和
          <a href="#" className="text-primary-600 hover:underline mx-1">隐私政策</a>
        </p>
      </div>
    </div>
  );
}
