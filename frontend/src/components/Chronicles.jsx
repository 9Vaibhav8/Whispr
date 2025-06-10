import  { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { BookOpen, Calendar, FileText, AlertCircle, Sparkles, Trash2, Edit, X, Save, ArrowLeft, ChevronRight } from 'lucide-react';

const DiaryChronicles = () => {
  const [entries, setEntries] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentView, setCurrentView] = useState('cover'); 
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

const fetchDiaryEntries = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get('http://localhost:5000/api/diary', {
      withCredentials: true,
    });
    setEntries(data); // Assume backend returns full image URLs (e.g., Cloudinary links)
    setError(null);
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to fetch entries');
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/diary/${id}`, {
      withCredentials: true,
    });
    setEntries(entries.filter(entry => entry._id !== id));
    setSuccessMessage('Diary deleted successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    // Route back to contents view after deletion
    setCurrentView('contents');
    setSelectedEntryId(null);
    
    // Reset any editing states
    setEditingId(null);
    setEditForm({ title: '', content: '' });
  } catch (err) {
    console.error("Delete error:", err);
    setError('Error deleting diary');
  }
};

  const startEditing = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      title: entry.title || '',
      content: entry.content || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/diary/${id}`,
        editForm,
        { withCredentials: true }
      );
      
      setEntries(entries.map(entry => 
        entry._id === id ? response.data : entry
      ));
      setEditingId(null);
      setSuccessMessage('Diary updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError('Error updating diary ');
    }
  };

  const openNotebook = () => {
    setCurrentView('contents');
  };

  const openEntry = (entryId) => {
    setSelectedEntryId(entryId);
    setCurrentView('entry');
  };
  const goBack = () => {
  // Clear messages when navigating
  setSuccessMessage(null);
  setError(null);
  
  if (currentView === 'entry') {
    setCurrentView('contents');
    setSelectedEntryId(null);
  } else if (currentView === 'contents') {
    setCurrentView('cover');
  }
  
  // Reset any editing states when going back
  setEditingId(null);
  setEditForm({ title: '', content: '' });
};
   

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your memories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
if (currentView === 'cover') {
  return (
   
    
    <div className="min-h-screen relative  bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
  {/* Cosmic background effects */}
  <div className="absolute inset-0">
    {/* Floating stars */}
    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
    <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse"></div>
    <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping opacity-60"></div>
    <div className="absolute top-1/5 right-1/4 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse"></div>
    <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-emerald-300 rounded-full animate-ping opacity-40"></div>
    
    {/* Nebula effects */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-600/15 to-purple-600/15 rounded-full blur-2xl opacity-40 animate-pulse animation-delay-2000"></div>
  </div>
  

    <Navbar />


  
  {/* Main content container */}
  <div className="container mx-auto px-4 py-30 relative z-10">
    <div className="flex items-center justify-center">
      {/* Notebook container with hover effects */}
      <div 
        className="relative cursor-pointer transform hover:scale-110 transition-all duration-700 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        onClick={openNotebook}
        style={{
          transformStyle: 'preserve-3d',
          animation: 'pageFlip 0.8s ease-in-out'
        }}
      >
        {/* Magical aura around the book */}
       
        
        {/* Notebook Cover */}
        <div className="w-80 h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-2xl border-2 border-purple-400/50 relative overflow-hidden transform hover:rotateY-12 transition-all duration-700 hover:shadow-[0_0_60px_rgba(168,85,247,0.8)]">
          
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-20 blur-sm animate-pulse"></div>
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
          </div>
          
          {/* Mystical corner decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="absolute top-6 left-6 w-16 h-16 text-cyan-400 opacity-60 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10 Q50 30 90 10 Q70 50 90 90 Q50 70 10 90 Q30 50 10 10" />
              </svg>
              <svg className="absolute top-6 right-6 w-16 h-16 text-pink-400 opacity-60 transform rotate-90 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10 Q50 30 90 10 Q70 50 90 90 Q50 70 10 90 Q30 50 10 10" />
              </svg>
              <svg className="absolute bottom-6 left-6 w-16 h-16 text-purple-400 opacity-60 transform rotate-270 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10 Q50 30 90 10 Q70 50 90 90 Q50 70 10 90 Q30 50 10 10" />
              </svg>
              <svg className="absolute bottom-6 right-6 w-16 h-16 text-emerald-400 opacity-60 transform rotate-180 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10 Q50 30 90 10 Q70 50 90 90 Q50 70 10 90 Q30 50 10 10" />
              </svg>
            </div>
          </div>

          {/* Crystal texture effect */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-cyan-300/20 to-transparent animate-pulse"></div>
          
          {/* Magical border design */}
          <div className="absolute inset-6 border border-purple-400/60 opacity-80 rounded-xl shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-4 border border-cyan-400/40 opacity-60 rounded-lg shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]"></div>
          </div>
          
          {/* Decorative lines */}
          <div className="absolute top-8 left-8 right-8">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse"></div>
            <div className="flex justify-center mt-2">
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 opacity-70 animate-pulse"></div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 opacity-70 animate-pulse"></div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80 animate-pulse"></div>
          </div>
          
          {/* Central mystical medallion */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-15">
            <svg viewBox="0 0 100 100" className="w-full h-full text-purple-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" className="animate-pulse"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
              <path d="M50 15 L55 35 L75 35 L60 50 L65 70 L50 60 L35 70 L40 50 L25 35 L45 35 Z" opacity="0.8" className="animate-pulse"/>
            </svg>
          </div>
          
          {/* Title Section */}
          <div className="inset-0 flex flex-col items-center justify-center text-center p-10 relative z-10">
            <div className="mb-8 relative">
             
              
              {/* Magical particles around icon */}
              <div className="absolute -top-3 -left-3 w-2 h-2 bg-cyan-400 rounded-full opacity-80 animate-ping"></div>
              <div className="absolute -top-3 -right-3 w-2 h-2 bg-pink-400 rounded-full opacity-80 animate-ping animation-delay-300"></div>
              <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-purple-400 rounded-full opacity-80 animate-ping animation-delay-600"></div>
              <div className="absolute -bottom-3 -right-3 w-2 h-2 bg-emerald-400 rounded-full opacity-80 animate-ping animation-delay-900"></div>
              
              {/* Orbiting particles */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 font-serif bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105 transition-transform duration-300">
            
            </h1>
            
           
            
            {/* Artistic divider */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 opacity-80"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full opacity-90 animate-pulse"></div>
              <div className="w-4 h-4 border border-pink-400 opacity-80 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-90 animate-pulse animation-delay-500"></div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-pink-400 opacity-80"></div>
            </div>
            
            <div className = " text-2xl font-bold mb-3  px-1 py-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105 transition-transform duration-300">
              {Array.isArray(entries) ? entries.length : 0} Chronicles
            </div>
            
            {/* Decorative ornament */}
            <div className="mt-8 flex items-center space-x-3">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400 opacity-80 animate-pulse"></div>
              <svg className="w-6 h-6 text-purple-400 opacity-90 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 15 L7 18 L9 12 L4 8 L10 8 Z"/>
              </svg>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-pink-400 to-purple-400 opacity-80 animate-pulse"></div>
            </div>
          </div>
          
          {/* Binding rings */}
          
          
          {/* Side elements */}
          <div className="absolute right-3 top-1/4 w-1.5 h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse rounded-full"></div>
          <div className="absolute right-3 bottom-1/4 w-1.5 h-20 bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-60 animate-pulse rounded-full animation-delay-1000"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-70"></div>
          <div className="absolute top-32 right-12 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping opacity-50"></div>
        </div>
        
        {/* Shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-2xl opacity-40 transform translate-x-4 translate-y-4 -z-10 blur-lg"></div>
        
        {/* Page turning effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/10 via-purple-50/10 to-pink-50/10 rounded-2xl opacity-0 hover:opacity-30 transition-opacity duration-700 transform origin-left hover:rotateY-180"></div>
        
        {/* Hover hint */}
        <div className="bottom-5 left-1 ">
          <p className="text-grey-400 text-base font-medium drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] transition-colors">
            ✨ Click to unlock your mystical chronicles ✨
          </p>
          <div className="flex justify-center mt-2 space-x-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-80 animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-pulse animation-delay-300"></div>
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full opacity-80 animate-pulse animation-delay-600"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Bottom glow */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
</div>
  );
}

if (currentView === 'contents') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-purple-200 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-pink-200 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-cyan-200 rounded-full animate-pulse delay-300"></div>
        </div>
        
        <Navbar />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-purple-300 hover:text-cyan-300 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Back to Cover
              </span>
            </button>
            
            {/* Cosmic Contents Page */}
            <div className="bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-indigo-800/90 rounded-xl shadow-2xl border border-purple-500/30 p-8 min-h-[600px] relative overflow-hidden backdrop-blur-sm
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-transparent before:to-cyan-500/10 before:animate-pulse
                after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] after:pointer-events-none">
              
              {/* Nebula texture overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,transparent_50%)] opacity-60"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)] opacity-40"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(236,72,153,0.1)_0%,transparent_50%)] opacity-50"></div>
              
              {/* Cosmic corner effect */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 via-cyan-400/20 to-transparent transform rotate-45 translate-x-10 -translate-y-10 rounded-full blur-sm"></div>
              
              {/* Glowing orbs */}
              <div className="absolute top-8 left-6 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
              <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse delay-500"></div>
              
              {/* Cosmic title */}
              <div className="text-center mb-8 relative z-20">
                <div className="absolute left-1/4 right-1/4 bottom-2 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2 relative inline-block drop-shadow-2xl tracking-tight">
                  <span className="relative z-10 px-4 font-sans bg-gradient-to-b from-white/90 to-purple-100/90 bg-clip-text text-transparent filter drop-shadow-lg" 
                        style={{textShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'}}>
                    Contents
                  </span>
                </h1>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-4 animate-pulse"></div>
                {/* Cosmic sparkles around title */}
                <div className="absolute -top-2 left-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute -top-1 right-1/3 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping delay-300"></div>
              </div>
              
              {Array.isArray(entries) && entries.length > 0 ? (
                <div className="space-y-3 relative z-20">
                  {/* Cosmic margin lines */}
                  <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-purple-400/30 via-cyan-400/30 to-purple-400/30"></div>
                  <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400/40 to-purple-400/40"></div>
                  
                  {entries.map((entry, index) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-purple-800/40 hover:to-cyan-800/40 cursor-pointer transition-all duration-300 group relative
                        border-b border-purple-500/20 last:border-b-0 rounded-lg hover:shadow-xl hover:shadow-purple-500/20 backdrop-blur-sm z-10
                        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-300 before:rounded-lg"
                      onClick={() => openEntry(entry._id)}
                    >
                      {/* Cosmic entry number */}
                      <span className="text-sm mr-4 font-bold w-8 text-right bg-gradient-to-b from-white/90 to-purple-200/90 bg-clip-text text-transparent font-sans relative z-10"
                            style={{textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'}}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      
                      <div className="flex-grow relative z-10">
                        <h3 className="font-sans font-semibold text-lg bg-gradient-to-b from-white/95 to-slate-200/95 bg-clip-text text-transparent group-hover:from-cyan-200/95 group-hover:to-pink-200/95 transition-all duration-300 tracking-tight"
                            style={{textShadow: '0 0 15px rgba(139, 92, 246, 0.3)'}}>
                          {entry.title || `Entry #${index + 1}`}
                        </h3>
                        <p className="text-sm text-purple-200/80 mt-1 font-sans group-hover:text-cyan-200/80 transition-colors font-medium tracking-wide">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      
                      {/* Cosmic orb decoration */}
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-60 group-hover:opacity-100 group-hover:shadow-xl group-hover:shadow-purple-400/50 transition-all duration-300 z-10"></div>
                      
                      <ChevronRight className="w-5 h-5 text-purple-300/80 group-hover:text-cyan-200/90 transform group-hover:translate-x-1 transition-all duration-300 ml-4 drop-shadow-lg relative z-10" />
                      
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 relative z-20">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-300">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <FileText className="w-12 h-12 text-purple-300 mx-auto mb-6 relative z-10 drop-shadow-2xl" />
                  <p className=" relative z-10 font-sans mb-8 text-lg font-medium tracking-wide bg-gradient-to-b from-white/95 to-purple-100/95 bg-clip-text text-transparent"
                     style={{textShadow: '0 0 20px rgba(139, 92, 246, 0.4)'}}>
                    No entries yet. Start writing your cosmic story!
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition-all duration-300 relative z-10 
                      border border-purple-400/50 font-sans font-semibold text-lg shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 hover:translate-y-[-2px]
                      before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:rounded-xl before:opacity-50"
                      style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    <span className="flex items-center relative z-10">
                      Create New Entry
                      <div className="ml-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-lg"></div>
                    </span>
                  </button>
                </div>
              )}
              
              {/* Cosmic page number */}
              <div className="absolute bottom-6 right-6 text-xs font-serif bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {Math.floor(Math.random() * 10) + 1}
              </div>
              
              {/* Nebula effect in corner */}
              <div className="absolute bottom-12 left-12 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl animate-pulse"></div>
              
              {/* Floating cosmic particles */}
              <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-bounce delay-1000"></div>
              <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
        
        {/* Additional cosmic background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/6 left-1/6 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/12 w-20 h-20 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </div>
    );
  }


  
if (currentView === 'entry') {
    const entry = entries.find(e => e._id === selectedEntryId);
    if (!entry) return null;

    const entryIndex = entries.findIndex(e => e._id === selectedEntryId);
    const gradients = [
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-blue-500 via-teal-500 to-emerald-500',
      'from-rose-500 via-red-500 to-amber-500',
      'from-violet-500 via-fuchsia-500 to-blue-500',
      'from-cyan-500 via-blue-500 to-indigo-500'
    ];
    const randomGradient = gradients[entryIndex % gradients.length];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back button with page flip effect */}
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-all transform hover:translate-x-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform hover:-translate-x-1" />
              Back to Contents
            </button>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-green-400 mr-3" />
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Entry Display */}
            <div className="group">
              <div className={`relative transition-all duration-500 transform group-hover:rotate-y-6 h-full rounded-xl shadow-2xl overflow-hidden border-2 border-white/20 ${editingId === entry._id ? 'bg-white' : `bg-gradient-to-r ${randomGradient}`}`}>
              
                {editingId !== entry._id && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-12 bg-black/10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-black/10"></div>
                    <div className="absolute top-1/4 left-4 w-2 h-32 bg-white/30 rotate-12"></div>
                    <div className="absolute bottom-8 right-4 w-16 h-2 bg-white/30 rotate-45"></div>
                    <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-white/20"></div>
                  </>
                )}
                
                {/* Diary Content */}
                <div className="relative h-full p-0">
                  {/* Card Header */}
                  <div className={`px-8 py-6 ${editingId === entry._id ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}>
                    <div className="flex items-center justify-between">
                      {editingId === entry._id ? (
                        <div className="flex-grow mr-4">
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="text-2xl font-bold bg-white/20 rounded px-3 py-1 w-full text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            placeholder="Entry title"
                          />
                        </div>
                      ) : (
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                          {entry.title || `Entry #${entryIndex + 1}`}
                        </h2>
                      )}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-white/90">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">
                            {formatDate(entry.createdAt || entry.date)}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 ml-4">
                          {editingId === entry._id ? (
                            <>
                              <button 
                                onClick={() => handleUpdate(entry._id)}
                                className="p-1 text-green-100 hover:text-white transition-colors"
                                title="Save"
                              >
                                <Save className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={cancelEditing}
                                className="p-1 text-red-100 hover:text-white transition-colors"
                                title="Cancel"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditing(entry)}
                                className="p-1 text-white/80 hover:text-white transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                             
                              <button 
  onClick={() => {
   {
      handleDelete(entry._id);
    }
  }}
  className="p-1 text-white/80 hover:text-white transition-colors"
  title="Delete"
>
  <Trash2 className="w-5 h-5" />
</button>
                              
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={`p-8 ${editingId !== entry._id ? 'bg-white/90 backdrop-blur-sm' : ''}`}>
                    {editingId === entry._id ? (
                      <textarea
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                        placeholder="Write your diary entry..."
                      />
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                          {entry.content || 'No content available'}
                        </p>
                      </div>
                    ) }

                    {entry.images?.length > 0 && (
                                  <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">MEMORIES</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {entry.images.map((image) => (
                                        <div key={image._id} className="relative group aspect-square overflow-hidden rounded-lg shadow-md">
                                          <img
                                            src={image.url}
                                            alt="Diary memory"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                          />
                                         
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                    


                  
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          
                          
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                          <div className="w-1 h-1 bg-pink-300 rounded-full"></div>
                          <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                 
              
              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 bg-black/20 blur-md rounded-xl -z-10 translate-y-4 group-hover:translate-y-6 transition-transform duration-500"></div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="fixed top-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="fixed bottom-20 left-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="fixed top-1/2 left-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    );
  }

  return null;
};

export default DiaryChronicles;