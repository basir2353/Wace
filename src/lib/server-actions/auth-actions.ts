'use server';
import { QueryResult } from 'pg';
import { compare } from 'bcrypt';
import { pool } from "../../utils/postgres";

import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";



// pages/api/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../supabase/server';
import { StringChunk } from 'drizzle-orm';

interface User {
  email: string;
  password: string;
  // Add any additional fields here
}

export async function actionLoginUser({ email, password }: { email: string; password: string }): Promise<{ success: boolean; message: any }> {

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })


  console.log("Trying to login user ===>>", { data, error });


  if (error || !data?.user) {

    if (error?.code) {
      if (error.code === "invalid_credentials") {
        return {
          success: false,
          message: 'Invalid email or password',

        };
      }
    }


    if (error?.status) {
      if (error.status === 429) {
        return {
          success: false,
          message: 'Too Many Requests',

        };
      }
      else if (error.status === 500) {
        return {
          success: false,
          message: 'Internal Server Error',
        };
      } else {
        console.log("Unhandled Error in auth-action.ts ===>>", { error })
        return {
          success: false,
          message: 'Internal Server Error',
        };
      }
    }
  }

  return {
    success: true,
    message: 'User Logged in Successfully!',
  };



  // const client = await pool.connect();
  // try {
  //   const result: QueryResult<any> = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  //   if (result.rows.length === 0) {
  //     return { success: false, error: { message: 'User not Found', status: 404 }, message: 'User not found', }; // User not found
  //   }
  //   const user: User = result.rows[0];
  //   const passwordMatch: boolean = await compare(password, user.password);
  //   if (!passwordMatch) {
  //     return { success: false, error: { message: 'Incorrect password', status: 401 }, message: 'Incorrect password' }; // Incorrect password
  //   }
  //   return { success: true, user: { email: user.email, password: user.password }, message: 'Login successful' };
  // } catch (error) {
  //   console.error('Login error:', error);
  //   return { success: false, error: { message: 'Internal server error', status: 500 }, message: 'Internal server error' }; // Internal server error
  // } finally {
  //   client.release();
  // }
}


type Auth =
  {
    user: any,
    pass: any
  }


// SignUP API CODE
export async function actionSignUpUser({ email, password }: User): Promise<{ success: boolean; message: any }> {

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })


  if (error || !data?.user) {

    if (error?.code) {
      if (error.code === "user_already_exists") {
        return {
          success: false,
          message: 'This Email is already in use',
        };
      }
    }


    if (error?.status) {
      if (error.status === 429) {
        return {
          success: false, message: 'Too Many Requests'
        };
      }
      else if (error.status === 500) {
        return {
          success: false, message: 'Internal Server Error'
        };
      } else {
        console.log("Unhandled Error in auth-action.ts ===>>", { error })
        return {
          success: false, message: 'Internal Server Error'
        };
      }
    }
  }





  const client = await pool.connect();
  const userName = "user_" + data?.user?.id.slice(0, 8);
  try {
    await client.query(
      'INSERT INTO users (id,email,full_name, verified) VALUES ($1, $2, $3, false)',
      [data?.user?.id, email, userName]
    );
    // console.log("Inesrt USer Query Result ===>", queryResult)
    return {
      success: true,
      message: 'Verification link sent to your provided email address.'
    };

  } catch (error) {
    console.log("Error in inserting user ===>", error)
    return {
      success: false,
      message: 'Internal Server Error'
    };


  } finally {
    client.release();
  }




  // const client = await pool.connect();
  // try {
  //   // Check if user already exists
  //   const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  //   if (existingUser.rowCount && existingUser.rowCount > 0) {
  //     return { 
  //       success: false, 
  //       error: { message: 'User already exists', status: 409 }
  //     };
  //   }

  //   // Hash password
  //   // const hashedPassword = await hash(password, 10);
  //   const token = randomBytes(16).toString('hex');

  //   // Insert the new user with verified set to false
  //   await client.query(
  //     'INSERT INTO users (email, password, verification_token, verified) VALUES ($1, $2, $3, false)',
  //     [email, password, token]
  //   );

  //   // Generate the verification link
  //   const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${token}&email=${encodeURIComponent(email)}`;

  //   // Send the verification email
  //   await sendVerificationEmail(email, verificationUrl);

  //   return { 
  //     success: true, 
  //     message: 'Verification email sent. Please verify your email to complete registration.'
  //   };
  // } catch (error) {
  //   console.error('Signup error:', error);
  //   return { 
  //     success: false, 
  //     error: { message: 'Internal server error', status: 500 }
  //   };
  // } finally {
  //   client.release();
  // }



}

export async function actionLogoutUser() {

  const supabase = createClient();
  const { error } = await supabase.auth.signOut()

  if (error) {
    if (error?.status) {
      if (error.status === 429) {
        return {
          success: false,
          message: 'Too Many Requests',
        };
      }
      else if (error.status === 500) {
        return {
          success: false,
          message: 'Internal Server Error',
        };
      } else {
        console.log("Unhandled Error in auth-action.ts ===>>", { error })
        return {
          success: false,
          message: 'Internal Server Error',
        };
      }
    }
  }

  return {
    success: true,
    message: 'User Logout Successfully',
  };



}




// export async function actionSignUpUser({ email, password }: User): Promise<any> {
//   const client = await pool.connect();
//   try {
//     // Check if user already exists
//     const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rowCount && existingUser.rowCount > 0) {
//       return { 
//         success: false, 
//         error: { message: 'User already exists', status: 409 }
//       };
//     }

//     // Hash password
//     // const hashedPassword = await hash(password, 10);
//     const token = randomBytes(16).toString('hex');

//     // Insert the new user with verified set to false
//     await client.query(
//       'INSERT INTO users (email, password, verification_token, verified) VALUES ($1, $2, $3, false)',
//       [email, password, token]
//     );

//     // Generate the verification link
//     const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${token}&email=${encodeURIComponent(email)}`;

//     // Send the verification email
//     await sendVerificationEmail(email, verificationUrl);

//     return { 
//       success: true, 
//       message: 'Verification email sent. Please verify your email to complete registration.'
//     };
//   } catch (error) {
//     console.error('Signup error:', error);
//     return { 
//       success: false, 
//       error: { message: 'Internal server error', status: 500 }
//     };
//   } finally {
//     client.release();
//   }
// }




// Verfiy email API

const sendVerificationEmail = async (email: string, token: any) => {
  try {

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/?token=${token}`;
    console.log(`Verification URL: ${verificationUrl}`); // Log the verification URL for debugging
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 465,
    //   secure: true, // Use `true` for port 465, `false` for all other ports
    //   auth: {
    //     user: "maddison53@ethereal.email",
    //     pass: "jn7jnAPss4f63QBp6D",
    //   },
    // });
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for ports 587 or 25
      auth: {
        user: 'haidergulfam207@gmail.com',
        pass: 'mcxc zdmw nvbq rzzj'
      }
    });

    await transporter.sendMail({
      from: 'haidergulfam207@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      html: `Please click on the link to verify your email: <a href="${verificationUrl}">Verify Email</a>`
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};


export default async function verify(req: NextApiRequest, res: NextApiResponse) {
  const { token, email } = req.query as { token: string; email: string };
  const client = await pool.connect();

  try {
    // Update the user's verified status to true if the token matches
    const result = await client.query('UPDATE users SET verified = true WHERE email = $1 AND verification_token = $2 AND verified = false RETURNING *', [email, token]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Verification failed or token is invalid.' });
      return;
    }
    res.status(200).json({ message: 'Email verified successfully, account activated.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', details: error.message });
  } finally {
    client.release();
  }
}



export async function actionupdateUsername({ username, userId }: { username: string; userId: string }): Promise<{ success: boolean, message: string }> {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET full_name = $1 WHERE  id = $2',
      [username, userId]);
    return {
      success: true,
      message: 'Username Successfully update'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Problem in updating username'
    };

  } finally {
    client.release();
  }
}


export async function actionUpdateUserEmail({ email, userId }: { email: string; userId: string }): Promise<any> {

  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    email
  })

  if (error || !data?.user) {

    if (error?.code) {
      if (error.code === "user_already_exists") {
        return {
          success: false,
          error: { message: 'This Email is already in use', status: 422 }
        };
      }
    }


    if (error?.status) {
      if (error.status === 429) {
        return {
          success: false,
          error: { message: 'Too Many Requests', status: 429 }
        };
      }
      else if (error.status === 500) {
        return {
          success: false,
          error: { message: 'Internal Server Error', status: 500 }
        };
      } else {
        console.log("Unhandled Error in auth-action.ts ===>>", { error })
        return {
          success: false,
          error: { message: 'Internal Server Error', status: 500 }
        };
      }
    }
  }





  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET email = $1, verified = false WHERE id = $2',
      [email, userId]);
    return {
      success: true,
      message: 'Verification link sent to your Email'
    };

  } catch (error) {
    console.log("Error in inserting user ===>", error)
    return {
      success: false,
      message: 'Problem in updating Email'
    };

  } finally {
    client.release();
  }




}


export async function actionRequestResetPassword({ email, userId }: { email: string; userId: string }): Promise<any> {
  const supabase = createClient();


  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process?.env?.NEXT_PUBLIC_SITE_URL}/settings?type=updatePassword`, // Redirect URL after user clicks the link
  });


  console.log({ email, data, error });


  if (error?.status) {
    if (error.status === 429) {
      return {
        success: false,
        error: { message: 'Too Many Requests', status: 429 }
      };
    }
    else if (error.status === 500) {
      return {
        success: false,
        error: { message: 'Internal Server Error', status: 500 }
      };
    } else {
      console.log("Unhandled Error in auth-action.ts ===>>", { error })
      return {
        success: false,
        error: { message: 'Internal Server Error', status: 500 }
      };
    }
  }

  return {
    success: true,
    message: 'Password Reset Link Send to your Email'
  };
}

export async function actionUpdateUserPassword({ password }: { password: string; }): Promise<any> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error?.status) {
    if (error.status === 429) {
      return {
        success: false,
        error: { message: 'Too Many Requests', status: 429 }
      };
    }
    else if (error.status === 500) {
      return {
        success: false,
        error: { message: 'Internal Server Error', status: 500 }
      };
    } else {
      console.log("Unhandled Error in auth-action.ts ===>>", { error })
      return {
        success: false,
        error: { message: 'Internal Server Error', status: 500 }
      };
    }
  }

  return {
    success: true,
    message: 'Password Update Succesfully'
  };
}


export async function actiongetUser({ userID }: { userID: string; }): Promise<any> {


  try {
    const client = await pool.connect();
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userID]);
    client.release(); // Release the connection

    if (userResult.rows.length > 0) {
      return {
        success: true,
        message: 'Successfull',
        data: userResult.rows[0]

      };
    } else {
      return {
        success: false,
        message: 'User not found',
        data: null

      };
    }
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Internal Server Error',
      data: null

    };

  }


}