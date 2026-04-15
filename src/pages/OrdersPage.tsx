import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Loader, Car } from 'lucide-react';
import { OrdersContext } from '../context/OrdersContext';
import { Order, OrderStatus } from '../types';
import { format } from 'date-fns';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: '已确认', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  ongoing: { label: '租用中', color: 'bg-green-100 text-green-700', icon: Loader },
  completed: { label: '已完成', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-600', icon: XCircle },
};

const tabs: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'confirmed', label: '已确认' },
  { key: 'ongoing', label: '租用中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

const OrderCard = ({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={order.carImage}
          alt={order.carName}
          className="w-24 h-16 object-cover rounded-xl flex-shrink-0"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placehold.co')) {
              target.src = `https://placehold.co/200x130/1e293b/ffffff?text=${encodeURIComponent(order.carName)}`;
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900">{order.carName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">订单号：#{order.id}</p>
            </div>
            <span className={`badge ${status.color} flex items-center gap-1 flex-shrink-0`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.startDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.endDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{order.pickupLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.days} 天</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-500">总费用 </span>
              <span className="text-lg font-bold text-primary-600">¥{order.totalPrice}</span>
            </div>
            <div className="flex gap-2">
              {(order.status === 'confirmed' || order.status === 'pending') && (
                <button
                  onClick={() => onCancel(order.id)}
                  className="btn-secondary text-xs py-1.5 px-3 text-red-500 border-red-100 hover:bg-red-50"
                >
                  取消订单
                </button>
              )}
              <Link to={`/cars/${order.carId}`} className="btn-secondary text-xs py-1.5 px-3">
                再次租用
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { orders, cancelOrder } = useContext(OrdersContext);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  const counts = tabs.reduce((acc, t) => {
    acc[t.key] = t.key === 'all' ? orders.length : orders.filter(o => o.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
        <p className="text-gray-500 mt-1">管理您的所有租车订单</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '全部订单', value: orders.length, color: 'text-gray-900' },
          { label: '已完成', value: orders.filter(o => o.status === 'completed').length, color: 'text-green-600' },
          { label: '累计消费', value: `¥${totalSpent.toLocaleString()}`, color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无订单</h3>
          <p className="text-gray-500 text-sm mb-5">还没有相关订单，快去选一辆心仪的车吧！</p>
          <Link to="/cars" className="btn-primary inline-flex">浏览车辆</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
