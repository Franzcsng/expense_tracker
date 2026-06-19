import {NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase/server-client.ts';

export async function GET(request: Request) {

    try{
        const {data} = await supabase.from('items').select('*');
        return NextResponse.json(data);
    }catch(error){
        
    }
    
}