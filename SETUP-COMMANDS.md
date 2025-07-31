# Git Repository Setup Commands

## After creating GitHub repository, run these commands:

```bash
# Navigate to project directory
cd "C:\Users\willi\.claude\projects\Trei Project\Enterprise-Software-Hub"

# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/YOURUSERNAME/enterprise-software-hub.git

# Push to GitHub
git push -u origin master

# Verify connection
git remote -v
```

## Vercel Deployment Options:

### Option 1: Vercel Dashboard with Git Integration
1. Go to [vercel.com](https://vercel.com) 
2. Click "New Project"
3. "Import Git Repository"
4. Select your `enterprise-software-hub` repository
5. Deploy automatically

### Option 2: Vercel CLI Direct Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

## Environment Variables for Vercel:
After deployment, add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY/
GA_MEASUREMENT_ID=G-XXXXXXXXXX  
```

## Domain Connection:
1. **Vercel Dashboard** → Your Project → Settings → Domains
2. **Add Domain**: `enterprisesoftwarehub.com`
3. **Follow DNS instructions** provided by Vercel

## Next Steps After Deployment:
1. ✅ Test live site functionality
2. ✅ Set up email capture webhook
3. ✅ Connect custom domain
4. ✅ Submit affiliate applications
5. ✅ Start building email list

**Your Enterprise Software Hub will be live and ready to capture leads from 30,000+ IT professionals!**