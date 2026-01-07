@echo off
echo Adding DNS records to Vercel...
echo.

REM SPF Record
echo Adding SPF record...
vercel dns add techtoolreviews.co @ TXT "v=spf1 include:amazonses.com ~all"

REM DMARC Record
echo Adding DMARC record...
vercel dns add techtoolreviews.co _dmarc TXT "v=DMARC1; p=none; rua=mailto:semipajo2003@gmail.com"

echo.
echo Done! Now you need to add DKIM records from Resend.
echo.
echo Go to: https://resend.com/domains
echo Click "Add Domain"
echo Enter: techtoolreviews.co
echo Copy the 3 DKIM records it shows you
echo.
pause
