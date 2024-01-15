
import Axios from 'axios'
export async function getGifts() {
    const response = await Axios.get('luck-wheel/getGifts')
    return response.data
}

export async function getOtp(userName) {
    console.log(userName,'usernameWheel')
    const response = await Axios.post(`luck-wheel/otp/${userName}`)
    return response.data
}


export async function setUser(userName,otp) {
    const response = await Axios.post(`luck-wheel/otp/${userName}/${otp}`)
    return response.data
}

export async function sendGift(userName,IdLuck) {
    const response = await Axios.post(`luck-wheel/userGetGift`,{
        'LUCK_WHEEL_ID':IdLuck,
        'USER_NAME':userName
    })
    return response.data
}
