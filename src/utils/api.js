const Localhost_API_BASE_URL = 'http://localhost:8080/api';
const PUBLIC_API_BASE_URL = 'http://zhangliyun10.gnway.cc:8000/api';

export function getApiUrl(endpoint) {
  return `${Localhost_API_BASE_URL}${endpoint}`;
}