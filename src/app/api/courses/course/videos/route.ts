import { createClient } from "@/lib/supabase/server";
import { Video } from "@/lib/supabase/supabase.types";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/utils/postgres";


export const POST = async (request: NextRequest) => {

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        return NextResponse.json({ message: "User is not Authorized" }, { status: 401 })
    }

    const { id, courseId, userId, title, videoDuration, timespan, fileSize, videoUrl } = await request.json() as Video;

    const client = await pool.connect();

    try {

        await client.query(
            'INSERT INTO videos (id,"courseId","userId",title,"videoDuration",timespan,"fileSize","videoUrl") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, courseId, userId, title, videoDuration, timespan, fileSize, videoUrl]
        );

        return NextResponse.json({
            success: true,
            message: 'Video Added Succesfully!'
        }, { status: 201 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Unable to Add Video!'
        }, { status: 500 })
    }



}


export const GET = async (request: NextRequest) => {

    console.log("I am calling get request")
    const searchParams = request.nextUrl.searchParams
    const courseIdQuery = searchParams.get('courseId');

    console.log("I logged the request");

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        return NextResponse.json({ message: "User is not Authorized" }, { status: 511 })
    }

    const client = await pool.connect();
    try {

        let data;
        if (courseIdQuery) {
            data = await client.query('SELECT * FROM videos WHERE "courseId" = $1 ORDER BY "videoOrder" ASC;', [courseIdQuery]);
        } else {
            return NextResponse.json({
                success: false,
                message: 'No Videos Found',
                data: null
            }, { status: 404 });
        }

        return data.rows.length > 0 ? NextResponse.json({
            success: true,
            message: 'Videos Found',
            data: data.rows
        }, { status: 200 }) : NextResponse.json({
            success: false,
            message: 'Videos Not Found',
            data: null
        }, { status: 404 });;
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error, Try again later!',
            data: null
        }, { status: 500 })
    }


}