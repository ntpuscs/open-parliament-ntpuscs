# 北大三峽議事資訊網

## 專案簡介

「北大三峽議事資訊網」專案由國立臺北大學三峽校區學生議會第 26 屆秘書處開發，旨在落實學生自治資訊公開法的要求，並嘗試實踐議事資訊學 (parliamentary informatics) 理論。

本網站的主要功能是：

1. 議案查詢：即舊網站提案公告功能。因新會網一般帳號禁止使用 iFrame 嵌入 AppSheet，爰獨立建置查詢網站。
2. 委員會建議事項提案查詢。至於作成建議報告者，則可於會網查詢。【建置中】
3. 秘書處議程作業系統：提供秘書處人員草擬議程與會議紀錄。

### 網站功能一覽

`https://sxcongress.ntpusu.org/`

![本系統之截圖](/public/screenshot.png)

* **首頁** ：以區塊形式呈現主要服務連結。
* **頭部導覽列** ：包含網站標題與導覽選單，並提供夜間模式切換按鈕。
* **議案查詢 (`/bill`)** ：
    * 顯示某屆所有議案的列表。
    * 提供多種篩選條件（例如：提案類型、提案機關/議員、案由等）。【功能完善中】
    * 支援日期範圍篩選與分頁功能。【功能完善中】
    * 議案詳細頁面 (`/bill/:term/:number`)：顯示單一議案的完整資訊與附件連結，並可列印之。
* **底部頁腳** ：顯示單位名稱及 GitHub Repository 連結。

## 技術

* **框架** ：Nuxt 4
* **樣式** ：Tailwind CSS
* **資料** ：Google Sheets API (透過 `googleapis` 函式庫)
* **圖標** ：Heroicons
* **部署** ：Cloudflare Pages
* **版本控制** ：Git / GitHub

本專案使用 Claude.ai, ChatGPT, Gemini 等服務生成，再由開發者微調。

技術上，配合議事系統使用 Google Forms 建置，本網站未來擬每天透過 GitHub Workflow 從 Google Sheets API 擷取資料（亦提供手動觸發功能），儲存至本地，以 Nuxt Content 作為 CMS。目前當前屆次資料係直接動態查詢 Google Sheets API，已結束屆次則是查詢本地 json。

## 開發

本專案使用 Node.js，套件管理工具為 pnpm.

### 專案啟動

1.  **複製專案**：
    ```bash
    git clone [https://github.com/ntpuscs/ntpusu-congsys.git](https://github.com/ntpuscs/ntpusu-congsys.git)
    cd ntpusu-congsys
    ```

2.  **安裝依賴**：
    ```bash
    pnpm install
    ```

3.  **Google Sheets API 設定**：

    * **建立 Google Cloud Project**：
        1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
        2.  建立新專案或選擇現有專案。
        3.  啟用 `Google Sheets API`。
    * **建立服務帳戶金鑰**：
        1.  在 Google Cloud Console 中，前往「API 和服務」>「憑證」。
        2.  點選「建立憑證」>「服務帳戶」。
        3.  填寫服務帳戶資訊並建立。
        4.  下載 JSON 金鑰檔案。
    * **設定 Google Sheets 權限**：
        1.  開啟您的 Google Sheets。
        2.  點選「共用」。
        3.  新增您的服務帳戶電子郵件地址（在下載的 JSON 檔案中的 `client_email` 欄位）。
        4.  給予「檢視者」或「編輯者」權限（依您的需求）。
    * **設定環境變數**：
        在專案根目錄創建一個 `.env` 檔案，並填入以下內容，這些值來自您下載的 JSON 金鑰檔案和您的 Google Sheets ID：
        ```env
        # .env
        GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@your-project-id.iam.gserviceaccount.com"
        GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
        GOOGLE_SHEETS_ID="your_google_sheets_spreadsheet_id_here"
        ```
        **注意：** `GOOGLE_PRIVATE_KEY` 務必將其中的換行符號 `\n` 替換為真實的換行。在部署時，直接粘貼原始的私鑰內容即可，會自動處理換行。

4.  **啟動開發伺服器**：
    ```bash
    npx nuxi dev
    ```
    應用程式將在 `http://localhost:3000` 啟動。

### 部署

本專案建議使用 Cloudflare Pages 部署，步驟如下：

1.  建立 GitHub Repository。
2.  Cloudflare Pages 部署。將 `.env` 檔案中的 `GOOGLE_SERVICE_ACCOUNT_EMAIL`、`GOOGLE_PRIVATE_KEY` 和 `GOOGLE_SHEETS_ID` 這三個變數及其值加入到 Cloudflare Pages 的環境變數中。
3.  自訂域名設定完成後， Cloudflare Pages 亦提供自動加密連線服務。

## 貢獻

歡迎對本專案提出任何建議或貢獻。如果您發現任何問題或有改進想法，請隨時提出 Issue 或 Pull Request。

## 聯絡方式

國立臺北大學學生自治會 三峽校區學生議會
Sanxia Campus Student Congress, NTPUSU

## 授權

本專案依據 [MIT License](LICENSE) 開源。