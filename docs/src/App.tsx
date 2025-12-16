import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { ChatWidget } from './components/ChatWidget';
import { PrivacyModal } from './components/PrivacyModal';
import { BlogPost, Review, BookingDetails, GalleryItem } from './types';
import { INITIAL_BOOKINGS, DIKIDI_WIDGET_URL, FULL_PRICE_LIST, API_URL } from './data';
import { CertificateModal } from './components/CertificateModal';

// Импортируем компоненты страниц
import { BlogPage, HomePage, ServicesPage, SchedulePage, ReviewsPage, GalleryPage, ContactsPage, CertificatesPage } from './components/StaticPages';

declare global {
  interface Window {
    dikidi?: {
      open: (url: string, options?: any) => void;
      openModal?: (url: string, options?: any) => void;
    };
  }
}

// --- Header ---
const Header: React.FC<any> = ({ currentPage, onNavigate, openBooking, isDarkMode, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled || currentPage !== 'home' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-900 dark:text-white';
  const navHoverClass = 'hover:text-purple-600 dark:hover:text-purple-400';
  const navClass = (page: string) => `cursor-pointer transition-all duration-300 text-xs uppercase tracking-widest font-bold relative group ${currentPage === page ? 'text-purple-600 dark:text-purple-400' : `${textColorClass} ${navHoverClass}`}`;

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled || currentPage !== 'home' ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-4 shadow-sm border-b border-purple-100 dark:border-slate-800' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-4 group">
          <img src="./images/21.jpg" alt="Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain group-hover:scale-105 transition-transform duration-300 dark:invert" />
          <div className="flex flex-col items-start">
            <span className={`font-bold tracking-wider leading-none transition-colors duration-300 ${textColorClass}`}>PLACE OF</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm leading-none neon-text">BEAUTY & HEALTHY</span>
          </div>
        </button>
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <button onClick={() => onNavigate('home')} className={navClass('home')}>Главная</button>
          <button onClick={() => onNavigate('services')} className={navClass('services')}>Услуги</button>
          <button onClick={() => onNavigate('certificates')} className={navClass('certificates')}>Сертификаты</button>
          <button onClick={() => onNavigate('schedule')} className={navClass('schedule')}>Расписание</button>
          <button onClick={() => onNavigate('reviews')} className={navClass('reviews')}>Отзывы</button>
          <button onClick={() => onNavigate('blog')} className={navClass('blog')}>Блог</button>
          <button onClick={() => onNavigate('gallery')} className={navClass('gallery')}>Портфолио</button>
          <button onClick={() => onNavigate('contacts')} className={navClass('contacts')}>Контакты</button>
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${textColorClass} hover:bg-slate-100 dark:hover:bg-slate-800`}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button onClick={openBooking} className={`px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg border text-sm font-bold ${isScrolled || currentPage !== 'home' ? 'bg-purple-600 text-white' : 'bg-white/90 text-purple-600'}`}>Записаться</button>
        </div>
        <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 ${textColorClass}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button className={`${textColorClass}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-purple-100 p-6 flex flex-col space-y-4 shadow-xl">
          <button className="text-lg" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>Главная</button>
          <button className="text-lg" onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}>Услуги</button>
          <button className="text-lg" onClick={() => { onNavigate('certificates'); setMobileMenuOpen(false); }}>Сертификаты</button>
          <button className="text-lg" onClick={() => { onNavigate('schedule'); setMobileMenuOpen(false); }}>Расписание</button>
          <button className="text-lg" onClick={() => { onNavigate('reviews'); setMobileMenuOpen(false); }}>Отзывы</button>
          <button className="text-lg" onClick={() => { onNavigate('blog'); setMobileMenuOpen(false); }}>Блог</button>
          <button className="text-lg" onClick={() => { onNavigate('gallery'); setMobileMenuOpen(false); }}>Портфолио</button>
          <button className="text-lg" onClick={() => { onNavigate('contacts'); setMobileMenuOpen(false); }}>Контакты</button>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<any> = ({ onNavigate, openPrivacy }) => ( 
    <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">PLACE OF BEAUTY & HEALTHY</h5>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">&copy; 2025 Все права защищены.</p>
                </div>
            </div>
        </div>
    </footer>
);

// --- APP ROOT ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const navigateTo = (page: string) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // DATA STATE (С ЗАЩИТОЙ ОТ ПУСТОТЫ)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [priceList, setPriceList] = useState<any>(FULL_PRICE_LIST || {}); // Загружаем локальный прайс сразу

  // --- БЕЗОПАСНАЯ ЗАГРУЗКА ---
  useEffect(() => {
    const fetchData = async () => {
       const API_URL_BASE = API_URL;

       // 1. REVIEWS
       try {
          const res = await fetch(`${API_URL_BASE}/get_reviews`);
          if (res.ok) {
             const data = await res.json();
             // Проверяем, что пришел массив, иначе не обновляем
             if (Array.isArray(data)) setReviews(data); 
          }
       } catch (e) { console.error("Reviews load error (ignore):", e); }

       // 2. PORTFOLIO
       try {
         const res = await fetch(`${API_URL_BASE}/get_portfolio`);
         if (res.ok) {
           const data = await res.json();
           if (Array.isArray(data)) {
               setGalleryItems(data.map((item: any, i: number) => ({
                 id: i, src: item.image_url, category: item.category, aspectRatio: 'square', imageScale: 1
               })));
           }
         }
       } catch(e) { console.error("Portfolio load error (ignore):", e); }

       // 3. BLOG
       try {
         const res = await fetch(`${API_URL_BASE}/get_blog`);
         if (res.ok) {
             const data = await res.json();
             if (Array.isArray(data)) {
                 setBlogPosts(data.map((post: any, i: number) => ({
                   id: i, title: post.title, excerpt: post.text.substring(0, 100) + '...', content: post.text, image: post.image_url, author: 'Admin', date: new Date().toLocaleDateString('ru-RU'), likes: 0, comments: [], tags: [], isOriginal: true
                 })));
             }
         }
       } catch(e) { console.error("Blog load error (ignore):", e); }

       // 4. PRICE LIST 
       try {
           const res = await fetch(`${API_URL_BASE}/get_services`);
           if (res.ok) {
               const data = await res.json();
               if (data && Object.keys(data).length > 0) setPriceList(data);
           }
       } catch(e) { console.log('Using local price list due to server error'); }
    };

    fetchData();
  }, []);

  const handleOpenBookingModal = () => {
    if (window.dikidi && window.dikidi.open) {
      window.dikidi.open(DIKIDI_WIDGET_URL);
    } else {
      window.open(DIKIDI_WIDGET_URL, '_blank');
    }
  };

  const handleAddReview = async (review: Review) => {
      // Сначала обновляем локально, чтобы пользователь сразу увидел
      setReviews([review, ...reviews]);
      try {
          await fetch(`${API_URL}/save_review`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ author: review.name, text: review.text, rating: review.rating })
          });
      } catch (e) { console.error("Backend not available for review save:", e); }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Montserrat'] selection:bg-purple-200 selection:text-purple-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      <Header currentPage={currentPage} onNavigate={navigateTo} openBooking={handleOpenBookingModal} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main>
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} openBooking={handleOpenBookingModal} />}
        
        {/* Передаем priceList с защитой от undefined */}
        {currentPage === 'services' && <ServicesPage openBooking={handleOpenBookingModal} priceList={priceList || FULL_PRICE_LIST} />}
        
        {currentPage === 'certificates' && <CertificatesPage openCertModal={() => setIsCertModalOpen(true)} />}

        {currentPage === 'schedule' && <SchedulePage />}
        
        {currentPage === 'reviews' && (
           <ReviewsPage 
             openBooking={handleOpenBookingModal} 
             reviews={reviews || []} 
             onAddReview={handleAddReview} 
           />
        )}
        
        {currentPage === 'gallery' && <GalleryPage items={galleryItems || []} />}
        {currentPage === 'contacts' && <ContactsPage />}
        
        {currentPage === 'blog' && (
           <BlogPage posts={blogPosts || []} onUpdatePosts={() => {}} />
        )}
      </main>

      <Footer onNavigate={navigateTo} openPrivacy={() => setIsPrivacyOpen(true)} />

      <ChatWidget />
      
      <CertificateModal 
         isOpen={isCertModalOpen}
         onClose={() => setIsCertModalOpen(false)}
         priceList={priceList || FULL_PRICE_LIST}
      />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};

export default App;