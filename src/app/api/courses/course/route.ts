import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/utils/postgres";
import { createClient } from "@/lib/supabase/server";

import generateuniqueID from "@/utils/uniqueID";

export const POST = async (request: NextRequest) => {

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        return NextResponse.json({ message: "User is not Authorized" }, { status: 511 })
    }

    const { title, description, category, tags, thumbnail, } = await request.json();

    const client = await pool.connect();
    try {
        const courseID = generateuniqueID();

        await client.query(
            'INSERT INTO courses (id,title,description, category,tags,thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6)',
            [courseID, title, description, category, tags, thumbnail]
        );

        return NextResponse.json({
            success: true,
            message: 'Course Successfully Created!'
        }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Unable to Create Course!'
        }, { status: 500 })
    }
}


export const GET = async (request: NextRequest) => {

    console.log("I am calling get request")
    const searchParams = request.nextUrl.searchParams
    const curseIdQuery = searchParams.get('courseId');

    console.log("I logged the request");

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        return NextResponse.json({ message: "User is not Authorized" }, { status: 511 })
    }

    const client = await pool.connect();
    try {

        let data;
        if (curseIdQuery) {
            data = await client.query('SELECT * FROM courses WHERE id = $1', [curseIdQuery]);
        } else {
            return NextResponse.json({
                success: false,
                message: 'Course Not FOund',
                data: null
            }, { status: 404 });
        }

        return data.rows.length > 0 ? NextResponse.json({
            success: true,
            message: 'Course Found',
            data: data.rows
        }, { status: 200 }) : NextResponse.json({
            success: false,
            message: 'Course Not Found',
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