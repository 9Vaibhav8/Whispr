import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import { PenLine, Calendar, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entryDates, setEntryDates] = useState([]);
  const [entriesByDate, setEntriesByDate] = useState({});
  const [monthEntries, setMonthEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loadingEntry, setLoadingEntry] = useState(false);
  const { user, loading, checkAuth } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // Helper function to format date to YYYY-MM-DD
  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch all entries once when user is available
  useEffect(() => {
    const fetchAllEntries = async () => {
      if (user) {
        try {
          const res = await axios.get("/api/diary", { withCredentials: true });
          const entries = res.data;
          console.log("All entries:", entries);

          const dates = [];
          const entriesMap = {};

          entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const dateStr = formatDateToYMD(entryDate);
            dates.push(dateStr);
            entriesMap[dateStr] = entry;
          });

          setEntryDates(dates);
          setEntriesByDate(entriesMap);
          updateMonthEntries(currentMonth, entries);
          
          // Set initial selected entry if available
          const selectedDateStr = formatDateToYMD(selectedDate);
          if (entriesMap[selectedDateStr]) {
            setSelectedEntry(entriesMap[selectedDateStr]);
          }
        } catch (err) {
          console.error("Failed to fetch diary entries:", err);
        }
      }
    };

    fetchAllEntries();
  }, [user]);

  // Fetch specific entry when date changes
  useEffect(() => {
    const fetchSelectedEntry = async () => {
      if (user && selectedDate) {
        setLoadingEntry(true);
        try {
          const dateStr = formatDateToYMD(selectedDate);
          console.log("Fetching entry for date:", dateStr);
          
          // First check if we already have this entry in our local state
          if (entriesByDate[dateStr]) {
            setSelectedEntry(entriesByDate[dateStr]);
            setLoadingEntry(false);
            return;
          }
          
          // If not in local state, fetch from API
          const res = await axios.get(`/api/diary/date/${dateStr}`, {
            withCredentials: true,
          });
          
          console.log("API response:", res.data);
          setSelectedEntry(res.data);
        } catch (err) {
          console.error("Error fetching entry:", err);
          if (err.response?.status === 404) {
            // No entry found for this date - this is normal
            setSelectedEntry(null);
          } else {
            console.error("Unexpected error:", err);
            setSelectedEntry(null);
          }
        } finally {
          setLoadingEntry(false);
        }
      }
    };

    // Only fetch if we have a user and the selected date has changed
    if (user) {
      fetchSelectedEntry();
    }
  }, [selectedDate, user]);

  // Update month entries when month changes
  useEffect(() => {
    if (Object.keys(entriesByDate).length > 0) {
      const allEntries = Object.values(entriesByDate);
      updateMonthEntries(currentMonth, allEntries);
    }
  }, [currentMonth, entriesByDate]);

  const updateMonthEntries = (date, allEntries) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const entriesInMonth = allEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === year && entryDate.getMonth() === month;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setMonthEntries(entriesInMonth);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const getMonthYearString = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendarDays = [];
    
    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthLastDay = prevMonth.getDate();
      const day = prevMonthLastDay - firstDayOfMonth + i + 1;
      calendarDays.push({
        day,
        currentMonth: false,
        date: new Date(year, month - 1, day)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        currentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    // Next month days to fill grid
    const totalCellsNeeded = 42;
    const remainingCells = totalCellsNeeded - calendarDays.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      calendarDays.push({
        day,
        currentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return calendarDays;
  };
  
  const isSelectedDate = (date) => {
    return formatDateToYMD(date) === formatDateToYMD(selectedDate);
  };
  
  const isToday = (date) => {
    return formatDateToYMD(date) === formatDateToYMD(new Date());
  };
  
  const hasEntry = (date) => {
    const dateStr = formatDateToYMD(date);
    return entryDates.includes(dateStr);
  };
  
  const getEntryForDate = (date) => {
    const dateStr = formatDateToYMD(date);
    return entriesByDate[dateStr] || null;
  };

  const renderSelectedDateEntry = () => {
    if (loadingEntry) {
      return (
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-6">
            <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">Loading entry...</p>
        </div>
      );
    }

    if (!selectedEntry) {
      return (
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <PenLine size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">No Entry Found</h3>
          <p className="text-slate-600 mb-6">Start capturing your thoughts and memories</p>
          <button 
            onClick={() => navigate("/diary")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Create New Entry
          </button>
        </div>
      );
    }

    // Handle both single entry and array responses
    const entry = Array.isArray(selectedEntry) ? selectedEntry[0] : selectedEntry;
    
    if (!entry) {
      return (
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <PenLine size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">No Entry Found</h3>
          <p className="text-slate-600 mb-6">Start capturing your thoughts and memories</p>
          <button 
            onClick={() => navigate("/diary")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Create New Entry
          </button>
        </div>
      );
    }

    const entryDate = new Date(entry.date);
    const isValidDate = !isNaN(entryDate.getTime());

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Check size={24} className="text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">{entry.title || "Untitled Entry"}</h2>
          </div>
        </div>

        <div className="flex items-center text-slate-500 mb-4">
          <Calendar size={18} className="mr-2" />
          <span>
            {isValidDate ? 
              entryDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 
              "Date unavailable"}
          </span>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-medium">Entry exists for this date</p>
          <p className="text-green-600 text-sm mt-1">Click "View/Edit Entry" to see full content</p>
        </div>

        <button 
          onClick={() => navigate("/diary")}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          View/Edit Entry
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="p-12 text-center bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-2xl">
              <div className="w-12 h-12 mx-auto mb-6">
                <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-slate-800 font-medium">Loading your diary portal...</p>
            </div>
          ) : !user ? (
            <div className="p-12 text-center bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Welcome Back</h2>
              <p className="text-slate-600 text-lg">Please log in to access your personal diary calendar</p>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Calendar Section */}
                <div className="w-full lg:w-3/5 p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      Your Diary Calendar
                    </h2>
                    <Sparkles size={28} className="text-purple-500" />
                  </div>
                  
                  {/* Calendar Header */}
                  <div className="calendar-container">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-slate-800">{getMonthYearString(currentMonth)}</h3>
                      <div className="flex space-x-2">
                        <button 
                          className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200 flex items-center justify-center group shadow-lg border border-slate-200"
                          onClick={() => navigateMonth('prev')}
                        >
                          <ChevronLeft size={20} className="text-slate-600 group-hover:text-slate-800" />
                        </button>
                        <button 
                          className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200 flex items-center justify-center group shadow-lg border border-slate-200"
                          onClick={() => navigateMonth('next')}
                        >
                          <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-800" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 text-center mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                        <div key={i} className="py-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 p-4 bg-white/60 rounded-2xl border border-slate-200 shadow-inner">
                      {getDaysInMonth(currentMonth).map((dayObj, i) => {
                        const hasEntryForDay = dayObj.currentMonth && hasEntry(dayObj.date);
                        const entryForDay = dayObj.currentMonth ? getEntryForDate(dayObj.date) : null;
                        
                        return (
                          <div 
                            key={i}
                            className={`relative h-16 rounded-xl p-2 transition-all duration-200 cursor-pointer group
                              ${!dayObj.currentMonth ? 'text-slate-400' : 'text-slate-700'} 
                              ${isSelectedDate(dayObj.date) ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg scale-105' : 'hover:bg-slate-100'}
                              ${isToday(dayObj.date) ? 'ring-2 ring-blue-400' : ''}
                              ${hasEntryForDay ? 'bg-green-50 hover:bg-green-100' : ''}`}
                            onClick={() => handleDateChange(dayObj.date)}
                          >
                            <div className="flex items-start justify-between h-full">
                              <span className={`text-sm font-medium ${isToday(dayObj.date) && !isSelectedDate(dayObj.date) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                {dayObj.day}
                              </span>
                              
                              {/* Check mark for entries */}
                              {hasEntryForDay && (
                                <Check size={16} className="text-green-600" />
                              )}
                            </div>
                            
                            {/* Entry title preview */}
                            {hasEntryForDay && entryForDay && (
                              <div className="absolute bottom-1 left-1 right-1">
                                <div className="text-xs truncate py-1 px-2 rounded-md bg-green-100 border border-green-300 text-green-800 shadow-sm">
                                  {entryForDay.title || "Untitled"}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                 
                  {/* Entry List - Only Titles */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
                      <Check size={20} className="text-green-500 mr-2" />
                      Entries This Month
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {monthEntries.map((entry, index) => {
                        const entryDate = new Date(entry.date);
                        return (
                          <div 
                            key={index} 
                            className="flex items-center p-3 rounded-xl bg-green-50 hover:bg-green-100 cursor-pointer transition-all duration-200 border border-green-200 hover:border-green-300 shadow-sm"
                            onClick={() => setSelectedDate(entryDate)}
                          >
                            <Check size={16} className="text-green-600 mr-3" />
                            <span className="text-lg font-bold text-slate-800 mr-3">{entryDate.getDate()}</span>
                            <span className="mx-2 text-slate-400">|</span>
                            <span className="text-sm text-slate-700 truncate flex-1 font-medium">
                              {entry.title || "Untitled Entry"}
                            </span>
                          </div>
                        );
                      })}
                      {monthEntries.length === 0 && (
                        <div className="text-center py-8">
                          <PenLine size={32} className="text-slate-400 mx-auto mb-3" />
                          <p className="text-sm text-slate-500 italic">No entries for this month</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Entry Preview Section */}
                <div className="w-full lg:w-2/5">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white/50">
                    <h2 className="text-xl font-bold text-slate-800">
                      {selectedDate ? selectedDate.toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : "Select a Date"}
                    </h2>
                    <button 
                      onClick={() => navigate("/diary")} 
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <PenLine size={18} className="mr-2" />
                      New Entry
                    </button>
                  </div>
                  <div className="h-[600px] overflow-y-auto bg-white/30">
                    {renderSelectedDateEntry()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;