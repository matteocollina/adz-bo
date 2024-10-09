import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../../utils/supabase";
import { cookies } from "next/headers";


// To handle a POST request to /api
export async function POST(request:NextRequest) {
    try {
        const body = await request.json() 
        const response = await supabase.auth.signInWithPassword(body)
        if(response.error){
            throw new Error(response.error.code)
        }
        cookies().set('currentUser', JSON.stringify(response.data.session))
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }
}