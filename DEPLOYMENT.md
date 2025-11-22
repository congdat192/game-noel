# Hướng Dẫn Triển Khai Game "Catch & Win"

Đây là tài liệu hướng dẫn các bước để triển khai game lên nền tảng Vercel, sử dụng Supabase làm backend.

## Bước 1: Chuẩn bị Môi trường

1.  **Cài đặt Node.js:** Đảm bảo bạn đã cài đặt Node.js (phiên bản 18.x trở lên).
2.  **Tạo tài khoản:**
    *   Tạo tài khoản [Supabase](https://supabase.com/).
    *   Tạo tài khoản [Vercel](https://vercel.com/).
    *   Tạo tài khoản [GitHub](https://github.com/).

## Bước 2: Thiết lập Backend trên Supabase

1.  **Tạo Project:**
    *   Đăng nhập vào Supabase và tạo một Project mới. Lưu lại **Project URL** và **`anon` public key**.

2.  **Chạy Schema SQL:**
    *   Vào mục `SQL Editor` trong project Supabase của bạn.
    *   Mở file `schema.sql` trong mã nguồn này, sao chép toàn bộ nội dung.
    *   Dán vào SQL Editor và bấm `Run`. Thao tác này sẽ tạo các bảng `profiles`, `game_plays`, `referrals` và các hàm cần thiết.

3.  **Cấu hình Authentication:**
    *   Vào mục `Authentication` -> `Providers`.
    *   Bật nhà cung cấp `Phone`.
    *   **QUAN TRỌNG:** Supabase có dịch vụ gửi SMS OTP riêng nhưng có thể không tối ưu cho Việt Nam. Vì logic code trong `src/pages/Auth.jsx` đang giả định gọi đến API SMS của bạn, bạn cần đảm bảo API của mình hoạt động và trả về kết quả tương thích. Hoặc, bạn có thể cấu hình Supabase để dùng dịch vụ Twilio nếu muốn.

## Bước 3: Chuẩn bị Mã nguồn để Triển khai

1.  **Tạo Repo GitHub:**
    *   Tạo một repo mới trên GitHub (private hoặc public).
    *   Upload toàn bộ mã nguồn của dự án này lên repo đó.

2.  **Cấu hình Biến Môi trường:**
    *   Trong thư mục gốc của dự án, tạo một file mới tên là `.env`.
    *   Sao chép nội dung từ file `.env.example` và dán vào file `.env` vừa tạo.
    *   Điền các giá trị thực tế của bạn vào:
        *   `VITE_SUPABASE_URL`: Lấy từ cài đặt API của project Supabase.
        *   `VITE_SUPABASE_ANON_KEY`: Lấy từ cài đặt API của project Supabase.

3.  **Điền ID Tracking:**
    *   Mở file `src/components/Tracking.jsx`.
    *   Thay thế `'YOUR_FB_PIXEL_ID'` và `'YOUR_GA4_ID'` bằng các ID thực tế của bạn.

## Bước 4: Triển khai lên Vercel

1.  **Import Project:**
    *   Đăng nhập vào Vercel.
    *   Chọn `Add New...` -> `Project`.
    *   Kết nối với tài khoản GitHub của bạn và chọn repo game mà bạn đã tạo ở Bước 3.

2.  **Cấu hình Project:**
    *   Vercel sẽ tự động nhận diện đây là một dự án Vite (`Framework Preset: Vite`).
    *   Vào mục `Environment Variables`.
    *   Thêm các biến môi trường đã có trong file `.env` của bạn:
        *   `VITE_SUPABASE_URL`
        *   `VITE_SUPABASE_ANON_KEY`
    *   Bấm `Deploy`.

3.  **Hoàn tất:**
    *   Vercel sẽ tự động build và triển khai dự án của bạn. Sau vài phút, bạn sẽ nhận được một URL để truy cập game.
    *   Để sử dụng tên miền phụ (sub-domain), bạn có thể vào mục `Settings` -> `Domains` của project trên Vercel để cấu hình.

Chúc bạn thành công!
