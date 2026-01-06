# 🚀 QUICK START - Fix Email Issues NOW

## Current Problem
✗ Emails only work for first test email (Resend sandbox limitation)  
✗ Emails going to spam (missing DNS records)  
✗ Links redirect to wrong domain (environment variable issue)

## ✅ 3-Step Solution (15 minutes)

---

### STEP 1: Add Domain to Resend (5 min)

**1.1** Go to https://resend.com/domains  
**1.2** Click "Add Domain" → Enter: `techtoolreviews.co`  
**1.3** Copy the DNS records shown (you'll need them next)

---

### STEP 2: Add DNS Records (5 min)

Go to your domain registrar (GoDaddy/Cloudflare/Namecheap) and add these records:

**Copy exactly from Resend dashboard**, should look like:

```
TYPE: TXT
NAME: @
VALUE: v=spf1 include:amazonses.com ~all

TYPE: TXT  
NAME: resend._domainkey
VALUE: p=MIGfMA0GC... (long string from Resend)

TYPE: TXT
NAME: resend2._domainkey  
VALUE: p=MIGfMA0GC... (long string from Resend)

TYPE: TXT
NAME: resend3._domainkey
VALUE: p=MIGfMA0GC... (long string from Resend)

TYPE: TXT
NAME: _dmarc
VALUE: v=DMARC1; p=quarantine; rua=mailto:dmarc@techtoolreviews.co
```

**Wait 15 minutes** for DNS to propagate, then click "Verify" in Resend.

---

### STEP 3: Update Vercel Environment Variables (5 min)

**3.1** Go to https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog/settings/environment-variables

**3.2** Update/Add these variables (for Production, Preview, Development):

| Variable | Value |
|----------|-------|
| `FROM_EMAIL` | `TechToolReviews <noreply@techtoolreviews.co>` |
| `FRONTEND_URL` | `https://techtoolreviews.co` |
| `RESEND_API_KEY` | `re_EGZtzNdU_B4YukB3uoZxNf9iZGcGrrcpu` |
| `ADMIN_EMAIL` | `semipajo2003@gmail.com` |

**3.3** Click "Save"

**3.4** Go to Deployments → Click "..." → "Redeploy"

---

## ✅ Verification (2 min)

### Test 1: Send test email
1. Go to admin dashboard → Subscribers tab
2. Send test newsletter
3. Check if it arrives in inbox (not spam)

### Test 2: Check deliverability score
1. Go to https://www.mail-tester.com/
2. Send test email to the address shown
3. Check your score (should be 8+/10)

### Test 3: Verify links
1. Subscribe with a new email
2. Click verification link in email
3. Should redirect to `https://techtoolreviews.co` (not Vercel domain)

---

## 🎯 Expected Results

After completing all steps:

✅ **FROM EMAIL**: `noreply@techtoolreviews.co` (not onboarding@resend.dev)  
✅ **Sends to ANY email** (not just verified test emails)  
✅ **Lands in INBOX** (not spam)  
✅ **Links work correctly** (redirect to your domain)  
✅ **Batch sending** works for newsletters  
✅ **Verification emails** work  
✅ **Unsubscribe links** work  

---

## 🆘 Troubleshooting

### "Domain not verified"
- Wait up to 1 hour for DNS propagation
- Use https://dnschecker.org/ to verify DNS records propagated globally

### Still going to spam
- Make sure ALL 4 DKIM records are added
- Check score at mail-tester.com
- Ask test recipients to mark as "Not Spam"

### "Sandbox mode" error
- FROM_EMAIL must use your custom domain (not onboarding@resend.dev)
- Check Vercel environment variables are saved
- Redeploy after changing variables

### Links still use Vercel domain
- Ensure FRONTEND_URL is set in Vercel (not just .env.local)
- Must redeploy after changing environment variables

---

## 📞 Need Help?

- **Resend Docs**: https://resend.com/docs/dashboard/domains/introduction
- **DNS Help**: https://resend.com/docs/knowledge-base/how-do-i-configure-dns-records
- **Check this file**: `EMAIL_SETUP_GUIDE.md` (detailed instructions)

---

**Last Updated**: January 6, 2026  
**Estimated Time**: 15 minutes  
**Status**: Ready to implement ✅
