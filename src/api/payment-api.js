import { api } from "../configs/axios"

export const postPayment = (data) => {
    return api.post('/paymentIntents/create-payment-intent',data)
  }