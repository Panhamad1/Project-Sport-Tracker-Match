import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaSpinner, FaSyncAlt } from "react-icons/fa";
import { getFixturesByDate } from "../api/football/FootballApi";
import MatchCard from "../components/matches/MatchCard";
import NoDataState from "../components/matches/NoDataState";

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateInput = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const addDays = (date, days) => {
  const nextDate = parseDateInput(date);
  nextDate.setDate(nextDate.getDate() + days);

  return formatDateInput(nextDate);
};

const formatReadableDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseDateInput(date));
};

const today = formatDateInput(new Date());

const filters = [
  { key: "all", label: "All Match" },
  { key: "live", label: "Live Match" },
  { key: "schedule", label: "Schedule Match" },
  { key: "finished", label: "Finish Match" },
];

const liveStatuses = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"];
const scheduledStatuses = ["NS", "TBD", "PST"];
const finishedStatuses = ["FT", "AET", "PEN"];

const getStatusGroup = (statusShort) => {
  const status = statusShort || "NS";

  if(liveStatuses.includes(status)){
    return "live";
  }

  if(finishedStatuses.includes(status)){
    return "finished";
  }

  if(scheduledStatuses.includes(status)){
    return "schedule";
  }

  return "all";
};

const MatchesPage = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState("all");
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFixtures = async (date) => {
    setLoading(true);
    setMessage("");

    const result = await getFixturesByDate(date);

    if(result.ok){
      setFixtures(result.data?.fixtures || []);
      setMessage(result.data?.message || "Fixtures loaded");
    }else{
      setFixtures([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load fixtures");
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFixtures(selectedDate);
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedDate]);

  const counts = useMemo(() => {
    return fixtures.reduce((summary, fixture) => {
      const group = getStatusGroup(fixture.status_short);

      summary.all += 1;
      if(group !== "all"){
        summary[group] += 1;
      }

      return summary;
    }, {
      all: 0,
      live: 0,
      schedule: 0,
      finished: 0,
    });
  }, [fixtures]);

  const filteredFixtures = useMemo(() => {
    if(activeFilter === "all"){
      return fixtures;
    }

    return fixtures.filter((fixture) => getStatusGroup(fixture.status_short) === activeFilter);
  }, [activeFilter, fixtures]);
  const quickDates = [
    { label: "Yesterday", date: addDays(today, -1) },
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
  ];

  return (
    <div className="text-white space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[#8b5cf6] font-medium">Matches</p>
          <h1 className="text-2xl font-bold mt-1">Match Center</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-3xl">
            Browse saved fixtures by date, filter by match status, and open details for overview, H2H, predictions, lineups, statistics, and streams.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadFixtures(selectedDate);
          }}
          className="w-full xl:w-auto"
        >
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:grid-cols-[auto_minmax(260px,1fr)_auto_auto]">
            <button
              type="button"
              onClick={() => setSelectedDate((currentDate) => addDays(currentDate, -1))}
              className="self-end inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-white transition-all hover:bg-[#2a2a2a]"
              aria-label="Previous day"
            >
              <FaChevronLeft />
            </button>

            <label className="relative text-sm text-gray-300">
              Fixture date
              <span className="mt-1 flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-left text-white transition-all hover:border-[#8b5cf6]/60 hover:bg-[#222222]">
                <FaCalendarAlt className="shrink-0 text-[#a78bfa]" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{formatReadableDate(selectedDate)}</span>
                  <span className="block text-xs text-gray-500">{selectedDate}</span>
                </span>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="absolute bottom-0 left-0 h-12 w-full cursor-pointer opacity-0"
              />
            </label>

            <button
              type="button"
              onClick={() => setSelectedDate((currentDate) => addDays(currentDate, 1))}
              className="self-end inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-white transition-all hover:bg-[#2a2a2a]"
              aria-label="Next day"
            >
              <FaChevronRight />
            </button>

            <button
              type="submit"
              disabled={loading}
              className="col-span-3 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:bg-[#111111] sm:col-span-1 sm:self-end"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
              Refresh
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {quickDates.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedDate(item.date)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedDate === item.date
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                    : "border-[#2a2a2a] bg-[#0d0d0d] text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`shrink-0 rounded-lg border px-4 py-2 text-sm transition-all ${
              activeFilter === filter.key
                ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                : "border-[#2a2a2a] bg-[#0d0d0d] text-gray-400 hover:text-white"
            }`}
          >
            {filter.label}
            <span className="ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs">
              {counts[filter.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Fixtures</h2>
            <p className="text-xs text-gray-500 mt-1">{message || "Choose a date to view saved fixtures."}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
            <FaCalendarAlt />
            {selectedDate}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
            <FaSpinner className="animate-spin text-[#8b5cf6]" />
            Loading fixtures...
          </div>
        ) : filteredFixtures.length === 0 ? (
          <div className="mt-4">
            <NoDataState
              title="No Matches Found"
              message="No saved fixtures match this date and filter yet. Sync fixtures from the admin panel first."
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 2xl:grid-cols-2 gap-4">
            {filteredFixtures.map((fixture) => (
              <MatchCard key={fixture.public_match_id || fixture.api_fixture_id} fixture={fixture} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
