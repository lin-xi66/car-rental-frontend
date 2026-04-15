import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings } from 'lucide-react';
import type { Car } from '../services/apiData';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const fuelColor: Record<string, string> = {
    '纯电动': 'bg-green-100 text-green-700',
    '油电混合': 'bg-blue-100 text-blue-700',
    '汽油': 'bg-orange-100 text-orange-700',
    '柴油': 'bg-gray-100 text-gray-700',
  };

  const typeColor: Record<string, string> = {
    'SUV': 'bg-purple-100 text-purple-700',
    '轿车': 'bg-blue-100 text-blue-700',
    'MPV': 'bg-teal-100 text-teal-700',
    '跑车': 'bg-red-100 text-red-700',
  };

  // 使用占位图，显示车辆品牌信息
  const placeholderImage = `https://placehold.co/800x500/1e293b/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.name)}&font=noto-sans`;
  const image = car.images?.[0] || placeholderImage;
  const isAvailable = car.status === 'available';

  return (
    <div className="card group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placehold.co')) {
              target.src = placeholderImage;
            }
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`badge ${typeColor[car.type] || 'bg-gray-100 text-gray-700'} backdrop-blur-sm`}>
            {car.type}
          </span>
          <span className={`badge ${fuelColor[car.fuel] || 'bg-gray-100 text-gray-700'} backdrop-blur-sm`}>
            {car.fuel}
          </span>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold text-gray-700">4.8</span>
        </div>
        
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-gray-800 font-bold px-6 py-2 rounded-xl text-sm shadow-lg">
              暂不可用
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg">{car.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{car.brand}</p>
        </div>

        {/* Specs */}
        <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-3">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{car.seats}座</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{car.transmission === '自动' ? '自动挡' : '手动挡'}</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{car.fuel}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {car.features?.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg">
              {feature}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-primary-600">¥{car.price_per_day}</span>
            <span className="text-sm text-gray-500">/天</span>
            <span className="text-xs text-gray-400 ml-1">押金 ¥{car.deposit}</span>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className={`btn-primary text-sm py-2.5 px-5 ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
          >
            预订
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
