import Diary from '../models/Diary.js';

export const createDiaryEntry = async (req, res) => {
  try {
    const { title, content, mood, images } = req.body; // Include `images` in request
    const userId = req.user.id;

    const diaryEntry = new Diary({
      title,
      content,
      mood,
      user: userId,
      images: images || [] // Save image data if provided
    });

    await diaryEntry.save();
    res.status(201).json(diaryEntry);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getDiaryEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await Diary.find({ user: userId })
      .populate('user', 'username email') // Populate user details
      .populate('images.uploadedBy', 'username'); // Populate image uploader

    res.status(200).json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood } = req.body;
    const userId = req.user.id; // Assuming you have user authentication

    const diaryEntry = await Diary.findById(id);
    if (!diaryEntry)
      return res.status(404).json({ message: 'Diary entry not found' });

    if (diaryEntry.user.toString() !== userId)
      return res.status(401).json({ message: 'Unauthorized' });

    diaryEntry.title = title || diaryEntry.title;
    diaryEntry.content = content || diaryEntry.content;
    diaryEntry.mood = mood || diaryEntry.mood;

    await diaryEntry.save();
    res.status(200).json(diaryEntry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming you have user authentication

    const diaryEntry = await Diary.findById(id);
    if (!diaryEntry)
      return res.status(404).json({ message: 'Diary entry not found' });

    if (diaryEntry.user.toString() !== userId)
      return res.status(401).json({ message: 'Unauthorized' });

    await Diary.findByIdAndDelete(id); // Better to use findByIdAndDelete
    res.status(200).json({ message: 'Diary entry deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err); 
    res.status(500).json({ message: 'Server error' , error: err.message });
  }
};

export const entrybyDate = async (req, res) => {
  let { date } = req.params; // Expects YYYY-MM-DD
  const userId = req.user.id;

  date = decodeURIComponent(date).trim(); // 💡 Clean it

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  try {
    const entries = await Diary.find({
      user: userId,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "UTC" } },
          date
        ]
      }
    }).sort({ date: -1 });

    res.json(entries);
  } catch (err) {
    console.error('Error fetching entry by date:', err);
    res.status(500).json({ error: "Failed to fetch diary entry" });
  }
};
