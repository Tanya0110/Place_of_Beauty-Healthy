
import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, Review, BookingDetails, Certificate, GalleryItem } from '../types';
import { Trash2, Plus, LogIn, Save, X, Edit2, Calendar, CheckCircle, XCircle, MessageSquare, Layout, Upload, Settings, Gift, Mail, Sparkles, Move, Maximize, RotateCw, Scaling, Square, RectangleVertical, Monitor, Image as ImageIcon, Star, Phone, Instagram, PenTool } from 'lucide-react';

interface AdminPanelProps {
  posts: BlogPost[];
  onUpdatePosts: (posts: BlogPost[]) => void;
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
  bookings: BookingDetails[];
  onUpdateBookings: (bookings: BookingDetails[]) => void;
  galleryItems: GalleryItem[];
  onUpdateGallery: (items: GalleryItem[]) => void;
  onLogout: () => void;
  priceList?: any; // Add priceList prop
}

type Tab = 'bookings' | 'blog' | 'certificates' | 'gallery' | 'reviews';

// --- CERTIFICATE CONFIG (SINGLE STYLE) ---
const CERT_STYLE = { 
    id: 1, 
    name: 'Titanium Grey', 
    type: 'paper',
    description: 'Единый фирменный стиль',
    bg: 'bg-[#d6d6d6]', 
    bgStyle: 'linear-gradient(135deg, #e3e3e3 0%, #cfcfcf 100%)',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  posts, onUpdatePosts, 
  reviews, onUpdateReviews, 
  bookings, onUpdateBookings, 
  galleryItems, onUpdateGallery,
  onLogout,
  priceList = {} // Default to empty object if not provided
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Auth State
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('pbh_admin_creds');
    return saved ? JSON.parse(saved) : { username: 'admin', password: 'admin' };
  });

  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [credsForm, setCredsForm] = useState({
     oldUsername: '', oldPassword: '',
     newUsername: '', newPassword: ''
  });

  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  
  // Blog State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', image: '', tags: [], author: 'Администратор', imageScale: 1, imageOffset: { x: 0, y: 0 }, imageRotation: 0, aspectRatio: 1.77, isOriginal: true
  });
  
  // Blog Image Editor State
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Booking State
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newBooking, setNewBooking] = useState<Partial<BookingDetails>>({
     name: '', phone: '', service: '', date: '', time: '', status: 'confirmed'
  });

  // Gallery State
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({ 
      src: '', 
      category: 'Массаж',
      imageScale: 1,
      imageOffset: { x: 0, y: 0 },
      aspectRatio: 'square'
  });
  
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [dragStartGallery, setDragStartGallery] = useState({ x: 0, y: 0 });

  // Certificate State
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('pbh_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [certForm, setCertForm] = useState({
    recipientName: '',
    phone: '',
    email: '',
    service: 'Сертификат на сумму 5000₽',
    startDate: new Date().toISOString().split('T')[0],
    isManualInput: false // Новое состояние для переключения режима ввода
  });

  useEffect(() => {
    localStorage.setItem('pbh_certificates', JSON.stringify(certificates));
  }, [certificates]);


  // --- AUTH ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.username === adminCredentials.username && loginInput.password === adminCredentials.password) {
       setIsAuthenticated(true);
    } else {
       alert('Неверный логин или пароль');
    }
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (credsForm.oldUsername !== adminCredentials.username || credsForm.oldPassword !== adminCredentials.password) {
       alert('Старые данные введены неверно!');
       return;
    }
    if (!credsForm.newUsername || !credsForm.newPassword) {
       alert('Новый логин и пароль не могут быть пустыми');
       return;
    }
    const newCreds = { username: credsForm.newUsername, password: credsForm.newPassword };
    setAdminCredentials(newCreds);
    localStorage.setItem('pbh_admin_creds', JSON.stringify(newCreds));
    alert('Данные для входа успешно изменены!');
    setIsSettingsOpen(false);
    setCredsForm({ oldUsername: '', oldPassword: '', newUsername: '', newPassword: '' });
  };

  // --- CERTIFICATE ACTIONS ---
  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.email || !certForm.recipientName || !certForm.phone) {
      alert('Заполните Имя, Телефон и Email!');
      return;
    }
    const start = new Date(certForm.startDate);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + 6);

    const newCert: Certificate = {
      id: Math.random().toString(36).substr(2, 9),
      recipientName: certForm.recipientName,
      phone: certForm.phone,
      email: certForm.email,
      service: certForm.service,
      startDate: start.toLocaleDateString('ru-RU'),
      issueDate: new Date().toLocaleDateString('ru-RU'),
      issueTime: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
      expiryDate: expiry.toLocaleDateString('ru-RU'),
      code: `PBH-${Math.floor(1000 + Math.random() * 9000)}`,
      styleId: CERT_STYLE.id
    };
    setCertificates([newCert, ...certificates]);
    alert(`Сертификат успешно создан!\n\nИмя: ${newCert.recipientName}\nОтправлено на: ${certForm.email}\nКод: ${newCert.code}`);
    setCertForm(prev => ({ ...prev, recipientName: '', phone: '', email: '' }));
  };

  const handleDeleteCertificate = (id: string) => {
    if(confirm('Аннулировать сертификат?')) {
      setCertificates(certificates.filter(c => c.id !== id));
    }
  };

  // --- GALLERY ACTIONS ---
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryForm(prev => ({ ...prev, src: reader.result as string, imageScale: 1, imageOffset: { x: 0, y: 0 } }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); setIsDraggingGallery(true);
    setDragStartGallery({ x: e.clientX - (galleryForm.imageOffset?.x || 0), y: e.clientY - (galleryForm.imageOffset?.y || 0) });
  };
  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingGallery) return;
    e.preventDefault();
    setGalleryForm(prev => ({ ...prev, imageOffset: { x: e.clientX - dragStartGallery.x, y: e.clientY - dragStartGallery.y } }));
  };
  const handleGalleryMouseUp = () => setIsDraggingGallery(false);
  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.src) return;
    const newItem: GalleryItem = {
      id: Date.now(),
      src: galleryForm.src,
      category: galleryForm.category || 'Массаж',
      imageScale: galleryForm.imageScale,
      imageOffset: galleryForm.imageOffset,
      aspectRatio: galleryForm.aspectRatio
    };
    onUpdateGallery([newItem, ...galleryItems]);
    setGalleryForm({ src: '', category: galleryForm.category, imageScale: 1, imageOffset: { x: 0, y: 0 }, aspectRatio: 'square' }); 
  };
  const handleDeleteGalleryItem = (id: number) => {
    if (confirm('Удалить фото из портфолио?')) {
      onUpdateGallery(galleryItems.filter(i => i.id !== id));
    }
  };

  // --- BLOG ACTIONS & IMAGE EDITOR ---
  const handleEditClick = (post: BlogPost) => {
    setPostForm(post);
    setEditingPostId(post.id);
    setIsEditingPost(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm(prev => ({ 
            ...prev, 
            image: reader.result as string,
            imageScale: 1,
            imageOffset: { x: 0, y: 0 },
            imageRotation: 0,
            isOriginal: true, // Default to full original view
            aspectRatio: 1.77 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // === EDITOR INTERACTION LOGIC ===
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
    setDragStart({ 
        x: e.clientX - (postForm.imageOffset?.x || 0), 
        y: e.clientY - (postForm.imageOffset?.y || 0) 
    });
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (isDraggingImage) {
        e.preventDefault();
        setPostForm(prev => ({ 
            ...prev, 
            imageOffset: { 
                x: e.clientX - dragStart.x, 
                y: e.clientY - dragStart.y 
            } 
        }));
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return;

    const savedPost = {
        ...postForm,
        id: editingPostId || Date.now(),
        date: postForm.date || new Date().toLocaleDateString('ru-RU'),
        author: postForm.author || 'Админ',
        likes: postForm.likes || 0,
        comments: postForm.comments || [],
        tags: postForm.tags || [],
        image: postForm.image || '/images/3.jpg'
    } as BlogPost;

    if (editingPostId) {
       onUpdatePosts(posts.map(p => p.id === editingPostId ? savedPost : p));
    } else {
       onUpdatePosts([savedPost, ...posts]);
    }
    setIsEditingPost(false);
    setEditingPostId(null);
    setPostForm({ title: '', excerpt: '', content: '', image: '', tags: [], author: 'Администратор', imageScale: 1, imageOffset: { x: 0, y: 0 }, imageRotation: 0, aspectRatio: 1.77, isOriginal: true });
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Удалить этот пост?')) onUpdatePosts(posts.filter(p => p.id !== id));
  };
  
  const updateBookingStatus = (id: number, status: 'confirmed' | 'cancelled' | 'pending') => onUpdateBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  const handleDeleteBooking = (id: number) => { if (confirm('Удалить?')) onUpdateBookings(bookings.filter(b => b.id !== id)); };
  const handleCreateBooking = (e: React.FormEvent) => { 
    e.preventDefault(); 
    const serviceName = newBooking.service || 'Консультация';
    onUpdateBookings([...bookings, { ...newBooking, service: serviceName, id: Date.now(), created_at: new Date().toISOString() } as BookingDetails]); 
    setIsAddingBooking(false); 
  };
  const handleDeleteReview = (id: number) => { if (confirm('Удалить?')) onUpdateReviews(reviews.filter(r => r.id !== id)); };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-purple-100 dark:border-slate-800">
           <div className="flex justify-center mb-6">
             <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200"><LogIn size={32}/></div>
           </div>
           <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Вход в CRM</h2>
           <p className="text-center text-slate-400 mb-8">Введите данные администратора</p>
           <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Логин" value={loginInput.username} onChange={e => setLoginInput({...loginInput, username: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
              <input type="password" placeholder="Пароль" value={loginInput.password} onChange={e => setLoginInput({...loginInput, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-200 dark:shadow-none">Войти</button>
           </form>
           <button onClick={onLogout} className="w-full mt-4 text-slate-400 hover:text-slate-600 text-sm">Вернуться на сайт</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-6 transition-colors duration-300"
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
    >
      <div className="container mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white"><Layout size={20}/></div>
             CRM Панель
          </h1>
          <div className="flex gap-2">
             <button onClick={() => setIsSettingsOpen(true)} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 p-2 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Settings size={20} /></button>
             <button onClick={onLogout} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700">Выйти</button>
          </div>
        </div>

        {/* SETTINGS MODAL */}
        {isSettingsOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-sm w-full">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">Смена пароля</h3>
                  <div className="space-y-3">
                      <input placeholder="Старый логин" className="w-full p-2 border rounded" value={credsForm.oldUsername} onChange={e=>setCredsForm({...credsForm, oldUsername: e.target.value})} />
                      <input placeholder="Старый пароль" className="w-full p-2 border rounded" type="password" value={credsForm.oldPassword} onChange={e=>setCredsForm({...credsForm, oldPassword: e.target.value})} />
                      <div className="h-px bg-slate-200 my-2"></div>
                      <input placeholder="Новый логин" className="w-full p-2 border rounded" value={credsForm.newUsername} onChange={e=>setCredsForm({...credsForm, newUsername: e.target.value})} />
                      <input placeholder="Новый пароль" className="w-full p-2 border rounded" type="password" value={credsForm.newPassword} onChange={e=>setCredsForm({...credsForm, newPassword: e.target.value})} />
                  </div>
                  <div className="flex gap-2 mt-4">
                      <button onClick={handleChangeCredentials} className="flex-1 bg-purple-600 text-white p-2 rounded font-bold">Сохранить</button>
                      <button onClick={()=>setIsSettingsOpen(false)} className="p-2 text-slate-500">Отмена</button>
                  </div>
              </div>
           </div>
        )}

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
           <button onClick={() => setActiveTab('bookings')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'bookings' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><Calendar size={18} /> Записи</button>
           <button onClick={() => setActiveTab('blog')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'blog' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><Edit2 size={18} /> Блог</button>
           <button onClick={() => setActiveTab('certificates')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'certificates' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><Gift size={18} /> Сертификаты</button>
           <button onClick={() => setActiveTab('gallery')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'gallery' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><ImageIcon size={18} /> Портфолио</button>
           <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><MessageSquare size={18} /> Отзывы</button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-purple-50 dark:border-slate-800 p-6 md:p-8 min-h-[500px]">
           
           {/* === BOOKINGS TAB === */}
           {activeTab === 'bookings' && (
              <div className="animate-in fade-in duration-500">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Управление записями</h2>
                    <button onClick={() => setIsAddingBooking(!isAddingBooking)} className="bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2">{isAddingBooking ? <X size={18}/> : <Plus size={18}/>} Добавить</button>
                 </div>
                 {isAddingBooking && (
                    <form onSubmit={handleCreateBooking} className="mb-8 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-purple-100 dark:border-slate-700">
                       <div className="grid md:grid-cols-5 gap-4">
                          <input required placeholder="Имя" value={newBooking.name} onChange={e => setNewBooking({...newBooking, name: e.target.value})} className="p-2 rounded border dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                          <input required placeholder="Телефон" value={newBooking.phone} onChange={e => setNewBooking({...newBooking, phone: e.target.value})} className="p-2 rounded border dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                          <select required value={newBooking.service} onChange={e => setNewBooking({...newBooking, service: e.target.value})} className="p-2 rounded border dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                             <option value="">Выберите услугу</option>
                             {Object.values(priceList).map((category: any, idx: number) => (
                                <optgroup key={idx} label={category.title}>
                                  {category.items.map((item: any) => (
                                    <option key={item.name} value={item.name}>
                                      {item.name}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                          </select>
                          <input required type="date" value={newBooking.date} onChange={e => setNewBooking({...newBooking, date: e.target.value})} className="p-2 rounded border dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                          <input required type="time" value={newBooking.time} onChange={e => setNewBooking({...newBooking, time: e.target.value})} className="p-2 rounded border dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                       </div>
                       <button type="submit" className="mt-4 bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 transition-colors">Сохранить</button>
                    </form>
                 )}
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead><tr className="text-slate-400 text-sm uppercase"><th className="pb-4">Дата</th><th className="pb-4">Клиент</th><th className="pb-4">Услуга</th><th className="pb-4">Статус</th><th className="pb-4"></th></tr></thead>
                       <tbody>
                          {bookings.map(b => (
                             <tr key={b.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-4 font-bold dark:text-white">{b.date} {b.time}</td>
                                <td className="py-4 dark:text-white">{b.name}<br/><span className="text-xs text-slate-400">{b.phone}</span></td>
                                <td className="py-4 dark:text-white">{b.service}</td>
                                <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${b.status==='confirmed'?'bg-green-100 text-green-700':b.status==='cancelled'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td>
                                <td className="py-4 text-right">
                                   <div className="flex gap-2 justify-end">
                                      {b.status === 'pending' && <><button onClick={()=>updateBookingStatus(b.id,'confirmed')} title="Подтвердить"><CheckCircle className="text-green-500 hover:scale-110 transition-transform" size={20}/></button><button onClick={()=>updateBookingStatus(b.id,'cancelled')} title="Отменить"><XCircle className="text-red-500 hover:scale-110 transition-transform" size={20}/></button></>}
                                      <button onClick={()=>handleDeleteBooking(b.id)} title="Удалить"><Trash2 className="text-slate-300 hover:text-red-500 hover:scale-110 transition-transform" size={20}/></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* === BLOG TAB === */}
           {activeTab === 'blog' && (
              <div className="animate-in fade-in duration-500">
                 {!isEditingPost ? (
                    <>
                       <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Статьи блога</h2>
                          <button onClick={() => { setPostForm({ imageScale: 1, imageOffset: { x: 0, y: 0 }, imageRotation: 0, aspectRatio: 1.77, isOriginal: true }); setEditingPostId(null); setIsEditingPost(true); }} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2">
                             <Plus size={18}/> Добавить
                          </button>
                       </div>
                       <div className="space-y-4">
                          {posts.map(post => (
                             <div key={post.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                   <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden">
                                       <img src={post.image} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                     <h4 className="font-bold text-slate-800 dark:text-slate-200">{post.title}</h4>
                                     <span className="text-xs text-slate-400">{post.date}</span>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button onClick={() => handleEditClick(post)} className="p-2 text-slate-400 hover:text-purple-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm"><Edit2 size={18}/></button>
                                   <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm"><Trash2 size={18}/></button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </>
                 ) : (
                    <div className="animate-in slide-in-from-right-5">
                       <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{editingPostId ? 'Редактирование' : 'Новый пост'}</h2>
                          <button onClick={() => setIsEditingPost(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X/></button>
                       </div>
                       
                       <div className="grid lg:grid-cols-2 gap-8 items-start">
                           {/* LEFT COL: FORM INPUTS */}
                           <form onSubmit={handleSavePost} className="space-y-4">
                              <input placeholder="Заголовок" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:border-purple-500" required />
                              
                              <div className="flex gap-2">
                                  <input placeholder="URL картинки" value={postForm.image} onChange={e => setPostForm({...postForm, image: e.target.value})} className="flex-1 px-4 py-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:border-purple-500" />
                                  <label className="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-slate-800 text-purple-600 rounded-xl border border-purple-100 dark:border-slate-700 cursor-pointer hover:bg-purple-100 transition-colors">
                                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                      <Upload size={20} />
                                  </label>
                              </div>

                              <textarea placeholder="Текст статьи (Markdown поддерживается)..." value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white h-64 focus:outline-none focus:border-purple-500" required />
                              
                              <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2 shadow-lg transition-colors">
                                 <Save size={20}/> Сохранить
                              </button>
                           </form>
                           
                           {/* RIGHT COL: VISUAL EDITOR */}
                           <div className="sticky top-24">
                              <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Move size={18} className="text-purple-600"/> Редактор фото</h3>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={postForm.isOriginal} 
                                        onChange={e => setPostForm({...postForm, isOriginal: e.target.checked})}
                                        className="w-5 h-5 accent-purple-600 rounded focus:ring-purple-500"
                                    />
                                    Оригинал
                                </label>
                              </div>
                              
                              {postForm.isOriginal ? (
                                  <div className="bg-neutral-900 p-6 rounded-[2rem] shadow-2xl flex items-center justify-center min-h-[400px]">
                                      {postForm.image ? (
                                        <div className="relative">
                                            <img src={postForm.image} className="max-w-full max-h-[400px] rounded-lg shadow-lg object-contain" alt="Original Preview" />
                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Предпросмотр</div>
                                        </div>
                                      ) : (
                                        <div className="text-white/50 flex flex-col items-center"><Upload size={48} className="mb-2 opacity-50"/>Нет изображения</div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="bg-neutral-900 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                                      {/* Toolbar: Aspect Ratio Presets */}
                                      <div className="flex justify-between items-center mb-6 px-2">
                                          <button type="button" onClick={() => setPostForm(prev => ({...prev, imageScale: 1, imageOffset: {x:0, y:0}, imageRotation: 0, aspectRatio: 1.77}))} className="text-neutral-400 hover:text-white text-xs uppercase tracking-wider font-bold">Сброс</button>
                                          <div className="flex gap-4">
                                              <button type="button" onClick={() => setPostForm({...postForm, aspectRatio: 1})} className={`text-neutral-400 hover:text-white transition-colors ${postForm.aspectRatio === 1 ? 'text-amber-400' : ''}`} title="1:1"><Square size={18} /></button>
                                              <button type="button" onClick={() => setPostForm({...postForm, aspectRatio: 0.75})} className={`text-neutral-400 hover:text-white transition-colors ${postForm.aspectRatio === 0.75 ? 'text-amber-400' : ''}`} title="3:4"><RectangleVertical size={18} /></button>
                                              <button type="button" onClick={() => setPostForm({...postForm, aspectRatio: 1.77})} className={`text-neutral-400 hover:text-white transition-colors ${postForm.aspectRatio === 1.77 ? 'text-amber-400' : ''}`} title="16:9"><Monitor size={18} /></button>
                                          </div>
                                      </div>

                                      {/* Viewport for Fixed Frame Crop */}
                                      <div className="relative w-full h-[450px] bg-neutral-950 rounded-xl overflow-hidden shadow-inner border border-neutral-800 mb-6 flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
                                           onMouseDown={handleImageMouseDown}>
                                          
                                          {/* The Image (Draggable) */}
                                          {postForm.image ? (
                                              <img 
                                                src={postForm.image} 
                                                className="absolute max-w-none pointer-events-none select-none"
                                                draggable={false}
                                                style={{
                                                    transform: `translate(${postForm.imageOffset?.x || 0}px, ${postForm.imageOffset?.y || 0}px) scale(${postForm.imageScale || 1}) rotate(${postForm.imageRotation || 0}deg)`,
                                                    transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
                                                }}
                                              />
                                          ) : (
                                            <div className="text-neutral-600 text-sm">Нет изображения</div>
                                          )}

                                          {/* Fixed Center Frame Overlay */}
                                          <div 
                                            className="relative border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 pointer-events-none"
                                            style={{ 
                                                height: '70%', 
                                                aspectRatio: `${postForm.aspectRatio || 1.77} / 1`,
                                            }}
                                          >
                                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                                                  {[...Array(9)].map((_, i) => <div key={i} className="border border-white/50"></div>)}
                                              </div>
                                          </div>
                                      </div>

                                      {/* Controls */}
                                      <div className="space-y-6">
                                          <div className="flex items-center gap-4">
                                              <RotateCw size={16} className="text-neutral-400" />
                                              <input type="range" min="-45" max="45" step="1" value={postForm.imageRotation || 0} onChange={(e) => setPostForm({...postForm, imageRotation: parseFloat(e.target.value)})} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"/>
                                              <span className="text-[10px] text-neutral-500 font-mono w-8 text-right">{postForm.imageRotation}°</span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                              <Maximize size={16} className="text-neutral-400" />
                                              <input type="range" min="0.5" max="3" step="0.1" value={postForm.imageScale || 1} onChange={(e) => setPostForm({...postForm, imageScale: parseFloat(e.target.value)})} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"/>
                                              <span className="text-[10px] text-neutral-500 font-mono w-8 text-right">{(postForm.imageScale || 1).toFixed(1)}x</span>
                                          </div>
                                      </div>
                                  </div>
                              )}
                           </div>
                       </div>
                    </div>
                 )}
              </div>
           )}

           {/* === CERTIFICATES TAB === */}
           {activeTab === 'certificates' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Сертификаты</h2>
                <div className="grid xl:grid-cols-2 gap-10 items-start">
                   {/* Generator Form */}
                   <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-purple-100 dark:border-slate-700">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg"><Sparkles className="text-purple-500"/> Данные сертификата</h3>
                      <form onSubmit={handleCreateCertificate} className="space-y-6">
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block pl-2">Имя получателя</label>
                                <input placeholder="Мария" value={certForm.recipientName} onChange={e=>setCertForm({...certForm, recipientName: e.target.value})} className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white focus:outline-none focus:border-purple-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block pl-2">Телефон</label>
                                <input placeholder="+7 999 000 00 00" value={certForm.phone} onChange={e=>setCertForm({...certForm, phone: e.target.value})} className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white focus:outline-none focus:border-purple-500 transition-all" />
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block pl-2">Email получателя</label>
                            <input placeholder="client@example.com" type="email" value={certForm.email} onChange={e=>setCertForm({...certForm, email: e.target.value})} className="w-full p-4 rounded-2xl border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white focus:outline-none focus:border-purple-500 transition-all" />
                         </div>
                         
                         <div>
                            <div className="flex justify-between items-center mb-1 pl-2 pr-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Услуга или Номинал</label>
                                <button 
                                  type="button" 
                                  onClick={() => setCertForm(prev => ({...prev, isManualInput: !prev.isManualInput, service: ''}))}
                                  className="text-xs font-bold text-purple-500 flex items-center gap-1 hover:text-purple-600"
                                >
                                    {certForm.isManualInput ? <><Layout size={12}/> Выбрать из списка</> : <><PenTool size={12}/> Ввести вручную</>}
                                </button>
                            </div>

                            {certForm.isManualInput ? (
                                <input 
                                    placeholder="Например: Курс массажа в подарок" 
                                    value={certForm.service} 
                                    onChange={e=>setCertForm({...certForm, service: e.target.value})} 
                                    className="w-full p-4 rounded-2xl border bg-white dark:bg-slate-700 border-purple-300 dark:border-purple-500 dark:text-white focus:outline-none focus:border-purple-500 transition-all ring-2 ring-purple-100 dark:ring-purple-900/30" 
                                />
                            ) : (
                                <select 
                                    value={certForm.service} 
                                    onChange={e=>setCertForm({...certForm, service: e.target.value})} 
                                    className="w-full p-4 rounded-2xl border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                                >
                                    <option value="Сертификат на сумму 1000₽">Сертификат на сумму 1000₽</option>
                                    <option value="Сертификат на сумму 2000₽">Сертификат на сумму 2000₽</option>
                                    <option value="Сертификат на сумму 3000₽">Сертификат на сумму 3000₽</option>
                                    <option value="Сертификат на сумму 5000₽">Сертификат на сумму 5000₽</option>
                                    <option value="Сертификат на сумму 10000₽">Сертификат на сумму 10000₽</option>
                                    <optgroup label="Услуги прайс-листа">
                                        {Object.values(priceList).flatMap((cat: any) => cat.items).map((item: any, i) => (
                                            <option key={i} value={item.name}>{item.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            )}
                         </div>

                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block pl-2">Дата начала действия</label>
                            <input type="date" value={certForm.startDate} onChange={e=>setCertForm({...certForm, startDate: e.target.value})} className="w-full p-4 rounded-2xl border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white focus:outline-none focus:border-purple-500 transition-all" />
                         </div>

                         <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-200 dark:shadow-purple-900/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                            <Mail size={20} /> Создать и Отправить
                         </button>
                      </form>
                   </div>
                   
                   {/* Preview Card */}
                   <div className="flex flex-col gap-8">
                       <div>
                           <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                Предпросмотр
                                <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                   Titanium Paper Style
                                </span>
                           </h3>
                           
                           {/* === NEW GREY STYLE LAYOUT === */}
                           <div 
                             className={`w-full aspect-[1.6/1] rounded-2xl shadow-2xl relative overflow-hidden flex ${CERT_STYLE.bg}`}
                             style={{ background: CERT_STYLE.bgStyle }}
                           >
                              {/* Main Content (Left) */}
                              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative">
                                  {/* Logo Area */}
                                  <div className="flex flex-col items-start text-zinc-800">
                                     <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 border border-zinc-600 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
                                        </div>
                                        <span className="text-[10px] tracking-widest uppercase font-bold">Place of Beauty & Healthy</span>
                                     </div>
                                     <div className="h-px w-full bg-zinc-400/50 mt-1"></div>
                                  </div>
                                  
                                  {/* Body Text */}
                                  <div className="my-2">
                                     <p className="text-xs text-zinc-600 leading-relaxed mb-4 max-w-[90%]">
                                        В ваших руках уникальный подарок — подарочный сертификат в салон красоты <br/>
                                        <span className="font-bold text-zinc-800">PLACE OF BEAUTY&HEALTHY</span>
                                     </p>
                                     
                                     <div className="space-y-3 mt-4">
                                        <div className="flex items-end gap-2 text-sm text-zinc-800">
                                           <span className="font-bold whitespace-nowrap">На:</span>
                                           <div className="flex-1 border-b border-zinc-800 text-center font-medium pb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                              {certForm.service.replace('Сертификат на сумму ', '') || '_________________'}
                                           </div>
                                        </div>
                                        <div className="flex items-end gap-2 text-sm text-zinc-800 w-full">
                                           <span className="font-bold whitespace-nowrap">Дата выдачи:</span>
                                           <div className="flex-1 border-b border-zinc-800 text-center font-medium pb-0.5">
                                              {new Date(certForm.startDate).toLocaleDateString('ru-RU')}
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  
                                  {/* Footer */}
                                  <div className="mt-2 pt-2 border-t border-zinc-400/30 flex justify-between items-end text-[9px] text-zinc-500 uppercase tracking-wide">
                                      <div>
                                          <p>сертификат действует в течение 6 месяцев</p>
                                      </div>
                                      <div className="text-right font-bold text-zinc-700 flex flex-col gap-0.5">
                                          <span className="flex items-center gap-1 justify-end"><Phone size={8}/> +7(993)-628-77-99</span>
                                          <span className="flex items-center gap-1 justify-end"><Instagram size={8}/> placeof.bh</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Vertical Strip (Right) */}
                              <div className="w-16 md:w-20 border-l border-zinc-400/30 flex items-center justify-center bg-zinc-200/30">
                                  <span className="text-xl md:text-2xl font-serif tracking-[0.2em] text-zinc-800 opacity-80" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>СЕРТИФИКАТ</span>
                              </div>
                           </div>
                       </div>
                   </div>
                </div>
              </div>
           )}

           {/* === GALLERY TAB === */}
           {activeTab === 'gallery' && (
              <div className="animate-in fade-in duration-500">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Портфолио</h2>
                    <label className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2 cursor-pointer shadow-lg">
                       <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                       <Upload size={18}/> Загрузить
                    </label>
                 </div>

                 {/* UPLOAD FORM */}
                 {galleryForm.src && (
                    <div className="mb-12 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-purple-100 dark:border-slate-700 animate-in slide-in-from-top-5">
                       <h3 className="font-bold mb-4 dark:text-white">Настройка фото</h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div 
                             className="relative w-full h-[300px] bg-neutral-900 rounded-xl overflow-hidden cursor-move"
                             onMouseDown={handleGalleryMouseDown}
                          >
                             <img 
                               src={galleryForm.src} 
                               className="absolute max-w-none pointer-events-none select-none"
                               style={{
                                  transform: `translate(${galleryForm.imageOffset?.x || 0}px, ${galleryForm.imageOffset?.y || 0}px) scale(${galleryForm.imageScale || 1})`,
                                  width: '100%', height: '100%', objectFit: 'cover'
                               }}
                             />
                          </div>
                          <div className="space-y-4">
                             <select className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})}>
                                {['Массаж', 'Брови', 'Ресницы', 'Интерьер'].map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                             <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Масштаб</label>
                                <input type="range" min="1" max="3" step="0.1" value={galleryForm.imageScale} onChange={e => setGalleryForm({...galleryForm, imageScale: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"/>
                             </div>
                             <div className="flex gap-2 mt-4">
                                <button onClick={handleAddGalleryItem} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">Добавить</button>
                                <button onClick={() => setGalleryForm({ src: '', category: 'Массаж', imageScale: 1, imageOffset: { x: 0, y: 0 }, aspectRatio: 'square' })} className="px-6 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300">Отмена</button>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryItems.map(item => (
                       <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square">
                          <img src={item.src} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button onClick={() => handleDeleteGalleryItem(item.id)} className="bg-white text-red-500 p-2 rounded-full hover:scale-110 transition-transform"><Trash2 size={20}/></button>
                          </div>
                          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{item.category}</span>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* === REVIEWS TAB === */}
           {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-500">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Отзывы клиентов</h2>
                 <div className="space-y-4">
                    {reviews.map(review => (
                       <div key={review.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-start">
                          <div>
                             <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-slate-800 dark:text-white">{review.name}</span>
                                <div className="flex text-yellow-400">
                                   {[...Array(review.rating)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}
                                </div>
                                <span className="text-xs text-slate-400 ml-2">{review.date}</span>
                             </div>
                             <p className="text-slate-600 dark:text-slate-300 text-sm">{review.text}</p>
                          </div>
                          <button onClick={() => handleDeleteReview(review.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};
