# 純手作烘焙坊官網 — 後端 API

純手作烘焙坊官網的 RESTful API 伺服器，提供商品管理、訂單處理、聯絡表單及後台人員認證等核心功能。

## 技術棧

| 類別     | 技術                                             |
| -------- | ------------------------------------------------ |
| 執行環境 | Node.js >= 18                                    |
| 框架     | Express 5                                        |
| 資料庫   | MongoDB + Mongoose 8                             |
| 認證     | JWT (Access Token + Refresh Token) + Passport.js |
| 驗證     | Joi                                              |
| 加密     | bcrypt                                           |
| 上傳     | Multer 2                                         |
| 模組系統 | ES Modules (`"type": "module"`)                  |

## 專案結構

```
server/
├── src/
│   ├── app.js                  # 入口：Express 設定、路由掛載、DB 連線
│   ├── config/
│   │   └── passport.js         # JWT Strategy 初始化
│   ├── constants/
│   │   ├── httpStatus.js       # HTTP 狀態碼常數
│   │   └── messages.js         # 中文訊息常數
│   ├── middleware/
│   │   ├── authMiddleware.js   # requireAuth / requireAdmin
│   │   ├── errorHandler.js     # globalErrorHandler + createError
│   │   └── rateLimiter.js      # In-memory Rate Limiter
│   ├── models/                 # Mongoose Schema
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Contact.js
│   ├── services/               # 業務邏輯層
│   ├── controllers/            # 請求處理層
│   ├── routes/                 # 路由定義層
│   ├── validation/             # Joi 驗證 Schema
│   └── utils/
│       ├── responseUtils.js    # 統一回應格式
│       ├── tokenUtils.js       # JWT 工具函式
│       └── passwordUtils.js    # 密碼雜湊工具
├── .env                        # 環境變數（不納入版本控制）
├── .gitignore
└── package.json
```

## API 文件

### 認證 `/api/auth`

| 方法 | 路徑        | 權限          | 說明                     |
| ---- | ----------- | ------------- | ------------------------ |
| POST | `/register` | -             | 註冊帳號                 |
| POST | `/login`    | -             | 登入，回傳 Access Token  |
| POST | `/refresh`  | -             | 換發 Access Token        |
| POST | `/logout`   | `requireAuth` | 登出，清除 Refresh Token |
| GET  | `/me`       | `requireAuth` | 取得當前使用者資訊       |

> 認證路由套用 `authLimiter`（10 次 / 15 分鐘）

### 商品 `/api/products`

| 方法   | 路徑         | 權限           | 說明                       |
| ------ | ------------ | -------------- | -------------------------- |
| GET    | `/`          | -              | 商品列表（支援篩選與分頁） |
| GET    | `/:id`       | -              | 單一商品詳情               |
| POST   | `/`          | `requireAdmin` | 新增商品                   |
| PUT    | `/:id`       | `requireAdmin` | 更新商品資訊               |
| DELETE | `/:id`       | `requireAdmin` | 刪除商品                   |
| POST   | `/:id/image` | `requireAdmin` | 上傳商品圖片               |

**商品列表查詢參數：**

| 參數       | 說明     | 範例        |
| ---------- | -------- | ----------- |
| `category` | 分類篩選 | `croissant` |
| `featured` | 精選商品 | `true`      |
| `badge`    | 標籤篩選 | `推薦`      |
| `page`     | 頁碼     | `1`         |
| `limit`    | 每頁筆數 | `12`        |

**商品分類（category）：** `croissant`、`bread`、`pastry`、`toast`、`seasonal`、`gift`

**商品標籤（badge）：** `推薦`、`季節限定`、`新品`、`熱銷`

### 訂單 `/api/orders`

| 方法  | 路徑          | 權限           | 說明             |
| ----- | ------------- | -------------- | ---------------- |
| POST  | `/`           | -              | 建立訂單（公開） |
| GET   | `/`           | `requireAdmin` | 取得所有訂單     |
| GET   | `/:id`        | -              | 取得單一訂單     |
| PATCH | `/:id/status` | `requireAdmin` | 更新訂單狀態     |

**訂單狀態流程：**

```
pending → confirmed → preparing → ready → completed
                                         ↘ cancelled
```

**付款狀態：** `unpaid` → `paid` → `refunded`

**訂單編號格式：** `BK-{timestamp36}-{random4}`（由 pre-save hook 自動產生）

### 聯絡表單 `/api/contact`

| 方法  | 路徑        | 權限           | 說明         |
| ----- | ----------- | -------------- | ------------ |
| POST  | `/`         | -              | 送出聯絡表單 |
| GET   | `/`         | `requireAdmin` | 取得所有訊息 |
| PATCH | `/:id/read` | `requireAdmin` | 標記為已讀   |

> 聯絡表單套用 `contactLimiter`（10 次 / 小時）

## 回應格式

所有 API 統一回傳以下格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

錯誤時：

```json
{
  "success": false,
  "message": "錯誤訊息"
}
```

## 授權

本專案為學術專題用途。
