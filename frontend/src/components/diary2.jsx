import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the import path as necessary
import { Image, Upload, X, Trash2, Zap, Brain, Eye } from 'lucide-react';

const MyDiary = () => {
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    mood: '',
  });
  const [images, setImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);

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
      
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
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
      
      if (imageToDelete.publicId) {
        await axios.delete(`http://localhost:5000/api/images/${imageToDelete.publicId}`, {
          withCredentials: true
        });
      }
      
      
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
    const response = await axios.post('http://localhost:5000/api/diary', {
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
    }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glitch scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.8) 2px,
            rgba(0, 255, 255, 0.8) 4px
          )`,
          animation: 'scanlines 0.1s linear infinite'
        }}></div>
      </div>

      {/* Navbar placeholder - replace with your actual navbar */}
      <div className="h-16 relative z-10">
        {/* Your navbar component would go here */}
        <div className="h-full bg-white/8 backdrop-blur-md border-b border-white/20 flex items-center ">
          <Navbar />
        </div>
      </div>
      
      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Personal Diary</h1>
            <p className="text-gray-300">Capture your thoughts and memories</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>{wordCount} words</span>
                  <span>{images.length} photos</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Title Input */}
              <div>
                <input
                  type="text"
                  name="title"
                  className="w-full text-2xl font-semibold text-white placeholder-white/50 bg-transparent border-none outline-none focus:outline-none"
                  placeholder="What's on your mind today?"
                  value={entry.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative overflow-hidden rounded-lg bg-white/10">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedImage(image)}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleImageDelete(image.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {uploadProgress[image.name] && uploadProgress[image.name] < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                            <div 
                              className="bg-blue-400 h-1 transition-all duration-300" 
                              style={{ width: `${uploadProgress[image.name]}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Content Textarea */}
              <div>
                <textarea
                  name="content"
                  className="w-full h-80 text-white placeholder-white/50 bg-transparent border-none outline-none resize-none text-lg leading-relaxed"
                  placeholder="Write your story here..."
                  value={entry.content}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/20 flex justify-between items-center">
              <button 
                onClick={() => setShowImageUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                disabled={isSaving}
              >
                <Image size={18} />
                Add Photo
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || !entry.title || !entry.content}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Entry'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-black/90 border border-cyan-500 rounded-lg p-6 max-w-md w-full backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-cyan-400 font-mono">MEMORY_UPLOAD_PROTOCOL</h3>
              <button 
                onClick={() => {
                  setShowImageUpload(false);
                  setError(null);
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="border-2 border-dashed border-cyan-600/50 rounded-lg p-8 text-center bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload size={40} className="mx-auto mb-4 text-cyan-400" />
                <p className="text-white font-mono text-sm">NEURAL_LINK_READY</p>
                <p className="text-gray-400 font-mono text-xs mt-2">JPG, PNG | MAX: 5MB</p>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-cyan-400 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <div className="bg-black/80 border border-cyan-500 rounded-lg p-4 backdrop-blur-sm">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto rounded filter contrast-125"
              />
              <div className="mt-4 flex justify-between items-center text-cyan-400 font-mono text-sm">
                <span>MEM_{selectedImage.id} | {(selectedImage.size / 1024).toFixed(1)}KB</span>
                <button
                  onClick={() => handleImageDelete(selectedImage.id)}
                  className="px-4 py-2 bg-red-900/50 border border-red-500 text-red-300 rounded hover:bg-red-800/50 transition-all"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 bg-green-900/80 border border-green-400 text-green-300 px-6 py-4 rounded-lg z-50 backdrop-blur-sm font-mono">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center font-bold">✓</div>
            <span>MEMORY_CORE_UPDATED</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-1px); }
          40% { transform: translateX(1px); }
          50% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MyDiary;