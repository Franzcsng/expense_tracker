import { S3Client } from '@aws-sdk/client-s3'
import {createClient} from '@/app/lib/supabase/server-client'


export async function createS3Client() {
    const supabase = await createClient()

    const {
    data: { session },
    } = await supabase.auth.getSession()

    return new S3Client({
        forcePathStyle: true,
        region: process.env.NEXT_PUBLIC_SUPABASE_REGION,
        endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.storage.supabase.co/storage/v1/s3`,
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF!,
            secretAccessKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            sessionToken: session?.access_token,
        },
    })
} 