import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// 메시지 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, lat, lon, anon_id, dong_name } = body;

    // 필수 필드 검증
    if (!content || !lat || !lon || !anon_id) {
      return Response.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    // 좌표 유효성 검증
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return Response.json({ error: "좌표 범위를 벗어남" }, { status: 400 });
    }

    // Supabase에 메시지 저장
    const { data, error } = await supabaseAdmin
      .from("Messages")
      .insert({
        content,
        lat,
        lon,
        anon_id,
        dong_name: dong_name || null,
        likes_count: 0,
        comments_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json(
        { error: "메시지 작성 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("POST error:", error);
    return Response.json(
      { error: "메시지 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 메시지 조회 (반경 5km 이내 메시지만 조회)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  if (!latStr || !lonStr) {
    return Response.json(
      { error: "lat과 lon 파라미터가 필요함" },
      { status: 400 }
    );
  }

  const userLat = parseFloat(latStr);
  const userLon = parseFloat(lonStr);

  if (isNaN(userLat) || isNaN(userLon)) {
    return Response.json({ error: "올바른 좌표 값이 아님" }, { status: 400 });
  }

  if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    return Response.json({ error: "좌표 범위를 벗어남" }, { status: 400 });
  }

  try {
    // Supabase RPC 함수를 사용하여 반경 5km 이내 메시지 조회
    const { data: messages, error } = await supabaseAdmin.rpc(
      "get_nearby_messages",
      {
        user_lat: userLat,
        user_lon: userLon,
        radius_km: 5,
      }
    );

    if (error) {
      console.error("Supabase RPC error:", error);
      return Response.json(
        { error: "메시지 조회 중 오류가 발생함" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      count: messages?.length || 0,
      data: messages || [],
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "메시지 조회 중 오류가 발생함" },
      { status: 500 }
    );
  }
}
