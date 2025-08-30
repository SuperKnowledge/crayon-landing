# 🖍️ Crayon - Create Your Own Apps

> Vibe only, no code. A mobile-first platform for building mini apps for yourself and people you care about.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)
![Three.js](https://img.shields.io/badge/Three.js-0.160-000000)

## ✨ Features

- **Modern Minimal Design** - Clean, focused interface with subtle 3D elements
- **Interactive 3D Crayon** - Elegant rotating crayon built with Three.js
- **Mouse Trail Effects** - Subtle colorful trails that follow cursor/touch
- **Email Waitlist** - Google Sheets integration for easy email collection
- **Mobile-First** - Fully responsive and optimized for mobile devices
- **Dark Mode** - Sophisticated dark theme with neon accents
- **Performance Optimized** - Fast loading with lazy loading and code splitting

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Complete setup and deployment instructions
- [Google Sheets Integration](./SETUP.md#-google-sheets-integration-setup) - Email collection setup
- [Vercel Deployment](./SETUP.md#-vercel-deployment) - Deploy to production

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js + React Three Fiber
- **Animations:** Framer Motion
- **Hosting:** Vercel
- **Email Collection:** Google Sheets API

## 📁 Project Structure

```
crayon-landing/
├── app/
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx          # Main landing page
│   ├── globals.css       # Global styles
│   └── api/
│       └── waitlist/     # Email collection API
├── components/
│   ├── CrayonScene.tsx   # 3D crayon component
│   ├── MouseTrail.tsx    # Interactive mouse effects
│   └── WaitlistForm.tsx  # Email capture form
├── public/               # Static assets
└── lib/                  # Utility functions
```

## 🎨 Customization

### Colors
Edit CSS variables in `app/globals.css`:
- `--color-accent-1`: Primary accent (coral)
- `--color-accent-2`: Secondary accent (purple)
- `--color-accent-3`: Tertiary accent (yellow)

### Typography
Modify fonts in `app/layout.tsx` using Next.js font optimization

### 3D Crayon
Customize the crayon in `components/CrayonScene.tsx`:
- Colors and materials
- Rotation speed
- Lighting setup

## 🌐 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/crayon-landing)

Or follow the [deployment guide](./SETUP.md#-vercel-deployment)

## 📄 License

© 2025 Crayon AI, Inc. All rights reserved.

## 📧 Support

For questions or support: [support@crayon-ai.com](mailto:support@crayon-ai.com)

---

Built with ❤️ by Crayon AI, Inc.