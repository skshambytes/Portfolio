import { Router, Request, Response, NextFunction } from 'express';
import { getProjects } from '../services/github.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getProjects();
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return res.status(200).json({
      success: true,
      data: data.projects,
      cached: data.cached,
      lastUpdated: data.lastUpdated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
