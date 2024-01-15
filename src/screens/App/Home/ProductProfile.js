/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react'
import {
    Platform,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    TouchableWithoutFeedback, Linking,
    FlatList,
    Image, AsyncStorage,TextInput,
    Share, Modal,CheckBox
  
} from 'react-native'
import { Rating} from 'react-native-ratings';
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import { Icon, Toast } from 'native-base'

import Material from 'react-native-vector-icons/MaterialIcons'

import Entypo from 'react-native-vector-icons/Entypo'
import Axios from 'axios'
import { config } from '../../../App'
import { TextTicker } from '../component'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'

import { WebView } from 'react-native-webview'
const { width } = Dimensions.get('window')
import { withTranslation } from 'react-i18next';
import i18n from '../../../services/lang/i18next'
 class App extends Beep(BeepProp, Component) {

    state = {
        scrollY: new Animated.Value(0),
        data: {},
        loading: true,
        like: false,
        lazy: false,
        lazyNote: false,
        item: {},
        product: {},

        order: store.cart[this.props.navigation.state.s ? this.props.navigation.state.s.item.ID + 'orderId' : this.props.navigation.state.params.item.ID + 'orderId'] ? store.cart[this.props.navigation.state.params.item.ID + 'orderId'] : 0,
        // count: store.cart[this.props.navigation.state.params.item.ID] ? store.cart[this.props.navigation.state.params.item.ID] : 0,
        count:  0,

        orderNote: store.note[this.props.navigation.state.s ? this.props.navigation.state.s.item.ID + 'orderId' : this.props.navigation.state.params.item.ID + 'orderId'] ? store.note[this.props.navigation.state.params.item.ID + 'orderId'] : 0,
        countNote: store.note[this.props.navigation.state.params.item.ID] ? store.note[this.props.navigation.state.params.item.ID] : 0,

        similar: [],
        routes: this.props.navigation.getParam('Route', []),
        countImg: 0,
        imgesLen: 0,
        hasNote: false,
        idPayDigi: false,
        idLinkDigi: false,
        idLinkProduct : false,
        commentIsOpen: false,
        commentModal:false,
        comments:[],
        itemBorderColor:null,
        featureColor:'',
        featureSize:'',
        itemBorderSize:null,
        parentId:null,
        orderProductID:'',
      orderProductNoteID :'',
      rating:'',
      showComment:false,
      showGaranti:false,
      showImage:false,
      getFeature :null,

      selectedFeature:[],

    selectedOptions :[],
    
    depended_id1:null,
    depended_id2:null,
    newPhone :null
    }

   

    setModalVisible(visible) {
        this.setState({ commentModal: visible })
    }
 
    async componentDidMount() {
        this.getModules()
        this.getPhone()
        AsyncStorage.getItem('Note').then((data) => {
            data == 'ok' ?
                this.setState({ hasNote: true })
                :
                null
        })

        const { item } = this.props.navigation.state.params

        if (!store.cart[item.ID]) {
            store.cart[item.ID] = 0
        }
        if (!store.note[item.ID]) {
            store.note[item.ID] = 0
        }

        

        try {
           
            Axios.get('products/pstore/' + item.ID).then(({data})=>{
                this.setState({
                    data: {
                        ...data.product,
                        ID: data.ID,
                        STORE_ID: data.STORE_ID,
                        PRODUCT_ID: data.PRODUCT_ID,
                        product_store_prices: data.product_store_prices[0],
                    },
                     count: data.IN_CART ? data.IN_CART : 0,
                    product: data.product,
                    item,
                    like: data.IS_FAVORIT,
                    loading: false
                })
               

            })
                    
            
            
          
        } catch (error) {

            // this.setState({ loading: false })
            Toast.show({
                text: 'مشکلی در پیدا کردن محصول بوجود آمده است.',
                type: 'danger'
            })
        }

        this.getComment(item.ID)
    }

    getComment =(ID)=>{
        Axios.get('features/getIdentifiedProductComment/' + ID).then((data)=>{
            this.setState({comments:data.data})
        })

    }

    getPhone =async()=>{
        AsyncStorage.getItem('NewPhoneNumber').then((data)=>{
     this.setState({
        newPhone :data
     })
         
        })
     }
    getModules = async () => {
        try {
            let getModuls = await Axios.get('features/get_modules')

            let hasComment =getModuls.data.getModules.filter((item) => item.ID == '4122')
         //
            let payDigi = getModuls.data.getModules.filter((item) => item.ID == '2015')
       //digiKala Link

       payDigi[0].ID == '2015' ? this.setState({ idPayDigi: true }) : console.log('noPay')
           
            let linkDigi = getModuls.data.getModules.filter((item) => item.ID == '2016')
              // video aparat
              linkDigi[0].ID == '2016' ? this.setState({ idLinkDigi: true }) : console.log('noLink')
            //link Product
            let linkProduct =getModuls.data.getModules.filter((item) => item.ID == '2037')
            linkProduct[0].ID == '2037' ? this.setState({ idLinkProduct: true }) : console.log('noLink')

            hasComment[0].ID=='4122' ? this.setState({ showComment: true }) : console.log('noComment')

         
        }
        catch (e) {
            console.log(e)
        }
    }


    convertAddCart=(e)=>{
    const { item } = this.props.navigation.state.params
 this.setState({count:e})
}

ratingCompleted(rate) {
    this.setState({rating:rate})
  }
sendComment =()=>{
     const { item } = this.props.navigation.state.params
    AsyncStorage.getItem('profile').then((data)=>{
        let guest = JSON.parse(data);
        if(guest.ROLE_ID == 1 ){
 Axios.post('features/addProductComment', {
        'COMMENT':this.state.comment,
        'PRODUCT_STORE_ID':Number(item.ID ),
        'RATE':Number(this.state.rating) ,
        'UR_ID':Number(guest.USER_ROLE_ID),
        
    }).then((response) => {
        Toast.show({
            text: 'نظر شما با موفقیت ثبت شد',
            type: 'success',
            position: 'top'
        });
       
    })
        }
        else {
            Toast.show({
                text: 'شما کاربر مهمان هستید لطفا لاگین کنید',
                type: 'danger',
                position: 'top'
            });
        }
    })

}


checkFeature = ()=>{

  if(this.state.product.product_features.length !==0  )  {
   if (this.state.featureColor  || this.state.featureSize)
   {
    return true
   }
   else {
    return false
   }

  }
  return true

}


      addToCart = ()=>{
  
    
    if (  this.state.count >0)
    { 
        
        //  if (this.checkFeature()  ){
  
        const { item } = this.props.navigation.state.params
        const stepCount = item.PRODUCT_UNIT_ID === 1 ? 0.5 : 1;
        let countTemp = store.cart[item.ID] ? store.cart[item.ID]   : 0;

        if (store.cart[item.ID] !== countTemp && countTemp !== 0) {
            this.setState({ count: countTemp })
        }
      
                    if (!this.state.lazy)
                        try {
                           
                                // this.createCart(this.state.data.ID, parseInt(this.state.count))
                                this.createCart(this.state.data.ID, parseInt(this.state.count))

                         
                        } catch (error) {
                            Toast.show({
                                text: 'please login',
                                type: 'danger',
                                position: 'bottom'
                            })
                        }
       
    // }else{
    //     Toast.show({
    //         text: 'please select size or color',
    //         type: 'danger',
    //         position: 'bottom'
    //     })
    // }
}else{
    Toast.show({
        text: 'Please specify the number',
        type: 'danger',
        position: 'bottom'
    })
}

    
    }

    createCart(ID, count) {

        
        
        const { item } = this.props.navigation.state.params
        
        this.setState({ lazy: true });
        Axios.post('order/cart', {
            'PRODUCT_ID': ID,
            'COUNT': count,
            'DESCRIPTION': '',
            'HAS_GUARANTEE':this.state.showGaranti ?  1:0,
            'FEATURE_ID_IN1':this.state.featureColor,
            'FEATURE_ID_IN2' :this.state.featureSize,
            'DEPENDED_ID1':this.state.depended_id1,
            'DEPENDED_ID2':this.state.depended_id2,
            'SELECTED_FEATURES':JSON.stringify(this.state.selectedFeature)
        }).then((response) => {
           
      
            store.cart_count += (this.state.data.PRODUCT_UNIT_ID === 1 ? 1 : count);
            store.cart[item.ID + 'orderId'] = response.data.ORDER_ID;
            if (store.cart[item.ID]) {
                store.cart[item.ID] += count;
            } else {
                store.cart[item.ID] = count;
            }
            Toast.show({
                text: this.state.data.NAME + ' تعداد' + count + ' به  سبد خرید اضافه شد',
                type: 'success',
                position: 'top'
            });
            this.setState({ lazy: false, order: response.data.ORDER_ID })

        }).catch((error) => {
            Toast.show({
                text: 'اضافه نشد',
                type: 'danger',
                position: 'bottom'
            });
            // alert(JSON.stringify(error, null, 5))
            this.setState({lazy:false})
          
        })
        
    }
    
        
    renderAddCount() {
       return (
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                <TouchableOpacity style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5
                }} onPress={async () => {

                              let n =parseInt(this.state.count) + 1
                              this.setState({count: n.toString() })
                        
                }}>
                    <Material name='add' size={18} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
        )
    }

    renderRemoveCount() {
        
        return (
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
                <TouchableOpacity style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5
                }} onPress={async () => {
                    let n=parseInt(this.state.count) ;
                    this.state.count ==0 ? null 
                  :

               n=  parseInt(this.state.count) - 1

                  this.setState({count: n.toString() })
                    //  this.setState({count: parseInt(this.state.count) - 1})
                    
                }}>
                  
                        <Material name='remove' size={15} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
        )
    }


    createCartNote(ID, count) {
        const { item } = this.props.navigation.state.params
        this.setState({ lazyNote: true });
       
        Axios.post('order/cart', {
            'PRODUCT_ID': ID,
            'COUNT': count,
            'DESCRIPTION': 'DESCRIPTION',
            'NOTE_BOOK': 1,
            'FEATURE_ID_IN1':this.state.featureColor,
            'FEATURE_ID_IN2' :this.state.featureSize

        }).then((response) => {
            store.note_count += (this.state.data.PRODUCT_UNIT_ID === 1 ? 1 : count);
            store.note[item.ID + 'orderId'] = response.data.ORDER_ID;
            if (store.note[item.ID]) {
                store.note[item.ID] += count;
            } else {
                store.note[item.ID] = count;
            }
            Toast.show({
                text: this.state.data.NAME + ' به تعداد ' + count + ' به دفترچه یادداشت اضافه شد',
                type: 'success',
                position: 'top'
            });
            this.setState({ lazyNote: false, orderNote: response.data.ORDER_ID })

        }).catch((error) => {
              Toast.show({
                text: 'به دفترچه اضافه نشد',
                type: 'danger',
                position: 'bottom'
            });
            this.setState({lazyNote: false})
            // alert(JSON.stringify(error, null, 5))
            
        })
    }
   
  

convertAddNote=(e)=>{
    const { item } = this.props.navigation.state.params
 this.setState({countNote:e})
}


addToCartNote = () =>{
    if (this.state.countNote > 0 )
{ 
       const { item } = this.props.navigation.state.params
        const stepCount = item.PRODUCT_UNIT_ID === 1 ? 0.5 : 1;
        let countTemp = store.note[item.ID] ? store.note[item.ID]   : 0;

        if (store.note[item.ID] !== countTemp && countTemp !== 0) {
            this.setState({ countNote: countTemp })
        }
      
                    if (!this.state.lazyNote)
                        try {
                                this.createCartNote(this.state.data.ID, parseInt(this.state.countNote))    
                            
                        } catch (error) {
                             
                            console.warn(error)
                        }

                    }else{
                        Toast.show({
                            text: 'لطفا تعداد را مشخص کنید',
                            type: 'danger',
                            position: 'bottom'
                        });
                    }
}
    renderAddCountNote=()=> {
        return (
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                <TouchableOpacity style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5
                }} onPress={async () => {

                             let n =parseInt(this.state.countNote) + 1

                             this.setState({countNote: n.toString() })
                       
                        
                }}>
                    <Material name='add' size={18} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
        )
    }

    renderRemoveCountNote() {
        return (
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
                <TouchableOpacity style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5
                }} onPress={async () => {
                    let n;
                    this.state.countNote ==0 ? null :
                    n =parseInt(this.state.countNote) - 1
                     this.setState({countNote:n.toString()  })
                        
                }}>
                  
                        <Material name='remove' size={15} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
        )
    }

    
     
        onShare= (id) => {
            Share.share(
                {
                    message:`${config.BaseUrl}/product/${id} `
                }
            )
           
        }

        handleError = () => { 
             this.setState({showImage:true})
           
        }

        addToSelectedOptions (data){
            
           
            let newFeature= this.state.selectedOptions
            if(!newFeature.includes(data.FEATURE_ID)){
                newFeature.push(data.FEATURE_ID); 
                // this.setState({selectedOptions:newFeature ,depended_id1:})
                this.setState({selectedOptions:newFeature,depended_id1 :data.IS_VARIABLE ==3 ? data.product_store.ID :null,
                    depended_id2 :data.IS_VARIABLE ==4 ?  data.product_store.ID :null,
                })
                
            }else{
              let news= newFeature.filter((e)=>e !==data.FEATURE_ID)
              this.setState({selectedOptions:news})
            //   newFeature= news
            }
        
        }
        addToSelectedFeature(data){
          
            let newFeature= this.state.selectedFeature
            if(!newFeature.some(item => item.ID == data.FEATURE_ID)){
              
                newFeature.push({ID:data.FEATURE_ID, NAME :data.feature.NAME  , VALUE :data.VALUE , PRODUCT_FEATURE_NAME :data.NAME }); 
                this.setState({selectedFeature:newFeature })
            }else{
              let news= newFeature.filter((e)=>e.ID != data.FEATURE_ID)
              this.setState({selectedFeature:news})
              newFeature= news
            }
        }

    render() {

        const {t} =this.props
        const { item } = this.props.navigation.state.params;
    

        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        } else {
            let price = this.state.data.product_store_prices;
            let hasOff = price ? price.PRICE_AFTER_OFFER !== price.PRICE : false;
            let PRICE = price.PRICE ? price.PRICE : this.state.data.product.productPrices[0].PRICE;
            let OFFERPRICE = price.PRICE_AFTER_OFFER;
           
            return (
                <View style={styles.container}>
                    <ScrollView
                        ref={(ref) => this.ScrollView = ref}
                        scrollEventThrottle={1}
                        style={{ flex: 1 }}>
                        <FlatList
                            horizontal
                            inverted
                            data={[...this.state.routes, this.state.data.NAME]}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ padding: 8, maxHeight: 40, height: 40, marginTop: 60 }}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: 'row-reverse', height: 30 }}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        this.props.navigation.pop(this.state.routes.length - index)
                                    }}>
                                        <View /*style = {{
											padding: 2, elevation: 2, borderRadius: 15,
											backgroundColor: '#ddd', alignItems: 'center',
											justifyContent: 'center', height: 25
										}}*/>
                                            <Text style={{
                                                ...styles.TextRegular,
                                                fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                                color: StyleSheet.value('$MainColor'),
                                                flex: 1
                                            }}>
                                                {item}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    {
                                        index < (this.state.routes.length) ?
                                            <Text style={styles.TextRegular}>{' < '}</Text> :
                                            <Text style={styles.TextRegular}>{'  '}</Text>
                                    }
                                </View>
                            )}
                        />

                        <View style={{ width, height: 300, flexDirection: 'row-reverse', marginTop: 8,justifyContent:'flex-end' }}>
                            {
                                // <FastImage
                                //     // source={{uri: config.BaseUrl + config.ProductSubUrl + this.state.data.IMAGE}}
                                //     source={{ uri: config.ImageBaners + config.ProductSubUrl + this.state.data.IMAGE }}
                                //     resizeMode='contain'
                                //     style={{ width, height: 300 }}
                                // />
                                this.state.data.productImages.length == 0 ?
                                    <Image
                                        // source={{uri: config.BaseUrl + config.ProductSubUrl + this.state.data.IMAGE}}
                                        //{ uri: config.ImageBaners + config.ProductSubUrl + this.state.data.IMAGE }
                                        source={require('../../../assest/cart.png')}
                                        resizeMode='contain'
                                        style={{ width, height: 300 }}
                                    />
                                    :
                                    this.state.data.productImages.length == 1 ?
                                        <FastImage
                                            // source={{uri: config.BaseUrl + config.ProductSubUrl + this.state.data.IMAGE}}
                                            onError={()=>this.handleError()}
                                            source={this.state.showImage?require('../../../assest/productNew.png'):{ uri: config.ImageBaners + config.ProductSubUrl + this.state.data.productImages[this.state.countImg].IMAGE }
                                                        }

                                            resizeMode='contain'
                                            style={{ width, height: 300 }}
                                        />
                                        :
                                        [
                                            <View style={{ zIndex: 1, top: 135, left: 10, width: 35, height: 35, borderRadius: 35 / 2, position: 'absolute', backgroundColor: 'white' }}>
                                                <Material name='chevron-right' size={35} onPress={() => {
                                                    this.state.data.productImages.length - 1 > this.state.countImg ?
                                                        [this.setState({ countImg: this.state.countImg + 1 }),
                                                        ]
                                                        : null
                                                }} />
                                            </View>,

                                            <View blurRadius={1} style={{ zIndex: 1, top: 135, right: 10, width: 35, height: 35, borderRadius: 35 / 2, position: 'absolute', backgroundColor: 'white' }}>
                                                <Material name='chevron-left' size={35} onPress={() => {
                                                    this.state.countImg >= 1 && this.state.data.productImages.length - 1 >= this.state.countImg ?
                                                        this.setState({ countImg: this.state.countImg - 1 })
                                                        : null
                                                }} />
                                            </View>,
                                            <FastImage
                                                // source={{uri: config.BaseUrl + config.ProductSubUrl + this.state.data.IMAGE}}
                                                source={{ uri: config.ImageBaners + config.ProductSubUrl + this.state.data.productImages[this.state.countImg].IMAGE }}
                                                resizeMode='contain'
                                                style={{ width, height: 300 }}
                                            />
                                        ]
                            }
                        </View>
                        <View>
                            <View style={{
                               
                                paddingRight: '5%',
                                paddingLeft: '5%',
                                alignItems: 'center',
                                flexDirection: 'row-reverse',
                                // justifyContent: 'flex-end'
                            }}>
                                <Text style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}>{this.state.data.NAME}</Text>
                                {/*<Material name='favorite' size={20} />*/}

                            </View>

  {
    
//  <View>
//     {
//         this.state.data?.attributes.map((data,index)=>{
//             return (

//                 <View style={{
//                     justifyContent: 'flex-end',
//                     paddingRight: '5%',
//                     paddingLeft: '5%',
//                     alignItems: 'center',
//                     flexDirection: 'row-reverse',
//                     justifyContent: 'space-between'
//                 }}>

                   
//                     <Text style={{
//                         ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{data.NAME}</Text>

                    
//               <Text style={{
//                          ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{`${index +1 } : ` }</Text>
                 
               
//                 </View>
//             )
//         })
//     }

// {
//         this.state.data?.selected_product_features.map((data,index)=>{
//             return (
//                 <TouchableOpacity
//                  onPress={()=>this.addToSelectedFeature(data)}
//                 style={{marginLeft:5,flexDirection:'row',marginTop:10,borderRadius:5, width:150,borderWidth : 2,
//                  borderColor : this.state.selectedFeature.some(item => item.ID == data.FEATURE_ID)  ? '#66B2FF' : '#A9A9A9'}}>
//                    {/* {console.log(this.state.selectedFeature.some(item => item.ID == data.FEATURE_ID),'pplppp')} */}
//                 <View style={{
//                     justifyContent: 'flex-end',
//                     paddingRight: '5%',
//                     paddingLeft: '5%',
//                     alignItems: 'center',
//                     flexDirection: 'row-reverse',
//                     justifyContent: 'space-between'
//                 }}>

                   
//                     <Text style={{
//                         ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{data.NAME}</Text>

                    
//               <Text style={{
//                          ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{`${data.SORT } : ` }</Text>
                 
               
//                 </View>
//                 </TouchableOpacity>
//             )
//         })
//     }

// <View style={{
//      justifyContent: 'flex-end',
//     paddingRight: '5%',
//     paddingLeft: '5%',
//     alignItems: 'center',
//     flexDirection: 'row-reverse',
//     justifyContent: 'space-between'
// }}>

   
//     <Text style={{
//         ...styles.TextBold,
//         color: 'black',
//         fontSize: 18,
//         textAlign: 'center',
//     }}>{ 'Optios : '   }</Text>
//     </View>


// {

//         this.state.data.options?.map((data,index)=>{
//             return (
//                 <TouchableOpacity
//                  onPress={()=>this.addToSelectedOptions(data)}
//                 style={{marginLeft:5,flexDirection:'row',marginTop:10,borderRadius:5, width:150,borderWidth : 2, borderColor : this.state.selectedOptions.includes(data.FEATURE_ID) ? '#66B2FF' : '#A9A9A9'}}>

//                 <View style={{
//                     marginVertical:10,
//                      justifyContent: 'flex-end',
//                     paddingRight: '5%',
//                     paddingLeft: '5%',
//                     alignItems: 'center',
//                     flexDirection: 'row-reverse',
//                      justifyContent: 'space-between'
//                 }}>

                   
//                     <Text style={{
//                         ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{data.feature.NAME}</Text>

                    
//               <Text style={{
//                          ...styles.TextBold,
//                         color: 'black',
//                         fontSize: 18,
//                         textAlign: 'center',
//                     }}>{`${data.VALUE } : ` }</Text>
                 
               
//                 </View>
//                 </TouchableOpacity>
//             )
//         })
//     }


 
//  </View>

 } 
                            {
                                hasOff ?
                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        alignSelf: 'center'
                                    }}>
                                        <Text style={{
                                             ...styles.TextRegular,
                                            color: 'black',
                                            fontSize: 18,
                                            textAlign: 'center',
                                            textDecorationStyle: 'dotted',
                                            textDecorationLine: 'line-through'
                                        }}>{config.priceFix(PRICE)} $</Text>
                                        <View style={{ width: 10 }} />
                                        <Text style={{
                                            ...styles.TextRegular,
                                             fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                            fontSize: 18,
                                            textAlign: 'center',
                                            color: 'red'
                                        }}>{config.priceFix(OFFERPRICE)} $</Text>

                                    </View>
                                    :

                                    <View style={{
                                        // justifyContent: 'flex-end',
                                        paddingRight: '5%',
                                        paddingLeft: '5%',
                                        alignItems: 'center',
                                        flexDirection: 'row-reverse',
                                        marginVertical:10
                                    }}>
                                     
                                       
                                       {
                                        PRICE ==1 ?

                                         <TouchableOpacity style={{flexDirection:'row-reverse',justifyContent:'space-around'}} 
                                         onPress={()=>{Linking.openURL(`tel:${this.state.newPhone}`)}}>
                                         <Text style={{
                                             ...styles.TextRegular,
                                             color: 'black',
                                             fontSize: 18,
                                             textAlign: 'center',
                                             alignSelf: 'center'
                                         }}> تماس بگیرید </Text>
                                         
 
                                          <Material name='phone' size={20}color={StyleSheet.value('$MainColor')} style={{justifyContent:'center',marginTop:5}}/>
                                         </TouchableOpacity>
                                         :
                                         [ 
                                            <Text style={{
                                                ...styles.TextRegular,
                                               color: 'black',
                                               fontSize: 18,
                                               textAlign: 'center',
                                               alignSelf: 'center',
                                                fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                           }}>
                                               {t('price')+ ' : '}
                                           </Text>,
                                           <Text style={{
                                               ...styles.TextRegular,
                                               color: 'black',
                                               fontSize: 18,
                                               textAlign: 'center',
                                               alignSelf: 'center',
                                               fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                           }}>
                                                {this.state.showGaranti ? config.priceFix(PRICE+Number(store.allSetting.GUARANTEE))  : config.priceFix(PRICE)} + { t('currency-unit')}
                               {/* {this.state.getFeature == null ? 'لطفا رنگ و سایز را انتخاب کنید ' : this.state.getFeature.AVAILABILITY ==0 ?
                                'تماس بگیرید ' : config.priceFix(this.state.getFeature.product_store_prices[0].PRICE)} */}
                                               </Text>
                                         ]
                                         
                                       }

                                    </View>
                            }

                            {
                        store.allSetting?.GUARANTEE ?
                        <View style={{
                            // justifyContent: 'flex-end',
                            paddingRight: '5%',
                            paddingLeft: '5%',
                            alignItems: 'center',
                            flexDirection: 'row-reverse'
                        }}>
                            <CheckBox
          value={this.state.showGaranti}
          onValueChange={()=>this.setState({showGaranti:!this.state.showGaranti})}
          style={styles.checkbox}
        />
                            <Text style={{
                                ...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'center',
                                alignSelf: 'center',
                               
                            }}>
                            {`گارانتی محصول (مبلغ ${config.priceFix(store.allSetting?.GUARANTEE)}  اضافه میگردد)`}
                            </Text>
                            
                           
                        </View>
                        :
                        null

                            }


                        </View>
                        {
                            this.state.product.product_brand?.NAME ?
                            <View style={{ paddingRight: '4%', }}>
                            <Text style={{
                                ...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end',
                             
                            }}> {t('brand')}
                                :{this.state.product.product_brand ? this.state.product.product_brand.NAME : t('no-brand')} </Text>
                        </View>
                        :
                        null
                        }
{/*                       
                        <View style={{ 
                            // justifyContent: 'flex-end',
                            paddingRight: '5%',
                            paddingLeft: '5%',
                            alignItems: 'center',
                            flexDirection: 'row-reverse'
                        }}>
                            <Text style={{
                                 ...styles.TextRegular,
                                color: 'black',

                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end'
                            }}> {t('unit')}
                                :{this.state.product.product_unit ? this.state.product.product_unit.NAME : ''} </Text>
                        </View> */}




                        {/* set condition in  view for  bazargardoon*/}
                   

                        {this.state.idPayDigi && this.state.product.DIGI_PRICE ? <View style={{ paddingRight: '4%', }}>
                   

                           <TouchableOpacity 
                            // onPress={() => { this.state.product.DIGIKALA_LINK ? Linking.openURL(this.state.product.DIGIKALA_LINK) : console.log('notlink') }}
                            > 

                                <Text style={{
                                    ...styles.TextRegular,
                                    color: 'black',
                                    fontSize: 16,
                                    textAlign: 'right',
                                    alignSelf: 'flex-end',
                                    
                                }}> قیمت در دیجی کالا
                                    :{this.state.product.DIGI_PRICE ? config.priceFix(this.state.product.DIGI_PRICE) : ''} </Text>

                            </TouchableOpacity>
                        {
                            this.state.product.POINT ?
                            <Text style={{
                                ...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end',
                               
                            }}> امتیاز
                                :{this.state.product.POINT ? this.state.product.POINT : ''} </Text>
                                :
                                null
                        }
                           

                        </View>
                        
                            : null}
             

{

this.state.idLinkProduct && this.state.product.LINK  ? <View style={{ paddingRight: '4%', }}>



   <TouchableOpacity 
   onPress={() => { this.state.product.LINK ? Linking.openURL(this.state.product.LINK) : console.log('notlink') }}
    > 

        <Text style={{
            ...styles.TextRegular,
            // color: 'black',
            fontSize: 16,
            textAlign: 'right',
            alignSelf: 'flex-end',

        }}> moreDetail
           </Text>

    </TouchableOpacity>

   

</View>

    : null}



                        {/* {this.state.idLinkDigi ? <View style={{
                            paddingVertical: 5, paddingHorizontal: 8, width: width, height: 180,
                            flex: 1,
                        }}>

                            <WebView
                                source={{ uri: this.state.product.DIGIKALA_LINK }}
                                style={{ flex: 1, marginTop: 20 }}
                            />
                        </View>
                            : null
                        } */}


                        {this.state.product.productAdditional?.SHORT_DESCRIPTION ?

                            <View style={{ paddingRight: '4%', }}>
                                <Text style={{
                                    ...styles.TextRegular,
                                    color: 'black',
                                    fontSize: 16,
                                    textAlign: 'right',
                                    alignSelf: 'flex-end',
                                 
                                }}> {t('features')}
                                    :{this.state.product.productAdditional.SHORT_DESCRIPTION} </Text>
                            </View>

                            : null

                        }

                        {
                            <View style={{flex:1}}>
                             <View style={{flexDirection:'row-reverse',marginTop:15,marginLeft:5,flexWrap:'wrap'}} >
                             { 
                           
                             this.state.product.product_features.map((data,index)=>{
                            return(
                                  data.feature.NAME=='color' || data.feature.NAME=='رنگ' ?

                                <TouchableOpacity  style={{width:30 ,height:30,borderRadius: 15,margin:10 ,
                                backgroundColor: data.feature.NAME =='color' || data.feature.NAME=='رنگ' ? data.VALUE :null,
                                 
                                borderWidth : 3, borderColor : index===this.state.itemBorderColor ? '#66B2FF' : '#A9A9A9' }}
                                onPress={()=>{
                                   
                               this.setState({itemBorderColor:index , featureColor:data.ID ,parentId:data.ID})
                                }}>
                                </TouchableOpacity>
                                :null
                                
                            )
                        })
                        }
                        </View>    


                         <View style={{flexDirection:'row-reverse',marginTop:15,marginLeft:5}} >
                            {this.state.parentId!==null ?<Text style={{...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end',
                       
                                marginRight:15}}> 
                             {t('size')}
                             </Text>
                             :null}

                             {     this.state.product.product_features.map((data,index)=>{
                               return(
                                // data.feature.NAME=='سایز'
                                   this.state.parentId != null &&this.state.parentId==data.PARENT_ID  ?
                                   <TouchableOpacity  style={{marginHorizontal:10 ,  height: 30,
                       justifyContent: 'center',
                       alignItems: 'center',
                       width:30 ,height:30,
                       borderRadius: 15,
                       borderWidth: 0.5 ,
                                   borderWidth : 3, borderColor : index===this.state.itemBorderSize ? '#66B2FF' : '#A9A9A9' }}
                                   onPress={()=>{
                                  this.setState({itemBorderSize:index , featureSize:data.ID ,getFeature:data.NAME =='سایز'? data.product_store :null})
                                   }}>
                                    
                                   <Text>
                                   {data.feature.NAME=='سایز' ? data.VALUE : null}
                                   </Text>
                                   </TouchableOpacity>
                                   :null
                               )
                           })}

                      
                          
                            
                        </View>    

                        </View>
                        }
  {this.state.showComment ?  
  <>
                         <View style={{ 
                            flexDirection: 'row',
                            // alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical:10
                           
                            }}>
                                <Material name='arrow-drop-down' style={{ color: 'black' }}
                                            size={20}  onPress={
                                                ()=>this.setModalVisible(true)
                                            }/>
                        <Text style={{...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end',
                                
                                marginRight:15}}> 
                             {'نمایش کامنت'}
                             </Text>
                            </View>

               

                        <View style={{ flexDirection: 'row',
                            // alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical:10
                           
                            }}>
                                 <Material name='arrow-drop-down' style={{ color: 'black' }}
                                            size={20}  onPress={
                                                ()=>this.setState({commentIsOpen:!this.state.commentIsOpen})
                                            }/>

                        <Text style={{...styles.TextRegular,
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'right',
                                alignSelf: 'flex-end',
                                
                                marginRight:15}}> 
                             {'درج کامنت'}
                             </Text>
                            </View>
                            </>

:null}

                            {this.state.commentIsOpen &&
                                 <View style={{ 
                                 // alignItems: 'center',
                                 paddingVertical:10
                                
                                 }}>
                                     
                                     <TextInput
                      placeholderTextColor='gray'
                       style={[styles.TextRegular,{ fontSize: 15,
                        
                        borderWidth: 0.5,borderColor: "#20232a", marginHorizontal:10}]} 
                       placeholder={`متن خود را وارد کنید`}
                      onChangeText={(e)=>this.setState({comment:e})}
                      value={this.state.comment}
                      multiline={true}
                      numberOfLines={4}
                     />

<Rating
style={{marginTop:25}}
  type='star'
  startingValue={1}
  ratingCount={5}
    imageSize={20}
//   showRating
  onFinishRating={(e)=>this.ratingCompleted(e)}
/>

                      <TouchableOpacity onPress={ this.sendComment} style={{marginTop:10,height:40,width:50,justifyContent:'flex-end',borderRadius:5,marginLeft:8 ,backgroundColor: 'green'}}>
                      <Text style= {{...styles.TextRegular,
                            color: 'white',
                            fontSize: 16,
                            marginBottom:5,
                            textAlign:'center',
                          
                           }}> 
                            {t('send')}
                            </Text>                   
                         

                        </TouchableOpacity>
                                 </View>
                                
                            }

                            

                         <View style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            // padding: 10,
                            paddingVertical:40,
                            marginBottom: 50
                        }}>
                            <View>
                                <View style={[styles.button, {
                                    
                                    position: 'absolute',
                                    top: 5,
                                    left: 5,
                                    right: 5,
                                    borderRadius: 4,
                                    elevation: 2,
                                    zIndex: 2002,
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                    marginBottom: 20
                                }]}>
                                    {this.state.lazy ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <ActivityIndicator />
                                    </View> : <View style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                       width: '100%',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Material name='shopping-basket' style={{ color: 'black' }}
                                            size={30} />

                                        {this.renderAddCount()}

       <View style={{ width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5}}>
                           <TextInput
                      placeholderTextColor='black'
                       style={[{height: 50, fontSize: 15, textAlign: 'center',alignSelf: 'center',fontFamily: 'IRANYekanRegular'}]}           
                       placeholder={`0`}
                      onChangeText={this.convertAddCart}
                      value={this.state.count}
                     keyboardType={'numeric'}/>
                                        </View> 
                                        {this.renderRemoveCount()}


                                         <TouchableOpacity 
                                                  onPress={()=>{
                                   item.PRODUCT_STATUS_ID ==2 ? Toast.show({text: 'محصول موجود نیست', type: 'danger',position: 'top'  }) : 
                                    // this.state.getFeature==null ? Toast.show({text: 'محصول موجود نیست', type: 'danger',position: 'top'  }):
                                    // this.state.getFeature.AVAILABILITY==0 ? Toast.show({text: 'محصول موجود نیست', type: 'danger',position: 'top'  }) :

                                    
                                                       this.addToCart()
                                                  }}
                                                  style={{ width: 60,
                                                                height: 40,
                                                              justifyContent:'center',
                                                                alignItems: 'center',
                                                                borderColor: 'black',
                                                                borderRadius: 5,
                                                                borderWidth: 0.5}}>

                                                             <Text style={[{fontSize:11,textAlign:'center'}]}>
                                                         {item.PRODUCT_STATUS_ID ==2 ? t('does-not-exist') :t('add-to-cart')}
                                    {/* {this.state.getFeature==null ? 'ناموجود' :this.state.getFeature.AVAILABILITY==0 ? 'ناموجود' : 'افزودن به سبد خرید' } */}
                                                              </Text>
                                                            </TouchableOpacity>

                                    </View>}

                                </View>
                                <View style={{
                                    position: 'absolute', width: '100%', height: '100%',
                                    backgroundColor: 'gray', opacity: 0.4, zIndex: 2000
                                }} />
                            </View>
                        </View> 
                         {
                    //         this.state.hasNote ?
                    //             <View style={{
                    //                 flexDirection: 'row-reverse',
                    //                 alignItems: 'center',
                    //                 justifyContent: 'space-between',
                    //                 padding: 10,
                    //                 marginBottom: 50,
                                    
                    //             }}>
                    //                 <View>
                    //                     <View style={[styles.button, {
                    //                         position: 'absolute',
                    //                         top: 5,
                    //                         left: 5,
                    //                         right: 5,
                    //                         borderRadius: 4,
                    //                         elevation: 2,
                    //                         zIndex: 2002,
                    //                         // alignItems: 'center',
                    //                         // justifyContent: 'center',
                    //                         marginBottom: 20
                    //                     }]}>
                    //                         {this.state.lazyNote ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    //                             <ActivityIndicator />
                    //                         </View> : <View style={{
                    //                             flexDirection: 'row-reverse',
                                      
                    //                             width: '100%',
                    //                             justifyContent: 'space-between'
                    //                         }}>
                    //                             <Material name='edit' style={{ color: 'black' }}
                    //                                 size={30} />
                    //                             {this.renderAddCountNote()}

                    //         <View style={{ width: 30,
                    // height: 30,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // borderColor: 'black',
                    // borderRadius: 5,
                    // borderWidth: 0.5}}>
                    //        <TextInput
                    //   placeholderTextColor='black'
                    //    style={[styles.TextRegular,{height: 50, fontSize: 15, textAlign: 'center',alignSelf: 'center',}]}           
                    // //    placeholder={`${store.note[item.ID]}`}
                    //    placeholder={`0`}
                    //   onChangeText={this.convertAddNote}
                    //   value={this.state.countNote}
                    //  keyboardType={'numeric'}/>
                    //                     </View> 
                    //                             {this.renderRemoveCountNote()}  
                    //                               <TouchableOpacity 
                    //                               onPress={()=>{

                    //                                    this.addToCartNote()
                    //                               }}
                    //                               style={{ width: 60,
                    //                                             height: 40,
                    //                                           justifyContent:'center',
                    //                                             alignItems: 'center',
                    //                                             borderColor: 'black',
                    //                                             borderRadius: 5,
                    //                                             borderWidth: 0.5}}>

                    //                                          <Text style={[styles.TextRegular,{fontSize:11,textAlign:'center'}]}>
                    //                                           {'سبد خرید بعدی'}
                    //                                           </Text>
                    //                                         </TouchableOpacity>
                    //                         </View>
                    //                         }

                    //                     </View>
                                     
                    //                 </View>
                    //             </View>
                    //             :
                    //             null
                        } 

                        {
                            this.state.similar.length === 0 ? null :
                                <View style={{ alignItems: 'flex-end', paddingHorizontal: 5 }}>
                                    <Text
                                        style={[styles.TextBold, { color: 'black', textAlign: 'center', fontSize: 16 }]}>
                                        محصولات مشابه
                                    </Text>
                                    <FlatList
                                        horizontal
                                        inverted
                                        data={this.state.similar}
                                        keyExtractor={(item) => item.ID.toString()}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => {
                                            return <ProductItem
                                                item={item}
                                                navigation={this.props.navigation}
                                                routes={this.state.routes}
                                                ProductName={this.state.data.NAME}
                                            />
                                        }}
                                    />
                                </View>

                        }
                    </ScrollView>


                    <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={this.state.commentModal}
                    onRequestClose={() => {
                   
                        this.setModalVisible(false)
                    }}>

                        <View>
                                    
                        <Text style={[styles.TextRegular,{fontSize:20,textAlign:'center'}]}>
                                                    {`نمایش پیام ها`}
                                                    </Text>          
                                 <FlatList
                                   
                                        
                                        data={this.state.comments}
                                         keyExtractor={(item,index) => index.toString()}
                                        renderItem={( {item} ) => {
                                            return (
                                               <View style={{ flex:1, marginTop:20, paddingHorizontal: 20, justifyContent:'flex-end',}}>

                                                <View style={{flexDirection:'row-reverse',}}>
                                                <Entypo name='dot-single' style={{  textAlign:'center', color: 'black' }}size={12} />

                                                       
                                                 <Text style={[styles.TextRegular,{fontSize:16,textAlign:'center',marginRight:5}]}>
                                                    {`نام کاربری : ${item.NAME}`}
                                                    </Text>
                                                
                                                </View>
                                                <Text style={[styles.TextRegular,{justifyContent:'flex-start',fontSize:14,marginTop:10,marginRight:5}]}>
                                                    {` متن پیام : ${item.COMMENTS}`}
                                                    </Text> 

                                                    <View style={{marginTop:5,borderBottomColor: 'black', borderBottomWidth: 0.5, }}/>

                                                </View>

                                            )
                                        }}
                                        />
                                        </View>
                    
                </Modal>


                    <View style={[styles.header, {
                        height: 60,
                        justifyContent: 'space-between',
                        backgroundColor: 'white',
                        flexDirection: 'row-reverse'
                    }]}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.goBack()}
                            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        >
                            <Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: 'black' }}
                                size={30} />
                        </TouchableWithoutFeedback>
                        <Text style={{
                            ...styles.TextBold,
                            color: 'black',
                            fontSize: 18,
                            textAlign: 'center',
                            alignSelf: 'center'
                        }}>{this.state.data.NAME}</Text>

                        <View style={{ flexDirection: 'row-reverse',justifyContent: 'space-between'}}>
                           
                        {
                            this.state.like ?
                                <TouchableWithoutFeedback
                                    onPress={async () => {
                                        try {
                                            // let res = await Axios.delete(`users/Unlike/${item.PRODUCT_ID}`)
                                            let res = await Axios.delete(`users/Unlike/${item.ID}`)
                                         
                                            await this.setState({ like: false })
                                        } catch (error) {
                                            this.setState({ like: true })
                                        }
                                    }}
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <Material name='favorite' style={{ alignSelf: 'flex-end', margin: 15, color: 'red' }}
                                        size={30} />
                                </TouchableWithoutFeedback> :
                                <TouchableWithoutFeedback
                                    onPress={async () => {
                                        try {
                                            // let res = await Axios.post('users/like', { PRODUCT_ID: item.PRODUCT_ID })
                                            let res = await Axios.post('users/like', { PRODUCT_ID: item.ID })
                                            console.log(res,'ress')
                                           
                                            await this.setState({ like: true })
                                        } catch (error) {
                                            this.setState({ like: false })
                                        }
                                    }}
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <Material name='favorite-border'
                                        style={{ alignSelf: 'flex-end', margin: 15, color: 'gray' }}
                                        size={30} />
                                </TouchableWithoutFeedback>
                        }

                         <TouchableWithoutFeedback
                                    onPress={()=>this.onShare(item.ID) }
                                        
                                   
                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <Material name='share'
                                        style={{ alignSelf: 'flex-end', margin: 15, color: 'gray' }}
                                        size={30} />
                                </TouchableWithoutFeedback>
                                </View>

                    </View>
                </View >
            )
        }
    }
}
export default withTranslation()(App)
class ProductItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            count: 0,
            lazy: false,
            ORDER_ID: 0
        }
        this.timeout = null
    }

    closeModal = () => this.setState({ show: false })

    resetTimeOut = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.closeModal, 7000)
    }

    render() {
        const {t} =this.props
        let item = this.props.item
        // let hasOff = item.price_offer.OFFER
        // let before = item.price_offer.PRICE
        // 	? item.price_offer.PRICE
        // 	: item.SYSTEM_PRICE
        // let after = before - item.price_offer.OFFER
        let hasOff = item.product_store_prices[0] ?
            item.product_store_prices[0].PRICE_AFTER_OFFER !== item.product_store_prices[0].PRICE :
            false
        let before = item.product_store_prices[0] ? config.priceFix(item.product_store_prices[0].PRICE) : config.priceFix(0)
        let after = item.product_store_prices[0] ? config.priceFix(item.product_store_prices[0].PRICE_AFTER_OFFER) : config.priceFix(0)
        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    this.props.navigation.push('ProductProfile', {
                        item: {
                            ...item.product,
                            PRODUCT_ID: item.PRODUCT_ID,
                            ID: item.ID
                        },
                        Route: [...this.props.routes, this.props.ProductName]
                    })
                }
            >
                <View
                    style={{
                        height: 190,
                        width: 140,
                        backgroundColor: 'white',
                        margin: 5,
                        overflow: 'hidden',
                        // padding: 5,
                        borderRadius: 7,
                        elevation: 1,
                        justifyContent: 'space-between',
                        zIndex: 1
                    }}
                >
                    {hasOff ? (
                        <View
                            style={{ position: 'absolute', right: 0, zIndex: 1000 }}
                        >
                            <View
                                style={[
                                    styles.triangle,
                                    { position: 'absolute', top: 0, right: 0 }
                                ]}
                            />
                            {/* <Text
													style={{
														...styles.TextRegular,
														color: 'white',
														fontSize: 8,
														position: 'absolute',
														right: 2,
														top: 2
													}}
												>
													{item.price_offer.OFEER} %
												</Text> */}
                        </View>
                    ) : null}
                    <View>
                        <FastImage
                       
                            // source={{ uri: config.ImageBaners + config.ProductSubUrl + item.product.IMAGE }}
                            source={{ uri: config.ImageBaners + config.ProductSubUrl + item.product.IMAGE }}
                            resizeMode="contain"
                            style={{ width: '100%', height: 115, borderRadius: 7, marginTop: 5 }}
                        />
                        {/* <TextTicker
												style={{
													...styles.TextBold,
													paddingHorizontal: 5,
													flexDirection: 'row-reverse',
													textAlign: 'right',
													fontSize: 13
												}}
												duration={5000}
												loop
												bounce = {false}
												repeatSpacer={30}
												marqueeDelay={3000}
											>
												{item.NAME}
											</TextTicker> */}
                        <Text
                            numberOfLines={2}
                            style={{
                                ...styles.TextBold,
                                paddingHorizontal: 5,
                                fontSize: 13
                            }}
                        >
                            {item.product.NAME}
                        </Text>
                    </View>
                    {hasOff ? (
                        <View
                            style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
                        >
                            <Text
                                style={{
                                    ...styles.TextRegular,
                                    paddingHorizontal: 5,
                                    fontSize: 12,
                                    textDecorationStyle: 'dotted',
                                    textDecorationLine: 'line-through',
                                    
                                    fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                }}
                            >
                                {config.priceFix(before)} {t('currency-unit')}
                            </Text>
                            <View style={{ width: 10 }} />

                            <Text
                                style={{
                                    ...styles.TextRegular,
                                    paddingHorizontal: 5,
                                    fontSize: 12,
                                    color: 'red',
                                   fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                }}
                            >
                                {config.priceFix(after)} {t('currency-unit')}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={{
                                ...styles.TextRegular,
                                paddingHorizontal: 5,
                                fontSize: 12,
                               fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                            }}
                        >
                            {/* {config.priceFix(before)} تومان */}
                            {config.priceFix(before)} {t('currency-unit')}
                        </Text>
                    )}
                    {/*<TouchableWithoutFeedback onPress={() =>*/}
                    {/*  Axios.post('order/cart', {*/}
                    {/*    'PRODUCT_ID': item.ID,*/}
                    {/*    'COUNT': 1,*/}
                    {/*    'DESCRIPTION': null*/}
                    {/*  }).then((response) => {*/}
                    {/*    console.log('add', response)*/}
                    {/*    this.setState({ ORDER_ID: response.data.ORDER_ID, count: 1, show: true })*/}
                    {/*    this.resetTimeOut()*/}

                    {/*  }).catch((error) => {*/}
                    {/*    console.log('add errror', error)*/}
                    {/*  })*/}
                    {/*}>*/}
                    {/*  <View style={{*/}
                    {/*    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',*/}
                    {/*    borderRadius: 50, width: 25, height: 25,*/}
                    {/*    borderColor: StyleSheet.value('$MainColor'),*/}
                    {/*    borderWidth: 1, position: 'absolute', overflow: 'hidden',*/}
                    {/*    top: 4, left: 4*/}
                    {/*  }}>*/}

                    {/*    {*/}
                    {/*      store.cart[item.ID] == 0 ?*/}
                    {/*        <Material name='add' size={20} color={StyleSheet.value('$MainColor')} /> :*/}
                    {/*        <Text style={{*/}
                    {/*          ...styles.TextRegular,*/}
                    {/*          width: '100%',*/}
                    {/*          height: '100%',*/}
                    {/*          backgroundColor: StyleSheet.value('$MainColor'),*/}
                    {/*          color: 'white',*/}
                    {/*          textAlign: 'center'*/}
                    {/*        }}>*/}
                    {/*          {store.cart[item.ID]}*/}
                    {/*        </Text>*/}
                    {/*    }*/}
                    {/*  </View>*/}
                    {/*</TouchableWithoutFeedback>*/}
                    {
                        this.state.show &&
                        <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2000 }}>
                            <View style={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                right: 5,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                elevation: 2,
                                zIndex: 2002,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    width: 80,
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            if (!this.state.lazy) try {
                                                await this.setState({
                                                    lazy: true,
                                                    count: store.cart[item.ID] + 1
                                                })
                                                this.resetTimeOut()
                                                // this.props.update_price(item.PRICE_AFTER_OFFER)
                                                let q = await Axios.put('order/cart', {
                                                    'ORDER_ID': this.state.ORDER_ID,
                                                    'PRODUCT_ID': '',
                                                    'PRODUCT': item.ID,
                                                    'COUNT': store.cart[item.ID],
                                                    'DESCRIPTION': null,
                                                   
                                                })
                                           
                                                await this.setState({ lazy: false })

                                            } catch (error) {
                                                // this.props.update_price(-1 * item.PRICE_AFTER_OFFER)

                                                await this.setState({
                                                    lazy: false,
                                                    count: store.cart[item.ID] - 1
                                                })
                                            
                                            }

                                        }}>

                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='add' size={15} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                    <Text style={{
                                        ...styles.TextRegular,
                                        color: 'black',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        padding: 5,
                                        fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                    }}>{store.cart[item.ID]}</Text>

                                    <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            if (store.cart[item.ID] > 0 && !this.state.lazy) {
                                                if (store.cart[item.ID] == 1) {
                                                    try {
                                                        this.resetTimeOut()
                                                        let q = await Axios.delete('/order/cart/' + item.ID)
                                                        await this.setState({
                                                            lazy: true,
                                                            show: false
                                                        })

                                                        // this.props.update_price(-1 * item.PRICE_AFTER_OFFER)

                                                        // this.props.update_cart()
                                                    } catch (error) {
                                                        // this.props.update_cart()
                                                    }
                                                    return
                                                }
                                                try {
                                                    await this.setState({
                                                        lazy: true,
                                                        count: store.cart[item.ID] - 1
                                                    })
                                                    this.resetTimeOut()
                                                    // this.props.update_price(-1 * item.PRICE_AFTER_OFFER)
                                                    let q = await Axios.put('order/cart', {
                                                        'ORDER_ID': this.state.ORDER_ID,
                                                        'PRODUCT_ID': '',
                                                        'PRODUCT': item.ID,
                                                        'COUNT': store.cart[item.ID],
                                                        'DESCRIPTION': null,
                                                      
                                                    })
                                                    await this.setState({ lazy: false })

                                                } catch (error) {
                                                    // this.props.update_price(item.PRICE_AFTER_OFFER)

                                                    await this.setState({
                                                        lazy: false,
                                                        count: store.cart[item.ID] + 1
                                                    })
                                                }
                                            }
                                        }}>
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='remove' size={15} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>
                            </View>
                            <View style={{
                                position: 'absolute', width: '100%', height: '100%',
                                backgroundColor: 'gray', opacity: 0.4, zIndex: 2000
                            }} />
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '$BackgroundColor'
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
         
        fontWeight: '$WeightRegular'
    },
    button: {
        borderRadius: 17,
        padding: 10,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        elevation: 2
    },
    checkbox: {
        alignSelf: "center",
      },

})
