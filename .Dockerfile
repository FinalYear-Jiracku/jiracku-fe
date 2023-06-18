# Sử dụng image nginx làm base
FROM nginx:alpine

# Xóa các tệp tin cấu hình mặc định của Nginx
RUN rm /etc/nginx/conf.d/*

# Sao chép tệp tin cấu hình tùy chỉnh của Nginx vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép tệp tin build của ứng dụng React vào thư mục web của Nginx
COPY build /usr/share/nginx/html

# EXPOSE cổng 80 để truy cập vào ứng dụng React qua Nginx
EXPOSE 81

# Khởi động Nginx khi container được chạy
CMD ["nginx", "-g", "daemon off;"]