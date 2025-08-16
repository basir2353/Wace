import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { pool } from "@/utils/postgres";

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'


  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');



  let response;
  if (token_hash && type) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    console.log({ error, data })

    if (!error && data?.user) {
      const userId = data.user.id
      const email = data.user.email
      console.log(email, "=====>>>>")
      const client = await pool.connect();
      try {
        await client.query('UPDATE users SET verified = true WHERE email = $1 AND id = $2 AND verified = false',
          [email, userId]);
        client.release();
        return NextResponse.redirect(new URL('/model-finder', request.url), { headers: headers })

      } catch (error) {
        console.log("OTP ERROR ===>>> ", { error });
        client.release();
        return NextResponse.redirect(new URL('/error', request.url), { headers: headers })
      } finally {
        console.log("Im running====>>>>");


      }

    } else {
      return NextResponse.redirect(new URL('/error-top', request.url), { headers: headers })
    }
  } else {

    return NextResponse.redirect(new URL('/error-top', request.url), { headers: headers })
  }




}


export async function OPTIONS() {
  const headers = new Headers();

  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, {
    status: 200,
    headers: headers
  });
}