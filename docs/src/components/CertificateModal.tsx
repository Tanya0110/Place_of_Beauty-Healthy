import React, { useState } from 'react';
import { X, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../data';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceList: any;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, priceList }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', type: 'На сумму', date: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Пытаемся отправить данные боту
      const response = await fetch(`${API_URL}/save_certificate_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formData.name,
          client_phone: formData.phone,
          cert_type: formData.type,
          start_date: formData.date
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', phone: '', type: 'На сумму', date: '' });
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (e) {
      console.error("Ошибка отправки:", e);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 relative shadow-2xl border border-white/20">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-purple-600 transition-colors">
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
              <Gift size={32}/>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Заказ сертификата</h3>
            <p className="text-sm text-slate-500 mt-2">Администратор свяжется для оплаты</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8 text-green-600 animate-in zoom-in">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <p className="font-bold text-lg">Заявка отправлена!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input type="text" placeholder="Ваше Имя" required 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500 outline-none dark:text-white" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
              </div>
              <div>
                <input type="tel" placeholder="Телефон" required 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500 outline-none dark:text-white" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 ml-2 block mb-1">Тип сертификата</label>
                 <select 
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500 outline-none dark:text-white appearance-none" 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                 >
                    <option value="На сумму">💰 На сумму (от 1000₽)</option>
                    {priceList && Object.values(priceList).map((cat: any) => 
                        cat.items.map((item: any) => <option key={item.name} value={item.name}>{item.name}</option>)
                    )}
                 </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 ml-2 block mb-1">Дата вручения (начала действия)</label>
                <input type="date" required 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500 outline-none dark:text-white" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}/>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-50 p-2 rounded-lg">
                  <AlertCircle size={16} /> Ошибка связи с сервером. Попробуйте позже.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {status === 'loading' ? 'Отправка...' : 'Оформить заказ'}
              </button>
          </form>
        )}
      </div>
    </div>
  );
};