import express from 'express';
import { createDiaryEntry, getDiaryEntries, updateDiaryEntry, deleteDiaryEntry , entrybyDate } from '../controllers/diaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, createDiaryEntry);
router.get('/', authMiddleware, getDiaryEntries);
router.put('/:id', authMiddleware, updateDiaryEntry);
router.delete('/:id', authMiddleware, deleteDiaryEntry);
router.get('/date/:date',  authMiddleware , entrybyDate)

router.get("/test/:date", (req, res) => {
    console.log("PARAM:", req.params.date);
    res.send("Got it");
  });
  
export default router;
