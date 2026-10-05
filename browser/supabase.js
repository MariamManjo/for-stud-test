import { createClient } from '@supabase/supabase-js';
export const supabase = createClient('https://iyrdtqbyynzstliywrgo.supabase.co','sb_publishable_zGwT0VNHwdCd_ZTwPjn3bQ_5LHX84DZ',{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
