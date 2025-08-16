import { pool } from "@/utils/postgres";
import { type NextRequest, NextResponse, } from "next/server";

export const GET = async (request: NextRequest) => {
    const headers = new Headers()
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');


    const { searchParams } = new URL(request.url)
    const userID = searchParams.get('uid') ?? ""

    try {
        const client = await pool.connect();
        const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userID]);
        client.release(); // Release the connection

        if (userResult.rows.length > 0) {
            return NextResponse.json({ data: userResult.rows[0], message: "Successfull" }, { status: 200,headers:headers });
        } else {
            return NextResponse.json({ data: null, message: 'User not found' }, { status: 404,headers:headers });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ data: null, message: 'Internal Server Error' }, { status: 500,headers:headers });
    }


}



export async function OPTIONS() {
    const headers = new Headers();
    
    // Allow only a specific domain
    headers.set('Access-Control-Allow-Origin', '*');
  
    // Specify allowed headers
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    return new NextResponse(null, {
      status: 200,
      headers: headers
    });
  }