### Steps để run và build source.
1. chuẩn bị và cài đặt các software:
    * Nodejs https://nodejs.org/en, version >= 18.18.0 
    * Postgresql Database https://www.postgresql.org/download. version >=16. Có thể thiết lập.  [docker](%https://hub.docker.com/_/postgres) thay vì cài trực tiếp trên thiết bị. ** Lưu ý hãy nhớ` username`,` password`, `databases name` được tạo (nên tạo database name là `library`), `port` sau khi cài đặt database này **.
    * [Git](%https://git-scm.com/downloads) để pull repos. Họăc các bạn có thể download trực tiếp repos (Code -> Download Zip).
2. running source.
    * Sau khi các bạn chuẩn bị và cài đặt các software ở trên. bước tiếp theo hãy mở `terminal`(command line) ở thư mục `library-management` (là repos chúng ta đã pull về hoặc đã giải nén) gõ các lệnh sau:
    ```
    node -v 
    npm -v
    ```
    * Để kiểm tra xem `nodejs` và `npm` đã cài đặt chưa và phiên bản là bao nhiêu. Sau khi đã kiểm tra và đã có 2 lệnh đó. tiếp theo chúng ta sẽ gõ lệnh:
    ```
    npm ci
    ```
   *  sau khi lệnh `npm ci` cài đặt xong. chúng ta sẽ thay đổi urlconnectionDB ở đường dẫn này `~./library-management/src/main/databases/db.ts`. 
    hiện tại nó đang là: `const urlConnection = 'postgres://postgres:123456@localhost:5433/library';
` 
chúng ta sẽ thay đổi nó(`username`, `password`, `port`, `database-name`) ở thiết lập bên trên.
Lưu ý định dạng chung sẽ là: `postgres://user:pass@example.com:5432/databasename`.
* Kiểm tra xem `ts-node` đã có chưa bằng lệnh:
```
ts-node -v
```
* Nếu chưa có chúng ta sẽ cài nó bằng lệnh:
```
npm i ts-node -g
```
* Tiêp theo chúng ta sẽ chạy chúng ở môi trường development với command lệnh như sau:
```
npm start
```
* chúng ta sẽ duplicate thêm 1 cửa số command line và chạy thêm các lệnh sau để import seeds và một số data cần thiết để chạy chúng.
```
npm run seed && npm run mock
```
Tới bước này là chúng ta có thể vọc chúng được rồi.

Nếu chúng ta muốn build thành file exe hoặc các file khác để chạy trên các môi trường `Linux`,` macOS`, `windows`. chúng ta sẽ gõ lệnh sau:
```
 electron-builder --linux # nếu là linux. các bạn có thể hay linux bằng các môi trường khác để build chúng.
```
các bạn có thể tham khảo ở đây: https://www.electron.build/cli.html

### Mọi vấn đề hoặc thắc mắc các bạn có thể tạo MR, busg ở đây: https://github.com/t-pk/library-management/issues.
