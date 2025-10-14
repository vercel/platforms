#!/bin/bash

# Deploy Supabase Edge Function for Email Capture
# Make sure you have Supabase CLI installed and logged in

echo "🚀 Deploying Supabase Edge Function..."

# Deploy the edge function
supabase functions deploy capture-email --project-ref YOUR_PROJECT_REF

echo "✅ Edge function deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Run the migration: supabase db push"
echo "2. Set up your environment variables in .env.local:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo "3. Test the email capture form"
echo ""
echo "🔍 Monitor function logs with:"
echo "supabase functions logs capture-email --project-ref YOUR_PROJECT_REF"