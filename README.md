# TOEIC Collocation Gym

Website luyện collocation, V-pattern, giới từ và chuỗi ý TOEIC Speaking & Writing bằng trắc nghiệm phản xạ.

## Demo

**GitHub Pages:** https://phatnguyen1962005-crypto.github.io/toeic-collocation-gym/

## Có gì bên trong?

- 577 mục học: 400 collocation, 105 mẫu Writing và 72 câu Speaking Idea Sprint
- 240 collocation thực chiến và 160 cụm danh từ
- 55 cụm dành cho email TOEIC
- 46 câu V-pattern: `V + to V`, `V + V-ing`, `V + O + to V`
- 59 câu giới từ: verb + preposition, cấu trúc tân ngữ, `to + V-ing` và cụm Writing
- 18 idea chain Speaking dùng lại được cho nhiều chủ đề, chia thành 72 câu nối chunk hoàn toàn bằng tiếng Anh
- Speaking Sprint chạy liên tục, tự chuyển câu và có đồng hồ 30, 60, 90 hoặc 120 giây
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

- `app/collocations.ts`: toàn bộ dữ liệu collocation, V-pattern, giới từ và Speaking idea chains
- `app/page.tsx`: logic trắc nghiệm, Speaking Sprint, bộ đếm giờ, âm thanh, điểm và ôn câu sai
- `app/globals.css`: giao diện, responsive và animation
- `.github/workflows/deploy-pages.yml`: tự động build và deploy GitHub Pages

## Công nghệ

Next.js 16, React 19, TypeScript và Web Audio API.
