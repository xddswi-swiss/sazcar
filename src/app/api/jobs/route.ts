import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the jobs JSON database
const dbPath = path.join(process.cwd(), "src/data/jobs.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET() {
  try {
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json([]);
    }
    const fileContent = fs.readFileSync(dbPath, "utf-8");
    const jobs = JSON.parse(fileContent);
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { passcode, titleDe, titleTr, titleEn, beforeImage, afterImage } = await req.json();

    // Verify passcode
    if (passcode !== "sazcar2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!titleDe || !titleTr || !titleEn || !beforeImage || !afterImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Helper to save base64 image
    const saveImage = (base64String: string, suffix: string) => {
      const parts = base64String.split(";base64,");
      const content = parts[1] || parts[0];
      const buffer = Buffer.from(content, "base64");
      
      // Determine file extension
      let ext = "png";
      if (base64String.includes("image/jpeg") || base64String.includes("image/jpg")) {
        ext = "jpg";
      } else if (base64String.includes("image/webp")) {
        ext = "webp";
      }

      const filename = `job_${Date.now()}_${suffix}.${ext}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      return `/uploads/${filename}`;
    };

    // Save before and after images
    const beforeUrl = saveImage(beforeImage, "before");
    const afterUrl = saveImage(afterImage, "after");

    // Read current jobs
    let jobs = [];
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      jobs = JSON.parse(dbContent);
    }

    // Add new job
    const newJob = {
      id: jobs.length > 0 ? Math.max(...jobs.map((j: any) => j.id)) + 1 : 1,
      titleDe,
      titleTr,
      titleEn,
      beforeImage: beforeUrl,
      afterImage: afterUrl,
      createdAt: new Date().toISOString(),
    };

    jobs.unshift(newJob); // Put new job at the start

    // Write updated database
    fs.writeFileSync(dbPath, JSON.stringify(jobs, null, 2), "utf-8");

    return NextResponse.json({ success: true, job: newJob });
  } catch (error: any) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
