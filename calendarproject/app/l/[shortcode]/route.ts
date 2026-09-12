import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(link.originalUrl);
}
