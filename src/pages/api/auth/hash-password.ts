import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const hashedPassword = await bcrypt.hash(password, 13)
    
    res.status(200).json({ hashedPassword })
  } catch (error) {
    console.error('Password hashing error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
