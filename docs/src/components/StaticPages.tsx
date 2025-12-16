import React, { useState } from 'react';
import { Clock, CheckCircle, Heart, ArrowRight, Sparkles, MapPin, Phone, Instagram, MessageCircle, Star, Quote, ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle, X, ZoomIn, ZoomOut, ExternalLink, Gift, CreditCard, Mail, Navigation } from 'lucide-react';
import { DIKIDI_WIDGET_URL } from '../data';
import { Review, BookingDetails, GalleryItem, BlogPost } from '../types';
import { sendTelegramNotification } from '../services/telegramService';

// --- HOME PAGE (ГЛАВНАЯ) ---
export const HomePage: React.FC<{ onNavigate: (page: string) => void; openBooking: () => void }> = ({ onNavigate, openBooking }) => (
  <>
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-fuchsia-200/30 dark:bg-fuchsia-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent dark:from-slate-950/90 dark:via-slate-950/40 dark:to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-20 animate-in slide-in-from-bottom-10 fade-in duration-700">
        <div className="mb-8 flex justify-center">
            <div className="px-8 py-2 border border-purple-200/50 dark:border-purple-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-full text-purple-800 dark:text-purple-300 text-xs md:text-sm uppercase tracking-[0.3em] font-bold shadow-lg shadow-purple-100/50 dark:shadow-none ring-1 ring-white/50 dark:ring-white/10">
              Салон красоты в Большом Камне
            </div>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.05] drop-shadow-sm">
          PLACE OF <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 neon-text drop-shadow-lg">BEAUTY & HEALTHY</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 mb-12 max-w-4xl mx-auto font-medium leading-relaxed drop-shadow-md">
          Для безупречного взгляда - брови и ресницы. <br className="hidden md:block"/>
          Для глубокого отдыха - ручной массаж. <br className="hidden md:block"/>
          Для красивой фигуры - аппаратный массаж.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={openBooking} className="group relative bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg px-12 py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden hover:bg-slate-800 dark:hover:bg-slate-100">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            <span className="flex items-center justify-center gap-2 relative z-10"><Clock size={20} className="text-purple-300 dark:text-purple-600" /> ЗАПИСАТЬСЯ</span>
          </button>
          <button onClick={() => onNavigate('services')} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-purple-100 dark:border-slate-700 hover:border-purple-300 text-lg px-12 py-5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Прайс-лист
          </button>
        </div>
      </div>
    </section>
    
    <section className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center relative z-10">
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-300 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">О нас</div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-8 leading-tight">
            Почему выбирают <br/><span className="text-purple-600 dark:text-purple-400 neon-text text-3xl md:text-5xl block mt-2">PLACE OF BEAUTY & HEALTHY?</span>
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-slate-700 shadow-xl shadow-purple-100/50 dark:shadow-none group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Опытные мастера</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Наши специалисты — настоящие фанаты своего дела.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

// --- SERVICES PAGE (ПРАЙС - ИСПРАВЛЕН) ---
export const ServicesPage: React.FC<{ openBooking: () => void; priceList: any }> = ({ openBooking, priceList }) => (
  <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
    <div className="text-center mb-16 animate-in slide-in-from-bottom-5">
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">НАШ ПРАЙС-ЛИСТ</h2>
      <div className="h-2 w-24 bg-gradient-to-r from-purple-400 to-fuchsia-400 mx-auto rounded-full shadow-lg shadow-purple-200 dark:shadow-purple-900"></div>
    </div>

    {!priceList || Object.keys(priceList).length === 0 ? (
       <div className="text-center text-slate-400 py-12">Загрузка прайс-листа...</div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {Object.values(priceList).map((category: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-purple-50 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Sparkles size={24} className="text-purple-500" /> {category.title}
            </h3>
            <div className="space-y-6">
              {category.items.map((item: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg">{item.name}</h4>
                      <span className="flex-1 mx-4 border-b border-dotted border-slate-200 hidden sm:block"></span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 text-lg whitespace-nowrap hidden sm:block">{item.price}</span>
                    </div>
                    {item.desc && <p className="text-slate-400 text-sm mt-1">{item.desc}</p>}
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-lg sm:hidden mt-2 block">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    <div className="text-center">
      <button onClick={openBooking} className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-lg px-16 py-5 rounded-full font-bold shadow-xl shadow-purple-200 dark:shadow-purple-900/50 transition-all hover:-translate-y-1 hover:scale-105">
        Записаться на процедуру
      </button>
    </div>
  </section>
);

// --- CERTIFICATES PAGE (СЕРТИФИКАТЫ - ИСПРАВЛЕНА КНОПКА) ---
export const CertificatesPage: React.FC<{ openCertModal: () => void }> = ({ openCertModal }) => (
  <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen">
      <div className="text-center mb-16 animate-in slide-in-from-bottom-5">
        <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-4">ПОДАРОЧНЫЕ СЕРТИФИКАТЫ</h2>
        <div className="h-2 w-24 bg-gradient-to-r from-purple-400 to-fuchsia-400 mx-auto rounded-full shadow-lg shadow-purple-200 dark:shadow-purple-900"></div>
        <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Дарите красоту и здоровье своим близким. Идеальный подарок на любой праздник.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
         <div className="flex-1 w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-purple-50 dark:border-slate-800 text-center">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Хотите заказать?</h3>
             <p className="text-slate-500 dark:text-slate-400 mb-8">Оставьте заявку, и администратор свяжется с вами для оформления.</p>
             <button onClick={openCertModal} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-purple-200 dark:shadow-purple-900/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                <Gift size={20} /> Заказать сертификат
             </button>
         </div>
      </div>
    </section>
);

// --- SCHEDULE PAGE ---
export const SchedulePage: React.FC = () => (
  <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen flex flex-col items-center">
     <div className="text-center mb-12 animate-in slide-in-from-bottom-5">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">РАСПИСАНИЕ</h2>
     </div>
     <div className="w-full max-w-4xl h-[700px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-purple-50 dark:border-slate-800 animate-in zoom-in-95 duration-700">
        <iframe src={DIKIDI_WIDGET_URL} width="100%" height="100%" frameBorder="0"></iframe>
     </div>
  </section>
);

// --- REVIEWS PAGE ---
export const ReviewsPage: React.FC<{ openBooking: () => void; reviews: Review[]; onAddReview: (review: Review) => void; }> = ({ openBooking, reviews, onAddReview }) => {
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    onAddReview({ id: Date.now(), name: newReview.name, text: newReview.text, rating: newReview.rating, date: new Date().toLocaleDateString('ru-RU') });
    setNewReview({ name: '', text: '', rating: 5 });
    setShowForm(false);
  };
  return (
    <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="text-center mb-16 animate-in slide-in-from-bottom-5"><h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">ОТЗЫВЫ</h2></div>
      {reviews.length === 0 ? <div className="text-center text-slate-400 py-12">Отзывов пока нет. Будьте первыми!</div> : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {reviews.map(review => (
           <div key={review.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-purple-50 dark:border-slate-800 relative animate-in zoom-in-95 duration-500 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="flex gap-1 text-yellow-400 mb-4">{[...Array(review.rating)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic leading-relaxed relative z-10 font-medium">"{review.text}"</p>
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                 <span className="font-bold text-slate-900 dark:text-white">{review.name}</span>
              </div>
           </div>
        ))}
      </div>
      )}
      <div className="max-w-2xl mx-auto text-center"><button onClick={() => setShowForm(true)} className="bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-slate-700 hover:border-purple-400 text-lg px-12 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg">Оставить отзыв</button></div>
      {showForm && (<form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-purple-50 dark:border-slate-700 shadow-2xl animate-in slide-in-from-bottom-5 relative overflow-hidden"><input type="text" required value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-purple-400 dark:text-white" placeholder="Имя" /><textarea required value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 h-32 mb-4 focus:outline-none focus:border-purple-400 dark:text-white resize-none" placeholder="Отзыв..." /><button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all">Отправить</button></form>)}
    </section>
  );
};

// --- GALLERY PAGE (ПОРТФОЛИО) ---
export const GalleryPage: React.FC<{ items: GalleryItem[] }> = ({ items }) => (
    <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen">
      <div className="text-center mb-12 animate-in slide-in-from-bottom-5"><h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">НАШИ РАБОТЫ</h2></div>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in bg-slate-200 dark:bg-slate-800 animate-in zoom-in-95 duration-500">
            <img src={item.src} alt={item.category} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
);

// --- BLOG PAGE (БЛОГ) ---
// ВАЖНО: Добавлен экспорт BlogPage
export const BlogPage: React.FC<{ posts: BlogPost[]; onUpdatePosts: (posts: BlogPost[]) => void }> = ({ posts }) => (
    <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen">
        <div className="text-center mb-12"><h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">БЛОГ</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg border border-purple-50 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors">{post.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">{post.excerpt}</p>
                    </div>
                </article>
            ))}
        </div>
    </section>
);

// --- CONTACTS PAGE (КОНТАКТЫ) ---
export const ContactsPage: React.FC = () => (
  <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen">
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
       <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-purple-50 dark:border-slate-800 animate-in slide-in-from-left-5">
           <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-10">КОНТАКТЫ</h2>
           <div className="space-y-8">
              <div><h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Адрес</h3><p className="text-slate-600 dark:text-slate-400 text-lg">г. Большой Камень,<br/>ул. Адмирала Макарова, 2</p></div>
              <div><h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Телефон</h3><p className="text-slate-600 dark:text-slate-400 text-lg font-medium">+7 (993) 628-77-99</p></div>
           </div>
       </div>
    </div>
  </section>
);