import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/utils/postgres";
import { createClient } from "@/lib/supabase/server";



export const GET = async (request: NextRequest) => {

    console.log("I am calling get request")
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('category');

    console.log("I logged the request");

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        return NextResponse.json({ message: "User is not Authorized" }, { status: 511 })
    }

    const client = await pool.connect();
    try {

        let data;
        if (query) {
            data = await client.query('SELECT * FROM courses WHERE category = $1', [query]);

            return data.rows.length > 0 ? NextResponse.json({
                success: true,
                message: 'Succesfully Found all the Courses regarding ${query} category ',
                data: data.rows
            }, { status: 201 }) : NextResponse.json({
                success: false,
                message: `Unable to found any course regarding ${query} category`,
                data: null
            }, { status: 404 });


        } else {
            data = await client.query(
                'SELECT * FROM courses');


            return data.rows.length > 0 ? NextResponse.json({
                success: true,
                message: 'Succesfully Found all the Courses',
                data: data.rows
            }, { status: 200 }) : NextResponse.json({
                success: false,
                message: 'Unable to found any Course regarding ${query} category ',
                data: null
            }, { status: 404 });
        }



    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error!',
            data: null
        }, { status: 500 })
    }


}

