import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, CreditCard, CheckCircle, Clock, ArrowLeft, Loader2 } from 'lucide-react';

interface PaymentProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 从路由状态获取订单信息
  const orderData = location.state || {
    orderId: 'ORD' + Date.now(),
    amount: 299.00,
    carName: '宝马5系 2024款',
    days: 3,
    pickupDate: '2026-04-15',
    returnDate: '2026-04-18'
  };

  useEffect(() => {
    // 如果没有订单数据，重定向到首页
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentSuccess(true);

    // 3秒后自动跳转
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">支付成功！</h2>
          <p className="text-gray-600 mb-4">您的订单已确认，稍后可在订单页面查看详情</p>
          <p className="text-sm text-gray-500">页面将在 3 秒后跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">确认支付</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 订单摘要 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">订单编号</span>
              <p className="font-medium text-gray-900">{orderData.orderId}</p>
            </div>
            <div>
              <span className="text-gray-500">租车费用</span>
              <p className="font-bold text-2xl text-primary-600">¥{orderData.amount.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">车型</span>
              <p className="font-medium text-gray-900">{orderData.carName}</p>
            </div>
            <div>
              <span className="text-gray-500">租期</span>
              <p className="font-medium text-gray-900">{orderData.days} 天</p>
            </div>
            <div>
              <span className="text-gray-500">取车日期</span>
              <p className="font-medium text-gray-900">{orderData.pickupDate}</p>
            </div>
            <div>
              <span className="text-gray-500">还车日期</span>
              <p className="font-medium text-gray-900">{orderData.returnDate}</p>
            </div>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择支付方式</h2>

          <div className="space-y-3">
            {/* 支付宝 */}
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'alipay'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="alipay"
                checked={paymentMethod === 'alipay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary-600"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">支</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">支付宝</p>
                    <p className="text-sm text-gray-500">推荐</p>
                  </div>
                </div>
              </div>
              {paymentMethod === 'alipay' && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </label>

            {/* 微信支付 */}
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'wechat'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="wechat"
                checked={paymentMethod === 'wechat'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary-600"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">微</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">微信支付</p>
                    <p className="text-sm text-gray-500">便捷安全</p>
                  </div>
                </div>
              </div>
              {paymentMethod === 'wechat' && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </label>

            {/* 银行卡 */}
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary-600"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">银行卡</p>
                    <p className="text-sm text-gray-500">支持借记卡/信用卡</p>
                  </div>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </label>
          </div>
        </div>

        {/* 支付安全提示 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 text-sm">交易安全</p>
              <p className="text-sm text-gray-500">您的支付信息已加密，全程保障资金安全</p>
            </div>
          </div>
        </div>

        {/* 确认支付按钮 */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              支付中...
            </>
          ) : (
            <>
              确认支付 ¥{orderData.amount.toFixed(2)}
            </>
          )}
        </button>

        {/* 提示信息 */}
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          支付有效期：30分钟内完成
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;