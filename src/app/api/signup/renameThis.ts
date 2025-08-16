// // pages/api/signup.js
// import { NextApiRequest, NextApiResponse } from 'next';
// import { pool } from '../../../utils/postgres'; // Adjust the path according to your project structure
// import { hash } from 'bcrypt';
// import { randomBytes } from 'crypto';
// import nodemailer from 'nodemailer';

// async function sendVerificationEmail(email: string, verificationUrl: string) {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true, // true for 465, false for other ports
//             auth: {
//                 user: process.env.EMAIL_USER, // These should be in your environment variables
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         await transporter.sendMail({
//             from: "haidergulfam207@gmail.com",
//             to: email,
//             subject: 'Verify Your Email',
//             html: `Please click on the link to verify your email: <a href="${verificationUrl}">Verify Email</a>`
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Email sending failed');
//     }
// }

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     const { email, password } = req.body;
//     console.log("Email and password", email, password);

//     if (!email || !password) {
//         res.status(400).json({ error: 'Email and password are required.' });
//         return;
//     }

//     const client = await pool.connect();

//     try {
//         // Check if user already exists
//         const { rowCount } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (rowCount > 0) {
//             res.status(409).json({ error: 'User already exists' });
//             return;
//         }

//         // Hash password
//         const hashedPassword = await hash(password, 10);
//         const token = randomBytes(16).toString('hex');

//         // Insert the new user with verified set to false
//         await client.query(
//             'INSERT INTO users (email, password, verification_token, verified) VALUES ($1, $2, $3, false)',
//             [email, hashedPassword, token]
//         );

//         // Generate the verification link
//         const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${token}&email=${encodeURIComponent(email)}`;

//         // Send the verification email
//         await sendVerificationEmail(email, verificationUrl);

//         res.status(201).json({ message: 'User registered. Please check your email to verify the account.' });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ error: error.message || 'Internal server error' });
//     } finally {
//         client.release();
//     }
// }
