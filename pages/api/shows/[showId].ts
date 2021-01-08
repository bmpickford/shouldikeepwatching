// const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${process.env.REACT_APP_API_KEY}`);

import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const r = await fetch(`https://api.themoviedb.org/3/tv/${req.query.showId}?api_key=${process.env.API_KEY}`)
    res.status(200).json(await r.json());
}
