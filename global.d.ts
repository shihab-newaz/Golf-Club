import { CachedConnection } from './app/lib/mongoose'

declare global {
  var mongoose: CachedConnection
}