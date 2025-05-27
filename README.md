# TIPX 學生資訊系統專案介紹

## 專案概述

TIPX 是一個為德明財經科技大學學生開發的現代化資訊系統，旨在提供比學校原有 TIP 系統更友善的用戶體驗和更豐富的功能。此系統整合了課表、成績查詢、作業管理、請假系統等多項學生常用功能。

## 技術架構

### 前端框架

- **Next.js** - 提供伺服器渲染和靜態網站生成功能
- **React** - 用於構建用戶介面
- **TypeScript** - 提供靜態類型檢查
- **Tailwind CSS** - 用於快速開發響應式設計
- **shadcn/ui** - 基於 Tailwind 的 UI 元件庫

### 狀態管理與數據獲取

- **TanStack Query (React Query)** - 用於數據獲取和快取管理
- **Axios** - HTTP 請求客戶端

### 後端技術

- **Next.js API Routes** - 作為後端 API 處理請求
- **Prisma** - ORM 工具，用於數據庫操作
- **Cheerio** - 用於解析學校系統的 HTML 並爬取數據
- **Redis** - 用於數據快取，提高系統效能

### 認證與授權

- **NextAuth.js/Auth.js** - 處理用戶認證
- **JWT** - 用於身份驗證和授權

### 使用者體驗增強

- **Framer Motion** - 提供頁面轉場和動畫效果
- **react-hot-toast** - 用於顯示通知提示
- **next-themes** - 實現深色/淺色模式切換
- **Tabler Icons** - 提供豐富的圖標庫

### 其他工具

- **js-cookie** - Cookie 處理
- **Fontmin** - 字體處理和優化
- **Google AdSense** - 廣告整合

## 功能模塊

### 學生基本功能

- 課表查詢與分享功能
- 學期成績與歷年成績查詢
- 系排名查詢
- 缺曠課紀錄與請假系統

### 課程相關功能

- 課程資訊顯示
- 作業上傳與管理
- 課程學生名單查詢

### 公告系統

- 學校公告瀏覽（包含置頂、校內、校外分類）
- 公告搜索和分享功能

### 個人資料管理

- 個人基本資料查詢
- 大頭貼與橫幅設定
- Line ID 設定

### 系統功能

- 響應式設計（支援桌面端和行動裝置）
- 深色/淺色模式切換
- 系統快取清除
- 資源下載中心

## 技術特點

### 數據爬取與處理

- 使用 Cheerio 爬取學校系統數據
- 處理 Big5 編碼問題，確保中文顯示正確

### 快取機制

- 實作 Redis 快取減少對學校系統的請求
- 不同數據設置不同的快取時間，優化性能

### 響應式設計

- 桌面版和行動版使用不同的版面設計
- 針對不同裝置提供最佳用戶體驗

### 進階功能

- 課表圖片生成與分享功能
- 自定義主題與界面設置
- 字體動態載入以優化效能

## 開發中功能

- 論壇/聊天功能
- 天氣預報整合
- 搜尋功能優化
- 點名頁面重構

## 改用 cheerio

- [x] class-list.ts
- [x] class-name.ts
- [x] class-rank.ts
- [x] conduct.ts
- [x] course-attendance-record.ts
- [x] course-teacher.ts
- [x] course.ts
- [x] credit.ts
- [x] description.ts
- [x] final-grade.ts
- [x] gender.ts
- [x] lineid.ts
- [ ] password.ts
- [x] post.ts
- [ ] ~~search-auth.ts~~
- [x] sem-grade.ts
- [x] teacher.ts
- [x] user.ts

# TODO

- [x] 缺曠操行功能重構
- [ ] 新增設定缺曠操行功能
- [x] 文章頁面重構
- [x] 資訊頁面重構
- [ ] 註冊頁面重構
- [ ] 點名頁面重構
- [x] 所有標題返回按鈕重構
- [ ] 搜尋功能重構
- [ ] 天氣預報功能重構
- [x] 新增大頭照更換功能
- [x] 新增背景圖更換功能
- [ ] 新稱Loading更換圖示功能
- [x] 新增留言功能 嵌入 ArtTalk
- [x] user 頁面總學分數統計
- [ ] user 頁面缺課統計
- [x] 作業上傳功能
