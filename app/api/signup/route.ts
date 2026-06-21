import { createClient } from "@/lib/supabase/server-client.ts";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    const supabase = await createClient();
    
    const requestBody = await request.json();
    const {
        email,
        password,
        firstName,
        lastName
    } = requestBody

    try{

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
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

        const {error: profileError} = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                first_name: firstName,
                last_name: lastName
            })

        if (profileError) {
        return NextResponse.json(
            { error: profileError.message },
            { status: 400 }
        )
        }

        return NextResponse.json({
            user
        });
        
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400})
    }
}