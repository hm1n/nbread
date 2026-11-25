import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "엔빵",
  description: "금융 알림으로 구독료 정산을 돕는 엔빵",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
