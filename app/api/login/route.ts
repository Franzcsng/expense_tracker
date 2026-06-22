import { createClient } from "@/app/lib/supabase/server-client";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    const supabase = await createClient();

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

        const user = data.user
        
        return NextResponse.json({
            user
        });
        
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400})
    }
}