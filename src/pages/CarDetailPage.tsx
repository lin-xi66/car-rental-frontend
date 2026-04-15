import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, Users, Fuel, Settings, MapPin, Calendar,
  Shield, CheckCircle, ChevronLeft, ChevronRight, Phone, Share2, Loader2
} from 'lucide-react';
import { getCar, getCars, type Car } from '../services/apiData';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { differenceInDays, format, addDays } from 'date-fns';
import MapPicker from '../components/MapPicker';

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [pickupStoreId, setPickupStoreId] = useState('');
  const [returnStoreId, setReturnStoreId] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showReturnMap, setShowReturnMap] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 自动填充用户信息
  useEffect(() => {
    if (user) {
      setDriverName(user.name || '');
      setDriverPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const carData = await getCar(id);
        setCar(carData);
        setPickupLocation(carData.name);
        setReturnLocation(carData.name);

        // Fetch related cars
        const allCars = await getCars({ type: carData.type, status: 'available' });
        setRelatedCars(allCars.filter(c => c.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🚗</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">车辆不存在</h2>
        <Link to="/cars" className="btn-primary inline-flex mt-4">返回列表</Link>
      </div>
    );
  }

  const placeholderImg = `https://placehold.co/800x500/1e293b/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.name)}`;
  const images = car.images?.length > 0 ? car.images : [placeholderImg];
  const days = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
  const total = days * car.price_per_day;
  const isAvailable = car.status === 'available';

  const handleBook = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    // 验证必填字段
    if (!driverName || !driverPhone) {
      alert('请填写驾驶人姓名和手机号');
      return;
    }
    if (!pickupLocation || !returnLocation) {
      alert('请选择取车和还车门店');
      return;
    }

    setSubmitting(true);
    try {
      // 确保门店ID存在
      const pickupId = pickupStoreId || storeNameToId[pickupLocation] || pickupLocation;
      const returnId = returnStoreId || storeNameToId[returnLocation] || returnLocation;

      const order = await createOrder({
        car_id: car.id,
        pickup_store_id: pickupId,
        return_store_id: returnId,
        pickup_date: startDate,
        return_date: endDate,
        pickup_location: pickupLocation,
        return_location: returnLocation,
        contact_name: driverName,
        contact_phone: driverPhone,
        contact_id_card: driverLicense,
      });

      // Navigate to payment with order info
      navigate('/payment', {
        state: {
          orderId: order.id,
          amount: total + car.deposit,
          carName: car.name,
          days,
          pickupDate: startDate,
          returnDate: endDate,
          carId: car.id,
          pickupLocation,
          returnLocation,
        }
      });
    } catch (error: any) {
      console.error('Failed to create order:', error);
      alert(error.message || '创建订单失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // Store name to ID mapping
  const storeNameToId: Record<string, string> = {
    '浦东机场店': 'store-001',
    '静安寺店': 'store-002',
    '虹桥枢纽店': 'store-003',
    '陆家嘴店': 'store-004',
    '徐家汇店': 'store-005',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            <div className="relative h-72 md:h-96">
              <img
                src={images[imgIndex]}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('placehold.co')) {
                    target.src = placeholderImg;
                  }
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex(Math.max(0, imgIndex - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIndex(Math.min(images.length - 1, imgIndex + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-full">暂不可用</span>
                </div>
              )}
            </div>
          </div>

          {/* Car Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
                <p className="text-gray-500 mt-1">{car.brand} · {car.type}</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
              {[
                { icon: Users, label: '座位', value: `${car.seats}座` },
                { icon: Settings, label: '变速箱', value: car.transmission },
                { icon: Fuel, label: '燃油', value: car.fuel },
                { icon: MapPin, label: '品牌', value: car.brand },
              ].map(spec => (
                <div key={spec.label} className="text-center">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                    <spec.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900 mb-2">车辆介绍</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">配置亮点</h3>
              <div className="grid grid-cols-2 gap-2">
                {car.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Cars */}
          {relatedCars.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">同类型推荐</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCars.map(c => (
                  <Link key={c.id} to={`/cars/${c.id}`} className="card hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={c.images?.[0] || `https://placehold.co/400x200/1e293b/ffffff?text=${encodeURIComponent(c.brand + ' ' + c.name)}`}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('placehold.co')) {
                            target.src = `https://placehold.co/400x200/1e293b/ffffff?text=${encodeURIComponent(c.brand + ' ' + c.name)}`;
                          }
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-primary-600 font-bold mt-1">¥{c.price_per_day}<span className="text-gray-400 font-normal text-xs">/天</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Panel */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-primary-600">¥{car.price_per_day}</span>
                <span className="text-gray-500 text-sm">/天</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!showBooking ? (
              <div className="space-y-4">
                {/* Date picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="inline w-3.5 h-3.5 mr-1" />取车日期
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="inline w-3.5 h-3.5 mr-1" />还车日期
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="inline w-3.5 h-3.5 mr-1" />取车地点
                  </label>
                  <div className="relative">
                    <select
                      value={pickupLocation}
                      onChange={e => {
                        const name = e.target.value;
                        setPickupLocation(name);
                        setPickupStoreId(storeNameToId[name] || name);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value="">选择门店</option>
                      <option value="浦东机场店">浦东机场店</option>
                      <option value="静安寺店">静安寺店</option>
                      <option value="虹桥枢纽店">虹桥枢纽店</option>
                      <option value="陆家嘴店">陆家嘴店</option>
                      <option value="徐家汇店">徐家汇店</option>
                    </select>
                    <button
                      onClick={() => setShowPickupMap(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-600 hover:text-primary-700 px-2 py-1 bg-primary-50 rounded"
                    >
                      地图选点
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="inline w-3.5 h-3.5 mr-1" />还车地点
                  </label>
                  <div className="relative">
                    <select
                      value={returnLocation}
                      onChange={e => {
                        const name = e.target.value;
                        setReturnLocation(name);
                        // 同取车点时使用同一个门店ID
                        if (name === '同取车点') {
                          setReturnStoreId(pickupStoreId);
                        } else {
                          setReturnStoreId(storeNameToId[name] || name);
                        }
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value="">选择门店</option>
                      <option value="同取车点">同取车点</option>
                      <option value="浦东机场店">浦东机场店</option>
                      <option value="静安寺店">静安寺店</option>
                      <option value="虹桥枢纽店">虹桥枢纽店</option>
                      <option value="陆家嘴店">陆家嘴店</option>
                      <option value="徐家汇店">徐家汇店</option>
                    </select>
                    <button
                      onClick={() => setShowReturnMap(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-600 hover:text-primary-700 px-2 py-1 bg-primary-50 rounded"
                    >
                      地图选点
                    </button>
                  </div>
                </div>

                {/* 地图选点弹窗 */}
                {showPickupMap && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-lg">选择取车地点</h3>
                        <button onClick={() => setShowPickupMap(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                      </div>
                      <MapPicker
                        mode="pickup"
                        onLocationSelect={(store) => {
                          setPickupLocation(store.name);
                          setPickupStoreId(store.id);
                          setShowPickupMap(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {showReturnMap && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-lg">选择还车地点</h3>
                        <button onClick={() => setShowReturnMap(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                      </div>
                      <MapPicker
                        mode="return"
                        onLocationSelect={(store) => {
                          setReturnLocation(store.name);
                          setReturnStoreId(store.id);
                          setShowReturnMap(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>¥{car.price_per_day} × {days} 天</span>
                    <span>¥{car.price_per_day * days}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>押金</span>
                    <span>¥{car.deposit}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>服务费</span>
                    <span className="text-green-600">免费</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                    <span>合计</span>
                    <span className="text-primary-600">¥{total + car.deposit}</span>
                  </div>
                </div>

                {/* Login Prompt */}
                {showLoginPrompt && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">请先登录</h3>
                      <p className="text-gray-500 mb-4">登录后即可完成预订，享受更多服务</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowLoginPrompt(false)}
                          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                          取消
                        </button>
                        <Link
                          to="/login"
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium text-center hover:from-primary-600 hover:to-primary-700 transition-all"
                        >
                          去登录
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowBooking(true)}
                  disabled={!isAvailable}
                  className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAvailable ? '立即预订' : '暂不可用'}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-center">
                  <Shield className="w-3.5 h-3.5" />
                  全额保险 · 免费取消 · 24小时客服
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">填写租车信息</h3>
                  <button onClick={() => setShowBooking(false)} className="text-xs text-gray-500 hover:text-gray-700">← 返回</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">驾驶人姓名 *</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    placeholder="请输入真实姓名"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号码 *</label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={e => setDriverPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">驾驶证号 *</label>
                  <input
                    type="text"
                    value={driverLicense}
                    onChange={e => setDriverLicense(e.target.value)}
                    placeholder="请输入驾驶证号码"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-primary-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>{car.name}</span>
                    <span>{days}天</span>
                  </div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>取车</span>
                    <span>{pickupLocation || '待选择'}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>还车</span>
                    <span>{returnLocation || '待选择'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary-700 pt-2 border-t border-primary-200">
                    <span>应付总额</span>
                    <span>¥{total + car.deposit}</span>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={!driverName || !driverPhone || submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? '提交中...' : '去支付'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
