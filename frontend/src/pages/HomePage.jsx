import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import diary from '../assets/diary.jpg'; 
import Navbar from '../components/Navbar';

const Homepage = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  const handleLogout = async () => {
    await logout();
  };

  const isAuthenticated = !!user;

  return (
    <div className="whispr-homepage font-sans w-screen h-screen overflow-visible">
      <Navbar />

      <main className="bg-gray-50">
        {/* Hero Section */}
       <section className="hero-section w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
      {/* Text Content (Enhanced Typography & Micro-interactions) */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Your thoughts,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 italic animate-gradient">
            whispered
          </span>{" "}
          into the pages
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 max-w-lg">
          Capture your daily moments, reflections, and ideas in a beautiful, secure digital diary. Write freely and find peace in your words.
        </p>
        <div className="flex flex-wrap gap-4">
          {isAuthenticated ? (
            <Link
  to="/diary"
  className="relative px-8 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-600 text-white rounded-xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-inner"
  style={{
    transformStyle: 'preserve-3d',
    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4), 0 5px 10px -5px rgba(236, 72, 153, 0.2)'
  }}
>
  <span 
    className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-white/0 opacity-80"
    aria-hidden="true"
  />
  <span className="relative flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
    Open My Diary
  </span>
</Link>
          ) : (
            <Link
              to="/auth"
              className="px-8 py-3.5 bg-gradient-to-r  from-indigo-700 via-purple-700 to-violet-600 text-white rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Start Writing
            </Link>
          )}
          <Link
            to="/learn-more"
            className="px-8 py-3.5 border border-gray-200 rounded-xl text-gray-700 text-lg font-medium hover:bg-gray-50/80 transition-all duration-300 hover:-translate-y-1 shadow-sm"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Image Content (3D Depth + Floating Elements) */}
      <div className="md:w-1/2 relative">
        {/* Floating Abstract Shapes */}
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100/30 rounded-full blur-xl -z-10 animate-float"></div>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-100/30 rounded-full blur-xl -z-10 animate-float-delay"></div>

        {/* Modern Card with Glass Morphism */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm bg-white/80">
          <img
            src={diary}
            alt="Whispr diary app illustration"
            className="w-full h-auto object-cover rounded-2xl transform hover:scale-[1.02] transition-transform duration-500"
            style={{ aspectRatio: "4/3" }}
          />
          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute -top-3 -right-3 w-16 h-16 border-t-4 border-r-4 border-indigo-300/70 rounded-tr-xl"></div>
      </div>
    </div>
  </div>
</section>

        {/* Features Section */}
       <section className="relative py-10 overflow-hidden bg-white">
  {/* Glassmorphism background elements */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Blurred gradient backdrop */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/10 backdrop-blur-[150px]"></div>
    
    {/* Floating glassmorphism blobs */}
    <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-blue-100/10 backdrop-blur-[100px] animate-float1 border border-white/20"></div>
    <div className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-indigo-100/10 backdrop-blur-[100px] animate-float2 border border-white/20"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center mb-20">
      <span className="inline-block text-blue-500 font-medium text-sm uppercase tracking-wider mb-4">Why Choose Us</span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 italic">Whispr</span> Difference
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Designed for writers who demand excellence in every detail of their digital journaling experience
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature Card 1 - Glassmorphism */}
      <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-white/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-3">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100/80 to-blue-50/80 text-blue-600 shadow-inner group-hover:shadow-md transition-all duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.5l-.394-.933a2.25 2.25 0 00-1.423-1.423L13.5 19.5l.933-.394a2.25 2.25 0 001.423-1.423l.394-.933.394.933a2.25 2.25 0 001.423 1.423l.933.394-.933.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Beautiful Experience</h3>
          <p className="text-gray-600 leading-relaxed">
            A meticulously crafted, distraction-free writing environment designed to inspire creativity and deep reflection.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 backdrop-blur-sm"></div>
      </div>
      
      {/* Feature Card 2 - Glassmorphism */}
      <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-white/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-3">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-t-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100/80 to-indigo-50/80 text-indigo-600 shadow-inner group-hover:shadow-md transition-all duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Privacy First</h3>
          <p className="text-gray-600 leading-relaxed">
            Military-grade encryption ensures your most private thoughts remain exclusively yours, always.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 backdrop-blur-sm"></div>
      </div>
      
      {/* Feature Card 3 - Glassmorphism */}
      <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-white/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-3">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100/80 to-purple-50/80 text-purple-600 shadow-inner group-hover:shadow-md transition-all duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Find Your Moments</h3>
          <p className="text-gray-600 leading-relaxed">
            Advanced search, AI-powered tagging, and smart organization help you rediscover meaningful moments.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 backdrop-blur-sm"></div>
      </div>
    </div>

    {/* Glassmorphism CTA */}
    <div className="mt-20 text-center">
      <button className="group relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm border border-white/20">
        <span className="relative z-10 text-white font-medium mr-3">Start Your Journey Today</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </button>
    </div>
  </div>
</section>

        {/* Testimonials Section */}
       <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-20 -translate-x-20 -translate-y-20"></div>
  <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100 rounded-full filter blur-3xl opacity-20 translate-x-20 translate-y-20"></div>
  
  <div className="container mx-auto px-4 max-w-7xl relative z-10">
    <div className="text-center mb-16">
   
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        Voices from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">writing community</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Discover how Whispr has transformed the writing habits of storytellers worldwide
      </p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Testimonial 1 */}
      <div className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl"></div>
        
        <div className="mb-6">
          <div className="text-blue-400 text-4xl mb-3 opacity-80">"</div>
          <p className="text-gray-700 text-lg leading-relaxed pl-6 relative before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-300 before:to-indigo-400 before:transition-all before:duration-700 group-hover:before:opacity-100">
            Whispr has become my daily companion. It's where I process my thoughts and track my growth. The simplicity makes writing a joy.
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
              <span className="text-blue-600 font-medium text-lg">AS</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Alex Smith</h4>
            <p className="text-sm text-gray-500">Daily writer, 2 years</p>
          </div>
        </div>
      </div>
      
      {/* Testimonial 2 */}
      <div className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-t-2xl"></div>
        
        <div className="mb-6">
          <div className="text-indigo-400 text-4xl mb-3 opacity-80">"</div>
          <p className="text-gray-700 text-lg leading-relaxed pl-6 relative before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-300 before:to-purple-400 before:transition-all before:duration-700 group-hover:before:opacity-100">
            I've tried many journaling apps, but Whispr's attention to detail and focus on privacy won me over. It feels like writing in a real diary.
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
              <span className="text-indigo-600 font-medium text-lg">JD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Jamie Diaz</h4>
            <p className="text-sm text-gray-500">Creative writer</p>
          </div>
        </div>
      </div>
    </div>

    {/* Trust indicators */}
    <div className="mt-16 pt-8 border-t border-gray-100">
     
    </div>
  </div>
</section>

        {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-24 md:py-32">
  {/* Animated gradient background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-[100px] opacity-40 animate-float1"></div>
    <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-purple-600 rounded-full mix-blend-soft-light filter blur-[90px] opacity-30 animate-float2"></div>
    <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-soft-light filter blur-[80px] opacity-20 animate-float3"></div>
  </div>

  {/* Grid texture overlay */}
  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      {/* Animated heading with gradient text */}
      <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight animate-text-shimmer">
        <span className="inline-block">Begin Your</span>{' '}
        <span className="inline-block text-blue-300">Writing Journey</span>{' '}
        <span className="inline-block">Today</span>
      </h2>
      
      {/* Elegant paragraph with animated border */}
      <div className="relative inline-block mb-10 group">
        <p className="text-xl md:text-2xl text-blue-100/90 font-light max-w-2xl mx-auto leading-relaxed">
          Your digital diary awaits. Start capturing your thoughts, dreams, and memories with Whispr.
        </p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent group-hover:w-full transition-all duration-700"></div>
      </div>
      
      {/* Premium button with hover effects */}
      <div className="flex justify-center">
        {isAuthenticated ? (
          <Link 
            to="/diary" 
            className="relative overflow-hidden px-10 py-4 bg-white/90 text-indigo-900 rounded-xl text-lg font-semibold hover:bg-white transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
          >
            <span className="relative z-10 flex items-center">
              Open Your Diary 
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </Link>
        ) : (
          <Link 
            to="/auth" 
            className="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-500 shadow-xl transform hover:-translate-y-1 group"
          >
            <span className="relative z-10 flex items-center">
              Start Writing Now
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute top-0 left-0 w-full h-0.5 bg-white/50 group-hover:bg-white transition-all duration-1000"></span>
          </Link>
        )}
      </div>
    </div>
  </div>

  {/* Corrected style tag with all animations */}
  <style jsx>{`
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-20px, -20px); }
    }
    
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(15px, 20px); }
    }
    
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(10px, -15px); }
    }
    
    @keyframes text-shimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    
    .animate-float1 { animation: float1 12s ease-in-out infinite; }
    .animate-float2 { animation: float2 10s ease-in-out infinite; }
    .animate-float3 { animation: float3 8s ease-in-out infinite; }
    .animate-text-shimmer { 
      background-size: 200% auto;
      animation: text-shimmer 3s linear infinite; 
    }
  `}</style>
</section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4 italic">whispr</h2>
              <p className="text-gray-400 max-w-md mb-6">
                Your cozy corner for thoughts, reflections, and personal growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links columns */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/calendar" className="text-gray-400 hover:text-white transition">Calendar</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition">Features</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Whispr. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-white text-sm transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;