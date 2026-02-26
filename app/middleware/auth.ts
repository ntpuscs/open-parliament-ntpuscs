// middleware/auth.ts
console.log('Auth middleware file loaded. (This should always appear if file is loaded)'); // <-- 新增的頂部日誌

import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('[Auth Middleware] 執行中介軟體，目標路徑:', to.fullPath);

  if (process.client) {
    const isAuthenticated = sessionStorage.getItem('secretariat_authenticated') === 'true';
    console.log('[Auth Middleware] 客戶端模式。是否已驗證:', isAuthenticated);

    if (isAuthenticated) {
      console.log('[Auth Middleware] 已驗證，允許繼續。');
      return // 已驗證，允許繼續
    } else {
      console.log('[Auth Middleware] 未驗證，導向登入頁面。');
      // 未驗證，導向登入頁面
      // 傳遞原始目標路徑作為查詢參數，以便登入成功後跳轉回去
      return navigateTo({ path: '/secretariat/login', query: { redirect: to.fullPath } });
    }
  }

  // 對於伺服器端渲染，我們讓它通過，客戶端會立即執行 prompt 驗證。
  // 實際生產環境中，伺服器端也應有更嚴格的驗證機制，例如基於 JWT 或 Session。
  // 但對於本範例的客戶端驗證流程，這裡可以簡單放行。
  // 注意：這個中介軟體假設您已經在客戶端使用 sessionStorage 設置了 'secretariat_authenticated' 標誌。
  console.log('[Auth Middleware] 伺服器端模式或非客戶端環境，跳過 sessionStorage 檢查。');
});
