import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../../utils/supabase";
import { cookies } from "next/headers";


// To handle a POST request to /api
export async function POST(request:NextRequest) {
    try {
        const response = await supabase.auth.signOut()
        if(response.error){
            throw new Error(response.error.code)
        }
        cookies().delete('currentUser')
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error while logging out" }, { status: 400 });
    }
}