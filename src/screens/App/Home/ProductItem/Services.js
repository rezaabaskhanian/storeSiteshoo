import Axios from 'axios'


export const CreateCart = async(ID, count, DESCRIPTION)=>{
 const response=await Axios.post('order/cart', {
        'PRODUCT_ID': ID,
        'COUNT': count,
        'DESCRIPTION': '',
    })
    return response.data
}

export const GetCart = async()=>{
    const response=await Axios.get('order/cart')
       return response.data
   }

   export const EditCart = async(id,orderProduct,count,des)=>{
    const response=await Axios.put('order/cart', {
        'PRODUCT_ID': id,
        'ORDER_PRODUCT_DETAIL_ID' :orderProduct,
        'COUNT':count ,
        'DESCRIPTION': des,
    })
       return response.data
   }


