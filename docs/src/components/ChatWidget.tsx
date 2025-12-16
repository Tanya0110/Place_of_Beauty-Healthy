import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Calendar, CheckCircle, GripHorizontal } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, BookingDetails } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Привет! Я Эми, ваш виртуальный администратор PLACE OF BEAUTY & HEALTHY. Хотите записаться или узнать цены? 🌿' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Refs to distinguish click vs drag
  const hasMoved = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to stop text selection, but allow input interaction inside if needed
    // e.preventDefault(); 
    
    if (containerRef.current) {
      setIsDragging(true);
      hasMoved.current = false; // Reset move flag

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      
      dragStartPos.current = { x: clientX, y: clientY };

      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // Prevent scrolling on touch
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        
        // Calculate distance moved
        const moveX = Math.abs(clientX - dragStartPos.current.x);
        const moveY = Math.abs(clientY - dragStartPos.current.y);

        // If moved more than 5 pixels, consider it a drag operation
        if (moveX > 5 || moveY > 5) {
            hasMoved.current = true;
        }
        
        // Boundaries
        const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
        const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);
        
        let newX = clientX - dragOffset.x;
        let newY = clientY - dragOffset.y;

        // Constraint to screen
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleToggle = () => {
    // If open, close immediately (ignore drag check as drag is disabled on the button when open)
    if (isOpen) {
      setIsOpen(false);
    } 
    // If closed, only open if we haven't dragged
    else if (!hasMoved.current) {
      setIsOpen(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages
      .filter(m => !m.isBookingRequest) 
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    const responseText = await sendMessageToGemini(history, userMsg.text);
    
    let finalMessage: ChatMessage;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.booking_ready && parsed.data) {
           finalMessage = {
             role: 'model',
             text: 'Отлично! Проверьте данные для записи:',
             isBookingRequest: true,
             bookingData: parsed.data
           };
        } else {
           finalMessage = { role: 'model', text: responseText };
        }
      } else {
        finalMessage = { role: 'model', text: responseText };
      }
    } catch (e) {
      finalMessage = { role: 'model', text: responseText };
    }

    setMessages(prev => [...prev, finalMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const confirmBooking = (data: BookingDetails) => {
    setMessages(prev => [
      ...prev,
      { role: 'model', text: `✨ Готово! Запись подтверждена.\n\n👤 ${data.name}\n📅 ${data.date} в ${data.time}\n💅 ${data.service}\n\nЖдем вас! ❤️` }
    ]);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div 
      ref={containerRef}
      style={position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : {}}
      className={`fixed z-50 flex flex-col items-end ${!position ? 'bottom-6 right-6' : ''}`}
    >
      
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-purple-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 mb-4">
          {/* Header */}
          <div 
             className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
             onMouseDown={handleMouseDown}
             onTouchStart={handleMouseDown}
          >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/50 shadow-sm pointer-events-none">
                 <Sparkles className="text-white w-5 h-5" />
               </div>
               <div className="pointer-events-none select-none">
                 <h3 className="font-bold text-white">Эми AI</h3>
                 <p className="text-xs text-purple-100">Виртуальный администратор</p>
               </div>
            </div>
            <GripHorizontal className="text-white/50" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-600 rounded-tl-none border border-purple-50'
                  }`}
                >
                  {msg.role === 'user' ? msg.text : formatText(msg.text)}
                </div>

                {msg.isBookingRequest && msg.bookingData && (
                   <div className="mt-3 bg-purple-50 border border-purple-100 rounded-2xl p-4 w-[85%] shadow-sm animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-2 mb-3 text-purple-700 font-bold">
                        <Calendar size={18} /> Подтверждение
                      </div>
                      <div className="space-y-2 text-sm text-slate-700 mb-4">
                        <div className="flex justify-between border-b border-purple-200 pb-1"><span>Услуга:</span> <span className="font-semibold">{msg.bookingData.service}</span></div>
                        <div className="flex justify-between border-b border-purple-200 pb-1"><span>Дата:</span> <span className="font-semibold">{msg.bookingData.date}</span></div>
                        <div className="flex justify-between border-b border-purple-200 pb-1"><span>Время:</span> <span className="font-semibold">{msg.bookingData.time}</span></div>
                        <div className="flex justify-between pb-1"><span>Имя:</span> <span className="font-semibold">{msg.bookingData.name}</span></div>
                      </div>
                      <button 
                        onClick={() => confirmBooking(msg.bookingData!)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                         <CheckCircle size={16} /> Записаться
                      </button>
                   </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-purple-50 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-purple-50 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-300 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onMouseDown={!isOpen ? handleMouseDown : undefined}
        onTouchStart={!isOpen ? handleMouseDown : undefined}
        onClick={handleToggle}
        className={`p-4 rounded-full shadow-[0_10px_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-white text-purple-600 rotate-90 border border-purple-100 self-end cursor-pointer' 
            : 'bg-purple-600 text-white hover:bg-purple-700 cursor-grab active:cursor-grabbing'
        }`}
        aria-label="Chat Assistant"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};