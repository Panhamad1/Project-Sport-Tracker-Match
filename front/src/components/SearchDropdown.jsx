import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFutbol,
  FaRegClock,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrophy,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { searchFootball } from '../api/football/FootballApi';

const RECENT_SEARCH_KEY = 'football_nav_search_recent';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'teams', label: 'Teams' },
  { key: 'leagues', label: 'Leagues' },
  { key: 'players', label: 'Players' },
  { key: 'matches', label: 'Matches' },
];

const emptyResults = {
  teams: [],
  leagues: [],
  players: [],
  matches: [],
};

const getSavedRecentItems = () => {
  try {
    const saved = window.localStorage.getItem(RECENT_SEARCH_KEY);

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveRecentItems = (items) => {
  window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(items.slice(0, 6)));
};

const getStatusLabel = (match) => {
  if (match.status_short === 'NS') {
    return match.match_time_local || 'Scheduled';
  }

  if (match.status_short === 'FT') {
    return 'FT';
  }

  if (match.elapsed) {
    return `${match.elapsed}'`;
  }

  return match.status_short || match.status_long || 'Match';
};

const ResultIcon = ({ image, icon }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]">
    {image ? (
      <img src={image} alt="" className="h-8 w-8 rounded-full object-contain" />
    ) : (
      icon
    )}
  </div>
);

const EmptyPanel = ({ title, message }) => (
  <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-6 text-center">
    <p className="text-sm font-semibold text-white">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{message}</p>
  </div>
);

const SimpleResult = ({ item, type, onSelect }) => {
  const iconMap = {
    teams: <FaUsers />,
    leagues: <FaTrophy />,
    players: <FaUser />,
  };

  const image = item.logo || item.photo;
  const subtitle = item.country || item.nationality || (item.season ? `Season ${item.season}` : null);
  const title = type === 'players'
    ? item.display_name || item.full_name || item.name
    : item.name;

  return (
    <button
      type="button"
      onClick={() => onSelect({ ...item, type })}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#1a1a1a]"
    >
      <ResultIcon image={image} icon={iconMap[type]} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        <p className="truncate text-xs text-gray-500">
          {type.slice(0, -1)}{subtitle ? ` - ${subtitle}` : ''}
        </p>
      </div>
    </button>
  );
};

const MatchResult = ({ match, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect({ ...match, type: 'matches' })}
      className="w-full rounded-lg px-2 py-3 text-left transition-colors hover:bg-[#1a1a1a]"
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-gray-500">
        <span className="flex min-w-0 items-center gap-2">
          <ResultIcon image={match.league?.logo} icon={<FaTrophy />} />
          <span className="truncate">{match.league?.name || 'Unknown League'}</span>
        </span>
        <span className="shrink-0">{match.match_date_local || 'Saved match'}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <ResultIcon image={match.homeTeam?.logo} icon={<FaFutbol />} />
            <span className="truncate text-sm text-white">{match.homeTeam?.name || 'Home Team'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ResultIcon image={match.awayTeam?.logo} icon={<FaFutbol />} />
            <span className="truncate text-sm text-white">{match.awayTeam?.name || 'Away Team'}</span>
          </div>
        </div>

        <div className="space-y-2 text-center text-sm font-semibold text-white">
          <p>{match.home_goals ?? '-'}</p>
          <p>{match.away_goals ?? '-'}</p>
        </div>

        <div className="w-20 border-l border-[#2a2a2a] pl-3 text-center text-xs text-gray-400">
          <p>{match.match_date_local ? (match.match_date_local === new Date().toISOString().slice(0, 10) ? 'Today' : match.match_date_local) : 'Match'}</p>
          <p className="mt-1 font-semibold text-white">{getStatusLabel(match)}</p>
        </div>
      </div>
    </button>
  );
};

const RecentItem = ({ item, onSelect }) => {
  if (item.type === 'matches') {
    return <MatchResult match={item} onSelect={onSelect} />;
  }

  return <SimpleResult item={item} type={item.type} onSelect={onSelect} />;
};

const SearchDropdown = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [results, setResults] = useState(emptyResults);
  const [recentItems, setRecentItems] = useState(getSavedRecentItems);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const keyword = searchText.trim();

  const resultCount = useMemo(() => {
    return results.teams.length + results.leagues.length + results.players.length + results.matches.length;
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || !keyword) {
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);

      const response = await searchFootball({
        search: keyword,
        type: activeType,
      });

      if (response.ok) {
        setResults({
          teams: response.data?.teams || [],
          leagues: response.data?.leagues || [],
          players: response.data?.players || [],
          matches: response.data?.matches || [],
        });
        setMessage(response.data?.message || 'Search results loaded successfully');
      } else {
        setResults(emptyResults);
        setMessage(response.data?.message || response.data?.error || 'Failed to search saved data');
      }

      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [activeType, isOpen, keyword]);

  const handleSearchTextChange = (event) => {
    const nextSearchText = event.target.value;

    setSearchText(nextSearchText);

    if (!nextSearchText.trim()) {
      setResults(emptyResults);
      setLoading(false);
      setMessage('');
    }
  };

  const addRecentItem = (item) => {
    const itemKey = item.type === 'matches' ? item.api_fixture_id : `${item.type}-${item.api_team_id || item.api_league_id || item.api_player_id}`;
    const nextItems = [
      item,
      ...recentItems.filter((recentItem) => {
        const recentKey = recentItem.type === 'matches'
          ? recentItem.api_fixture_id
          : `${recentItem.type}-${recentItem.api_team_id || recentItem.api_league_id || recentItem.api_player_id}`;

        return recentKey !== itemKey;
      }),
    ].slice(0, 6);

    setRecentItems(nextItems);
    saveRecentItems(nextItems);
  };

  const handleSelect = (item) => {
    addRecentItem(item);

    if (item.type === 'matches' && item.api_fixture_id) {
      navigate(`/matches/${item.api_fixture_id}`);
      setIsOpen(false);
      setSearchText('');
      return;
    }

    if (item.type === 'leagues' && item.api_league_id) {
      navigate(`/leagues?league=${item.api_league_id}&season=${item.season || ''}`);
      setIsOpen(false);
      setSearchText('');
      return;
    }

    if (item.type === 'teams' && item.api_team_id) {
      navigate(`/teams/${item.api_team_id}`);
      setIsOpen(false);
      setSearchText('');
      return;
    }

    if (item.type === 'players' && item.api_player_id) {
      navigate(`/players/${item.api_player_id}`);
      setIsOpen(false);
      setSearchText('');
    }
  };

  const clearRecent = () => {
    setRecentItems([]);
    saveRecentItems([]);
  };

  const visibleResults = {
    teams: activeType === 'all' || activeType === 'teams' ? results.teams : [],
    leagues: activeType === 'all' || activeType === 'leagues' ? results.leagues : [],
    players: activeType === 'all' || activeType === 'players' ? results.players : [],
    matches: activeType === 'all' || activeType === 'matches' ? results.matches : [],
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="relative block">
        <span className="sr-only">Search football data</span>
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={handleSearchTextChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, leagues, players, matches..."
          className="w-full rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 pl-10 pr-9 text-sm text-white outline-none transition-colors focus:border-[#8b5cf6]"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
        {searchText && (
          <button
            type="button"
            onClick={() => {
              setSearchText('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </label>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[72vh] overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] shadow-2xl shadow-black/50">
          <div className="border-b border-[#2a2a2a] p-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveType(filter.key)}
                  className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                    activeType === filter.key
                      ? 'border-[#8b5cf6] bg-[#8b5cf6] text-white'
                      : 'border-[#2a2a2a] bg-[#111111] text-gray-300 hover:border-[#8b5cf6]/60 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[58vh] overflow-y-auto p-4">
            {!keyword ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Recent</h3>
                  {recentItems.length > 0 && (
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-sm font-semibold text-gray-400 transition-colors hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {recentItems.length === 0 ? (
                  <EmptyPanel
                    title="No Recent Searches"
                    message="Search for a team, league, player, or match to keep it here."
                  />
                ) : (
                  <div className="space-y-2">
                    {recentItems.map((item, index) => (
                      <RecentItem key={`${item.type}-${item.api_fixture_id || item.api_team_id || item.api_league_id || item.api_player_id || index}`} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] py-8 text-sm text-gray-400">
                <FaSpinner className="animate-spin text-[#8b5cf6]" />
                Searching saved data...
              </div>
            ) : resultCount === 0 ? (
              <EmptyPanel
                title="No Data Yet"
                message={message || 'No saved data matched this search. Admin may need to sync more data.'}
              />
            ) : (
              <div className="space-y-4">
                {visibleResults.matches.length > 0 && (
                  <section>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                      <FaRegClock className="text-[#8b5cf6]" />
                      Matches
                    </h3>
                    <div className="space-y-2">
                      {visibleResults.matches.map((match) => (
                        <MatchResult key={match.api_fixture_id} match={match} onSelect={handleSelect} />
                      ))}
                    </div>
                  </section>
                )}

                {visibleResults.teams.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-white">Teams</h3>
                    <div className="space-y-1">
                      {visibleResults.teams.map((team) => (
                        <SimpleResult key={team.api_team_id} item={team} type="teams" onSelect={handleSelect} />
                      ))}
                    </div>
                  </section>
                )}

                {visibleResults.leagues.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-white">Leagues</h3>
                    <div className="space-y-1">
                      {visibleResults.leagues.map((league) => (
                        <SimpleResult key={`${league.api_league_id}-${league.season}`} item={league} type="leagues" onSelect={handleSelect} />
                      ))}
                    </div>
                  </section>
                )}

                {visibleResults.players.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-white">Players</h3>
                    <div className="space-y-1">
                      {visibleResults.players.map((player) => (
                        <SimpleResult key={player.api_player_id} item={player} type="players" onSelect={handleSelect} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
