import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, ChevronDown } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('北京朝阳店');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const locations = ['北京朝阳店', '北京西城店', '北京海淀店', '上海浦东店', '广州天河店'];

  const handleSearch = () => {
    navigate('/cars');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2 animate-scaleIn">
      {/* Pickup location */}
      <div className="flex-1 relative group">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl group-hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">取车地点</p>
            <select
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer appearance-none"
            >
              {locations.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent my-3" />

      {/* Start date */}
      <div className="flex-1 group">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl group-hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">取车日期</p>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent my-3" />

      {/* End date */}
      <div className="flex-1 group">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl group-hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">还车日期</p>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="btn-primary flex items-center justify-center gap-2 px-8 md:rounded-xl whitespace-nowrap font-semibold"
      >
        <Search className="w-5 h-5" />
        搜索车辆
      </button>
    </div>
  );
};

export default SearchBar;
