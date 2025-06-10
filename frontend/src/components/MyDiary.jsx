import { useState } from 'react';
import axios from 'axios';
import {  PenLine, Save, FileText,Image, Upload, X, Trash2,  BookOpen , ZoomIn } from 'lucide-react';
import * as THREE from 'three';
import Navbar from '../components/Navbar';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 60;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xD2691E,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={mountRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

const MyDiary = () => {
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    mood: '',
  });
  const [images, setImages] = useState([]);

  const [characterCount, setCharacterCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [isBookOpen, setIsBookOpen] = useState(false);

 const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Better file validation
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  
const openBook = () => {
  setIsBookOpen(true);
};

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
    
    if (name === 'content') {
      setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    }
  };

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('https://whispr-backend-cgh7.onrender.com/api/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: percentCompleted
          }));
        }
      });
      
      return {
        url: response.data.imageUrl,
        publicId: response.data.publicId,
        uploadedBy: response.data.userId
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setUploadProgress(prev => {
        const newProgress = {...prev};
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };
  

  const handleFileInputChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Create preview and store file for upload
      const previewImage = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        file: file,
        isUploading: true
      };
      
      setImages(prev => [...prev, previewImage]);
      setShowImageUpload(false);
      setError(null);
      
      // Start upload immediately
      uploadImageToServer(file)
        .then(uploadedImage => {
          setImages(prev => prev.map(img => 
            img.id === previewImage.id 
              ? { ...uploadedImage, id: img.id } 
              : img
          ));
        })
        .catch(() => {
          setImages(prev => prev.filter(img => img.id !== previewImage.id));
          setError('Failed to upload image');
        });
    }
  };

  const handleImageDelete = async (imageId) => {
    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) return;

    try {
      // If image was already uploaded to server, you might want to delete it there too
      if (imageToDelete.publicId) {
        await axios.delete(`https://whispr-backend-cgh7.onrender.com/api/images/${imageToDelete.publicId}`, {
          withCredentials: true
        });
      }
      
      // Clean up object URL if it exists
      if (imageToDelete.url && imageToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      
      setImages(prev => prev.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const handleSave = async () => {
  if (!entry.title.trim() || !entry.content.trim()) {
    setError('Title and content are required');
    return;
  }

  setIsSaving(true);
  setError(null);

  try {
    // 1. Upload all images first
    const uploadedImages = [];
    for (const image of images) {
      // Only upload if it hasn't been uploaded yet (no publicId)
      if (!image.publicId && image.file) {
        const uploadedImage = await uploadImageToServer(image.file);
        uploadedImages.push(uploadedImage);
      } else if (image.publicId) {
        // Already uploaded, use existing data
        uploadedImages.push({
          url: image.url,
          publicId: image.publicId,
          uploadedBy: image.uploadedBy
        });
      }
    }

    // 2. Create diary entry with all images
    const response = await axios.post('https://whispr-backend-cgh7.onrender.com/api/diary', {
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      images: uploadedImages
    }, { 
      withCredentials: true 
    });

    // 3. Reset form on success
    setEntry({
      title: '',
      content: '',
      mood: ''
    });
    setImages([]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
  } catch (error) {
    console.error('Error creating diary:', error);
    setError(error.response?.data?.message || 'Failed to save diary');
  } finally {
    setIsSaving(false);
  }
};
  

return (

    <div className="min-h-screen ">  
    <Navbar />
       <style>{`
        .pen-cursor textarea,
        .pen-cursor input {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23B45309" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>'), text !important;
        }
        
        .lined-paper {
          background-image: 
            linear-gradient(to right, #dc2626 80px, transparent 80px),
            repeating-linear-gradient(
              transparent,
              transparent 28px,
              #e5e7eb 28px,
              #e5e7eb 30px
            );
          background-size: 100% 30px;
          line-height: 30px;
          padding-left: 100px;
          padding-right: 40px;
          padding-top: 20px;
          padding-bottom: 20px;
        }
        
        .notebook-shadow {
          box-shadow: 
            0 0 0 1px rgba(0,0,0,0.08),
            0 8px 16px -4px rgba(0,0,0,0.12),
            0 20px 25px -5px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.7);
        }
        
        .spiral-holes {
          background: radial-gradient(circle at center, transparent 6px, #f3f4f6 6px, #f3f4f6 8px, transparent 8px);
          background-size: 40px 40px;
          background-position: 20px 20px;
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
        
        .writing-focus textarea:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.05);
        }

        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-in {
          animation: animate-in 0.2s ease-out;
        }

        .fade-in { animation: fadeIn 0.3s ease-out; }
        .zoom-in { animation: zoomIn 0.3s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { transform: scale(0.9); }
          to { transform: scale(1); }
        }
      `}</style>
      
<main className="pt-20 pb-12 px-4">
  <div className="container mx-auto max-w-4xl">
    
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4 floating-animation">
        Your Digital <span className="italic text-amber-700">Diary</span>
      </h1>
      <p className="text-lg text-amber-700 max-w-2xl mx-auto">
        Capture your thoughts, dreams, and memories in this beautiful digital diary. 
        Let your words flow like ink on paper.
      </p>
    </div>
    
    <div className="relative w-full max-w-6xl h-[700px] left-20 perspective-1000 mx-auto">
      
     
      <div 
        className={`absolute inset-0 transition-all duration-1000 transform-style-preserve-3d ${
          isBookOpen ? 'rotate-y-180 opacity-0 pointer-events-none' : 'rotate-y-0 opacity-100'
        }`}
      >
        <div className="relative w-full h-full">
       
          <div className="absolute  bg-black/20 rounded-r-xl  blur-xl"></div>
          
       
          <div 
            className="relative w-full h-full bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-xl shadow-2xl overflow-hidden max-w-2xl justify-center cursor-pointer group"
            onClick={openBook}
          >
            {/* Leather Texture Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-transparent"></div>
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0,0,0,0.3) 1px, transparent 1px),
                                  radial-gradient(circle at 60% 70%, rgba(0,0,0,0.2) 1px, transparent 1px),
                                  radial-gradient(circle at 80% 20%, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: '30px 30px, 25px 25px, 35px 35px'
              }}
            ></div>
            
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-900/50"></div>
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-amber-600/30"></div>
            
      
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="relative mb-8">
                <BookOpen size={80} className="text-amber-200/80 drop-shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent rounded-full blur-xl"></div>
              </div>
              
              <h1 className="text-4xl font-bold text-amber-100 mb-2 drop-shadow-2xl font-sans tracking-wide">
                My Personal
              </h1>
              <h2 className="text-6xl font-bold text-amber-50 mb-4 drop-shadow-2xl font-sans tracking-wider">
                DIARY
              </h2>
            </div>

            {/* Bookmark */}
            <div className="absolute top-0 right-8 w-4 h-16 bg-gradient-to-b from-red-600 to-red-800 shadow-lg transform translate-y-0 group-hover:translate-y-2 transition-transform duration-300">
              <div className="absolute bottom-0 left-0 right-0 h-0 w-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-800 mx-auto"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/0 to-amber-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Open Book State */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 transform-style-preserve-3d ${
          isBookOpen ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative w-full h-full">
          {/* Open Book Content - Improved Layout Structure */}
          <div className="notebook-shadow bg-white rounded-2xl overflow-hidden w-full h-full flex flex-col relative">
            
            {/* Writing Stats - Fixed at top center */}
  {/* Writing Stats - Fixed above the notebook */}
            <div className={`fixed top-2 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${
              isBookOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="b backdrop-blur-sm rounded-full px-8 py-3 shadow-xl border border-amber-200/50">
                <div className="flex items-center gap-6 text-sm text-amber-700 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Writing Mode</span>
                  </div>
                  <div className="w-px h-4 bg-amber-300"></div>
                  <span>{wordCount || 0} words</span>
                  <div className="w-px h-4 bg-amber-300"></div>
                  <span>0 characters</span>
                  {images && images.length > 0 && (
                    <>
                      <div className="w-px h-4 bg-amber-300"></div>
                      <span>{images.length} photo{images.length !== 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
  
            {/* Header - Top section with red gradient */}
            <div className="bg-gradient-to-r from-red-100 via-red-50 to-orange-100 px-8 py-6 border-b border-red-200 flex-shrink-0 mt-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-red-300 rounded-full shadow-sm"></div>
                  </div>
                  <div className="text-red-800 font-medium">
                    Today's Entry
                  </div>
                </div>
                <div className="text-red-700 text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            {/* Spiral Holes */}
            <div className="spiral-holes h-6 bg-gray-100 border-b border-gray-200 flex-shrink-0"></div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="writing-focus flex-1 overflow-y-auto">
                
                {/* Error Message */}
                {error && (
                  <div className="mx-8 mt-6 p-4 bg-red-100 text-red-700 rounded-lg backdrop-blur-sm text-sm border border-red-200">
                    {error}
                  </div>
                )}

                {/* Title Input */}
                <div className="px-10 py-8 border-b border-gray-100">
                  <input
                    type="text"
                    name="title"
                    className="w-full text-3xl md:text-4xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent"
                    placeholder="What's on your mind today..."
                    value={entry.title}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Images Gallery */}
                {images && images.length > 0 && (
                  <div className="px-10 py-8 border-b border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="relative overflow-hidden rounded-xl shadow-lg">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-56 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
                              onClick={() =>  setSelectedImage(image)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setSelectedImage(image)}
                                  className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all transform hover:scale-110"
                                >
                                  <ZoomIn size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                     handleImageDelete(image.id);
                                  }}
                                  className="p-3 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transition-all transform hover:scale-110"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            {uploadProgress && uploadProgress[image.name] && uploadProgress[image.name] < 100 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gray-200/80 h-2 rounded-b-xl">
                                <div 
                                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-b-xl transition-all duration-300" 
                                  style={{ width: `${uploadProgress[image.name]}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Textarea with lined paper effect */}
                <div className="px-10 py-8 min-h-[400px] relative">
                  {/* Red margin line */}
                  <div className="absolute left-20 top-0 bottom-0 w-0.5 bg-red-300 opacity-60"></div>
                  
                  <textarea
                    name="content"
                    className="w-full h-full min-h-[400px] resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-500 text-lg leading-8 font-light pl-12"
                    placeholder="Dear diary, today I want to share..."
                    value={entry.content}
                    onChange={handleInputChange}
                    style={{ 
                      lineHeight: '32px',
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
                      backgroundSize: '100% 32px'
                    }}
                  />
                </div>
                
              </div>
            </div>

            {/* Floating Action Bar - Positioned at bottom center */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-white/95 backdrop-blur-lg border border-amber-200/50 rounded-2xl shadow-2xl px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  {/* Close Book Button */}
                  <button
                    onClick={() => setIsBookOpen(false)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-4xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-sm">Close</span>
                  </button>

                  {/* Separator */}
                  <div className="w-px h-8 bg-amber-300/50"></div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowImageUpload(true)}
                      className="p-3 text-amber-700 hover:bg-amber-50 rounded-xl transition-all hover:scale-110 relative group"
                      disabled={isSaving}
                      title="Add Photos"
                    >
                      <Image size={20} />
                      {images && images.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {images.length}
                        </div>
                      )}
                    </button>
                    
                    <button 
                      className="p-3 text-amber-700  hover:bg-amber-50 rounded-xl transition-all hover:scale-110 relative group"
                      title="Format Text"
                    >
                      <PenLine size={20} />
                    </button>
                    
                    <button 
                      className="p-3 text-amber-700 hover:bg-amber-50 rounded-xl transition-all hover:scale-110 relative group"
                      title="Templates"
                    >
                      <FileText size={20} />
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-8 bg-amber-300/50"></div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !entry.title || !entry.content}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-4xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50  shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-sm">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span className="text-sm">Save </span>
                        
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

      

      
    {showImageUpload && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image size={24} />
            <h3 className="text-lg font-semibold">Add Photo to Entry</h3>
          </div>    
          <button 
            onClick={() => {
              setShowImageUpload(false);
              setError(null);
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20}/>
          </button>
        </div>
      </div>

      <div className="p-6 z-10">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-amber-500 bg-amber-50 scale-105' 
              : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {Object.keys(uploadProgress).length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="text-amber-700 font-medium">Uploading your photo...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Upload size={32} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800 mb-2">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-gray-600">
                    or click to browse files
                  </p>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('image-upload').click()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Choose Photo
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Supports JPG, PNG up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="image-upload"
        />
      </div>
    </div>
  </div>
)}

    {selectedImage && (
      
       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="relative max-w-4xl max-h-[90vh] w-full">
    <button
      onClick={() => setSelectedImage(null)}
      className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
    >
      <X size={32} />
    </button>

    <img
      src={selectedImage?.url}
      alt={selectedImage?.name}
      className="w-full h-full object-contain rounded-lg shadow-2xl"
      style={{
        viewTransitionName: 'selected-image',
        touchAction: 'none'
      }}
    />

    <div className="absolute bottom-4 right-4 group">
      <button
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          if (window.confirm('Delete this memory forever?')) {
            try {
              await handleImageDelete(selectedImage.id);
              setSelectedImage(null); // Only close after successful deletion
            } catch (error) {
              console.error("Delete failed:", error);
              // Optionally show error to user
            }
          }
        }}
        className="px-4 py-2 bg-gradient-to-br from-red-500/90 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
      >
        <Trash2 size={16} className="flex-shrink-0" />
        <span>Delete Memory</span>
      </button>
      <div className="absolute -bottom-8 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        This cannot be undone
      </div>
    </div>
  </div>
</div>
    )}

        {saveSuccess && (
        <div className="fixed top-24 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="font-medium">Entry saved successfully!</p>
              <p className="text-sm opacity-90">Your thoughts are now preserved</p>
            </div>
          </div>
        </div>
      )}
    
  

    
  </div>
  );
};

export default MyDiary;
