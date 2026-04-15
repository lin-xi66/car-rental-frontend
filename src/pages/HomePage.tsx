import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, MapPin, Award, Star, ChevronRight, CheckCircle, Car as CarIcon, ArrowRight, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import { getCars } from '../services/apiData';
import type { Car } from '../services/apiData';

const features = [
  { icon: Shield, title: '全面保险保障', desc: '每辆车均投保全险，行程期间安心无忧' },
  { icon: Clock, title: '24小时服务', desc: '全天候客服支持，随时解答疑问' },
  { icon: MapPin, title: '全国门店覆盖', desc: '30+城市，200+门店，就近取还' },
  { icon: Award, title: '精选优质车型', desc: '严格质检，定期保养，提供最佳驾驶体验' },
];

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await getCars({ status: 'available' });
        setFeaturedCars(cars.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              租一辆好车，开启美好旅程
            </h1>
            <p className="text-xl text-white/90 mb-10">
              海量优质车型，透明价格，随取随还
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">50,000+</div>
              <div className="text-gray-500 mt-1">累计用户</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">200+</div>
              <div className="text-gray-500 mt-1">精选车型</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">30+</div>
              <div className="text-gray-500 mt-1">城市覆盖</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">4.9</div>
              <div className="text-gray-500 mt-1">平均评分</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(f => (
              <div key={f.title} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">热门车型</h2>
            <Link to="/cars" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看全部 <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">简单三步，轻松租车</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-bold text-xl mb-2">选择车辆</h3>
              <p className="text-gray-500">浏览我们精选的车型，选择合适的车辆</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2">预订确认</h3>
              <p className="text-gray-500">填写租用信息，完成在线支付</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2">取车出发</h3>
              <p className="text-gray-500">前往指定门店取车，享受旅程</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">立即开始您的旅程</h2>
          <p className="text-xl text-white/90 mb-8">注册即享首单9折优惠</p>
          <Link to="/cars" className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100">
            立即租车 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
