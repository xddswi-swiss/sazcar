import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import { supabase, supabaseAdmin } from "@/app/lib/supabase";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const dbPath = path.join(process.cwd(), "src/data/jobs.json");

export async function GET() {
  try {
    // 1. Fetch jobs from Supabase sorted by created_at descending
    const { data: dbJobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase query error, falling back to local JSON:", error);
    } else if (dbJobs && dbJobs.length > 0) {
      // Map Supabase columns to frontend keys
      const mappedJobs = dbJobs.map((j: any) => ({
        id: j.id,
        titleDe: j.title_de,
        titleTr: j.title_tr,
        titleEn: j.title_en,
        beforeImage: j.before_image_url,
        afterImage: j.after_image_url,
        createdAt: j.created_at,
        carModel: j.car_model
      }));
      return NextResponse.json(mappedJobs);
    }

    // 2. Fallback: Read from local JSON database if Supabase is empty or has error
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, "utf-8");
      const jobs = JSON.parse(fileContent);
      return NextResponse.json(jobs);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { passcode, titleDe, titleTr, titleEn, beforeImage, afterImage, carModel } = await req.json();

    // Verify passcode
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!titleDe || !titleTr || !titleEn || !beforeImage || !afterImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not initialized" }, { status: 500 });
    }

    // Helper to upload base64 string to Cloudinary
    const uploadToCloudinary = async (base64String: string, suffix: string) => {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: 'sazcar',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });
      return result.secure_url;
    };

    // Save images to Cloudinary (will auto-optimize to webp)
    const beforeUrl = await uploadToCloudinary(beforeImage, "before");
    const afterUrl = await uploadToCloudinary(afterImage, "after");

    // Insert new job into Supabase PostgreSQL table
    const { data: newJob, error: insertError } = await supabaseAdmin
      .from('jobs')
      .insert([
        {
          title_de: titleDe,
          title_tr: titleTr,
          title_en: titleEn,
          before_image_url: beforeUrl,
          after_image_url: afterUrl,
          car_model: carModel
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const mappedJob = {
      id: newJob.id,
      titleDe: newJob.title_de,
      titleTr: newJob.title_tr,
      titleEn: newJob.title_en,
      beforeImage: newJob.before_image_url,
      afterImage: newJob.after_image_url,
      createdAt: newJob.created_at,
      carModel: newJob.car_model
    };

    return NextResponse.json({ success: true, job: mappedJob });
  } catch (error: any) {
    console.error("Jobs POST error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, passcode } = await req.json();

    // Verify passcode
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not initialized" }, { status: 500 });
    }

    // Delete record from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Jobs DELETE error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
