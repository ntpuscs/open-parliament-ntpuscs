# 技術指示

## 開發環境建置

本指南適用於接手維護之學生議會資訊人員。

### 1. 取得專案與依賴安裝

```bash
git clone [https://github.com/ntpuscs/open-parliament-ntpuscs.git](https://github.com/ntpuscs/open-parliament-ntpuscs.git)
cd open-parliament-ntpuscs
pnpm install

```

### 2. 環境變數與 Google API 設定

本專案依賴 Google Sheets 進行資料存儲。請在專案根目錄建立 `.env` 檔案：

```env
# .env 範例
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@your-project-id.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID="your_google_sheets_spreadsheet_id_here"

```

[重要提醒]：

* 請至 Google Cloud Console 啟用 `Google Sheets API` 並建立服務帳戶 (Service Account)。
* 務必將該服務帳戶的 Email 加入至您的 Google 試算表共用名單中（賦予檢視者或編輯者權限）。
* `.env` 檔案中的 `GOOGLE_PRIVATE_KEY` 必須將實際憑證內的換行符號保留為 `\n`。

### 3. 啟動開發伺服器

```bash
npx nuxi dev

```

啟動後，請於瀏覽器開啟 `http://localhost:3000` 預覽。

## 部署與上線

推薦使用 **Cloudflare Pages** 進行自動化部署：

1. 將本儲存庫連結至 Cloudflare Pages。
2. 於 Cloudflare 的部署設定中，填入 `.env` 內對應的三個環境變數 (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEETS_ID`)。
3. (注意：於 Cloudflare 儀表板填入 Private Key 時，直接貼上原始多行文本即可，系統會自動處理換行)。
4. 設定自訂網域，Cloudflare 將自動核發 SSL 憑證確保連線安全。