# Email Capture System

This system captures email addresses from the hero form and stores them in Supabase with a serverless edge function.

## 🏗️ Architecture

```
Hero Form → Next.js API Route → Supabase Edge Function → PostgreSQL Database
```

## 📁 Files Created

### Database
- `supabase/migrations/001_create_email_captures.sql` - Database schema
- Table: `email_captures` with RLS policies

### Edge Function
- `supabase/functions/capture-email/index.ts` - Serverless function
- Handles email validation, deduplication, and storage

### API Route
- `app/api/capture-email/route.ts` - Next.js API proxy
- Calls the Supabase edge function

### Frontend
- `components/landing/hero.tsx` - Updated with email capture form

## 🚀 Setup Instructions

### 1. Deploy Database Migration
```bash
supabase db push
```

### 2. Deploy Edge Function
```bash
supabase functions deploy capture-email
```

### 3. Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the System
1. Start your Next.js app: `npm run dev`
2. Navigate to the homepage
3. Enter an email in the hero form
4. Check your Supabase dashboard for the captured email

## 📊 Database Schema

```sql
TABLE email_captures (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100) DEFAULT 'unknown',
  captured_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  ip_address VARCHAR(45),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

## 🔐 Security Features

- **Email Validation**: Server-side validation
- **Deduplication**: Prevents duplicate email entries
- **RLS Policies**: Row-level security enabled
- **Rate Limiting**: Built into Supabase edge functions
- **CORS Protection**: Proper CORS headers

## 📈 Monitoring

### View Captured Emails
```sql
SELECT email, source, captured_at 
FROM email_captures 
ORDER BY captured_at DESC;
```

### Function Logs
```bash
supabase functions logs capture-email
```

### Analytics Queries
```sql
-- Emails by source
SELECT source, COUNT(*) as count 
FROM email_captures 
GROUP BY source;

-- Daily captures
SELECT DATE(captured_at) as date, COUNT(*) as captures
FROM email_captures 
GROUP BY DATE(captured_at)
ORDER BY date DESC;
```

## 🔧 Customization

### Add More Fields
Update both the edge function and database schema:

```sql
ALTER TABLE email_captures 
ADD COLUMN company_name VARCHAR(255),
ADD COLUMN phone VARCHAR(50);
```

### External Integrations
Add to the edge function after successful capture:

```typescript
// Send to Mailchimp
await fetch('https://api.mailchimp.com/3.0/lists/LIST_ID/members', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email_address: email,
    status: 'subscribed',
  }),
})
```

## 🚨 Error Handling

The system handles:
- Invalid email formats
- Duplicate email submissions
- Network failures
- Database connection issues
- Validation errors

## 📱 Frontend Features

- **Responsive Design**: Works on all devices
- **Loading States**: Shows submission progress
- **Validation**: Client and server-side validation
- **Error Feedback**: User-friendly error messages
- **Success Handling**: Clear form on success

## 🔄 Future Enhancements

1. **Email Verification**: Send confirmation emails
2. **Segmentation**: Tag emails by campaign/source
3. **A/B Testing**: Test different form variants
4. **Analytics**: Track conversion rates
5. **Automation**: Trigger email sequences
6. **GDPR Compliance**: Add consent checkboxes
7. **Export**: CSV/Excel export functionality

---

**Last Updated**: October 2024  
**Version**: 1.0.0