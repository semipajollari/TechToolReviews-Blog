# Complete Email Setup Guide - Production Ready

## 🚨 CURRENT ISSUES IDENTIFIED

1. **Sandbox Mode Restriction**: Using `onboarding@resend.dev` limits emails to verified test addresses only
2. **Spam Issues**: Missing SPF, DKIM, DMARC DNS records
3. **Wrong Domain in Links**: Verification links use Vercel default domain instead of custom domain

---

## ✅ COMPLETE SOLUTION

### STEP 1: Add Custom Domain to Resend (CRITICAL - Fixes Issue #1)

Currently using: `onboarding@resend.dev` (SANDBOX - only sends to verified emails)
Need to use: `noreply@techtoolreviews.co` (PRODUCTION - sends to anyone)

#### 1.1 Add Domain in Resend Dashboard

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `techtoolreviews.co`
4. Click **"Add"**

#### 1.2 Configure DNS Records (CRITICAL for deliverability)

Resend will provide you with DNS records. Add these to your domain registrar (GoDaddy/Namecheap/Cloudflare):

**Example DNS Records (yours will be similar):**

```dns
# SPF Record (Prevents spoofing)
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
TTL: 3600

# DKIM Record 1 (Email authentication)
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (provided by Resend)
TTL: 3600

# DKIM Record 2
Type: TXT
Name: resend2._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (provided by Resend)
TTL: 3600

# DKIM Record 3
Type: TXT
Name: resend3._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (provided by Resend)
TTL: 3600

# DMARC Record (Email policy)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@techtoolreviews.co
TTL: 3600
```

**How to add DNS records:**

- **Cloudflare**: DNS → Records → Add Record
- **GoDaddy**: Domain Settings → Manage DNS → Add Record
- **Namecheap**: Domain List → Manage → Advanced DNS → Add New Record

⏱️ **Wait 15-60 minutes** for DNS propagation

#### 1.3 Verify Domain in Resend

1. After adding DNS records, click **"Verify DNS"** in Resend dashboard
2. Status should change to **"Verified"** ✅
3. You can now send emails from `noreply@techtoolreviews.co` to **ANY email address**

---

### STEP 2: Update Environment Variables

Add these to **Vercel** (NOT just .env.local):

1. Go to: https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog/settings/environment-variables
2. Add/Update these variables for **Production, Preview, Development**:

```env
RESEND_API_KEY=re_EGZtzNdU_B4YukB3uoZxNf9iZGcGrrcpu
FROM_EMAIL=TechToolReviews <noreply@techtoolreviews.co>
FRONTEND_URL=https://techtoolreviews.co
ADMIN_EMAIL=semipajo2003@gmail.com
```

3. **Redeploy** your application after saving

---

### STEP 3: Additional DNS Records for Maximum Deliverability

Add these optional but recommended records:

```dns
# MX Record (allows receiving bounce notifications)
Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600

# Return-Path (bounce handling)
Type: CNAME
Name: bounce
Value: feedback-smtp.us-east-1.amazonses.com
TTL: 3600
```

---

### STEP 4: Best Practices for Avoiding Spam

#### Email Content Best Practices:
- ✅ Always include physical address or company info in footer
- ✅ Include unsubscribe link (already implemented)
- ✅ Use plain text version alongside HTML
- ✅ Avoid spam trigger words: "FREE", "CLICK HERE", excessive caps
- ✅ Maintain good text-to-image ratio
- ✅ Use a real reply-to address

#### Sending Best Practices:
- ✅ Start with small volumes, gradually increase
- ✅ Monitor bounce rates (<5%)
- ✅ Monitor complaint rates (<0.1%)
- ✅ Keep unsubscribe rate low
- ✅ Clean inactive subscribers regularly

---

### STEP 5: Test Email Deliverability

Use these free tools after setup:

1. **Mail Tester**: https://www.mail-tester.com/
   - Send test email to their address
   - Get spam score (aim for 10/10)

2. **MX Toolbox**: https://mxtoolbox.com/SuperTool.aspx
   - Enter: `techtoolreviews.co`
   - Check SPF, DKIM, DMARC records

3. **DMARC Analyzer**: https://dmarc.org/
   - Verify DMARC configuration

---

### STEP 6: Monitor Email Health

In Resend Dashboard:
- Check **Delivery Rate** (should be >95%)
- Check **Bounce Rate** (should be <5%)
- Check **Complaint Rate** (should be <0.1%)
- Review any blocked/bounced emails

---

## 🔧 CODE UPDATES APPLIED

All code has been updated with:
- ✅ Dynamic domain from environment variables
- ✅ Proper custom domain email sender
- ✅ Correct verification link URLs
- ✅ Production-ready error handling
- ✅ Batch sending for newsletters
- ✅ Unsubscribe link compliance
- ✅ Professional email templates

---

## 📋 VERIFICATION CHECKLIST

Before going live, verify:

- [ ] Domain verified in Resend dashboard
- [ ] All DNS records added and verified (SPF, DKIM, DMARC)
- [ ] Environment variables set in Vercel (all environments)
- [ ] FROM_EMAIL updated to use custom domain
- [ ] FRONTEND_URL set to custom domain
- [ ] Test email sent successfully to external address (Gmail, Outlook)
- [ ] Verification link redirects to correct domain
- [ ] Unsubscribe link works correctly
- [ ] Newsletter sends to multiple recipients
- [ ] Mail-Tester.com score >8/10
- [ ] Application redeployed on Vercel

---

## 🆘 TROUBLESHOOTING

### Issue: Domain not verifying
**Solution**: Wait up to 1 hour for DNS propagation. Use `dig` or `nslookup` to verify:
```bash
nslookup -type=TXT resend._domainkey.techtoolreviews.co
```

### Issue: Emails still going to spam
**Solution**: 
1. Check Mail-Tester.com score
2. Verify all 3 DKIM records are added
3. Warm up domain by sending to engaged users first
4. Ask recipients to mark as "Not Spam"

### Issue: "Domain not verified" error
**Solution**: You're still using `onboarding@resend.dev` - update FROM_EMAIL environment variable

### Issue: Links redirect to Vercel domain
**Solution**: Ensure FRONTEND_URL is set in Vercel environment variables and app is redeployed

---

## 📞 SUPPORT

- **Resend Docs**: https://resend.com/docs
- **DNS Help**: https://resend.com/docs/dashboard/domains/introduction
- **Deliverability Guide**: https://resend.com/docs/knowledge-base/deliverability

---

**Last Updated**: January 6, 2026
**Status**: Production Ready ✅
