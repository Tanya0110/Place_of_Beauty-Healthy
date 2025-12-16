import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { ChatWidget } from './components/ChatWidget';
import { PrivacyModal } from './components/PrivacyModal';
import { BlogPost, Review, BookingDetails, GalleryItem } from './types';
import { INITIAL_BOOKINGS, DIKIDI_COMPANY_ID, DIKIDI_API_KEY, DIKIDI_WIDGET_URL, FULL_PRICE_LIST, API_URL } from './data'; // API_URL теперь из data.ts
import { sendTelegramNotification } from './services/telegramService';
import { AdminPanel } from './components/AdminPanel'; 

// Import Pages
import { BlogPage } from './components/BlogPage';
import { 
  HomePage, 
  ServicesPage, 
  SchedulePage, 
  ReviewsPage, 
  GalleryPage, 
  ContactsPage,
  CertificatesPage 
} from './components/StaticPages';
import { CertificateModal } from './components/CertificateModal';

// Update Dikidi Type Definition
declare global {
  interface Window {
    dikidi?: {
      open: (url: string, options?: any) => void;
      openModal?: (url: string, options?: any) => void;
    };
  }
}

// --- Header and Footer Components (Omitted for brevity, but they are fine) ---
const Header: React.FC<any> = ({ currentPage, onNavigate, openBooking, isDarkMode, toggleTheme }) => {
  // ... (Header code)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled || currentPage !== 'home' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-900 dark:text-white';
  const navHoverClass = 'hover:text-purple-600 dark:hover:text-purple-400';

  const navClass = (page: string) => `
    cursor-pointer transition-all duration-300 text-xs uppercase tracking-widest font-bold relative group
    ${currentPage === page 
      ? 'text-purple-600 dark:text-purple-400' 
      : `${textColorClass} ${navHoverClass}`
    }
  `;

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled || currentPage !== 'home' ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-4 shadow-sm border-b border-purple-100 dark:border-slate-800' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-4 group">
          <img 
src="./images/21.jpg"
            alt="Logo" 
            className="w-14 h-14 md:w-16 md:h-16 object-contain group-hover:scale-105 transition-transform duration-300 dark:invert" 
          />
          <div className="flex flex-col items-start">
            <span className={`font-bold tracking-wider leading-none transition-colors duration-300 ${textColorClass}`}>PLACE OF</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm leading-none neon-text">BEAUTY & HEALTHY</span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <button onClick={() => onNavigate('home')} className={navClass('home')}>Главная</button>
          <button onClick={() => onNavigate('services')} className={navClass('services')}>Услуги</button>
          <button onClick={() => onNavigate('certificates')} className={navClass('certificates')}>Сертификаты</button>
          <button onClick={() => onNavigate('schedule')} className={navClass('schedule')}>Расписание</button>
          <button onClick={() => onNavigate('reviews')} className={navClass('reviews')}>Отзывы</button>
          <button onClick={() => onNavigate('blog')} className={navClass('blog')}>Блог</button>
          <button onClick={() => onNavigate('gallery')} className={navClass('gallery')}>Портфолио</button>
          <button onClick={() => onNavigate('contacts')} className={navClass('contacts')}>Контакты</button>
          
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${textColorClass} hover:bg-slate-100 dark:hover:bg-slate-800`}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={openBooking}
            className={`px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg border text-sm font-bold transform hover:-translate-y-0.5 ${
              isScrolled || currentPage !== 'home' 
              ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-600 shadow-purple-200 dark:shadow-none' 
              : 'bg-white/90 dark:bg-slate-800/90 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 border-purple-100 dark:border-slate-700'
            }`}
          >
            Записаться
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 ${textColorClass}`}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`${textColorClass}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-purple-100 dark:border-slate-800 p-6 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>Главная</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}>Услуги и Цены</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('certificates'); setMobileMenuOpen(false); }}>Сертификаты</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('schedule'); setMobileMenuOpen(false); }}>Расписание</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('reviews'); setMobileMenuOpen(false); }}>Отзывы</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('blog'); setMobileMenuOpen(false); }}>Блог</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('gallery'); setMobileMenuOpen(false); }}>Портфолио</button>
          <button className="text-lg text-slate-800 dark:text-slate-100 hover:text-purple-600 font-medium text-left" onClick={() => { onNavigate('contacts'); setMobileMenuOpen(false); }}>Контакты</button>
          <button onClick={() => { setMobileMenuOpen(false); openBooking(); }} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-purple-200">Записаться Онлайн</button>
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
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">г. Большой Камень, ул. Адмирала Макарова, 2</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-slate-600 dark:text-slate-400 text-sm font-medium items-center">
            <button onClick={() => onNavigate('services')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Услуги</button>
            <button onClick={() => onNavigate('blog')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Блог</button>
            <button onClick={() => onNavigate('contacts')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Контакты</button>
            <button onClick={openPrivacy} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Политика конфиденциальности</button>
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
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return false; // Default to light
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- DYNAMIC DATA STATE ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  // Initialize Price List with FULL_PRICE_LIST from data.ts immediately
  const [priceList, setPriceList] = useState<any>(FULL_PRICE_LIST); 
  
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem('pbh_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch { return INITIAL_BOOKINGS; }
  });

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
       const API_URL = 'https://salon-bot-tanybbb2007-0110.amvera.io'; // Правильная ссылка Amvera

       // 1. REVIEWS
       try {
          const res = await fetch(`${API_URL}/get_reviews`);
          if (res.ok) {
             const data = await res.json();
             setReviews(data); 
          } else {
             // Если бот ответил, но с ошибкой (например, 404), оставляем пустой массив
             setReviews([]); 
          }
       } catch (e) {
          // Если соединение не установлено (главная причина белого экрана)
          setReviews([]); // НЕ ПАДАЕМ, а просто показываем пустой список
          console.error("Fetch failed for Reviews:", e);
       }

       // 2. PORTFOLIO
       try {
         const res = await fetch(`${API_URL}/get_portfolio`);
         if (res.ok) {
           const data = await res.json();
           setGalleryItems(data.map((item: any, i: number) => ({
             id: i,
             src: item.image_url,
             category: item.category,
             aspectRatio: 'square', 
             imageScale: 1
           })));
         } else {
            setGalleryItems([]);
         }
       } catch(e) { 
            console.error('Portfolio fetch failed:', e);
            setGalleryItems([]);
       }

       // 3. BLOG
       try {
         const res = await fetch(`${API_URL}/get_blog`);
         if (res.ok) {
           const data = await res.json();
           setBlogPosts(data.map((post: any, i: number) => ({
             id: i,
             title: post.title,
             excerpt: post.text.substring(0, 100) + '...',
             content: post.text,
             image: post.image_url,
             author: 'Admin',
             date: new Date().toLocaleDateString('ru-RU'),
             likes: 0,
             comments: [],
             tags: [],
             isOriginal: true
           })));
         } else {
             setBlogPosts([]);
         }
       } catch(e) { 
           console.error('Blog fetch failed:', e);
           setBlogPosts([]);
       }

       // 4. PRICE LIST (Если он не был загружен из data.ts)
       try {
           const res = await fetch(`${API_URL}/get_services`);
           if (res.ok) {
               const data = await res.json();
               setPriceList(data);
           }
       } catch(e) { console.log('PriceList fetch skipped, using local data'); }

    };

    fetchData();
  }, []);

  // Persist Local Bookings (Admin Panel)
  useEffect(() => localStorage.setItem('pbh_bookings', JSON.stringify(bookings)), [bookings]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveReviewToBackend = async (review: Review) => {
      try {
          // ИСПРАВЛЕНО: Указан правильный маршрут /save_review
          await fetch(`${API_URL}/save_review`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  author: review.name,
                  text: review.text,
                  rating: review.rating
              })
          });
      } catch (e) {
          console.error("Backend not available for review save:", e);
      }
  };

  const handleAddReview = (review: Review) => {
      setReviews([review, ...reviews]);
      saveReviewToBackend(review);
  };

  // Replaces custom modal with Dikidi Widget logic
  const handleOpenBookingModal = () => {
    // Check if Dikidi script is loaded and available
    if (window.dikidi && window.dikidi.open) {
      window.dikidi.open(DIKIDI_WIDGET_URL);
    } else {
      // Fallback: open in new tab
      window.open(DIKIDI_WIDGET_URL, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Montserrat'] selection:bg-purple-200 selection:text-purple-900 transition-colors duration-300">
      
      <Header 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        openBooking={handleOpenBookingModal}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main>
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} openBooking={handleOpenBookingModal} />}
        
        {/* Pass priceList to ServicesPage */}
        {currentPage === 'services' && <ServicesPage openBooking={handleOpenBookingModal} priceList={priceList} />}
        
        {currentPage === 'certificates' && <CertificatesPage openCertModal={() => setIsCertModalOpen(true)} />}

        {currentPage === 'schedule' && <SchedulePage />}
        
        {currentPage === 'reviews' && (
           <ReviewsPage 
             openBooking={handleOpenBookingModal} 
             reviews={reviews} 
             onAddReview={handleAddReview} 
           />
        )}
        
        {currentPage === 'gallery' && <GalleryPage items={galleryItems} />}
        {currentPage === 'contacts' && <ContactsPage />}
        
        {currentPage === 'blog' && (
           <BlogPage posts={blogPosts} onUpdatePosts={setBlogPosts} />
        )}
      </main>

      <Footer onNavigate={navigateTo} openPrivacy={() => setIsPrivacyOpen(true)} />

      <ChatWidget />
      
      {/* Modals */}
      <CertificateModal 
         isOpen={isCertModalOpen}
         onClose={() => setIsCertModalOpen(false)}
         priceList={priceList}
      />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};

export default App;