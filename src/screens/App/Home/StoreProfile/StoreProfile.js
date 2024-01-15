import React, { Component } from 'react'
import {
    Text,
    View,
    Animated,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    TouchableWithoutFeedback,Linking,AsyncStorage,TouchableOpacity
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar, FAB } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Material from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { config } from '../../../../App'
import { RenderProduct } from './RenderProducts'
import  {RenderItem } from './RenderItem'
import BackHeader from '../../component/BackHeader'
import moment from 'moment-jalaali'
import { Beep, on, state as store } from "react-beep";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import BannerSlider from "../../../LandingPage/bannerSlider";

import { NavigationEvents, StackActions, NavigationActions } from 'react-navigation'

import { withTranslation } from 'react-i18next';
import i18next,{languageResources} from '../../../../services/lang/i18next'
import languagesList from '../../../../services/lang/languagesList.json'



const { width } = Dimensions.get('window')
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
const AnimatedMaterial = Animated.createAnimatedComponent(Material)

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = 60
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT


 class App extends Component {
    state = {
        scrollY: new Animated.Value(0),
        data: [],
        bestSellers: [],
        latest: [],
        productCategories: [],
        store: [],
        store_offers: [],
        banners: [],
        loading: true,
        summaryLoading: true,
        BANNER: null,
        LOGO: null,
        empty: false,
        times: {
            START_TIME: '',
            END_TIME: '',
            START_TIME2: '',
            END_TIME2: '',
        },
        customer:null,

        showLang:false,
        lang:'فارسی'

    };
   
    getDayNumberJalali(day) {
        // switch (day + 1) {

        switch (day + 1) {
            case 1:
                return 2;
            case 2:
                return 3;
            case 3:
                return 4;
            case 4:
                return 5;
            case 5:
                return 6;
            case 6:
                return 7;
            case 7:
                return 1;
        }
    }

getParams = ()=>{
   
    const param   = this.props.navigation.state
          if(param.params)    {
 	        AsyncStorage.getItem('isGuest').then((guest)=>{
               
                   try{
                 if (guest == '1') {
                    AsyncStorage.getItem('token').then((token)=>{
                         this.props.navigation.navigate('Auth', { token, isGuest: true })
                        
                    })
                     
               
                 }
                 else{
                
                    AsyncStorage.getItem('profile').then((data)=>{

                      let guest = JSON.parse(data);
            

                        Axios.post('/payment/pay',{
					'resNum': param.params.orderId,
					'PayType': 'app',
					'RedirectType': 'payment',
					'amount': param.params.amount.ORDER_VALUE_WITH_COURIER * 10,
					'TOTAL': param.params.amount.ORDER_VALUE_WITH_COURIER,
					'URID': guest.USER_ROLE_ID

				}).then(async (response) => {
					Linking.openURL(response.data.url)
				})
                    })
                
                 }
                 }
                 catch (e){
                     console.log(e)
                 }
            })
	
          }else{
        //   console.log('paramsNot')
          }                  
}

    componentDidMount=()=> {
this.getParams()
        // Axios.get(`landing/banner_app/${store.storeId}`).then(res => {
            Axios.get(`landing/getlandingvalue?type=slider`).then(res => {
                
            if (res && res.data) {
                let data = [];
                for (let item of res.data) {
                    // data.push(config.ImageBaners + '/assets/img/banner/' + item.VALUE)
                    data.push(config.ImageBaners +  item.VALUE)
                }
                this.setState({ banners: data })
            }
        });
        this.fetchData()
         
        // this.getMoudels()
    }



    fetchData = () => {
        let STORE_ID = store.storeId
        Axios.get(`stores/${STORE_ID}`)
            .then(store => {
                let new_PhonNumber =store.data.store_additional.PHONE
           
                AsyncStorage.setItem('NewPhoneNumber',new_PhonNumber)
                let store_images = store.data.store_images
                let data = {};
                store_images.forEach(item => {
                    if (item.store_image_category)
                        data = { ...data, [item.store_image_category.NAME_ENG]: item.ADDRESS_URL }
                    if (item.NAME === 'logo') {
                        this.setState({ LOGO: item.ADDRESS })

                    }
                    if (item.NAME === 'bannermobile') {
                        this.setState({ BANNER: item.ADDRESS })

                    }

                });
                const today = moment(new Date()).day();
                const todayJalali = this.getDayNumberJalali(today);
                let wh = store.data.store_hours.find(
                    item => item.WEEK_DAY === todayJalali
                );
                if (wh && wh.HOLIDAY === 1) {
                    wh = undefined
                }
                this.setState({
                    times: wh
                });
                Axios.get(
                    `stores/${STORE_ID}/summary`
                ).then(summary => {
                    const productCategories = summary.data.productCategories
                  
                    if (
                        summary.data.bestSellers.length === 0 &&
                        summary.data.latest.length === 0 &&
                        productCategories.length === 0
                    ) {
                        this.setState({
                            empty: true,
                            loading: false,
                            data: store.data,
                            store: summary.data.store,
                            bestSellers: summary.data.bestSellers,
                            latest: summary.data.latest,
                            store_offers: summary.data.store_offers,
                            summaryLoading: false
                        })
                    } else {
                        let bestSellers = [];
                        for (let bestS of summary.data.bestSellers) {
                            bestS.ID = bestS.PRODUCT_STORE_ID
                            bestSellers.push(bestS);
                        }
                        this.setState({
                            loading: false,
                            data: store.data,
                            store: summary.data.store,
                            bestSellers: bestSellers,
                            latest: summary.data.latest,
                            store_offers: summary.data.store_offers,
                            summaryLoading: false
                        })
                    }
                    Axios.get(
                        'stores/' + STORE_ID + '/StoreCategories'
                    ).then(async (response) => {
                      
                       
                        for (let value of response.data.slice(0, 5)) {
                            try {
                                let response = await Axios.get(
                                    `stores/${STORE_ID}/sortGenelogyproduct/${value.PRODUCT_ID}`
                                )
                                if (response.data[0] != null)
                                
                                    this.setState((prevState) => ({
                                        
                                        productCategories: [...prevState.productCategories, {
                                            CHILD_PRODUCTS: response.data,
                                            IMAGE: value.IMAGE,
                                            NAME: i18next.language=='en'? value.NAME_EN :value.NAME,
                                            ID: value.ID,
                                            LEAF: value.LEAF,
                                            STORE_ID: value.STORE_ID,
                                            PRODUCT_ID: value.PRODUCT_ID,
                                        }]
                                    }))
                            } catch (error) {
                                console.log('[CategoryError ' + value + ']', error.data)
                            }
                        }
                    }).catch((errorHour) => {
                        console.log(errorHour)
                    })
                }).catch(sumerror => {
                    this.setState({ summaryLoading: false, loading: false })
                })

            })
            .catch(error => {
                this.setState({ loading: false, summaryLoading: false })
                console.log('main ERROR', error)
            })
    }

     ChangeLang=(lng,txt)=>{
        i18next.changeLanguage(lng)
        this.setState({
            showLang:false,lang:txt
        })
        setTimeout(() => {
         
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Landing' })],
            })
            this.props.navigation.dispatch(resetAction)
        }, 1000);
     
       }

    render() {

        const { t } = this.props
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
        const LOGOTOP = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [20, -70],
            extrapolate: 'clamp'
        })
        const DESCRIPTIONTOP = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [150, 250],
            extrapolate: 'clamp'
        })
        const TIMETOP = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [125, 250],
            extrapolate: 'clamp'
        })
        const NAMETOP = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [100, 17],
            extrapolate: 'clamp'
        })
        const NAMESCALE = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1.25],
            extrapolate: 'clamp'
        })
        const headeropacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const headercolor = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: ['white', 'black'],
            extrapolate: 'clamp'
        })
        const backcolor = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: ['white', StyleSheet.value('$MainColor')],
            extrapolate: 'clamp'
        })
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <BackHeader headerText={store.setting.NAME} />
                    <View
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                    >
                        <ActivityIndicator />
                    </View>
                </View>
            )
        } else if (this.state.empty) {
            return (
                <View style={styles.container}>
               
                    <Appbar.Header style={{ backgroundColor: 'white' }}>
                        {/*<Appbar.BackAction*/}
                        {/*    color={StyleSheet.value('$MainColor')}*/}
                        {/*    onPress={() => this.props.navigation.goBack()}*/}
                        {/*/>*/}
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingRight: 48
                            }}
                        >
                            <Text
                                style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}
                            >
                                {store.setting.NAME}
                            </Text>
                        </View>
                    </Appbar.Header>
                    <View
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                    >
                        <FastImage
                            source={require('../../../../assest/no_data.png')}
                            style={{ width: 150, height: 150 }}
                        />
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() => {
                   
                        // Axios.get(`landing/banner_app/${store.storeId}`).then(res => {

                        //     if (res && res.data) {
                        //         let data = [];
                        //         for (let item of res.data) {
                        //             data.push(config.ImageBaners + '/assets/img/banner/' + item.VALUE)
                        //         }
                        //         this.setState({ banners: data })
                        //     }
                        // }),
                        // this.fetchData()

                        const resetAction = StackActions.reset({
                            index: 0,
                            key:null,
                            actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                        })
                        this.props.navigation.dispatch(resetAction)

                    }

                    }
                // onWillFocus={() => this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })}
                />
                <ScrollView
                    onScrollEndDrag={e => {
                        if (e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE / 2)
                            this.ScrollView.scrollTo({ y: 0 })
                        if (
                            e.nativeEvent.contentOffset.y >= HEADER_SCROLL_DISTANCE / 2 &&
                            e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE
                        )
                            this.ScrollView.scrollTo({ y: HEADER_SCROLL_DISTANCE })
                    }}
                    ref={ref => (this.ScrollView = ref)}
                    scrollEventThrottle={1}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
                    ])}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingTop: HEADER_MAX_HEIGHT,
                        paddingBottom: 50
                    }}
                >
                    {this.state.summaryLoading ? (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <ActivityIndicator />
                        </View>
                    ) : (
                        <View>
                            {/* {
								this.state.store_offers.length > 0 ?
									<OffItems data={this.state.store_offers} />
									:
									null
							} */}
                        
                            {
                                this.state.banners.length > 0 ?
                                    <View style={{ marginTop: hp('3%') }}>
                                        <BannerSlider data={this.state.banners} />
                                    </View>
                                    :
                                    null
                            }

                       {/* <View style={{marginLeft:10,paddingVertical:15}}>
                      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.setState({showLang:true})}>
                      <Icon  name="globe"  size={20} />
                      <Text style={ {   ...styles.TextBold,marginLeft:10}}>
                        {t('change-lang')}
                      </Text>
                      </TouchableOpacity>
                       
                        {this.state.showLang &&
                            Object.keys(languageResources).map((item,index)=>(
                             <TouchableOpacity key={index} onPress={()=>{this.ChangeLang(item,languagesList[item].nativeName)}} 
                             style={{marginTop:10 ,width:100 ,borderWidth:0.5,borderColor:'gray',borderRadius:5}}>
                         <Text style={{   ...styles.TextBold,marginHorizontal:10}}>
                             {languagesList[item].nativeName}
                                     </Text>
                             </TouchableOpacity>
                            ))
                        }
                       
                       </View> */}

                            {this.state.latest.length === 0 ? null : (
                                <RenderProduct
                                    {...this.props}
                                    item={{
                                         CATEGORYNAME: t('latest-products'),
                                        // CATEGORYNAME: 'Latest Products',
                                        data: this.state.latest
                                    }}
                                    storeName={store.setting.NAME}
                                />
                            )}
                            {this.state.bestSellers.length === 0 ? null : (
                                <RenderProduct
                                    {...this.props}
                                    item={{
                                        CATEGORYNAME: t('best-sellers'),
                                        // CATEGORYNAME: 'Best sellers',
                                        data: this.state.bestSellers
                                    }}
                                    storeName={store.setting.NAME}
                                />
                            )}
                            {
                               
                            this.state.productCategories.length === 0
                                ? null
                                : this.state.productCategories.map((item, index) => {
                                    return (
                                        <RenderItem
                                            key={'category' + index}
                                            {...this.props}
                                            item={item}
                                            storeName={store.setting.NAME}
                                        />
                                    )
                                })
                                }
                        </View>
                    )}
                </ScrollView>

                <Animated.View
                    style={[
                        styles.header,
                        { height: headerHeight, backgroundColor: 'black' }
                    ]}
                >

                    

                    <AnimatedFastImage
                        source={{ uri: config.ImageBaseUrl + this.state.BANNER }}

                        resizeMode="cover"
                        style={{
                            width,
                            height: headerHeight,
                            position: 'absolute',
                            opacity: 0.3
                        }}
                    />
                    <AnimatedFastImage
                        source={{ uri: config.ImageBaners + '/assets/img/settings/' + store.setting.LOGO }}

                        // source={{uri: config.ImageBaseUrl + this.state.LOGO}}
                        resizeMode="cover"
                        style={{
                            top: LOGOTOP,
                            width: 70,
                            height: 70,
                            // borderRadius: 35,
                            position: 'absolute',
                            alignSelf: 'center'
                        }}
                    />

                    < Animated.View
                        style={{
                            height: headerHeight,
                            position: 'absolute',
                            opacity: headeropacity,
                            width,
                            backgroundColor: 'white'
                        }}
                    />
                    <Animated.Text
                        style={{
                            ...styles.TextBold,
                            color: headercolor,
                            fontSize: 14,
                            position: 'absolute',
                            textAlign: 'center',
                            alignSelf: 'center',
                            top: NAMETOP,
                            transform: [{ scale: NAMESCALE }]
                        }}
                    >
                        {store.setting.NAME} 


                    </Animated.Text>
                    <Animated.View
                        style={{
                            // flexDirection: 'row-reverse',
                            top: TIMETOP,
                            position: 'absolute',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}
                    >

                      
                        {
                            this.state.times ?
                                <>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Material name="access-time" color="white" style={{ margin: 5 }} />
                                       
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'white',
                                                fontSize: 11,
                                                textAlign: 'center',
                                                 fontFamily: i18next.language=="en" ? null : 'IRANYekanRegular',
                                            }}
                                        >
                                         {  t('sending-time')} :
                                        </Text>
                                    </View>
                                    {(this.state.times.START_TIME != '' || this.state.times.START_TIME != '0') &&
                                        (this.state.times.END_TIME != '' || this.state.times.END_TIME != '0') &&
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'white',
                                                fontSize: 11,
                                                textAlign: 'center',
                                                fontFamily: i18next.language=="en" ? null : 'IRANYekanRegular',
                                            }}
                                        >
                                            {(this.state.times.START_TIME2 != '0:00' && this.state.times.END_TIME2 != '0:00') ?  t('morning') +' :  ' + (this.state.times.START_TIME +  t('to')  + this.state.times.END_TIME) : ' ' + (this.state.times.START_TIME +  t('to')  + this.state.times.END_TIME)}
                                        </Text>
                                    }
                                    {
                                        (this.state.times.START_TIME2 != '0:00') &&
                                        (this.state.times.END_TIME2 != '0:00') &&
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'white',
                                                fontSize: 11,
                                                textAlign: 'center',
                                                fontFamily: i18next.language=="en" ? null : 'IRANYekanRegular',
                                            }}
                                        >
                                            {t('afternoon') + this.state.times.START_TIME2 + t('to') + this.state.times.END_TIME2}
                                        </Text>
                                    }
                                </>
                                :
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    backgroundColor: 'red',
                                    marginTop: 10,
                                    padding: 2,
                                    borderRadius: 3
                                }}>
                                    <Text
                                        style={{
                                            ...styles.TextRegular,
                                            color: 'white',
                                            fontSize: 11,
                                            textAlign: 'center',
                                        }}> {t('store-closed')}</Text>
                                                                                

                                        
                                </View>
                        }
                    </Animated.View>
                </Animated.View>




                {
              

                    this.state.productCategories[0] &&

                    <TouchableWithoutFeedback
                        onPress={() =>

                            this.props.navigation.push('StoreCategory', {
                                ID: store.storeId,
                                PRODUCT_ID: 0,
                                NAME: this.state.data.NAME,
                                data: this.state.productCategories,
                                Route: [this.state.data.NAME]
                            })
                        }
                    >

                        <View
                            style={{
                                ...styles.button,
                                position: 'absolute',
                                borderRadius: 0,
                                bottom: 0,
                                alignSelf: 'center',
                                width: ('100%')
                            }}
                        >
                            <Material name="edit" color="white" size={17} />
                            <Text
                                style={[
                                    styles.TextBold,
                                    { color: 'white', textAlign: 'center', fontSize: 14 }
                                ]}
                            >
                                {/* all categories */}
                                {t('all-categories')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                }

            </View>
        )
    }
}

export default withTranslation()(App);

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
        // fontFamily:'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    button: {
        borderRadius: 17,
        padding: 10,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        elevation: 2
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 30,
        borderTopWidth: 30,
        borderLeftColor: 'transparent',
        borderTopColor: 'purple',
        transform: [{ rotate: '0deg' }]
    }
})
