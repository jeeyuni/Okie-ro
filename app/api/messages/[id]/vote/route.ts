import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { vote_type, user_id } = await request.json();
    const { id: messageId } = await params;

    // 필수 필드 검증
    if (!user_id) {
      return Response.json({ error: "user_id가 필요함" }, { status: 400 });
    }

    if (vote_type !== -1 && vote_type !== 1 && vote_type !== 0) {
      return Response.json(
        { error: "vote_type은 -1, 0, 1 중 하나여야 함" },
        { status: 400 }
      );
    }

    // vote_type이 0이면 투표 취소
    if (vote_type === 0) {
      const { error } = await supabaseAdmin
        .from("Votes")
        .delete()
        .eq("message_id", messageId)
        .eq("anon_id", user_id);

      if (error) {
        console.error("Vote delete error:", error);
        return Response.json(
          { error: "투표 취소 중 오류 발생" },
          { status: 500 }
        );
      }

      return Response.json({ success: true, action: "removed" });
    }

    // 기존 투표 확인
    const { data: existingVote } = await supabaseAdmin
      .from("Votes")
      .select("*")
      .eq("message_id", messageId)
      .eq("anon_id", user_id)
      .single();

    if (existingVote) {
      // 같은 투표면 취소, 다른 투표면 변경
      if (existingVote.vote_type === vote_type) {
        // 투표 취소
        const { error } = await supabaseAdmin
          .from("Votes")
          .delete()
          .eq("message_id", messageId)
          .eq("anon_id", user_id);

        if (error) {
          console.error("Vote delete error:", error);
          return Response.json(
            { error: "투표 취소 중 오류 발생" },
            { status: 500 }
          );
        }

        return Response.json({ success: true, action: "removed" });
      } else {
        // 투표 변경
        const { error } = await supabaseAdmin
          .from("Votes")
          .update({ vote_type })
          .eq("message_id", messageId)
          .eq("anon_id", user_id);

        if (error) {
          console.error("Vote update error:", error);
          return Response.json(
            { error: "투표 변경 중 오류가 발생했습니다" },
            { status: 500 }
          );
        }

        return Response.json({ success: true, action: "changed", vote_type });
      }
    } else {
      // 새로운 투표 추가
      const { error } = await supabaseAdmin.from("Votes").insert({
        message_id: messageId,
        anon_id: user_id,
        vote_type,
      });

      if (error) {
        console.error("Vote insert error:", error);
        return Response.json(
          { error: "투표 중 오류가 발생했습니다" },
          { status: 500 }
        );
      }

      return Response.json({ success: true, action: "added", vote_type });
    }
  } catch (error) {
    console.error("POST vote error:", error);
    return Response.json(
      { error: "투표 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 사용자의 투표 상태 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const { id: messageId } = await params;

    if (!userId) {
      return Response.json({ error: "anon_id가 필요함" }, { status: 400 });
    }

    const { data: vote, error } = await supabaseAdmin
      .from("Votes")
      .select("vote_type")
      .eq("message_id", messageId)
      .eq("anon_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116은 "not found" 에러
      console.error("Vote fetch error:", error);
      return Response.json(
        { error: "투표 조회 중 오류 발생" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      vote_type: vote?.vote_type || 0,
    });
  } catch (error) {
    console.error("GET vote error:", error);
    return Response.json({ error: "투표 조회 중 오류 발생" }, { status: 500 });
  }
}
