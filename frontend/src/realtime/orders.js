import { io } from 'socket.io-client'
import { API_URL } from '@/stores/api'

const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: true,
})

export function subscribeToOrderChanges(callback) {
  socket.on('orders:changed', callback)

  return () => {
    socket.off('orders:changed', callback)
  }
}
