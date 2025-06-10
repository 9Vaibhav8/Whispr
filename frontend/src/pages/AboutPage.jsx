import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import team2 from '../assets/team2.jpg';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  const { user, logout, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAuthenticated = !!user;

  return (
    <div className="whispr-about font-sans bg-gray-50 min-h-screen">
      <Navbar />

      <main className="pt-24">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-16 md:py-24 ">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                Our <span className="text-indigo-600">Story</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At whispr, we believe in the transformative power of personal reflection. Our journey began with a simple question: how can we create a digital space that feels as intimate and special as a physical journal?
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2025 by a team of writers, designers, and developers who shared a passion for journaling, whispr was born to blend the timeless practice of diary-keeping with modern technology.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img 
                src={team2} 
                alt="Team working on whispr" 
                className="rounded-xl shadow-xl w-full object-cover h-96"
              />
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="bg-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-4">Our Purpose</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                To create a sanctuary for your thoughts where privacy meets beauty, and where the art of journaling can flourish in the digital age.
              </p>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-indigo-500 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values section */}
   <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
  {/* 3D Floating Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
  </div>

  {/* Glossy Grid Pattern */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center mb-20">
      <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-semibold px-4 py-2 rounded-full uppercase mb-4 shadow-sm">
        What We Stand For
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Core Values</span>
      </h2>
      <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full shadow-md"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Value Card 1 - Privacy First */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg transform group-hover:-rotate-1 transition-all duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-gray-100/50 shadow-md group-hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 w-20 h-20 rounded-xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-5 text-gray-900 text-center">Privacy First</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            Your journal is your sanctuary. We've built whispr with uncompromising privacy protections so you can write without reservation.
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Value Card 2 - Beautiful Experience */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg transform group-hover:rotate-1 transition-all duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-gray-100/50 shadow-md group-hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 w-20 h-20 rounded-xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-5 text-gray-900 text-center">Beautiful Experience</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            We believe that the aesthetics of your writing space matters. Our design philosophy embraces simplicity, warmth, and thoughtful details.
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Value Card 3 - Mindful Technology */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg transform group-hover:-rotate-1 transition-all duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-gray-100/50 shadow-md group-hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-5 text-gray-900 text-center">Mindful Technology</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            We create technology that enhances the journaling experience without getting in the way, supporting your practice rather than distracting from it.
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Journey section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-4">Our Evolution</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <div className="w-16 h-1 bg-indigo-500 mx-auto rounded"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-indigo-200"></div>
                
                {/* Timeline entries */}
                {[
                  {
                    year: "2025",
                    title: "The Beginning",
                    content: "whispr started as a personal project to create a better digital journaling experience."
                  },
                  {
                    year: "2025",
                    title: "Official Launch",
                    content: "whispr was officially released, bringing our vision of beautiful, private digital journaling to life."
                  },
                ].map((entry, index) => (
                  <div key={index} className={`mb-12 flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="hidden md:block md:w-1/2"></div>
                    
                    <div className="md:w-1/2 flex">
                      <div className={`${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} w-full`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                          {/* Timeline dot */}
                          <div className={`absolute top-6 -left-4 md:${index % 2 === 0 ? '-right-4' : '-left-4'} w-8 h-8 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">{entry.year}</span>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                          <p className="text-gray-600">{entry.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-4">Need Help?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="w-16 h-1 bg-indigo-500 mx-auto rounded"></div>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "Is my journal content private?",
                  a: "Absolutely. We use end-to-end encryption to ensure that only you can access your journal entries."
                },
                {
                  q: "Can I export my journal entries?",
                  a: "Yes, you can export your journal as PDF or plain text files at any time. Your data is always yours."
                },
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 mr-4 group-hover:bg-indigo-200 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.q}</h3>
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  </div>
                  {index < 1 && <div className="border-b border-gray-100 mt-6"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
   <section className="relative overflow-hidden bg-gray-900 py-32 text-white">
  {/* Grid line background (dynamic responsive) */}
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a4a4a_1px,transparent_1px),linear-gradient(to_bottom,#4a4a4a_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent"></div>
  </div>

  {/* Animated gradient overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4f46e580_0%,transparent_70%)] animate-pulse-slow"></div>

  {/* Floating grid elements (3D depth) */}
  <div className="absolute inset-0">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i}
        className="absolute border border-white/10 rounded-lg"
        style={{
          width: `${Math.random() * 200 + 100}px`,
          height: `${Math.random() * 200 + 100}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `float ${Math.random() * 20 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-300">
        Start your <span className="italic">journaling practice</span> today
      </h2>
      
      <p className="text-xl md:text-2xl text-gray-300 mb-12 mx-auto leading-relaxed max-w-2xl">
        Join <span className="font-semibold text-white">thousands of writers</span> who've found their digital sanctuary with whispr.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link 
          to="/auth" 
          className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-12 py-5 rounded-xl font-semibold text-white shadow-2xl hover:shadow-[0_10px_30px_-5px_rgba(34,211,238,0.3)] transition-all duration-500 hover:-translate-y-1.5"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Get Started
          </span>
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
        
        <Link 
          to="/features" 
          className="relative overflow-hidden group border-2 border-white/20 hover:border-cyan-400/30 bg-white/5 hover:bg-white/10 backdrop-blur-lg px-12 py-5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </span>
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </Link>
      </div>
    </div>
  </div>
</section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">whispr</h2>
              <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
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
              <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-gray-300 text-sm transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;