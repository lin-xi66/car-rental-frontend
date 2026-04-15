import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, Search, X, ChevronDown, Car as CarIcon, Loader2 } from 'lucide-react';
import CarCard from '../components/CarCard';
import { getCars, type Car } from '../services/apiData';

const carTypes = ['all', '轿车', 'SUV', 'MPV', '跑车', '新能源', '皮卡'];

const CarsListPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceMax, setPriceMax] = useState(2000);
  const [seats, setSeats] = useState<number | 'all'>('all');
  const [transmission, setTransmission] = useState<string>('all');
  const [fuel, setFuel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars({ status: 'available' });
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filtered = useMemo(() => {
    let list = [...cars];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
      );
    }
    if (selectedType !== 'all') list = list.filter(c => c.type === selectedType);
    list = list.filter(c => c.price_per_day <= priceMax);
    if (seats !== 'all') list = list.filter(c => c.seats >= (seats as number));
    if (transmission !== 'all') list = list.filter(c => c.transmission === transmission);
    if (fuel !== 'all') list = list.filter(c => c.fuel === fuel);

    if (sortBy === 'price_asc') list.sort((a, b) => a.price_per_day - b.price_per_day);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price_per_day - a.price_per_day);

    return list;
  }, [searchQuery, selectedType, priceMax, seats, transmission, fuel, sortBy, cars]);

  const availableCount = filtered.filter(c => c.status === 'available').length;

  const clearFilters = () => {
    setSelectedType('all');
    setPriceMax(2000);
    setSeats('all');
    setTransmission('all');
    setFuel('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'all' || priceMax < 2000 || seats !== 'all'
    || transmission !== 'all' || fuel !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">选择您的车辆</h1>
          <p className="text-gray-500">共 {filtered.length} 辆车，{availableCount} 辆可用</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索品牌、车型..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            ) : null}
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">默认排序</option>
              <option value="price_asc">价格从低到高</option>
              <option value="price_desc">价格从高到低</option>
            </select>
            
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-colors ${
                showFilter || hasActiveFilters
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选
            </button>
            
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {carTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {type === 'all' ? '全部车型' : type}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">高级筛选</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-primary-600">
                  清除全部
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  最高价格：<span className="text-primary-600">¥{priceMax}/天</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  step={50}
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">座位数</label>
                <div className="flex gap-2">
                  {(['all', 2, 5, 7] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSeats(s)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        seats === s ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {s === 'all' ? '不限' : `${s}座+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">变速箱</label>
                <div className="flex gap-2">
                  {([['all', '不限'], ['自动', '自动挡'], ['手动', '手动挡']] as const).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setTransmission(v)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        transmission === v ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">燃油类型</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', '汽油', '纯电动', '油电混合'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFuel(f)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        fuel === f ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {f === 'all' ? '不限' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">已选：</span>
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                {selectedType}
                <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {priceMax < 2000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                ≤¥{priceMax}/天
                <button onClick={() => setPriceMax(2000)}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 mb-4">未找到匹配的车辆</p>
            <button onClick={clearFilters} className="btn-primary">
              清除筛选
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filtered.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsListPage;
