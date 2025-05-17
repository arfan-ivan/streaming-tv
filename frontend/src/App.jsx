import React, { useEffect, useState, useRef } from "react";
import Hls from "hls.js";

// Komponen ikon pencarian
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Komponen ikon close
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// CSS Variables untuk tema aplikasi
const appStyles = `
  :root {
    --primary-color:rgb(9, 148, 229);
    --primary-dark:rgb(7, 81, 178);
    --secondary-color: #0071eb;
    --background-dark: #141414;
    --background-darker: #0b0b0b;
    --background-light: #181818;
    --text-color: #ffffff;
    --text-muted: #b3b3b3;
    --shadow-strong: 0 10px 20px rgba(0, 0, 0, 0.5);
    --shadow-light: 0 5px 10px rgba(0, 0, 0, 0.3);
    --transition-default: all 0.3s ease;
    --border-radius: 4px;
    --input-bg: rgba(255, 255, 255, 0.1);
    --chip-bg: rgba(255, 255, 255, 0.15);
    --chip-active: rgba(9, 196, 229, 0.3);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--background-dark);
    color: var(--text-color);
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    overflow-x: hidden;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Header Section */
  .header {
    background-color: var(--background-darker);
    padding: 20px;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: var(--shadow-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header h1 {
    color: var(--primary-color);
    font-size: 28px;
  }

  /* Search Component */
  .search-container {
    display: flex;
    align-items: center;
    position: relative;
    width: 300px;
  }

  .search-input {
    background-color: var(--input-bg);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    color: var(--text-color);
    font-size: 14px;
    padding: 10px 15px 10px 40px;
    width: 100%;
    transition: var(--transition-default);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--secondary-color);
    background-color: rgba(255, 255, 255, 0.15);
  }

  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--text-muted);
  }

  .clear-search {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .clear-search:hover {
    color: var(--text-color);
  }

  /* Filter chips */
  .filter-container {
    display: flex;
    gap: 10px;
    padding: 10px 15px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--background-light) var(--background-darker);
  }

  .filter-container::-webkit-scrollbar {
    height: 6px;
  }

  .filter-container::-webkit-scrollbar-track {
    background: var(--background-darker);
  }

  .filter-container::-webkit-scrollbar-thumb {
    background-color: var(--background-light);
    border-radius: 6px;
  }

  .filter-chip {
    background-color: var(--chip-bg);
    border: none;
    border-radius: 16px;
    color: var(--text-color);
    cursor: pointer;
    font-size: 13px;
    padding: 6px 12px;
    white-space: nowrap;
    transition: var(--transition-default);
  }

  .filter-chip:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .filter-chip.active {
    background-color: var(--chip-active);
    border: 1px solid var(--primary-color);
  }

  /* No results found */
  .no-results {
    padding: 30px 15px;
    text-align: center;
    color: var(--text-muted);
    font-size: 16px;
  }

  .no-results-icon {
    font-size: 24px;
    margin-bottom: 10px;
  }

  /* Main Content */
  .main-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 70px);
  }

  @media (min-width: 992px) {
    .main-content {
      flex-direction: row;
    }
  }

  /* Sidebar/Channel List */
  .sidebar {
    background-color: var(--background-darker);
    flex: 0 0 280px;
    overflow-y: auto;
    transition: var(--transition-default);
    box-shadow: var(--shadow-light);
  }
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: --background-darker; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
  .sidebar-header {
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-header h2 {
    font-size: 18px;
    color: var(--text-color);
  }

  .group-container {
    margin-bottom: 20px;
  }

  .group-title {
    padding: 10px 15px;
    background-color: rgba(27, 69, 82, 0.34);
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .channel-list {
    list-style: none;
  }

  .channel-item {
    transition: var(--transition-default);
  }

  .channel-button {
    width: 100%;
    padding: 12px 15px;
    background: none;
    border: none;
    text-align: left;
    color: var(--text-muted);
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition-default);
    display: flex;
    align-items: center;
  }

  .channel-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
  }

  .channel-button.active {
    background-color: rgba(9, 60, 229, 0.2);
    color: var(--text-color);
    border-left: 3px solid var(--primary-color);
  }

  .channel-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  /* Video Player Section */
  .player-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background-dark);
    padding: 20px;
    position: relative;
  }

  .player-title {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .player-subtitle {
    font-size: 16px;
    color: var(--text-muted);
    margin-bottom: 15px;
  }

  .video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
    background-color: black;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-strong);
  }

  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .empty-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--background-darker);
    border-radius: var(--border-radius);
  }

  .empty-player-icon {
    font-size: 48px;
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .empty-player-text {
    color: var(--text-muted);
    font-size: 18px;
    text-align: center;
  }

  /* Animation - fadeIn */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  /* Mobile Responsive Adjustments */
@media (max-width: 991px) {
  .main-content {
    display: flex;
    flex-direction: column;
  }

  .video-wrapper {
    order: 1;
  }

  .sidebar {
    order: 2; /* sidebar tampil di bawah video */
    max-height: 604px;
    flex: 0 0 auto;
  }
    .player-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background-dark);
    padding: 5px;
    position: relative;
}
}


  /* Toggle Button for Mobile */
  .sidebar-toggle {
    display: none;
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-bottom: 10px;
  }
    
  /* videoplayer pembaruan */
.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 1520px;
  aspect-ratio: 16 / 9; /* Jaga rasio video & header */
  background: black;
  margin: 0 auto;
  overflow: hidden;
}

.player-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  z-index: 10;
  pointer-events: none;
}

/* Flex container untuk title dan arfan */
.player-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Opsional untuk tampilan */
.player-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.player-right {
  font-size: 12px;
  opacity: 0.5;
}


.player-subtitle {
  font-size: 14px;
  margin: 0;
  opacity: 0.85;
}

.video-player {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover; /* atau contain sesuai preferensi */
  display: block;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

  /* videoplayer pembaruan */

  @media (max-width: 991px) {
    .sidebar-toggle {
      display: block;
    }

    .sidebar.collapsed {
      max-height: 0;
      overflow: hidden;
    }
  }
`;

// Komponen pencarian
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  
  const handleChange = (e) => {
    const value = e.currentTarget.value;
    setQuery(value);
    onSearch(value);
  };
  
  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };
  
  return (
    <div className="search-container">
      <div className="search-icon">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Cari channel atau negara..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button className="clear-search" onClick={clearSearch}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

// Komponen chip filter untuk negara
function CountryFilters({ countries, activeCountry, onSelectCountry }) {
  const pinnedCountry = "Indonesia"; // atau bisa dari props / state juga

  // Pindahkan Indonesia ke awal
  const reorderedCountries = [
    pinnedCountry,
    ...countries.filter(c => c !== pinnedCountry)
  ];

  return (
    <div className="filter-container">
      <button 
        className={`filter-chip ${activeCountry === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCountry('all')}
      >
        Semua Negara
      </button>
      {reorderedCountries.map(country => (
        <button 
          key={country} 
          className={`filter-chip ${activeCountry === country ? 'active' : ''}`}
          onClick={() => onSelectCountry(country)}
        >
          {country}
        </button>
      ))}
    </div>
  );
}


// Video Player Component dengan styling
function VideoPlayer({ src }) {
  const videoRef = useRef();
  const containerRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Autoplay failed:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          setIsLoading(false);
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Autoplay failed:", err);
        });
      });
    }

    return () => {
      if (hls) hls.destroy();
      setIsPlaying(false);
    };
  }, [src]);

  return (
    <div ref={containerRef} className="video-container">
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      <video 
        ref={videoRef} 
        className="video-player fade-in" 
        controls 
        autoPlay
      />
    </div>
  );
}

function encodeGroupKey(groupKey) {
  return groupKey.toLowerCase().replace(" / ", "__").replace(/ /g, "_");
}

export default function App() {
  const [channelsByGroup, setChannelsByGroup] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChannelsByGroup, setFilteredChannelsByGroup] = useState({});
  const [countries, setCountries] = useState([]);
  const [activeCountry, setActiveCountry] = useState('all');

  useEffect(() => {
    // Inject the CSS
    const styleElement = document.createElement("style");
    styleElement.innerText = appStyles;
    document.head.appendChild(styleElement);

    // Fetch channels
    setIsLoading(true);
    fetch("http://localhost:8000/channels")
      .then((res) => res.json())
      .then((data) => {
        setChannelsByGroup(data);
        setFilteredChannelsByGroup(data);
        
        // Extract unique countries from the group keys
        const uniqueCountries = Object.keys(data).map(key => {
          // Assuming group keys might be in format "Country / Category"
          const parts = key.split(' / ');
          return parts[0].trim();
        }).filter((value, index, self) => self.indexOf(value) === index);
        
        setCountries(uniqueCountries);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching channels:", error);
        setIsLoading(false);
      });

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    // Filter channels based on search query and country filter
    if (!Object.keys(channelsByGroup).length) return;
    
    const query = searchQuery.toLowerCase();
    
    const filtered = Object.entries(channelsByGroup).reduce((acc, [groupKey, channels]) => {
      // Check if the group matches the country filter
      const groupCountry = groupKey.split(' / ')[0].trim();
      const matchesCountry = activeCountry === 'all' || groupCountry === activeCountry;
      
      if (!matchesCountry) return acc;
      
      // Filter channels by search query
      const filteredChannels = channels.filter(channel => 
        channel.name.toLowerCase().includes(query) || 
        groupKey.toLowerCase().includes(query)
      );
      
      if (filteredChannels.length > 0) {
        acc[groupKey] = filteredChannels;
      }
      
      return acc;
    }, {});
    
    setFilteredChannelsByGroup(filtered);
  }, [searchQuery, activeCountry, channelsByGroup]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleSelectCountry = (country) => {
    setActiveCountry(country);
  };

  const handleSelectChannel = (groupKeyOriginal, index) => {
    setSelectedChannel({
      groupKeyOriginal,
      groupKeyEncoded: encodeGroupKey(groupKeyOriginal),
      index,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get first letter for channel icon
  const getChannelInitial = (channelName) => {
    return channelName.charAt(0).toUpperCase();
  };

  // Check if there are no results after filtering
  const noResults = Object.keys(filteredChannelsByGroup).length === 0 && !isLoading;

  return (
    <div className="app-container">
      <header className="header">
        <h1>TV-A</h1>
        <SearchBar onSearch={handleSearch} />

      </header>
      <div>          
          <CountryFilters 
            countries={countries}
            activeCountry={activeCountry}
            onSelectCountry={handleSelectCountry}
          />
      </div>

      <div className="main-content">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "Show Channels" : "Hide Channels"}
        </button>

        <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
         
          {isLoading ? (
            <div className="loading-state">Loading channels...</div>
          ) : noResults ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p>Tidak ada channel yang ditemukan.</p>
              <p>Coba kata kunci lain atau filter yang berbeda.</p>
            </div>
          ) : (
            Object.entries(filteredChannelsByGroup).map(([groupKey, channels]) => (
              <div key={groupKey} className="group-container">
                <h3 className="group-title">{groupKey}</h3>
                <ul className="channel-list">
                  {channels.map((channel, index) => {
                    const isActive = 
                      selectedChannel && 
                      selectedChannel.groupKeyOriginal === groupKey && 
                      selectedChannel.index === index;
                    
                    return (
                      <li key={`${groupKey}_${channel.id}_${index}`} className="channel-item">
                        <button 
                          className={`channel-button ${isActive ? "active" : ""}`}
                          onClick={() => handleSelectChannel(groupKey, index)}
                        >
                          <div className="channel-icon">
                            {getChannelInitial(channel.name)}
                          </div>
                          <span>{channel.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </aside>

        <main className="player-section">
          {selectedChannel ? (
            <>
              {/* <div className="player-header fade-in">
                <h2 className="player-title">
                  {channelsByGroup[selectedChannel.groupKeyOriginal][selectedChannel.index]?.name}
                </h2>
                <p className="player-subtitle">
                  {selectedChannel.groupKeyOriginal}
                </p>
              </div>
              <VideoPlayer
                src={`http://localhost:8000/hls/${selectedChannel.groupKeyEncoded}/${selectedChannel.index}/stream.m3u8`}
              /> */}
          <div className="video-wrapper">
          <div className="player-header fade-in">
            <div className="player-header-content">
              <h2 className="player-title">
                {channelsByGroup[selectedChannel.groupKeyOriginal][selectedChannel.index]?.name}
              </h2>
              <p className="player-right">ArfanVn</p>
            </div>
            <p className="player-subtitle">
              {selectedChannel.groupKeyOriginal}
            </p>
          </div>

            <VideoPlayer
              src={`http://localhost:8000/hls/${selectedChannel.groupKeyEncoded}/${selectedChannel.index}/stream.m3u8`}
            />
          </div>

            </>
          ) : (
            <div className="empty-player fade-in">
              <div className="empty-player-icon">▶</div>
              <p className="empty-player-text">
                Pilih saluran dari daftar untuk mulai menonton
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}