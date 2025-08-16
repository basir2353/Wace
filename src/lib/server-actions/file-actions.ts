

"use client"
import generateuniqueID from '@/utils/uniqueID';
import { createBrowserBasedClient } from '../supabase/client';



export const actionUploadImage = async (file: File): Promise<{ success: true, message: string, response: string } | { success: false, message: string, response: null }> => {
   
    const supabase = createBrowserBasedClient();

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    const access_token =  session ? session.access_token : ""
;

    try {
        const { data, error } = await supabase.storage
            .from("wace-assets")
            .upload(`images/${generateuniqueID()}.${file.type.split("/")[1]}`, file, {
                contentType: file.type,
                headers: {
                    authorization: `Bearer ${access_token}`,
                }
            });

        if (error) {
            throw error
        }

        return {
            success: true,
            message: 'Username Successfully update',
            response: process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/wace-assets/' + data.path
        }

    } catch (error) {

        return {
            success: false,
            message: `Can't upload your thumbnail`,
            response: null
        }

    }
}

const actionUpdateImage = () => {

}