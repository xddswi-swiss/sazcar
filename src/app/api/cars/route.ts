import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase, supabaseAdmin } from "@/app/lib/supabase";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const { data: dbCars, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase cars query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database columns to frontend keys
    const mappedCars = (dbCars || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      price: Number(c.price),
      mileage: Number(c.mileage),
      year: c.year,
      power: c.power,
      transmission: c.transmission,
      fuelType: c.fuel_type,
      mfk: c.mfk,
      descriptionDe: c.description_de,
      descriptionTr: c.description_tr,
      descriptionEn: c.description_en,
      imageUrls: c.image_urls || [],
      createdAt: c.created_at,
    }));

    return NextResponse.json(mappedCars);
  } catch (error: any) {
    console.error("Cars GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      passcode,
      title,
      price,
      mileage,
      year,
      power,
      transmission,
      fuelType,
      mfk,
      descriptionDe,
      descriptionTr,
      descriptionEn,
      images, // array of base64 strings
    } = await req.json();

    // Verify passcode
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !title ||
      price === undefined ||
      mileage === undefined ||
      !year ||
      !power ||
      !transmission ||
      !fuelType ||
      !mfk ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not initialized" }, { status: 500 });
    }

    // Helper to upload base64 string to Cloudinary
    const uploadToCloudinary = async (base64String: string) => {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: "sazcar_cars",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });
      return result.secure_url;
    };

    // Upload all images and collect URLs
    const imageUrls: string[] = [];
    for (const base64Img of images) {
      const uploadedUrl = await uploadToCloudinary(base64Img);
      imageUrls.push(uploadedUrl);
    }

    // Insert new car into Supabase
    const { data: newCar, error: insertError } = await supabaseAdmin
      .from("cars")
      .insert([
        {
          title,
          price: Number(price),
          mileage: Number(mileage),
          year,
          power,
          transmission,
          fuel_type: fuelType,
          mfk,
          description_de: descriptionDe || "",
          description_tr: descriptionTr || "",
          description_en: descriptionEn || "",
          image_urls: imageUrls,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const mappedCar = {
      id: newCar.id,
      title: newCar.title,
      price: Number(newCar.price),
      mileage: Number(newCar.mileage),
      year: newCar.year,
      power: newCar.power,
      transmission: newCar.transmission,
      fuelType: newCar.fuel_type,
      mfk: newCar.mfk,
      descriptionDe: newCar.description_de,
      descriptionTr: newCar.description_tr,
      descriptionEn: newCar.description_en,
      imageUrls: newCar.image_urls,
      createdAt: newCar.created_at,
    };

    return NextResponse.json({ success: true, car: mappedCar });
  } catch (error: any) {
    console.error("Cars POST error:", error);
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
      return NextResponse.json({ error: "Car ID required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin not initialized" }, { status: 500 });
    }

    // Delete record from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("cars")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cars DELETE error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
