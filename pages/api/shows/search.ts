import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const r = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&query=${req.query.q}`)
    res.status(200).json(await r.json());
}
