const Localhost_API_BASE_URL = '/api'; // 通过代理的 API 基础路径

export function getApiUrl(endpoint) {
  return `${Localhost_API_BASE_URL}${endpoint}`; // 请求会被代理到 http://localhost:8080
}