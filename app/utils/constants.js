// 網站基本設定
export const SITE_CONFIG = {
  name: '北大三峽議事資訊',
  fullName: '國立臺北大學三峽校區學生議會',
  englishName: 'NTPU Student Congress (Sanxia Campus)',
  domain: 'sxcongress.ntpusu.org',
  email: 'ntpuscs@gmail.com',
  githubRepo: 'https://github.com/ntpuscs/open-parliament-ntpuscs'
};

// 外部連結設定
export const EXTERNAL_LINKS = {
  mainWebsite: 'https://ntpusu.org/',
};

// 主視覺顏色
export const THEME_COLORS = {
  primary: '#0F2D4B',
  primaryLight: '#1A3A5C',
  primaryDark: '#0A1F35',
  secondary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

// 響應式斷點
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// 錯誤訊息
export const ERROR_MESSAGES = {
  networkError: '網路連線錯誤，請檢查您的網路連線',
  serverError: '伺服器錯誤，請稍後再試',
  notFound: '找不到資料',
  invalidData: '資料格式錯誤',
  unauthorized: '未授權存取',
  forbidden: '禁止存取',
  timeout: '請求逾時',
  unknown: '未知錯誤'
};

// 成功訊息
export const SUCCESS_MESSAGES = {
  dataLoaded: '資料載入成功',
  searchCompleted: '搜尋完成',
  filterApplied: '篩選條件已套用'
};

// 載入狀態文字
export const LOADING_MESSAGES = {
  bills: '正在載入議案資料...',
  search: '正在搜尋...',
  filter: '正在篩選...',
  page: '正在載入頁面...'
};

// 空資料訊息
export const EMPTY_MESSAGES = {
  noBills: '目前沒有議案資料',
  noResults: '沒有符合條件的議案',
  noAttachments: '無附件'
};

// 議案編號正規表達式
export const BILL_NUMBER_REGEX = /^(\d+)屆北大峽議字第(\d+)號$/;

// 解析議案編號
export const parseBillNumber = (billNumber) => {
  const match = billNumber.match(BILL_NUMBER_REGEX);
  if (match) {
    return {
      term: parseInt(match[1]),
      number: parseInt(match[2])
    };
  }
  return null;
};

// 格式化議案編號
export const formatBillNumber = (term, number) => {
  return `${term}屆北大峽議字第${number}號`;
};

// 時間格式化
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 檢查是否為有效的 Google Drive 連結
export const isValidGoogleDriveLink = (url) => {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

// 將 Google Drive 分享連結轉換為直接檢視連結
export const convertGoogleDriveLink = (url) => {
  if (!url) return '';
  
  // 處理 /open?id= 格式
  const openIdMatch = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch) {
    return `https://drive.google.com/file/d/${openIdMatch[1]}/view`;
  }
  
  // 處理 /file/d/ 格式
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`;
  }
  
  return url;
};

// 預設匯出
export default {
  SITE_CONFIG,
  EXTERNAL_LINKS,
  THEME_COLORS,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  EMPTY_MESSAGES,
  BILL_NUMBER_REGEX,
  parseBillNumber,
  formatBillNumber,
  formatDate,
  isValidGoogleDriveLink,
  convertGoogleDriveLink
};