# SSA Form-Assist - Deployment Guide

This guide covers deploying the SSA Form-Assist Progressive Web Application to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
- [Post-Deployment](#post-deployment)
- [Security Considerations](#security-considerations)
- [Monitoring](#monitoring)

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- npm 9+ installed
- A production build tested locally
- API keys for at least one LLM provider (optional for users)

## Environment Variables

### Required Variables (None!)
This application requires **NO server-side environment variables** because it's a fully client-side PWA.

### Optional Client-Side Variables
Users can optionally provide API keys via `.env` or `.env.local` files:

```bash
# .env.local (gitignored)
VITE_ANTHROPIC_API_KEY="sk-ant-..."
VITE_ANTHROPIC_API_MODEL=claude-sonnet-4-5-20250929

VITE_GOOGLE_API_KEY="..."
VITE_GEMINI_API_MODEL=gemini-2.0-flash-exp

VITE_OPENAI_API_KEY="sk-proj..."
VITE_OPENAI_API_MODEL=gpt-4o-mini

VITE_XAI_API_KEY="xai-..."
VITE_XAI_API_MODEL=grok-beta
```

**Note:** These variables are baked into the client bundle at build time. They are NOT required - users can manually enter API keys in the Settings page.

## Deployment Options

### Option 1: Netlify (Recommended)

**Step 1: Connect Repository**
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Netlify will auto-detect Vite configuration

**Step 2: Configure Build Settings**
Build settings should auto-populate, but verify:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `18`

**Step 3: Deploy**
Click "Deploy site" - Netlify will:
1. Install dependencies
2. Run build
3. Deploy to CDN
4. Provide HTTPS URL

**Step 4: Custom Domain (Optional)**
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS (Netlify provides instructions)
4. SSL certificate auto-provisions

**Configuration File:** `netlify.toml` (already included)

### Option 2: Vercel

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
vercel
```

Follow the prompts:
- Set up and deploy: Y
- Which scope: Select your account
- Link to existing project: N
- Project name: ssa-form-assist
- Directory: `./` (current directory)
- Build command: `npm run build`
- Output directory: `dist`

**Step 3: Production Deployment**
```bash
vercel --prod
```

**Configuration File:** `vercel.json` (already included)

### Option 3: GitHub Pages

**Step 1: Update `vite.config.ts`**
Add base path:
```typescript
export default defineConfig({
  base: '/ssa-form-assist/', // Your repo name
  // ... rest of config
})
```

**Step 2: Add Deploy Script to `package.json`**
```json
{
  "scripts": {
    "deploy": "npm run build && npx gh-pages -d dist"
  }
}
```

**Step 3: Deploy**
```bash
npm install -D gh-pages
npm run deploy
```

**Step 4: Configure GitHub Pages**
1. Go to repository Settings → Pages
2. Source: `gh-pages` branch
3. Save

### Option 4: Self-Hosted (Docker)

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `nginx.conf`:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker
    location /sw.js {
        expires 0;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
}
```

**Build and Run:**
```bash
docker build -t ssa-form-assist .
docker run -p 8080:80 ssa-form-assist
```

## Post-Deployment

### 1. Verify PWA Installation
- Open deployed site in Chrome
- Check for "Install" button in address bar
- Verify service worker registered (DevTools → Application → Service Workers)

### 2. Test Core Functionality
- [ ] Passphrase creation works
- [ ] Passphrase unlock works
- [ ] Reports can be created
- [ ] Blue Book data loads
- [ ] AI generation works (with API keys)
- [ ] Reports save to IndexedDB
- [ ] Offline mode works (after first load)

### 3. Test Mobile Experience
- Open on real mobile device
- Verify responsive design
- Test touch targets (44px minimum)
- Check bottom navigation on mobile
- Verify PWA can be added to home screen

### 4. Security Verification
- [ ] HTTPS enabled (required for PWA)
- [ ] Security headers present (use securityheaders.com)
- [ ] No mixed content warnings
- [ ] IndexedDB encryption working
- [ ] Passphrase not leaked in network requests

## Security Considerations

### Critical Security Features
1. **HTTPS Required**: PWA features require HTTPS
2. **Client-Side Encryption**: All data encrypted with AES-256-GCM
3. **Zero-Knowledge**: Passphrase never leaves the client
4. **No Server Storage**: All data in IndexedDB on user's device

### Security Headers (Configured)
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Limit referrer info
- `Permissions-Policy` - Disable unnecessary browser features

### Data Privacy
- **No Analytics**: No tracking or analytics by default
- **No Cookies**: Application doesn't use cookies
- **Local Storage Only**: All data stays on user's device
- **No Server Communication**: Except LLM API calls (user-initiated)

## Monitoring

### Recommended Monitoring (Optional)

**1. Netlify Analytics** (if using Netlify)
- Site settings → Analytics
- Enable server-side analytics
- Privacy-respecting, no client-side tracking

**2. Performance Monitoring**
Use Lighthouse in Chrome DevTools:
```bash
npm install -g lighthouse
lighthouse https://your-site.com --view
```

**3. Error Monitoring (Optional)**
Consider Sentry for client-side error tracking:
```bash
npm install @sentry/react @sentry/vite-plugin
```

**4. Uptime Monitoring**
Use UptimeRobot or similar:
- Monitor main URL
- Check every 5 minutes
- Alert on downtime

### Health Checks

Create a simple health check script:
```bash
#!/bin/bash
# health-check.sh
curl -f https://your-site.com || exit 1
```

## Performance Optimization

### Already Implemented
- ✅ Code splitting
- ✅ Gzip compression
- ✅ Asset caching (1 year for static assets)
- ✅ Service worker for offline support
- ✅ Lazy loading of components
- ✅ Minification and tree-shaking

### Bundle Size
- Current: 284 KB (84 KB gzipped)
- Target: <500 KB (✅ Achieved)

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+
- PWA: 100

## Troubleshooting

### Issue: Service Worker Not Updating
**Solution:** Clear cache and hard reload
```
Chrome: DevTools → Application → Service Workers → Unregister → Reload
```

### Issue: IndexedDB Quota Exceeded
**Solution:** Users should delete old reports from Dashboard

### Issue: API Key Not Working
**Solution:** Check:
1. API key is valid and active
2. API key has correct prefix (sk-ant-, sk-proj, etc.)
3. Provider account has credits/billing enabled

### Issue: PWA Install Button Not Showing
**Solution:** Verify:
1. Site served over HTTPS
2. Has valid manifest.webmanifest
3. Has registered service worker
4. Meets PWA criteria (Lighthouse PWA audit)

## Rollback Procedure

### Netlify
1. Go to Deploys
2. Find previous deploy
3. Click "..." → "Publish deploy"

### Vercel
```bash
vercel rollback
```

### GitHub Pages
```bash
git revert HEAD
git push
npm run deploy
```

## Support

For deployment issues:
1. Check build logs in deployment platform
2. Test build locally: `npm run build && npm run preview`
3. Verify all files in `dist/` directory
4. Check browser console for errors

## License

This deployment guide is part of the SSA Form-Assist project.
