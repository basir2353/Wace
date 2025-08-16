import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../utils/postgres'; // Adjust the import to match your project structure
import { compare } from 'bcrypt'; // Assuming you are using bcrypt for password hashing
import { sign } from "jsonwebtoken";
interface User {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } = await req.json();

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: { message: 'User not found', status: 404 }, message: 'User not found' }, { status: 404 });
      }

      const user: User = result.rows[0];
      
      if (user.password !== password) {
        return NextResponse.json({ success: false, error: { message: 'Incorrect password', status: 401 }, message: 'Incorrect password' }, { status: 401 });
      }
      
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    const token = sign({ userId: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    return NextResponse.json(  
      {data: { token }, success: true, user: { email: user.email }, message: 'Login successful' }, { status: 200 }
    );
      
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({ success: false, error: { message: 'Internal server error', status: 500 }, message: 'Internal server error' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ success: false, error: { message: 'Invalid request', status: 400 }, message: 'Invalid request' }, { status: 400 });
  }
}
