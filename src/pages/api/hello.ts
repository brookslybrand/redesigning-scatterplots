// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'

function hello(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}

export default hello
