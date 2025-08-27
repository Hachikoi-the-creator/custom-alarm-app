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
    const { password, hashedPassword } = req.body

    if (!password || !hashedPassword) {
      return res.status(400).json({ message: 'Password and hashed password are required' })
    }

    const isMatch = await bcrypt.compare(password, hashedPassword)
    
    res.status(200).json({ isMatch })
  } catch (error) {
    console.error('Password comparison error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
