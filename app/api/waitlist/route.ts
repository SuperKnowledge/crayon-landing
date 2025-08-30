import { NextRequest, NextResponse } from "next/server";

// You'll need to set up a Google Apps Script and add the URL as an environment variable
// Instructions:
// 1. Go to Google Sheets and create a new spreadsheet
// 2. Go to Extensions > Apps Script
// 3. Replace the code with the Google Apps Script code (see below)
// 4. Deploy as Web App and get the URL
// 5. Add the URL to your .env.local as GOOGLE_SCRIPT_URL

/* Google Apps Script Code (paste this in Google Apps Script editor):

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

*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    
    // Get additional data
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";
    
    // If you have set up Google Sheets integration
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    
    if (googleScriptUrl) {
      // Send to Google Sheets
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let response: Response | undefined;
      try {
        response = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            userAgent,
            referrer,
          }),
          // @ts-expect-error: node fetch supports AbortController signal
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        console.error("Google Sheets request failed", {
          status: response.status,
          statusText: response.statusText,
          body: bodyText?.slice(0, 1000),
        });
        throw new Error("Failed to save to Google Sheets");
      }
    } else {
      // Fallback: Log to console (for development)
      console.log("New waitlist signup:", {
        email,
        timestamp: new Date().toISOString(),
        userAgent,
        referrer,
      });
      
      // In production without Google Sheets, you might want to:
      // - Save to a database (Supabase, PostgreSQL, etc.)
      // - Send to an email service (SendGrid, Resend, etc.)
      // - Save to Vercel KV storage
    }
    
    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}