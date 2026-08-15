# TOEIC Collocation Gym

Website luyện collocation TOEIC Speaking & Writing theo luật: **hiện nghĩa tiếng Việt trước, chọn collocation tiếng Anh đúng sau**.

## Demo

**GitHub Pages:** https://phatnguyen1962005-crypto.github.io/toeic-collocation-gym/

## Có gì bên trong?

- 400 collocation không trùng lặp
- 240 collocation thực chiến và 160 cụm danh từ
- 55 cụm dành cho email TOEIC
- Chọn buổi luyện 10, 20, 50 hoặc toàn bộ câu
- Âm thanh đúng/sai, streak, hiệu ứng và confetti
- Phím tắt `1`–`4` để chọn, `Enter` để sang câu tiếp theo
- Tự lưu điểm cao nhất bằng `localStorage`
- Giao diện responsive cho điện thoại và máy tính
- Luyện lại riêng các câu trả lời sai

## Chạy trên máy

Yêu cầu Node.js 22 trở lên.

```bash
npm install
npx next dev
```

Mở http://localhost:3000.

## Tạo bản tĩnh cho GitHub Pages

```bash
npm run build:github
```

Next.js sẽ xuất website tĩnh vào thư mục `out/`. Workflow trong `.github/workflows/deploy-pages.yml` tự build và deploy lại mỗi khi nhánh `main` có thay đổi.

## Cấu trúc chính

- `app/collocations.ts`: toàn bộ dữ liệu 400 cụm Việt–Anh
- `app/page.tsx`: logic trắc nghiệm, âm thanh, điểm và ôn câu sai
- `app/globals.css`: giao diện, responsive và animation
- `.github/workflows/deploy-pages.yml`: tự động build và deploy GitHub Pages

## Công nghệ

Next.js 16, React 19, TypeScript và Web Audio API.
