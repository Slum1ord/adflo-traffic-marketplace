# ADFLO Traffic Marketplace - Deployment Guide

## Deployment Architecture

```
├── Frontend (Next.js) → Vercel
├── Backend (Node.js/Express API) → Render
└── Database (PostgreSQL) → Render
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository connected

### Steps

1. **Connect to Vercel:**
   - Go to [vercel.com/import](https://vercel.com/import)
   - Select "From Git Repository"
   - Choose your `adflo-traffic-marketplace` repository
   - Click "Import"

2. **Configure Environment Variables:**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add the following:
     ```
     DATABASE_URL=<your_render_postgres_connection_string>
     JWT_SECRET=<generate_a_secure_secret_key>
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
     ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at: `https://<your-project>.vercel.app`

---

## Backend Deployment (Render)

### Prerequisites
- Render account ([render.com](https://render.com))
- GitHub repository

### Option A: Using Render Dashboard (Easiest)

1. **Create Database:**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `adflo-traffic-db`
   - Region: (choose closest to you)
   - PostgreSQL Version: 14+
   - Plan: Starter ($7/month or free trial)
   - Click "Create Database"
   - Copy the Internal Database URL (starts with `postgresql://...`)

2. **Create Web Service:**
   - Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Name: `adflo-traffic-backend`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Plan: Starter (free)

3. **Add Environment Variables:**
   - In Web Service Settings → Environment
   - Add:
     ```
     DATABASE_URL=<postgresql://adflo_user:3d3DpsT9NaNGkEliXD8OTZugzeHrurXh@dpg-d584dgmuk2gs73ddgqbg-a/adflo>
     JWT_SECRET=<generate_secure_key>
     NODE_ENV=production
     PORT=10000
     ```

4. **Deploy:**
   - Connect and Deploy
   - Backend will be live at: `https://adflo-traffic-backend.onrender.com`

### Option B: Using render.yaml (Recommended)

```bash
# Push render.yaml to GitHub, then:
# 1. Go to Render Dashboard
# 2. Click "New" → "Blueprint"
# 3. Connect your GitHub repo
# 4. Select this repository
# 5. Render will auto-deploy both DB and backend
```

---

## Environment Variables Reference

### Frontend (.env.local in Vercel)
```
DATABASE_URL=postgresql://user:password@host:5432/db_name
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_API_URL=https://adflo-traffic-backend.onrender.com
```

### Backend (.env in Render)
```
DATABASE_URL=postgresql://user:password@host:5432/db_name
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
PORT=10000
```

---

## Database Setup

### Initial Migration
After connecting the database, run:

```bash
npx prisma migrate deploy
npx prisma db seed  # Optional: seed sample data
```

### Connect to Database
```bash
# Using psql client
psql postgresql://user:password@host:5432/db_name

# Inside Render, psql is available:
render-psql postgresql://user:password@host:5432/db_name
```

---

## Deployment Checklist

- [ ] Vercel account created
- [ ] Render account created  
- [ ] GitHub repository created and pushed
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API endpoints tested from frontend
- [ ] SSL/HTTPS enabled (automatic on both platforms)

---

## Post-Deployment Testing

### Test Backend
```bash
# Test login endpoint
curl -X POST https://adflo-traffic-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check health
curl https://adflo-traffic-backend.onrender.com/api/auth/me
```

### Test Frontend
1. Open `https://<your-project>.vercel.app`
2. Navigate to Login page
3. Test login/register flows
4. Check browser console for errors
5. Verify API requests reach backend

---

## Monitoring & Logs

### Vercel Logs
- Dashboard → Deployments → Logs
- Real-time and historical logs available

### Render Logs
- Service Dashboard → Logs
- Auto-rotating logs (last 100 entries visible)

---

## Troubleshooting

### Build Fails on Vercel
- Check `npm run build` works locally
- Verify all environment variables are set
- Check that database migrations are in sync

### Backend Won't Connect to Database
- Verify `DATABASE_URL` is correct
- Use Internal Database URL (not external)
- Ensure firewall allows connections
- Run `npx prisma db push` to update schema

### API Calls Return 401/403
- Verify `JWT_SECRET` is same on frontend & backend
- Check token is being sent in Authorization header
- Verify CORS is configured correctly

### Slow Deployments
- Starter plan may take longer to spin up
- Free tier sleeps after 15 minutes of inactivity
- Consider upgrading to Standard plan for production

---

## Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Vercel Frontend | Hobby (free) | $0 |
| Render Backend | Starter | $7 |
| Render Database | Starter | $7 |
| **Total** | - | **$14/month** |

*Free tier available for testing but has limitations*

---

## Support & Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
