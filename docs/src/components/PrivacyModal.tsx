import React from 'react';
import { X, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-0 flex flex-col max-h-[80vh] border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
               <FileText size={20} />
             </div>
             <h2 className="text-xl font-bold text-slate-800">Политика конфиденциальности</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-purple-600 transition-colors bg-slate-50 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <p className="text-slate-400 text-sm mb-6">Редакция от 12 октября 2025 года</p>

          <div className="prose prose-purple prose-sm max-w-none text-slate-600">
            <p className="mb-4">Настоящая Политика конфиденциальности (далее – «Политика») регулирует порядок обработки и защиты персональной информации, которую <strong>PLACE OF BEAUTY & HEALTHY</strong> (далее – «Салон») может получить о Пользователе во время использования им сайта.</p>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. Общие положения</h3>
            <p className="mb-2">1.1. Использование Пользователем Сайта означает согласие с настоящей Политикой и условиями обработки его персональной информации.</p>
            <p>1.2. В случае несогласия с условиями Политики Пользователь должен воздержаться от использования Сайта.</p>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. Предмет Политики</h3>
            <p className="mb-2">2.1. В рамках настоящей Политики персональная информация Пользователя включает данные, которые Пользователь предоставляет о себе при записи на услуги (через внешние сервисы) или через формы обратной связи: имя, телефонный номер и иные данные, необходимые для оказания услуг.</p>
            <p>2.2. Салон также собирает обезличенные данные (IP-адрес, тип браузера, время доступа и т.п.) с помощью сервисов веб-аналитики для улучшения работы Сайта.</p>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Цели сбора персональной информации</h3>
            <p className="mb-2">3.1. Персональную информацию Салон может использовать в целях:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Осуществления связи с Пользователем, в том числе направления уведомлений о записи.</li>
                <li>Оказания услуг, на которые записался Пользователь.</li>
                <li>Улучшения качества услуг, удобства их использования.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">4. Условия обработки персональной информации</h3>
            <p className="mb-2">4.1. Обработка персональной информации Пользователя осуществляется без ограничения срока любым законным способом.</p>
            <p>4.2. Салон не передает персональную информацию Пользователя третьим лицам, за исключением случаев, предусмотренных законодательством РФ или при согласии Пользователя.</p>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">5. Защита информации</h3>
            <p>5.1. Салон принимает необходимые организационные и технические меры для защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end">
           <button 
             onClick={onClose}
             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-purple-200"
           >
             Понятно
           </button>
        </div>
      </div>
    </div>
  );
};