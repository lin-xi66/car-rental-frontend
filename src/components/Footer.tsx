import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">驰行租车</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              专业汽车租赁服务，提供高品质车辆，让您的每次出行都成为愉快的体验。
            </p>
            <div className="flex gap-3">
              {['微博', '微信', '抖音', 'B站'].map((name) => (
                <button key={name} className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors text-xs text-gray-300 hover:text-white font-medium">
                  {name.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: '首页' },
                { to: '/cars', label: '浏览车辆' },
                { to: '/orders', label: '我的订单' },
                { to: '/about', label: '关于我们' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">服务项目</h4>
            <ul className="space-y-2.5 text-sm">
              {['商务租车', '自驾游', '婚庆用车', '机场接送', '长期租赁', '企业用车'].map(s => (
                <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 text-primary-400" />
                <div>
                  <p className="text-white font-medium">400-888-8888</p>
                  <p className="text-xs">周一至周日 8:00-22:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-primary-400" />
                <p>service@chixing.com</p>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400" />
                <p>北京市朝阳区建国路88号</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs">© 2024 驰行租车. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <span className="hover:text-white cursor-pointer">隐私政策</span>
            <span className="hover:text-white cursor-pointer">服务条款</span>
            <span className="hover:text-white cursor-pointer">Cookie政策</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
