
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBooking: (booking: Omit<BookingDetails, 'id' | 'status' | 'created_at'>) => void;
  priceList: any; // Dynamic price list structure
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onAddBooking, priceList }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) return;

    const time = formData.time || '12:00'; 
    const serviceName = formData.service || 'Консультация';
    
    onAddBooking({
       name: formData.name,
       phone: formData.phone,
       service: serviceName,
       date: formData.date,
       time: time
    });

    setStep(2);
  };

  const handleClose = () => {
     setStep(1);
     setFormData({ name: '', phone: '', service: '', date: '', time: '' });
     onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 transform transition-all scale-100 border border-purple-50">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-purple-600 transition-colors bg-slate-50 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-1 text-slate-800 leading-tight">
              Запись в <span className="text-purple-600 neon-text block text-lg md:text-xl mt-1">PLACE OF BEAUTY & HEALTHY</span>
            </h2>
            <p className="text-center text-slate-500 text-sm mb-6 mt-2">Оставьте заявку, и мы свяжемся с вами</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Ваше имя</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                  placeholder="Мария Иванова"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Телефон</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                  placeholder="+7 (999) 000-00-00"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Услуга</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                >
                  <option value="">Выберите процедуру</option>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Дата</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Время</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    >
                      <option value="">Выбрать</option>
                      <option value="10:00">10:00</option>
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="16:00">16:00</option>
                      <option value="18:00">18:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                 </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_10px_20px_rgba(168,85,247,0.3)] transition-all transform hover:-translate-y-0.5"
              >
                Отправить заявку
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Заявка принята!</h3>
            <p className="text-slate-500 mb-8">
              Администратор свяжется с вами в ближайшее время для подтверждения.
            </p>
            <button
              onClick={handleClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-xl transition-colors w-full"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
