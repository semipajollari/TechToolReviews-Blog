# 📧 DO THIS NOW - Copy & Paste Guide

## ⏱️ Time: 15 minutes | Just follow the steps below

---

## STEP 1: Add Domain to Resend (3 minutes)

### 1.1 Open Resend
👉 **Click here:** https://resend.com/domains

### 1.2 Add Domain
1. Click the **"Add Domain"** button
2. In the box, type: `techtoolreviews.co`
3. Click **"Add"**

**You'll see DNS records** - KEEP THIS PAGE OPEN! You need these values next.

---

## STEP 2: Add DNS Records (7 minutes)

### 2.1 Find Your Domain Registrar

**Where did you buy techtoolreviews.co?**

- **Namecheap?** 👉 https://ap.www.namecheap.com/domains/list/
- **GoDaddy?** 👉 https://account.godaddy.com/products
- **Cloudflare?** 👉 https://dash.cloudflare.com/
- **Google Domains?** 👉 https://domains.google.com/registrar

### 2.2 Go to DNS Settings

Once you're in your registrar, look for:
- "DNS Settings" or
- "DNS Management" or  
- "Advanced DNS" or
- "Name Servers"

### 2.3 Add These 5 Records

**Copy the values from Resend**, but here's the format you need:

#### Record 1: SPF
```
Type: TXT
Name: @ (or leave blank)
Value: [Copy from Resend - starts with "v=spf1"]
TTL: 3600 (or Auto)
```

#### Record 2: DKIM #1
```
Type: TXT
Name: resend._domainkey
Value: [Copy from Resend - long string starting with "p="]
TTL: 3600
```

#### Record 3: DKIM #2
```
Type: TXT
Name: resend2._domainkey
Value: [Copy from Resend - long string starting with "p="]
TTL: 3600
```

#### Record 4: DKIM #3
```
Type: TXT
Name: resend3._domainkey
Value: [Copy from Resend - long string starting with "p="]
TTL: 3600
```

#### Record 5: DMARC
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:techtoolreview.co@gmail.com
TTL: 3600
```

**IMPORTANT:** Copy the actual values from Resend for Records 1-4. Only Record 5 (DMARC) uses the value I provided above.

### 2.4 Save Changes
Click **"Save"** or **"Add Record"** after each one.

---

## STEP 3: Wait & Verify (5-15 minutes)

### 3.1 Wait for DNS Propagation
⏱️ **Wait 5-15 minutes** (grab coffee ☕)

### 3.2 Verify in Resend
1. Go back to Resend domains page
2. Find your domain: `techtoolreviews.co`
3. Click **"Verify DNS"** button
4. Wait for status to change to **"Verified" ✅**

**If still pending:** Wait another 10 minutes and try again.

---

## STEP 4: Update Vercel (5 minutes)

### 4.1 Open Vercel Settings
👉 **Click here:** https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog/settings/environment-variables

### 4.2 Update/Add These Variables

For **EACH variable** below:
1. Click "Add New" or "Edit" if it exists
2. Set environment to: **Production, Preview, Development** (check all 3)
3. Click "Save"

#### Variable 1: FROM_EMAIL
```
Key: FROM_EMAIL
Value: TechToolReviews <noreply@techtoolreviews.co>
Environments: Production, Preview, Development
```

#### Variable 2: REPLY_TO
```
Key: REPLY_TO
Value: techtoolreview.co@gmail.com
Environments: Production, Preview, Development
```

#### Variable 3: FRONTEND_URL (if not set)
```
Key: FRONTEND_URL
Value: https://techtoolreviews.co
Environments: Production, Preview, Development
```

#### Variable 4: RESEND_API_KEY (verify it exists)
```
Key: RESEND_API_KEY
Value: re_EGZtzNdU_B4YukB3uoZxNf9iZGcGrrcpu
Environments: Production, Preview, Development
```

---

## STEP 5: Deploy (2 minutes)

### 5.1 Commit Changes
Open PowerShell in your project folder and run:

```powershell
git add .
git commit -m "Setup custom domain email"
git push
```

### 5.2 Redeploy on Vercel

**Option A: Auto-deploy**
- Vercel will auto-deploy after you push (wait 2-3 min)

**Option B: Manual redeploy**
1. Go to: https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog
2. Click **"Deployments"** tab
3. Click **"..."** on latest deployment
4. Click **"Redeploy"**

---

## ✅ DONE! Test It

### Test 1: Send Test Email
1. Go to: https://techtoolreviews.co/admin
2. Login
3. Go to "Subscribers" tab
4. Check "Send test email only"
5. Fill subject: "Test"
6. Fill content: "<p>Hello!</p>"
7. Click "Send Test"
8. Check your Gmail inbox

**Expected:**
- Email from: `noreply@techtoolreviews.co`
- Reply-to: `techtoolreview.co@gmail.com`
- Arrives in inbox (not spam)

### Test 2: Check Spam Score
1. Go to: https://mail-tester.com
2. Copy the test email address shown
3. Send newsletter to that address from admin
4. Check score (should be 8+/10)

---

## 🆘 Troubleshooting

### "Domain still pending"
- Wait longer (up to 1 hour)
- Check DNS records are exactly as shown
- Use https://dnschecker.org/ to check if DNS propagated

### "Emails still not working"
Run this in PowerShell:
```powershell
nslookup -type=TXT techtoolreviews.co
```
Should show the SPF record.

### "Can't find DNS settings"
Tell me your domain registrar and I'll give you specific instructions.

---

## 📋 Checklist

- [ ] Added domain to Resend
- [ ] Added 5 DNS records (SPF + 3 DKIM + DMARC)
- [ ] Waited 15 minutes
- [ ] Domain shows "Verified" in Resend
- [ ] Updated 4 environment variables in Vercel
- [ ] Committed and pushed code
- [ ] Redeployed on Vercel
- [ ] Sent test email
- [ ] Email arrived in inbox

---

**Need help?** Tell me which step you're stuck on and I'll help!
