import {supabase} from "@/lib/supabase/server-client.ts";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    const requestBody = await request.json();
    const email = requestBody.email;
    const password = requestBody.password;

    try{

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if(error){
            return NextResponse.json({error: error?.message}, {status: 400})
        }

        return NextResponse.json({
            user: data.user
        });
        
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400})
    }
}