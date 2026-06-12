# Crayon Landing Page - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- A Vercel account (free tier works)
- A Google account (for Google Sheets integration)

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📧 Google Sheets Integration Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Crayon Waitlist"
4. In the first row, add headers: `Timestamp`, `Email`, `User Agent`, `Referrer`

### Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toISOString(),
      data.email,
      data.userAgent || '',
      data.referrer || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Save the project (Ctrl+S or Cmd+S)
5. Name it "Crayon Waitlist Script"

### Step 3: Deploy as Web App
1. Click **Deploy > New Deployment**
2. Choose type: **Web app**
3. Configure:
   - Description: "Crayon Waitlist Handler"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/...`)
6. Add this URL to your `.env.local` file as `GOOGLE_SCRIPT_URL`

## 🌐 Vercel Deployment

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# Set up environment variables when prompted
```

### Option 2: Deploy with Git
1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (leave as is)
   - Build Command: (leave as is)
   - Output Directory: (leave as is)

6. Add Environment Variables:
   - Click **Environment Variables**
   - Add `GOOGLE_SCRIPT_URL` with your Google Apps Script URL

7. Click **Deploy**

## 🎨 Customization

### Colors
Edit the color variables in `app/globals.css`:
```css
--color-accent-1: 255 98 87;  /* Coral/Red */
--color-accent-2: 120 119 255; /* Purple/Blue */
--color-accent-3: 255 206 84;  /* Yellow */
```

### Fonts
Change fonts in `app/layout.tsx`:
- Import different Google Fonts
- Update the font variables

### 3D Crayon
Modify colors and animation in `components/CrayonScene.tsx`:
- Change material colors
- Adjust rotation speed
- Modify lighting

## 📱 Mobile Optimization

The site is already mobile-optimized with:
- Responsive typography
- Touch-friendly interactions
- Optimized 3D rendering
- Mobile-first design

## 🐛 Troubleshooting

### 3D Crayon not showing
- Check browser console for WebGL errors
- Ensure Three.js dependencies are installed
- Try refreshing the page

### Emails not saving to Google Sheets
- Verify the Google Apps Script URL is correct
- Check that the script is deployed with "Anyone" access
- Look at Vercel function logs for errors

## Investor Deck Setup

The investor deck lives at `/deck` and is protected by an environment-variable password.
The login cookie is consumed on each deck load, so a browser refresh asks for the
password again.

### Environment variables

```env
DECK_PASSWORD="choose-a-shared-password"
DECK_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
```

`DECK_COOKIE_SECRET` is optional. If omitted, the deck password signs the session cookie.

### Tracking Sheet

Create a separate Google Sheet for deck tracking with these headers:

```text
Email | View Count | First Viewed At | Last Viewed At | Last User Agent | Last Referrer | Last IP
```

In **Extensions > Apps Script**, deploy this as a web app with **Execute as: Me** and
**Who has access: Anyone**:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || '').trim().toLowerCase();
    const timestamp = data.timestamp || new Date().toISOString();

    if (!email) {
      throw new Error('Missing email');
    }

    const lastRow = sheet.getLastRow();
    const emails = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
      : [];
    const existingIndex = emails.findIndex(function(value) {
      return String(value || '').trim().toLowerCase() === email;
    });

    if (existingIndex === -1) {
      sheet.appendRow([
        email,
        1,
        timestamp,
        timestamp,
        data.userAgent || '',
        data.referrer || '',
        data.ip || ''
      ]);
    } else {
      const row = existingIndex + 2;
      const values = sheet.getRange(row, 1, 1, 7).getValues()[0];
      const viewCount = Number(values[1] || 0) + 1;

      sheet.getRange(row, 1, 1, 7).setValues([[
        email,
        viewCount,
        values[2] || timestamp,
        timestamp,
        data.userAgent || values[4] || '',
        data.referrer || values[5] || '',
        data.ip || values[6] || ''
      ]]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

The app logs a `page_view` every time an authenticated visitor loads `/deck`. The script
keeps one row per email, increments `View Count`, and updates the latest viewed
timestamp/metadata.

### Build errors
- Ensure Node.js version is 18.17+
- Delete `node_modules` and `.next` folders, then reinstall:
```bash
rm -rf node_modules .next
npm install
```

## 🔒 Security Notes

- The Google Apps Script endpoint is public but only accepts POST requests
- Consider adding rate limiting for production
- Add CAPTCHA for bot protection if needed
- Validate emails server-side (already implemented)

## 📈 Analytics (Optional)

To add analytics:
1. Install Vercel Analytics: `npm i @vercel/analytics`
2. Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

// In the body:
<Analytics />
```

## 🎉 Launch Checklist

- [ ] Test email collection locally
- [ ] Verify Google Sheets integration
- [ ] Test on mobile devices
- [ ] Check loading performance
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Share with friends for feedback!

## 📞 Support

For issues or questions: support@crayon-ai.com

---

Built with ❤️ by Crayon AI, Inc.
