# 📧 DNS Records Template for EnterpriseSoftwareHub.com

## Copy-Paste Ready DNS Records

### 🔧 For Vercel DNS Management

If you're using Vercel nameservers (ns1.vercel-dns.com, ns2.vercel-dns.com):

**Go to**: https://vercel.com/tahshawn-brinsons-projects/enterprise-software-hub/settings/domains

**Add these records exactly:**

#### MX Record 1:
```
Type: MX
Name: @ 
Value: mx1.titan.email
Priority: 10
```

#### MX Record 2:
```
Type: MX
Name: @
Value: mx2.titan.email  
Priority: 20
```

#### SPF Record:
```
Type: TXT
Name: @
Value: v=spf1 include:titan.email ~all
```

#### DMARC Record (Optional):
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@enterprisesoftwarehub.com
```

---

### 🔧 For Logo.com DNS Management

If you're managing DNS directly through Logo.com:

**Login to Logo.com** → My Domains → EnterpriseSoftwareHub.com → DNS Management

#### MX Records:
```
Record 1:
Type: MX
Host: @ (or leave blank)
Points to: mx1.titan.email
Priority: 10
TTL: 3600

Record 2:  
Type: MX
Host: @ (or leave blank)
Points to: mx2.titan.email
Priority: 20
TTL: 3600
```

#### TXT Records:
```
SPF Record:
Type: TXT
Host: @ (or leave blank)
Value: v=spf1 include:titan.email ~all
TTL: 3600

DMARC Record:
Type: TXT  
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@enterprisesoftwarehub.com
TTL: 3600
```

---

### 🔧 For Any Other DNS Provider

**Generic format for any DNS management panel:**

#### MX Records:
```
Type: MX
Name/Host: @ (root domain)
Value/Points to: mx1.titan.email
Priority/Preference: 10

Type: MX
Name/Host: @ (root domain)  
Value/Points to: mx2.titan.email
Priority/Preference: 20
```

#### SPF Record:
```
Type: TXT
Name/Host: @ (root domain)
Value: v=spf1 include:titan.email ~all
```

---

## ✅ Quick Setup Checklist

### Step 1: Sign up for Titan Email
- [ ] Go to https://titan.email
- [ ] Enter domain: enterprisesoftwarehub.com
- [ ] Choose Business Email plan
- [ ] Complete account setup

### Step 2: Add DNS Records
- [ ] MX Record 1: mx1.titan.email (priority 10)
- [ ] MX Record 2: mx2.titan.email (priority 20) 
- [ ] SPF Record: v=spf1 include:titan.email ~all
- [ ] DMARC Record (optional): DMARC policy

### Step 3: Verify Setup
- [ ] Check MX records at https://mxtoolbox.com
- [ ] Check SPF record at https://spf-record.com
- [ ] Wait 1-4 hours for DNS propagation
- [ ] Test email delivery

### Step 4: Create Email Accounts
- [ ] hello@enterprisesoftwarehub.com
- [ ] partnerships@enterprisesoftwarehub.com
- [ ] support@enterprisesoftwarehub.com
- [ ] noreply@enterprisesoftwarehub.com

---

## 🚨 Common DNS Panel Variations

### If your DNS panel asks for:

**"Host" or "Name" field:**
- Use `@` for root domain records
- Or leave blank if @ doesn't work

**"Value", "Points to", or "Destination":**
- Use the exact values: mx1.titan.email, mx2.titan.email

**"Priority", "Preference", or "Weight":**
- Use 10 for first MX record
- Use 20 for second MX record

**"TTL" (Time to Live):**
- Use 3600 (1 hour) or Auto/Default

---

## 📞 Support Contacts

### If you need help:

**Titan Email Support:**
- Help Center: https://support.titan.email
- Contact: support@titan.email

**Vercel DNS Support:**
- Documentation: https://vercel.com/docs/concepts/projects/domains
- Community: https://github.com/vercel/vercel/discussions

**Logo.com Support:**
- Check your Logo.com account for support options
- Look for live chat or support tickets

---

## ⏱️ Expected Timeline

### DNS Propagation:
- **15 minutes**: Records start propagating
- **1-2 hours**: Most locations updated
- **4-24 hours**: Full global propagation

### Email Functionality:
- **1-4 hours**: Basic email delivery working
- **24 hours**: Full deliverability optimized
- **48 hours**: All authentication records active

---

## 🔍 Verification Commands

### Check MX Records:
```bash
nslookup -type=mx enterprisesoftwarehub.com
```

### Check SPF Record:
```bash
nslookup -type=txt enterprisesoftwarehub.com
```

### Online Verification Tools:
- **MX Records**: https://mxtoolbox.com/mx/enterprisesoftwarehub.com
- **SPF Records**: https://spf-record.com/check/enterprisesoftwarehub.com
- **DMARC**: https://dmarc.org/dmarc-check/

---

**🎯 Goal**: Professional email at hello@enterprisesoftwarehub.com working within 4 hours, ready for affiliate program applications and business communications.**