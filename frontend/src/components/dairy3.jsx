import { useState } from 'react';
import axios from 'axios';
import { Image, Upload, X, Trash2 } from 'lucide-react';
import Navbar from './Navbar'; // Assuming you have a Navbar component

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
      // If image was already uploaded to server, you might want to delete it there too
      if (imageToDelete.publicId) {
        await axios.delete(`http://localhost:5000/api/images/${imageToDelete.publicId}`, {
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
      // Filter out any images that failed to upload
      const validImages = images.filter(img => img.url && img.publicId && img.uploadedBy);

      const res = await fetch('http://localhost:5000/api/diary', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: entry.title.trim(),
          content: entry.content.trim(),
          mood: entry.mood || null,
          images: validImages
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save diary entry');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Reset form after successful save
      setEntry({ title: '', content: '', mood: '' });
      setImages([]);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || 'Failed to save diary entry');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
        radial-gradient(circle at 80% 50%, rgba(0,0,0,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px'
    }}>
      {/* Wood grain background pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.1) 2px,
          rgba(0,0,0,0.1) 4px
        )`
      }}></div>

      {/* Navbar placeholder */}
      <div className="h-16 bg-gradient-to-r  shadow-lg"> <Navbar/></div>
      
      
      <main className="pt-8 pb-12 px-4 relative z-10">
        
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-serif text-amber-100 mb-2 drop-shadow-lg" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>My Personal Diary</h1>
            <p className="text-amber-200 text-lg font-light">Where memories come to life</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md border-l-4 border-red-500 transform transition-all duration-300 hover:scale-105">
              {error}
            </div>
          )}

          {/* Main Diary Book */}
          <div className="relative perspective-1000">
            <div className="diary-book transform-gpu transition-all duration-500 hover:rotateY-2" style={{
              background: 'linear-gradient(145deg, #f4f1e8, #e8e0d0)',
              boxShadow: `
                0 30px 60px rgba(0,0,0,0.3),
                inset 0 1px 0 rgba(255,255,255,0.8),
                inset 0 -1px 0 rgba(0,0,0,0.1)
              `,
              borderRadius: '20px 8px 8px 20px',
              border: '3px solid #8B4513',
              position: 'relative',
              minHeight: '600px'
            }}>
              
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-amber-800 to-amber-700 rounded-l-2xl shadow-inner"></div>
              
              {/* Ring binding holes */}
              <div className="absolute left-8 top-12 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute left-8 top-24 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute left-8 top-36 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute left-8 bottom-36 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute left-8 bottom-24 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute left-8 bottom-12 w-3 h-3 bg-gray-400 rounded-full shadow-inner"></div>

              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-10 rounded-lg" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, #000 0.5px, transparent 0.5px)
                `,
                backgroundSize: '20px 20px, 15px 15px'
              }}></div>

              {/* Diary content */}
              <div className="p-12 pl-20 relative z-10">
                {/* Date line at top */}
                <div className="text-right mb-6 text-gray-600 font-handwriting text-lg">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                {/* Title input */}
                <div className="mb-8">
                  <input
                    type="text"
                    name="title"
                    className="w-full text-3xl font-serif text-gray-800 placeholder-gray-400 bg-transparent  outline-none border-b-2 border-dotted border-gray-300 pb-2 focus:border-amber-600 transition-colors"
                    placeholder="Deer Diary..."
                    value={entry.title}
                    onChange={handleInputChange}
                    style={{
                      fontFamily: '"Dancing Script", cursive',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>

                {/* Images section */}
                {images.length > 0 && (
                  <div className="mb-8 grid grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                        <div className="polaroid-frame bg-white p-3 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300" style={{
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-32 object-cover cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          />
                          <div className="text-xs text-gray-600 mt-2 text-center font-handwriting">
                            Memory #{image.id}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(image.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {uploadProgress[image.name] && uploadProgress[image.name] < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                            <div 
                              className="bg-amber-500 h-1 transition-all duration-300" 
                              style={{ width: `${uploadProgress[image.name]}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Main content textarea */}
                <div className="relative">
                  {/* Lined paper effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({length: 12}).map((_, i) => (
                      <div 
                        key={i} 
                        className="border-b border-blue-200 h-8"
                        style={{ marginTop: i === 0 ? '16px' : '16px' }}
                      ></div>
                    ))}
                  </div>
                  
                  <textarea
                    name="content"
                    className="w-full h-80 p-4 bg-transparent border-none outline-none resize-none text-gray-800 leading-8 font-handwriting text-lg relative z-10"
                    placeholder="Today I want to remember..."
                    value={entry.content}
                    onChange={handleInputChange}
                    style={{
                      fontFamily: '"Kalam", cursive',
                      lineHeight: '32px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex justify-between items-center mt-8 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <div className="text-amber-100 font-medium flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                {wordCount} words
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                {images.length} photos
              </span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowImageUpload(true)}
                className="p-3 text-amber-100 hover:text-white bg-amber-700/50 hover:bg-amber-600 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 backdrop-blur-sm"
                disabled={isSaving}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              >
                <Image size={20} />
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || !entry.title || !entry.content}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:from-amber-700 hover:to-amber-800 disabled:from-amber-400 disabled:to-amber-500 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}
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

      {/* Image upload modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-800">Add a Memory</h3>
              <button 
                onClick={() => {
                  setShowImageUpload(false);
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700 transform hover:scale-110 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="border-2 border-dashed border-amber-300 rounded-xl p-8 text-center bg-amber-50 hover:bg-amber-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload size={40} className="mx-auto mb-4 text-amber-600" />
                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Image viewer modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-300 transform hover:scale-110 transition-all"
            >
              <X size={32} />
            </button>
            <div className="polaroid-frame bg-white p-6 shadow-2xl mx-auto max-w-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto"
              />
              <div className="mt-4 flex justify-between items-center text-gray-700">
                <span className="font-handwriting text-lg">
                  {selectedImage.name} • {(selectedImage.size / 1024).toFixed(1)}KB
                </span>
                <button
                  onClick={() => handleImageDelete(selectedImage.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success notification */}
      {saveSuccess && (
        <div className="fixed top-8 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 transform transition-all duration-500 scale-100">
          <div className="w-6 h-6 bg-white text-green-500 rounded-full flex items-center justify-center font-bold">✓</div>
          <span className="font-medium">Diary saved successfully!</span>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Kalam:wght@300;400;700&display=swap');
        
        .font-handwriting {
          font-family: 'Kalam', cursive;
        }
        
        .diary-book {
          transform-style: preserve-3d;
        }
        
        .diary-book:hover {
          transform: perspective(1000px) rotateY(-2deg) rotateX(1deg);
        }
        
        .polaroid-frame {
          transform-origin: center;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotateY-2 {
          transform: rotateY(-2deg);
        }
      `}</style>
    </div>
  );
};

export default MyDiary;