import axios from "axios";
import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextRequest, res) {
    if (req.headers?.["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }
    if (!req?.body?.["social"] || !req?.body?.["username"] || !req?.body?.["email"]) {
        return res.status(400).end('Missing data');
    }
    const socialResponse = await axios(`${process.env.URL_SCRAPE_FOLLOWER}?username=${req?.body?.["username"]}`, {
        headers: {
            'accept': '*/*',
            'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6,bn;q=0.5',
            'cache-control': 'no-cache',
            'origin': 'https://www.tucktools.com',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': 'https://www.tucktools.com/',
            'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
    })
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    const commonData = { email: req?.body?.["email"] }
    const { error } = await supabase
        .from('SocialInfo')
        .upsert([
            req?.body?.["social"] === "ig" ?
                { ...commonData, ig_followers_count: socialResponse.data?.user_followers, ig_username: req?.body?.["username"], ig_following_count: socialResponse.data?.user_following, ig_is_private: socialResponse.data?.is_private, ig_total_posts: socialResponse.data?.total_posts }
                :
                { ...commonData }, //do nothing
        ],{
            ignoreDuplicates: false,
            onConflict: "email"
        })
        .select()
    if (error) {
        return res.status(400).end(error?.message);
    }

    return res.status(200).end('Ok');
}