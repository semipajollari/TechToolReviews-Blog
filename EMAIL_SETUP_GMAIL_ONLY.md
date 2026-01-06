# Email Setup - Using Gmail Without Custom Domain

## ⚠️ IMPORTANT LIMITATIONS

**You CANNOT send emails FROM Gmail addresses** (like `techtoolreview.co@gmail.com`) using Resend. This is a security measure by Gmail to prevent email spoofing.

**Your options:**

### Option 1: Limited Testing (Sandbox Mode) ⚠️
- **FROM**: `onboarding@resend.dev` (Resend's sandbox)
- **REPLY-TO**: `techtoolreview.co@gmail.com` (your Gmail)
- **LIMITATION**: Only sends to verified test emails in Resend
- **Use case**: Testing only, NOT for production

### Option 2: Custom Domain (Recommended) ✅
- **FROM**: `noreply@techtoolreviews.co` (your domain)
- **REPLY-TO**: `techtoolreview.co@gmail.com` (your Gmail)
- **BENEFIT**: Sends to ANYONE, professional, no spam
- **Use case**: Production-ready

---

## 🔧 Setup for Option 1 (Gmail + Sandbox)

### Step 1: Configure Environment Variables

Add to Vercel:

```env
FROM_EMAIL=TechToolReviews <onboarding@resend.dev>
REPLY_TO=techtoolreview.co@gmail.com
RESEND_API_KEY=re_EGZtzNdU_B4YukB3uoZxNf9iZGcGrrcpu
FRONTEND_URL=https://techtoolreviews.co
```

### Step 2: Add Test Emails in Resend

Since you're using sandbox mode, you can only send to verified emails:

1. Go to https://resend.com/settings/emails
2. Click "Add Email"
3. Add each email you want to test:
   - `techtoolreview.co@gmail.com`
   - `semipajo2003@gmail.com`
   - Any other test emails

**Limitation:** You have to add EVERY recipient email manually. Not scalable for production!

### Step 3: Deploy

```bash
git add .
git commit -m "Configure email with Gmail reply-to"
git push
vercel --prod
```

---

## ✅ How It Works

**When you send an email:**
- **FROM**: Shows as `TechToolReviews <onboarding@resend.dev>`
- **REPLY-TO**: When recipients click "Reply", it goes to `techtoolreview.co@gmail.com`
- **Recipients**: Only verified test emails (emails you added in Resend)

**Example email header:**
```
From: TechToolReviews <onboarding@resend.dev>
Reply-To: techtoolreview.co@gmail.com
To: semipajo2003@gmail.com
```

---

## ⚠️ Why This is NOT Ideal for Production

| Issue | Impact |
|-------|--------|
| Only sends to verified emails | Can't send to regular users |
| Looks unprofessional | `onboarding@resend.dev` doesn't match your brand |
| More likely to go to spam | Shared sandbox domain has poor reputation |
| Limited to test emails | Need to manually add every recipient |
| No custom branding | Can't use your domain name |

---

## 🎯 Recommended Solution: Use Custom Domain

**Cost:** FREE (you already own techtoolreviews.co)  
**Time:** 15 minutes  
**Benefit:** Unlimited emails, professional, better deliverability

### Quick Setup:

1. **Add domain to Resend** (5 min)
   - Go to https://resend.com/domains
   - Add `techtoolreviews.co`

2. **Add DNS records** (5 min)
   - Copy DNS records from Resend
   - Add to your domain registrar
   - Wait 15 min

3. **Update environment variable** (5 min)
   ```env
   FROM_EMAIL=TechToolReviews <noreply@techtoolreviews.co>
   REPLY_TO=techtoolreview.co@gmail.com
   ```

**Result:** 
- Emails from: `noreply@techtoolreviews.co` (professional!)
- Replies to: `techtoolreview.co@gmail.com` (your Gmail inbox)
- Sends to: ANYONE (unlimited!)
- Deliverability: Excellent (your own domain)

---

## 🧪 Testing Current Setup

### Test 1: Verify sandbox limitations

```bash
# This will FAIL if recipient isn't verified in Resend
Subscribe with: anyone@example.com
Result: ❌ Email won't send (sandbox restriction)

# This will WORK if recipient is verified
Subscribe with: techtoolreview.co@gmail.com
Result: ✅ Email sends (verified in Resend)
```

### Test 2: Check reply-to header

1. Send test email
2. Open email in Gmail
3. Click "Reply"
4. Should reply to: `techtoolreview.co@gmail.com` ✅

---

## 💡 Alternative: Use Your Personal Gmail

If you want to use your existing Gmail for everything:

### Option A: Forward Resend emails to Gmail
- Keep FROM as `onboarding@resend.dev`
- Set REPLY-TO to your personal Gmail
- Users see `onboarding@resend.dev` but replies go to your Gmail

### Option B: Use Gmail SMTP directly (not recommended)
- Send via Gmail's SMTP
- Requires app password
- Limited to 500 emails/day
- More likely to be marked as spam

---

## 🆘 FAQ

### Can I send FROM my Gmail address?
**No.** Gmail (and all email providers) block this to prevent spoofing. You can only send FROM domains you own and verify.

### How many test emails can I add?
Resend allows up to 100 verified test emails in sandbox mode.

### Will emails go to spam?
Using `onboarding@resend.dev` has higher spam risk than your own domain because it's a shared sandbox domain used by many Resend users.

### Do I need to pay for a custom domain?
No! You already own `techtoolreviews.co` - just add DNS records (free).

### What if I don't want to mess with DNS?
Then you're limited to sandbox mode (verified test emails only). Not suitable for real users.

---

## 📋 Current Configuration

✅ **Code updated to:**
- FROM: `onboarding@resend.dev` (sandbox)
- REPLY-TO: `techtoolreview.co@gmail.com` (your Gmail)
- Recipients: Only verified test emails

⚠️ **To send to everyone:**
- Must add custom domain
- Follow [QUICK_START_EMAIL_FIX.md](QUICK_START_EMAIL_FIX.md)

---

## 📞 Next Steps

### For Testing Only:
1. Add test emails in Resend dashboard
2. Set environment variables
3. Deploy and test

### For Production (Recommended):
1. Read [QUICK_START_EMAIL_FIX.md](QUICK_START_EMAIL_FIX.md)
2. Add custom domain (15 min)
3. Unlimited emails ✅

---

**Bottom Line:** With Gmail only, you're limited to testing. For real users, you need a custom domain (which you already own - just add DNS records).
