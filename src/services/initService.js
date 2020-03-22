import { JwtManager, ServiceManager } from './index'

export default function initServices(host) {
  JwtManager.creteAxiosInstance(host)
  ServiceManager.creteAxiosInstance(host)
}
