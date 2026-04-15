import React, { useState, useEffect, useRef } from 'react';
import { Search, Navigation, Clock, Phone, Loader2 } from 'lucide-react';
import { getStores, type Store } from '../services/apiData';

interface MapPickerProps {
  onLocationSelect?: (location: Store) => void;
  mode?: 'pickup' | 'return';
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, mode = 'pickup' }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    onLocationSelect?.(store);
  };

  const getStoreIcon = () => {
    return (
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#F97316"/>
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {mode === 'pickup' ? '选择取车地点' : '选择还车地点'}
        </h3>
        <span className="text-sm text-gray-500">{stores.length} 个门店可选</span>
      </div>

      {/* 搜索栏 */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索门店名称或地址"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 地图区域 */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50">
        {/* 模拟地图背景 */}
        <div className="absolute inset-0">
          {/* 模拟道路 */}
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-300 opacity-50"></div>
          <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300 opacity-50"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50"></div>
          <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50"></div>

          {/* 模拟建筑物 */}
          <div className="absolute top-10 left-10 w-16 h-12 bg-gray-200 rounded opacity-40"></div>
          <div className="absolute top-20 right-20 w-20 h-16 bg-gray-200 rounded opacity-40"></div>
          <div className="absolute bottom-16 left-1/3 w-14 h-10 bg-gray-200 rounded opacity-40"></div>

          {/* 加载状态 */}
          {loading ? (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="flex items-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                加载中...
              </div>
            </div>
          ) : (
            /* 门店标记 */
            stores.map((store, index) => {
              const positions = [
                { left: '20%', top: '25%' },
                { left: '60%', top: '35%' },
                { left: '30%', top: '55%' },
                { left: '70%', top: '70%' },
                { left: '50%', top: '40%' }
              ];
              const pos = positions[index] || { left: '50%', top: '50%' };
              const isSelected = selectedStore?.id === store.id;
              const isHovered = hoveredStore === store.id;

              return (
                <div
                  key={store.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-full transition-all duration-200 ${
                    isSelected ? 'z-20 scale-125' : isHovered ? 'z-10 scale-110' : 'z-0'
                  }`}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => handleStoreSelect(store)}
                  onMouseEnter={() => setHoveredStore(store.id)}
                  onMouseLeave={() => setHoveredStore(null)}
                >
                  <div className={`flex flex-col items-center ${isSelected || isHovered ? '' : 'opacity-70'}`}>
                    {getStoreIcon()}
                    {isSelected && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 地图控件 */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
            <span className="text-xl font-bold text-gray-600">+</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
            <span className="text-xl font-bold text-gray-600">−</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
            <Navigation className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 门店列表 */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            加载门店中...
          </div>
        ) : filteredStores.length > 0 ? (
          filteredStores.map(store => (
            <div
              key={store.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedStore?.id === store.id
                  ? 'bg-primary-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleStoreSelect(store)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{store.name}</h4>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
                      {store.district}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {store.hours}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {store.phone}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            未找到符合条件的门店
          </div>
        )}
      </div>

      {/* 选中门店详情 */}
      {selectedStore && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已选择</p>
              <p className="font-medium text-gray-900">{selectedStore.name}</p>
              <p className="text-sm text-gray-500">{selectedStore.address}</p>
            </div>
            <button
              onClick={() => setSelectedStore(null)}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
