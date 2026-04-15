import { useState, useEffect } from 'react';
import { Gift, Tag, Clock, CheckCircle, Ticket, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'fixed' | 'percentage';
  value: number;
  min_amount: number;
  max_discount: number | null;
  total_count: number;
  claimed_count: number;
  valid_from: string;
  valid_until: string;
}

interface UserCoupon {
  id: string;
  coupon_id: string;
  status: string;
  code: string;
  name: string;
  type: string;
  value: number;
  valid_until: string;
}

const CouponsPage = () => {
  const { isAuthenticated } = useAuth();
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCoupons();
    }
  }, [isAuthenticated]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getCoupons();
      setAvailableCoupons(res.data?.coupons || []);
      setMyCoupons(res.data?.userCoupons || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (couponId: string) => {
    setClaiming(couponId);
    try {
      await api.claimCoupon(couponId);
      alert('领取成功!');
      fetchCoupons();
    } catch (error: any) {
      alert(error.message || '领取失败');
    } finally {
      setClaiming(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 3;
  };

  const getCouponStatus = (coupon: UserCoupon) => {
    if (coupon.status === 'used') return '已使用';
    if (new Date(coupon.valid_until) < new Date()) return '已过期';
    if (isExpiringSoon(coupon.valid_until)) return '即将过期';
    return '未使用';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已使用': return 'bg-gray-100 text-gray-500';
      case '已过期': return 'bg-red-100 text-red-600';
      case '即将过期': return 'bg-orange-100 text-orange-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">优惠券中心</h1>
              <p className="text-white/80">领取优惠券，享受更多优惠</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* My Coupons Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">我的优惠券</p>
            <p className="text-3xl font-bold text-primary-600">{myCoupons.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">已使用</p>
            <p className="text-3xl font-bold text-green-600">
              {myCoupons.filter(c => c.status === 'used').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">可用优惠券</p>
            <p className="text-3xl font-bold text-blue-600">
              {myCoupons.filter(c => c.status === 'unused' && new Date(c.valid_until) >= new Date()).length}
            </p>
          </div>
        </div>

        {/* My Coupons */}
        {myCoupons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">我的优惠券</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCoupons.map(coupon => {
                const status = getCouponStatus(coupon);
                return (
                  <div
                    key={coupon.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border-2 ${
                      coupon.status === 'used' || new Date(coupon.valid_until) < new Date()
                        ? 'border-gray-200 opacity-60'
                        : 'border-primary-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Ticket className={`w-6 h-6 ${
                          coupon.status === 'used' ? 'text-gray-400' : 'text-primary-600'
                        }`} />
                        <span className="font-bold">{coupon.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(status)}`}>
                        {status}
                      </span>
                    </div>
                    
                    <p className="text-2xl font-bold text-primary-600 mb-2">
                      {coupon.type === 'fixed' ? '¥' : ''}{coupon.value}
                      {coupon.type === 'percentage' ? '%' : ''}
                      <span className="text-sm font-normal text-gray-500"> 优惠券</span>
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {coupon.type === 'percentage' && coupon.max_discount
                        ? `最高抵扣¥${coupon.max_discount}`
                        : `满${coupon.min_amount}元可用`}
                    </p>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {formatDate(coupon.valid_until)} 到期
                      {isExpiringSoon(coupon.valid_until) && (
                        <span className="text-orange-500 ml-1">⚠️</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Coupons */}
        <div>
          <h2 className="text-xl font-bold mb-4">可领取优惠券</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : availableCoupons.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无可领取的优惠券</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableCoupons.map(coupon => {
                const remaining = coupon.total_count - coupon.claimed_count;
                const percentLeft = ((remaining / coupon.total_count) * 100).toFixed(0);
                const isClaimed = myCoupons.some(c => c.coupon_id === coupon.id);
                
                return (
                  <div
                    key={coupon.id}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm ${
                      remaining <= 10 ? 'border-2 border-orange-300' : ''
                    }`}
                  >
                    <div className="flex">
                      {/* Left side - value */}
                      <div className="w-32 bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold">
                          {coupon.type === 'fixed' ? '¥' : ''}{coupon.value}
                          {coupon.type === 'percentage' && <span className="text-lg">折</span>}
                        </p>
                        <p className="text-xs text-white/80 mt-1">
                          {coupon.type === 'fixed' ? '直减' : '折扣'}
                        </p>
                      </div>
                      
                      {/* Right side - info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{coupon.name}</h3>
                            <p className="text-sm text-gray-500">{coupon.description || '全场通用'}</p>
                          </div>
                          {isClaimed ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              已领取
                            </span>
                          ) : (
                            <button
                              onClick={() => handleClaim(coupon.id)}
                              disabled={claiming === coupon.id || remaining <= 0}
                              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                remaining <= 0
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                              }`}
                            >
                              {claiming === coupon.id ? '领取中...' : '立即领取'}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            {coupon.type === 'percentage' && coupon.max_discount
                              ? `最高减¥${coupon.max_discount}`
                              : `满${coupon.min_amount}元可用`}
                          </span>
                          <span>
                            剩余 {remaining}/{coupon.total_count}
                          </span>
                        </div>
                        
                        {remaining <= 10 && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-400 rounded-full"
                                style={{ width: `${percentLeft}%` }}
                              />
                            </div>
                            <p className="text-xs text-orange-500 mt-1">仅剩 {remaining} 张</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}
                      </div>
                      <Tag className="w-3 h-3" />
                      券码: {coupon.code}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
