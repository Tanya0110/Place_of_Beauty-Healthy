import React, { useState } from 'react';
import { BlogPost, Comment } from '../types';
import { ChevronLeft, User, MessageCircle, Send, Calendar, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  posts: BlogPost[];
  onUpdatePosts: (posts: BlogPost[]) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, onUpdatePosts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: Date.now(),
      author: 'Гость',
      text: newComment,
      date: 'Сегодня'
    };

    const updatedPost = { ...selectedPost, comments: [...selectedPost.comments, comment] };
    setSelectedPost(updatedPost);
    const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    onUpdatePosts(updatedPosts);
    setNewComment('');
  };

  const formatContent = (text: string) => {
      return text.split('\n').map((line, i) => {
          if (line.trim().startsWith('# ')) return <h3 key={i} className="text-2xl font-bold text-slate-800 mt-6 mb-4">{line.replace('# ', '')}</h3>;
          if (line.trim().startsWith('### ')) return <h4 key={i} className="text-xl font-bold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h4>;
          if (line.trim().startsWith('**')) return <p key={i} className="mb-4 font-bold text-slate-900">{line.replace(/\*\*/g, '')}</p>;
          if (line.trim().startsWith('* ')) return <li key={i} className="ml-5 list-disc mb-2 text-slate-600">{line.replace('* ', '')}</li>;
          if (line.trim().match(/^\d\./)) return <li key={i} className="ml-5 list-decimal mb-2 text-slate-600">{line}</li>;
          if (line.trim() === '') return <br key={i}/>;
          return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{line}</p>;
      });
  };

  if (selectedPost) {
    return (
      <section className="pt-32 pb-20 container mx-auto px-6 max-w-4xl animate-in slide-in-from-right-5">
        <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-purple-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
          <ChevronLeft size={20} /> Назад к новостям
        </button>
        
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-50">
          
          {/* DISPLAY LOGIC: Original vs Cropped */}
          {selectedPost.isOriginal ? (
             // ORIGINAL MODE: Simple Image Tag, Natural Aspect Ratio
             <div className="w-full relative bg-slate-100">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-auto object-contain max-h-[80vh]" 
                />
                <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/50 to-transparent">
                    <span className="bg-purple-600 px-3 py-1 rounded-md text-white font-bold shadow-md text-sm">{selectedPost.tags[0] || 'News'}</span>
                </div>
                <div className="p-8 pb-4 bg-white">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900">{selectedPost.title}</h1>
                    <div className="flex items-center gap-4 text-sm mt-4 text-slate-400">
                       <span>{selectedPost.date}</span>
                    </div>
                </div>
             </div>
          ) : (
             // CROP MODE: Container with specific Aspect Ratio and Transform
             <div 
                className="w-full relative overflow-hidden bg-slate-100 group" 
                style={{ aspectRatio: `${selectedPost.aspectRatio || 1.77} / 1` }}
             >
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover transition-transform duration-700" 
                  style={{
                     transform: `scale(${selectedPost.imageScale || 1}) translate(${selectedPost.imageOffset?.x || 0}px, ${selectedPost.imageOffset?.y || 0}px) rotate(${selectedPost.imageRotation || 0}deg)`,
                     transformOrigin: 'center center'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white pointer-events-none w-full">
                    <div className="flex items-center gap-4 text-sm mb-2 opacity-90">
                        <span className="bg-purple-600 px-2 py-1 rounded-md text-white font-bold shadow-md">{selectedPost.tags[0] || 'News'}</span>
                        <span className="text-slate-100">{selectedPost.date}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-lg">{selectedPost.title}</h1>
                </div>
             </div>
          )}
          
          <div className="p-8 md:p-12 pt-4">
             <div className="flex items-center gap-2 mb-8 text-slate-400 text-sm border-b border-slate-100 pb-4">
                <User size={16} /> Автор: {selectedPost.author}
             </div>
             
             <div className="prose prose-purple max-w-none text-slate-700">
                {formatContent(selectedPost.content)}
             </div>

             <div className="mt-16 pt-8 border-t border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                   <MessageCircle className="text-purple-500" /> Комментарии ({selectedPost.comments.length})
                </h3>
                
                <div className="space-y-6 mb-10">
                   {selectedPost.comments.length > 0 ? selectedPost.comments.map(c => (
                     <div key={c.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-slate-800">{c.author}</span>
                           <span className="text-xs text-slate-400">{c.date}</span>
                        </div>
                        <p className="text-slate-600">{c.text}</p>
                     </div>
                   )) : (
                     <p className="text-slate-400 italic">Пока нет комментариев.</p>
                   )}
                </div>

                <form onSubmit={handleAddComment} className="relative">
                   <input 
                      type="text" 
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Написать комментарий..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-14 text-slate-800 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all placeholder:text-slate-400"
                   />
                   <button type="submit" className="absolute right-3 top-3 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-md">
                      <Send size={18} />
                   </button>
                </form>
             </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20 container mx-auto px-6 bg-slate-50">
      <div className="text-center mb-16 animate-in slide-in-from-bottom-5">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">БЛОГ & НОВОСТИ</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-fuchsia-400 mx-auto rounded-full shadow-lg"></div>
        <p className="text-slate-500 mt-6 max-w-2xl mx-auto">Советы экспертов и жизнь салона.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-purple-50 hover:border-purple-200 transition-all hover:-translate-y-2 group cursor-pointer flex flex-col h-full animate-in zoom-in-95 duration-500" onClick={() => setSelectedPost(post)}>
            
            <div 
                className="w-full relative overflow-hidden bg-slate-100" 
                style={{ aspectRatio: post.isOriginal ? '4/3' : `${post.aspectRatio || 1.77} / 1` }}
            >
               <img 
                 src={post.image} 
                 alt={post.title} 
                 className={`w-full h-full object-${post.isOriginal ? 'cover' : 'cover'}`} 
                 style={!post.isOriginal ? {
                     transform: `scale(${post.imageScale || 1}) translate(${post.imageOffset?.x || 0}px, ${post.imageOffset?.y || 0}px) rotate(${post.imageRotation || 0}deg)`,
                     transformOrigin: 'center center',
                     width: '100%', height: '100%'
                 } : { width: '100%', height: '100%' }}
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wider shadow-sm z-10">
                  {post.tags[0] || 'News'}
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
               <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar size={14} /> {post.date}
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">{post.title}</h3>
               <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
               <div className="flex items-center justify-between text-sm font-bold text-purple-600 border-t border-purple-50 pt-4">
                  <span>Читать далее</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};