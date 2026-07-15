import { useEffect, useMemo, useState } from "react";
import { fetchFixturesByDate } from "../services/matchService";

export const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateInput = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const addDays = (date, days) => {
  const nextDate = parseDateInput(date);
  nextDate.setDate(nextDate.getDate() + days);

  return formatDateInput(nextDate);
};

export const formatReadableDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseDateInput(date));
};

export const today = formatDateInput(new Date());

export const filters = [
  { key: "all", label: "All Match" },
  { key: "live", label: "Live Match" },
  { key: "schedule", label: "Schedule Match" },
  { key: "finished", label: "Finish Match" },
];

const liveStatuses = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"];
const scheduledStatuses = ["NS", "TBD", "PST"];
const finishedStatuses = ["FT", "AET", "PEN"];

export const getStatusGroup = (statusShort) => {
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

export const useMatchesPage = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState("all");
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFixtures = async (date = selectedDate) => {
    setLoading(true);
    setMessage("");

    const result = await fetchFixturesByDate(date);

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

  return {
    activeFilter,
    counts,
    filteredFixtures,
    loading,
    loadFixtures,
    message,
    quickDates,
    selectedDate,
    setActiveFilter,
    setSelectedDate,
  };
};
