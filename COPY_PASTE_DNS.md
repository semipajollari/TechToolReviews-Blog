# COPY/PASTE THESE DNS RECORDS - 10 MINUTES

## STEP 1: Where did you buy techtoolreviews.co?

### If Namecheap:
1. Go to: https://ap.www.namecheap.com/
2. Click on techtoolreviews.co
3. Click "Advanced DNS"

### If GoDaddy:
1. Go to: https://account.godaddy.com/products
2. Click DNS next to techtoolreviews.co

### If Cloudflare:
1. Go to: https://dash.cloudflare.com/
2. Click techtoolreviews.co
3. Click "DNS"

---

## STEP 2: Add These 5 Records

**First, go to Resend and add domain:**
1. https://resend.com/domains
2. Click "Add Domain"
3. Type: `techtoolreviews.co`
4. Click Add

**Then copy the DNS records Resend shows you**

They will look like this (but use YOUR values from Resend):

### Record 1: SPF
```
Type: TXT
Name: @ 
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

### Record 2: DKIM 1
```
Type: TXT
Name: resend._domainkey
Value: [COPY FROM RESEND - starts with p=MIG...]
TTL: 3600
```

### Record 3: DKIM 2
```
Type: TXT
Name: resend2._domainkey
Value: [COPY FROM RESEND - starts with p=MIG...]
TTL: 3600
```

### Record 4: DKIM 3
```
Type: TXT
Name: resend3._domainkey
Value: [COPY FROM RESEND - starts with p=MIG...]
TTL: 3600
```

### Record 5: DMARC (use this exact value)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:semipajo2003@gmail.com
TTL: 3600
```

---

## STEP 3: Wait 15 Minutes

Grab coffee ☕

---

## STEP 4: Verify in Resend

1. Go back to https://resend.com/domains
2. Find techtoolreviews.co
3. Click "Verify DNS"
4. Should show "Verified" ✅

---

## STEP 5: Update Vercel (CRITICAL)

1. Go to: https://vercel.com/semis-projects-96449758/tech-tool-reviews-blog/settings/environment-variables

2. Find `FROM_EMAIL` → Edit → Change to:
```
TechToolReviews <noreply@techtoolreviews.co>
```

3. Click Save

4. Go to Deployments → Click "..." → "Redeploy"

---

## DONE! ✅

Now emails work for EVERYONE!

---

## Can't find DNS settings?

Tell me where you bought the domain and I'll give exact instructions.
