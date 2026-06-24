import {NextResponse} from 'next/server';
import {createClient} from '@/app/lib/supabase/server-client';

export async function GET(request: Request) {

    const supabase = await createClient();

    try{
        const {data} = await supabase
        .from('Items')
        .select('*');

        return NextResponse.json(data);
    }catch(error: any){
        return NextResponse.json({error: error?.message}, {status: 400})
    }
    
}

