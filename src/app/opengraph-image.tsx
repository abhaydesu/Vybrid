import { OG_SIZE, shareCard } from "@/lib/og/card";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: party games for friends and family, on one phone`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return shareCard({
    lines: ["Game night,", "sorted."],
    subtitle: "Party games for friends and family, on one phone.",
  });
}
