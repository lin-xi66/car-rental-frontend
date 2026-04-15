import { Car, Award, Shield, Clock, Users, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const milestones = [
    { year: '2015', event: '驰行租车成立，在北京开设首家门店' },
    { year: '2017', event: '扩展至5个城市，用户突破10万' },
    { year: '2019', event: '引入新能源车队，积极推动绿色出行' },
    { year: '2021', event: '获A轮融资，开启全国扩张之路' },
    { year: '2023', event: '覆盖30+城市，注册用户突破50万' },
    { year: '2024', event: '荣获年度最佳租车平台大奖' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">关于驰行租车</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            我们相信每一次出行都应该是一次愉快的体验。自2015年成立以来，驰行租车一直致力于为用户提供高品质、高性价比的汽车租赁服务。
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Award, title: '我们的使命', desc: '让每个人都能享受到便捷、安全、舒适的出行体验，推动汽车共享经济发展。', color: 'text-yellow-600 bg-yellow-50' },
            { icon: Shield, title: '我们的承诺', desc: '全面车险保障、严格车辆检测、透明价格政策，让您的每次租车都安心无忧。', color: 'text-blue-600 bg-blue-50' },
            { icon: Clock, title: '我们的服务', desc: '24小时在线客服、遍布全国的门店网络、灵活的取还车方式，随时为您服务。', color: 'text-green-600 bg-green-50' },
          ].map(item => (
            <div key={item.title} className="card p-8 text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Users, value: '500,000+', label: '注册用户' },
              { icon: Car, value: '200+', label: '精选车型' },
              { icon: MapPin, value: '30+', label: '覆盖城市' },
              { icon: Award, value: '4.9分', label: '用户评分' },
            ].map(s => (
              <div key={s.label}>
                <s.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-primary-100 mt-1 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">发展历程</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                  {m.year}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-gray-700">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">联系我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: '客服热线', value: '400-888-8888', sub: '周一至周日 8:00-22:00' },
              { icon: Mail, title: '邮件联系', value: 'service@chixing.com', sub: '24小时内回复' },
              { icon: MapPin, title: '总部地址', value: '北京市朝阳区建国路88号', sub: '驰行大厦18楼' },
            ].map(c => (
              <div key={c.title} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-primary-600 font-medium">{c.value}</p>
                <p className="text-gray-500 text-sm mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">准备好出发了吗？</h2>
        <p className="text-gray-500 mb-8">选择驰行租车，开启您的美好旅程</p>
        <Link to="/cars" className="btn-primary text-base py-3 px-10 inline-flex">
          立即租车
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
