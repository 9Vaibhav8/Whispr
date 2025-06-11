import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://whispr-backend-cgh7.onrender.com', // Your backend port
  withCredentials: true, // optional if using cookies/sessions
});


export const askAI = async (prompt) => {
  try {
    const response = await instance.post('/api/chat', { prompt });
    return response.data.reply;
  } catch (error) {
    console.error("AI Request Failed:", error);
    throw error;
  }
};

export default instance;
