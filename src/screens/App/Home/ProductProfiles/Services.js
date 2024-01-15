import Axios from 'axios'


export const CreateCart = async(ID, count, DESCRIPTION)=>{
 const response=await Axios.post('order/cart', {
        'PRODUCT_ID': ID,
        'COUNT': count,
        'DESCRIPTION': '',
    })

    return response.data
}

export const EditCart = async(id,productId,itemId,count,des)=>{
    const response=await Axios.put('order/cart', {
        'ORDER_ID': id,
        'PRODUCT_ID': productId,
        'PRODUCT': itemId,
        'COUNT': count,
        'DESCRIPTION': des,
    })
       return response.data
   }

   export const GetProduct =async (ID)=>{
    const response =await Axios.get('products/pstore/'+ID)
    
    return response.data
   }