import React, { useState, useMemo } from 'react';
import { Search, Sword, Shield, Zap, Play, X } from 'lucide-react';

<AdBanner 
  type="adsense" 
  slot="8888888888"  // 填入步驟四取得的 slot ID
/>

// 🟢 從剛剛建立的 data.js 匯入資料
import { INITIAL_DATA, CATEGORIES } from './data';

export default function ArenaHub() {
  const [posts] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedCard, setSelectedCard] = useState(null);

  // 🛠️ 影片嵌入網址轉換邏輯
  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      // 1. Facebook
      if (url.includes('facebook.com') || url.includes('fb.watch')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&t=0&autoplay=1&muted=1`;
      }

      // 2. YouTube (新增 Shorts 支援)
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('/embed/')) {
          videoId = url.split('/embed/')[1].split('?')[0];
        } else if (url.includes('/shorts/')) { 
          videoId = url.split('/shorts/')[1].split('?')[0];
        } else if (url.includes('v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      }

      // 3. Instagram
      if (url.includes('instagram.com')) {
        const match = url.match(/\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://www.instagram.com/p/${match[1]}/embed/captioned/`;
        }
        return null; 
      }

      // 4. Threads
      if (url.includes('threads.net')) {
        const cleanUrl = url.split('?')[0];
        const baseUrl = cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
        return `${baseUrl}/embed`;
      }
    } catch (error) {
      console.error("URL 解析失敗:", error);
      return null;
    }

    return null; 
  };

  const filteredData = useMemo(() => {
    return posts.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.champion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = 
        selectedCategory === "全部" || 
        item.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, posts]);

  // 判斷是否為 YouTube 影片
  const isYouTube = selectedCard?.videoUrl?.includes('youtube.com') || selectedCard?.videoUrl?.includes('youtu.be');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 pb-20">
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center transform rotate-3">
                <Sword className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 hidden sm:block">
                隨機單中：大混戰集錦
              </span>
            </div>
            <div className="flex-1 max-w-md mx-4 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-full leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 sm:text-sm transition-all"
                placeholder="搜尋英雄或玩法..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 
                  ${selectedCategory === cat 
                    ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedCard(item)}
              className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-900/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="relative h-48 bg-slate-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>
                <div className="w-full h-full bg-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="text-6xl font-black text-slate-800 opacity-50 uppercase tracking-tighter">
                    {/* 只取第一個名字的前兩個字顯示 */}
                    {item.champion.split(',')[0].substring(0, 2)}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 z-20">
                   <h3 className="text-white font-bold text-lg drop-shadow-md leading-tight">{item.title}</h3>
                   <p className="text-yellow-400 text-sm font-medium drop-shadow-sm line-clamp-1">{item.champion}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300 border border-slate-600/50">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                   <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="truncate max-w-[120px]">{item.augments[0]}</span>
                   </div>
                   <span>by {item.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 詳細頁面 Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedCard(null)}></div>
          
          <div className="relative bg-slate-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl border border-slate-700 flex flex-col lg:flex-row animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"><X className="w-5 h-5" /></button>
            
            {/* 🎥 影片播放區 (9:16) */}
            <div className="w-full lg:w-[50%] bg-slate-950 flex items-center justify-center relative overflow-hidden">
               <div className="w-full h-full flex justify-center bg-black">
                  <div className="aspect-[9/16] h-full max-h-[80vh] w-auto">
                    {getEmbedUrl(selectedCard.videoUrl) ? (
                        <iframe 
                        src={getEmbedUrl(selectedCard.videoUrl)}
                        title="Video player"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        // 🟢 關鍵修正：如果是 YouTube 就不加 no-referrer，其他平台則加上
                        referrerPolicy={isYouTube ? "strict-origin-when-cross-origin" : "no-referrer"}
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900">
                        <Play className="w-16 h-16 text-slate-600 mb-4" />
                        <p className="text-slate-500 text-sm">無法預覽影片</p>
                        <a href={selectedCard.videoUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-500 text-xs mt-2 underline block">點此前往觀看</a>
                        </div>
                    )}
                  </div>
               </div>
            </div>

            {/* 資訊區 */}
            <div className="w-full lg:w-[50%] p-6 md:p-8 flex flex-col overflow-y-auto max-h-[40vh] lg:max-h-full bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-700">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-400 text-sm font-mono tracking-wider uppercase">{selectedCard.champion}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedCard.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedCard.description}</p>
              </div>

              <div className="space-y-6 mb-8 flex-1">
                <div>
                  <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> 核心海克斯</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.augments.map((aug, i) => (
                      <div key={i} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 shadow-sm">{aug}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> 關鍵裝備</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCard.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50 flex justify-between text-xs text-slate-500 mt-auto">
                 <span>Author: {selectedCard.author}</span>
                 <span>Fun: {selectedCard.stats.fun}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}