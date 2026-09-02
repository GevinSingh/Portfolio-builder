import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://glhowtmwkgzylfoglwhy.supabase.co";
const SUPABASE_KEY = "sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSupabase() {
  console.log("==================================================");
  console.log("Checking Live Supabase Cloud Connection...");
  console.log("URL:", SUPABASE_URL);
  console.log("==================================================");
  
  // 1. Select existing portfolios
  const { data: selectData, error: selectError } = await supabase
    .from('portfolios')
    .select('id, slug, title, updated_at');

  if (selectError) {
    console.error("❌ SELECT ERROR:", selectError.message);
  } else {
    console.log(`✅ SUCCESS! ${selectData.length} portfolios currently stored in Supabase Cloud table 'portfolios':`);
    selectData.forEach((row, idx) => {
      console.log(`   [${idx+1}] Slug: ${row.slug} | Title: ${row.title} | Updated: ${row.updated_at}`);
    });
  }

  // 2. Perform live upsert
  const testPortfolio = {
    slug: 'alex-johnson',
    user_id: '00000000-0000-4000-a000-000000000000',
    title: "Alex Johnson's Portfolio",
    data: {
      profile: {
        fullName: "Alex Johnson",
        headline: "Full Stack Developer & AI Engineer",
        bio: "Building intelligent web applications with Supabase Cloud & Next.js.",
        email: "alex@example.com"
      },
      templateId: "developer",
      slug: "alex-johnson"
    },
    updated_at: new Date().toISOString()
  };

  const { data: upsertData, error: upsertError } = await supabase
    .from('portfolios')
    .upsert(testPortfolio, { onConflict: 'slug' })
    .select();

  if (upsertError) {
    console.error("❌ UPSERT ERROR:", upsertError.message);
  } else {
    console.log("✅ SUCCESS! Upserted data directly into Supabase Cloud 'portfolios' table!");
  }
}

testSupabase();
