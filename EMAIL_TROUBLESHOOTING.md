# 🔧 Email Troubleshooting Guide

## Common Issues & Solutions

---

### ❌ Issue 1: "Only first test email works, others don't receive emails"

**Symptoms:**
- Email sent to `semipajo2003@gmail.com` works
- Emails to other addresses fail silently
- No error messages in logs

**Root Cause:**
Using Resend sandbox mode (`onboarding@resend.dev`) which only sends to verified test emails

**Solution:**
1. Add custom domain in Resend: https://resend.com/domains
2. Add DNS records (SPF, DKIM, DMARC)
3. Update `FROM_EMAIL` environment variable:
   ```
   FROM_EMAIL=TechToolReviews <noreply@techtoolreviews.co>
   ```
4. Redeploy application

**How to verify it's fixed:**
- Check Resend dashboard - domain status should be "Verified"
- Send test email to any email address (Gmail, Yahoo, etc.)
- Should receive email successfully

---

### ❌ Issue 2: "Emails going to spam folder"

**Symptoms:**
- Emails arrive but in spam/junk folder
- Mail-Tester.com score below 5/10

**Root Cause:**
Missing email authentication (SPF, DKIM, DMARC)

**Solution:**

**Step 1:** Add SPF record
```
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

**Step 2:** Add DKIM records (get exact values from Resend)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GC... (from Resend)

Type: TXT
Name: resend2._domainkey
Value: p=MIGfMA0GC... (from Resend)

Type: TXT
Name: resend3._domainkey
Value: p=MIGfMA0GC... (from Resend)
```

**Step 3:** Add DMARC record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@techtoolreviews.co
```

**Step 4:** Wait 15-60 minutes for DNS propagation

**How to verify it's fixed:**
- Use https://mxtoolbox.com/SuperTool.aspx - enter `techtoolreviews.co`
- Check SPF: should show "Pass"
- Check DKIM: should show "Pass"
- Check DMARC: should show "Pass"
- Send test email to https://mail-tester.com - score should be 8+/10

---

### ❌ Issue 3: "Verification links redirect to Vercel domain"

**Symptoms:**
- Click verification link in email
- Redirects to `tech-tool-reviews-blog.vercel.app` instead of `techtoolreviews.co`

**Root Cause:**
`FRONTEND_URL` environment variable not set in Vercel

**Solution:**
1. Go to Vercel: https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog/settings/environment-variables
2. Add/Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://techtoolreviews.co
   ```
3. Set for: Production, Preview, Development
4. Redeploy application

**How to verify it's fixed:**
- Send test verification email
- Check email source/HTML - all links should use `techtoolreviews.co`
- Click verification link - should redirect to custom domain

---

### ❌ Issue 4: "Domain not verifying in Resend"

**Symptoms:**
- Added DNS records but domain still shows "Pending" in Resend
- "Verify DNS" button doesn't change status

**Root Cause:**
DNS propagation delay or incorrect records

**Solution:**

**Step 1:** Verify DNS records are correct
```powershell
# Check SPF
nslookup -type=TXT techtoolreviews.co

# Check DKIM
nslookup -type=TXT resend._domainkey.techtoolreviews.co
nslookup -type=TXT resend2._domainkey.techtoolreviews.co
nslookup -type=TXT resend3._domainkey.techtoolreviews.co

# Check DMARC
nslookup -type=TXT _dmarc.techtoolreviews.co
```

**Step 2:** Check global DNS propagation
- Go to https://dnschecker.org/
- Enter: `techtoolreviews.co`
- Type: `TXT`
- Should show green checkmarks globally

**Step 3:** Wait and retry
- DNS can take up to 48 hours (usually 15-60 min)
- Try "Verify DNS" button again after waiting

**How to verify it's fixed:**
- Domain status in Resend shows "Verified" with green checkmark
- Can send emails from `noreply@techtoolreviews.co`

---

### ❌ Issue 5: "Newsletter not sending to all subscribers"

**Symptoms:**
- Only first 50 subscribers receive newsletter
- Admin shows more subscribers but not all get emails

**Root Cause:**
Old code had 50-email safety limit

**Solution:**
Code has been updated to use batch sending (100 emails/batch, unlimited batches)

Verify in [api/admin.js](api/admin.js):
```javascript
const BATCH_SIZE = 100; // Resend's max batch size
for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
  const batch = subscribers.slice(i, i + BATCH_SIZE);
  const result = await resend.batch.send(emails);
}
```

**How to verify it's fixed:**
- Check response after sending newsletter
- Should show: `sent: X, total: X, batches: Y`
- All active subscribers should receive email

---

### ❌ Issue 6: "Subscriber can't unsubscribe"

**Symptoms:**
- Click unsubscribe link in email
- Link broken or doesn't work
- Status doesn't change to "unsubscribed"

**Root Cause:**
Missing `unsubscribeToken` or wrong domain in link

**Solution:**

**Check database:** Ensure subscribers have `unsubscribeToken`
```javascript
// In MongoDB, subscriber document should have:
{
  email: "user@example.com",
  status: "active",
  unsubscribeToken: "abc123..." // Must exist
}
```

**Check link format:**
```
https://techtoolreviews.co/api/unsubscribe?token=abc123
```

**Verify [api/unsubscribe.js](api/unsubscribe.js) exists and works**

**How to verify it's fixed:**
- Send test newsletter with unsubscribe link
- Click unsubscribe link
- Should see confirmation page
- Check admin dashboard - status should change to "unsubscribed"

---

### ❌ Issue 7: "Environment variables not working after deployment"

**Symptoms:**
- Set environment variables in Vercel
- Deployed application
- Still using old values or undefined

**Root Cause:**
Environment variables only apply to NEW deployments

**Solution:**
1. Set/Update environment variables in Vercel
2. Go to Deployments tab
3. Find latest deployment
4. Click "..." menu → "Redeploy"
5. Wait for deployment to complete

**Alternative:** Force new deployment
```bash
vercel --prod
```

**How to verify it's fixed:**
- Check Vercel deployment logs
- Environment variables should show in build logs
- Test functionality (send email, check links)

---

### ❌ Issue 8: "Emails working locally but not on Vercel"

**Symptoms:**
- `npm run dev` - emails send successfully
- Production deployment - emails fail

**Root Cause:**
Different environment variables between local and Vercel

**Solution:**

**Step 1:** Compare environment variables
Local (`.env.local`):
```env
RESEND_API_KEY=re_xxx
FROM_EMAIL=TechToolReviews <noreply@techtoolreviews.co>
FRONTEND_URL=https://techtoolreviews.co
```

Vercel (check settings):
- All variables must be set for "Production" environment
- Values must match exactly

**Step 2:** Check Vercel function logs
```bash
vercel logs --follow
```

Look for errors like:
- "RESEND_API_KEY not found"
- "FROM_EMAIL undefined"

**How to verify it's fixed:**
- Vercel logs show successful email sending
- Test email arrives in inbox
- No error messages in logs

---

### ❌ Issue 9: "High bounce rate"

**Symptoms:**
- Many emails bouncing (>5%)
- Resend dashboard shows high bounce rate

**Root Cause:**
Invalid email addresses or inactive accounts

**Solution:**

**Step 1:** Clean subscriber list
```javascript
// Remove subscribers with invalid emails
// Check for:
// - Typos (gmial.com instead of gmail.com)
// - Fake emails (test@test.com)
// - Role-based emails (admin@, noreply@)
```

**Step 2:** Implement email validation
Already implemented in [api/subscribe.js](api/subscribe.js):
```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

**Step 3:** Use double opt-in (already implemented)
- Requires users to verify email
- Reduces fake/typo emails

**How to verify it's fixed:**
- Bounce rate should drop below 5%
- Monitor in Resend dashboard

---

### ❌ Issue 10: "Verification email not arriving"

**Symptoms:**
- User subscribes
- No verification email received
- Not in inbox or spam

**Debugging Steps:**

**Step 1:** Check Resend logs
- Go to https://resend.com/emails
- Find the email
- Check status (Delivered/Bounced/Failed)

**Step 2:** Check application logs
```bash
vercel logs --follow
```

Look for:
```
[Subscribe] Email sent: true/false
[Email] ✅ Sent to: user@example.com ID: xxx
```

**Step 3:** Verify code is being called
Add temporary logging in [api/subscribe.js](api/subscribe.js):
```javascript
console.log('[Subscribe] Sending verification to:', email);
const emailSent = await sendEmail(...);
console.log('[Subscribe] Email sent result:', emailSent);
```

**Common causes:**
- RESEND_API_KEY not set
- FROM_EMAIL using sandbox domain
- Email address invalid
- DNS not verified

---

## 🧪 Testing Checklist

Use this checklist to test email system:

- [ ] ✅ Send verification email to new subscriber
- [ ] ✅ Verification email arrives in inbox (not spam)
- [ ] ✅ Email is from `noreply@techtoolreviews.co`
- [ ] ✅ Click verification link redirects to `techtoolreviews.co`
- [ ] ✅ Subscriber status changes to "active"
- [ ] ✅ Send test newsletter to admin email
- [ ] ✅ Newsletter arrives with correct formatting
- [ ] ✅ Unsubscribe link works
- [ ] ✅ Subscriber status changes to "unsubscribed"
- [ ] ✅ Mail-Tester score is 8+/10
- [ ] ✅ SPF, DKIM, DMARC all pass in MXToolbox

---

## 📞 Getting Help

### Free Tools
- **Mail Tester**: https://mail-tester.com - Check spam score
- **MX Toolbox**: https://mxtoolbox.com - Check DNS records
- **DNS Checker**: https://dnschecker.org - Check DNS propagation
- **Email Header Analyzer**: https://mxtoolbox.com/EmailHeaders.aspx

### Documentation
- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Email Setup Guide**: See `EMAIL_SETUP_GUIDE.md`
- **Quick Start**: See `QUICK_START_EMAIL_FIX.md`

### Debug Commands

**Check DNS records:**
```powershell
nslookup -type=TXT techtoolreviews.co
nslookup -type=TXT resend._domainkey.techtoolreviews.co
```

**Check Vercel environment variables:**
```bash
vercel env ls
```

**View Vercel logs:**
```bash
vercel logs --follow
```

**Test Resend API:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@techtoolreviews.co",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>Hello</p>"
  }'
```

---

**Last Updated**: January 6, 2026  
**Version**: 1.0
