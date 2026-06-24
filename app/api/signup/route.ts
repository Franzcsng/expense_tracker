import { createClient } from "@/app/lib/supabase/server-client";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    const supabase = await createClient();
    
    const requestBody = await request.json();
    const {
        email,
        password,
        first_name,
        last_name
    } = requestBody

    try{

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
                data: {
                    first_name,
                    last_name,
                },
            }
        })

        if(error){
            return NextResponse.json(
                {error: error?.message}, 
                {status: 400}
            )
        }

        const user = data.user

        if(!user){
            return NextResponse.json(
                {error: 'Account creation failed'}, 
                {status: 400}
            )
        }

        return NextResponse.json({
            user
        });
        
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400})
    }
}