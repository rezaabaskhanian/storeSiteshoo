
// import React, { Component, useEffect, useState } from 'react'
// import { Platform, View, StatusBar, Text, I18nManager, TouchableOpacity, AsyncStorage } from 'react-native'
// import {
//     createStackNavigator,
//     createAppContainer,
//     createBottomTabNavigator,
//     createSwitchNavigator
// } from 'react-navigation'


// // import {enableScreens} from 'react-native-screens'


// //navigations 

// import AuthStack from './navigations/authStack/AuthStack'

// import NooteStack from './navigations/nootStack/NootStack'
// import LandingStack from './navigations/landingStack/LandingStack'
// import TabStack from './navigations/tabStack/TabStack'
// import { I18nextProvider } from 'react-i18next';
// import i18n from './services/lang/i18next'

// // enableScreens()
// I18nManager.allowRTL(false)
// I18nManager.forceRTL(false)






// const AppNavigator = createStackNavigator(
//     {
//      Tab:{screen :TabStack  ,path:''},
//         // ButtomTabNavigator, 
//         Auth :AuthStack    ,
//        Landing:LandingStack,
//         NooteStack
//     },
//     {
//         headerMode: 'none',
//         initialRouteName: 'Landing'
//     }
// )
// const AppContainerMain = createAppContainer(AppNavigator)
// export default () =>  {
//     // const prefix = 'https://ahelict.com/'
//     const prefix = 'https://www.ahelict.com'
// return(

//     <AppContainerMain uriPrefix={prefix} /> 

// )
// }


// export const config = {

//     ImageBaners: 'https://panel.ahelict.com',
//     ImageBaseUrlPanel: 'https://panel.ahelict.com/assets/img/stores/',
//     ImageBaseUrl: 'https://panel.ahelict.com/assets/img/stores/',
//     ImageBaseUrlProduct: 'https://panel.ahelict.com/assets/img/products/',
//     SettingBaseUrlProduct: 'https://panel.ahelict.com/assets/img/settings/',
//     SettingBaseUrlPanel: 'https://panel.ahelict.com/assets/img/settings/',
//     BaseUrl: 'https://ahelict.com',
//     Domain: 'ahelict.com',
//     ProductSubUrl: '/assets/img/products/',
//     CategorySubUrl: '/assets/img/categories/category_logo/',

//     priceFix: (num, sep) => {
//         const number = typeof num === 'number' ? Math.round(num).toString() : num || '0',
//             separator = typeof sep === 'undefined' ? ',' : sep


//         return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + separator)
//     }
// }


import React, { Component, useEffect, useState } from 'react'
import { Platform, View, StatusBar, Text, I18nManager, TouchableOpacity, AsyncStorage } from 'react-native'
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import { AuthScreen } from './screens'
import { BeepProp } from './store/BeepProp'
import { Beep, state as store } from 'react-beep'

import * as HomeScreens from './screens/App/Home'
import * as SearchScreens from './screens/App/Search'
import * as ProfileScreens from './screens/App/Profile'
import * as CartScreens from './screens/App/Cart'
import * as NooteScreen from './screens/App/Notebook'
import { Landing } from './screens/Landing'
import LandingPage from './screens/LandingPage/LandingPage'
import Axios from 'axios'
import Material from 'react-native-vector-icons/MaterialIcons'
// import {enableScreens} from 'react-native-screens'

import { on } from 'react-beep'

import TabBarComponent from "./component/tabBarComponent.component";
import { StoreProfile } from "./screens/App/Home";


const url = {
    BaseUrl: 'https://mahanmotorsco.com',
}
// enableScreens()
I18nManager.allowRTL(false)
I18nManager.forceRTL(false)



class Tests extends React.Component {
    state = {
        ref: null,
        testTabs: ''
    };
    constructor() {
        super()
       
    }

    // componentDidMount() {
    //    
    // }
    componentDidMount() {
        this.getModules()
       

        // console.log('ejra')
    }
    getModules = async () => {
        //  data.data.getModules.filter((item) => item.ID == '2012') ? AsyncStorage.setItem('Sign', 'lock') : AsyncStorage.setItem('Sign', 'open')

        try {
            let getWallet = Axios.get(url.BaseUrl + '/api/features/get_modules')
            let cheque = getWallet.data.getModules.filter((item) => item.ID == '2008')
            console.log(cheque, 'cheque[0].ID')
            // cheque[0].ID == '2008' ? AsyncStorage.setItem('Sign', 'lock') : AsyncStorage.setItem('Sign', 'open')
        } catch (e) {
            console.log(e)
        }

    }
    render() {
        return (


            <View style={{}}>
                {/* <Text>
                    {'reza'}
                </Text> */}

            </View>
        )
    }
}

const wrapper = (Component, ...props) => {
    return class App extends React.Component {
        state = {
            ref: null
        };

        constructor() {
            super()
         
        }

        componentDidMount() {
            setTimeout(() => {
               
            }, 1000)
            this.getModules()

            // console.log('ejra')
        }

        render() {
            return (
                <View style={{ flex: 1 }}>
                    <Component
                        {...{
                            ...this.props,
                            ...props
                        }}
                    />
                </View>
            )
        }
    }
}

const Auth = createStackNavigator(
    {
        // Landing: Landing,
        VerifyCode: AuthScreen.VerifyCode,
        //  RequestReview: { screen: requestReview, path: 'orders/sampling/:id' },
        SignIn: AuthScreen.SignIn, 
        SignInVerify: AuthScreen.SignInVerify,
        SignUp: AuthScreen.SignUp,
        ChooseAddress: AuthScreen.ChooseAddress,
        DetailAddress: AuthScreen.DetailAddress,
        Forgotpassword: AuthScreen.Forgotpassword,
        IntroPage: AuthScreen.IntroPage,

    },
    {
        initialRouteName: 'SignIn',
        headerMode: 'none'
    }
)

const HomeStack = createStackNavigator(
    {
        Category: HomeScreens.Home,
        // Home: LandingPage,
        Home: {screen: StoreProfile, path:'user-payment'},
        Stores: HomeScreens.Stores,
        StoreProfile: HomeScreens.StoreProfile,
        ProductProfile:   HomeScreens.ProductProfile ,
        StoreCategory: HomeScreens.StoreCategory,
        StoreProducts: HomeScreens.StoreProducts,
        ProductSubCats: HomeScreens.ProductSubCats
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none'
    }
)

const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreens.Profile,
        Auth1: Auth   ,
        Address: ProfileScreens.Address,
        EditAddress: ProfileScreens.EditAddress,
        DetailAddress: ProfileScreens.DetailAddress,
        OrderHistory: ProfileScreens.OrderHistory,
        HomeBox: ProfileScreens.HomeBox,
        OrderDetail: ProfileScreens.OrderDetail,
        Favorite: ProfileScreens.Favorite,
        Turnover: ProfileScreens.Turnover,
        EditProfile: ProfileScreens.EditProfile,
        AboutUs: ProfileScreens.AboutUs,
        Rolls: ProfileScreens.Rolls,
        AddAddress: ProfileScreens.AddAddress,
        AddDetailAddress: ProfileScreens.AddDetailAddress,
        SupportPage: ProfileScreens.SupportPage,
        Help: ProfileScreens.Help,
        FreqQuestions: ProfileScreens.FreqQuestions,
        ContactUs: ProfileScreens.ContactUs,
        ReturnOf: ProfileScreens.ReturnOf,
        ShareToFriends: ProfileScreens.ShareToFriends
    },
    {
        initialRouteName: 'Profile',
        headerMode: 'none'
    }
)

const CartStack = createStackNavigator(
    {
        Cart: CartScreens.Cart,
        // Cart1: CartScreens.Cart,
        CartDetail: CartScreens.CartDetail
    },
    {
        initialRouteName: 'Cart',
        headerMode: 'none'
    }
)

const NootStack = createStackNavigator(
    {
        Note: NooteScreen.NooteBook,
        // Cart1: CartScreens.Cart,
    },
    {
        initialRouteName: 'Note',
        headerMode: 'none'
    }
)

class NotiTabBarIcon extends Beep(BeepProp, Component) {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        on('cart_count', value => {
            if (value === this.state.count) {
                this.setState({
                    count: value
                })
            }
        });
        return (<Text
            style={{
                color: '#fff8fd',
                position: 'absolute',
                top: 1,
                right: 1,
                margin: -1,
                minWidth: 13,
                height: 13,
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF0000',
                textAlign: 'center',
                fontSize: 9
            }}>{parseInt(store.cart_count)}</Text>
        )

    }
}

class NotiTabBarIconNote extends Beep(BeepProp, Component) {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        on('note_count', value => {
            if (value === this.state.count) {
                this.setState({
                    count: value
                })
            }
        });
        return (<Text
            style={{
                color: '#fff8fd',
                position: 'absolute',
                top: 1,
                right: 15,
                margin: -1,
                minWidth: 13,
                height: 13,
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF0000',
                textAlign: 'center',
                fontSize: 9
            }}>{parseInt(store.note_count)}</Text>
        )

    }
}
const LandingModule = createStackNavigator(
    {
        Landing: Landing,
        LandingPage: LandingPage,
        StoreProducts: HomeScreens.StoreProducts,
        ProductSubCats: HomeScreens.ProductSubCats,
        IntroPage: AuthScreen.IntroPage,
    },
    {
        initialRouteName: 'Landing',
        headerMode: 'none'
    }
)

const routes = (condition) => {

    let routes = {

        Search: {
            screen: SearchScreens.Search,
            navigationOptions: {
                tabBarLabel: 'جستجو',
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="search" color={tintColor} size={focused ? 22 : 20} />
                )
            }
        },
        Shopping: {
            screen: CartStack,
            navigationOptions: {
                tabBarLabel: 'سبد خرید',
                tabBarIcon: ({ focused, tintColor }) => {
                    return (
                        <View>
                            <Material
                                name="shopping-basket"
                                color={tintColor}
                                size={focused ? 22 : 20}
                            />
                            <NotiTabBarIcon />
                            <Tests />
                        </View>
                    )
                }
            }
        },
        Home: {
            screen: HomeStack ,path:'',
            navigationOptions: {
                tabBarLabel: 'خانه',
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="home" color={tintColor} size={focused ? 22 : 20} />
                )
            }
        },
        Profile: {
            screen: ProfileStack ,
            navigationOptions: {
                tabBarLabel: 'پروفایل',
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="person" color={tintColor} size={focused ? 22 : 20} />
                )
            }

        },
    }


    // if (condition) {
    //     routes["NootStack"] = {
    //         screen: NootStack,
    //         navigationOptions: {
    //             tabBarLabel: 'دفترچه یادداشت',
    //             tabBarIcon: ({ focused, tintColor }) => {
    //                 return (
    //                     <View>
    //                         <Material
    //                             name="edit"
    //                             color={tintColor}
    //                             size={focused ? 22 : 20}
    //                         />
    //                         <NotiTabBarIconNote />
    //                     </View>
    //                 )
    //             }
    //         }
    //     }
    // }

    return routes;
}


const Tab = createBottomTabNavigator(routes(res = Axios.get(url.BaseUrl + '/api/features/get_modules').then((data) => {
    return data.data.getModules.filter((item) => item.ID == '2009') ? [true, AsyncStorage.setItem('Note', 'ok')] : false
})),
    {
        initialRouteName: 'Home',
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabBarComponent,

        tabBarOptions: () => {
            return {
                activeTintColor: '#43B02A',
                labelStyle:
                    Platform.OS === 'android' ?
                        {
                            fontFamily: 'IRANYekanRegular'
                        }
                        : {
                            fontFamily: 'IRANYekanMobile(FaNum)',
                            fontWeight: 'normal'
                        }
            }
        }
    }

)
// const Tab = createBottomTabNavigator(
//     {
//         Search: {
//             screen: SearchScreens.Search,
//             navigationOptions: {
//                 tabBarLabel: 'جستجو',
//                 tabBarIcon: ({ focused, tintColor }) => (
//                     <Material name="search" color={tintColor} size={focused ? 22 : 20} />
//                 )
//             }
//         },
//         Shopping: {
//             screen: CartStack,
//             navigationOptions: {
//                 tabBarLabel: 'سبد خرید',
//                 tabBarIcon: ({ focused, tintColor }) => {
//                     return (
//                         <View>
//                             <Material
//                                 name="shopping-basket"
//                                 color={tintColor}
//                                 size={focused ? 22 : 20}
//                             />
//                             <NotiTabBarIcon />
//                             <Tests />
//                         </View>
//                     )
//                 }
//             }
//         },
//         Home: {
//             screen: HomeStack,
//             navigationOptions: {
//                 tabBarLabel: 'خانه',
//                 tabBarIcon: ({ focused, tintColor }) => (
//                     <Material name="home" color={tintColor} size={focused ? 22 : 20} />
//                 )
//             }
//         },
//         Profile: {
//             screen: ProfileStack,
//             navigationOptions: {
//                 tabBarLabel: 'پروفایل',
//                 tabBarIcon: ({ focused, tintColor }) => (
//                     <Material name="person" color={tintColor} size={focused ? 22 : 20} />
//                 )
//             }

//         },
//     },


//     {
//         initialRouteName: 'Home',
//         animationEnabled: true,
//         lazy: true,
//         tabBarComponent: TabBarComponent,

//         tabBarOptions: () => {
//             return {
//                 activeTintColor: '#43B02A',
//                 labelStyle:
//                     Platform.OS === 'android' ?
//                         {
//                             fontFamily: 'IRANYekanRegular'
//                         }
//                         : {
//                             fontFamily: 'IRANYekanMobile(FaNum)',
//                             fontWeight: 'normal'
//                         }
//             }
//         }
//     }
// );

const AppNavigator = createStackNavigator(
    {
        Tab:{screen :Tab ,path:''},
        // ButtomTabNavigator, 
        Auth :Auth    ,
       LandingModule:LandingModule,
        NootStack
    },
    {
        headerMode: 'none',
        initialRouteName: 'LandingModule'
    }
)
const AppContainerMain = createAppContainer(AppNavigator)
export default () =>  {
    const prefix = 'https://mahanmotorsco.com/'
return <AppContainerMain uriPrefix={prefix} enableURLHandling={true}/> 
}


export const config = {
    // ImageBaseUrl: 'http://185.2.14.219:8065/assets/img/stores/',
    // ImageBaseUrlProduct: 'http://185.2.14.219:8065/assets/img/products/',
    // SettingBaseUrlProduct: 'http://185.2.14.219:8065/assets/img/settings/',
    // BaseUrl: 'http://185.2.14.219:8065',


    ImageBaners: 'https://panel.mahanmotorsco.com',
    ImageBaseUrlPanel: 'https://panel.mahanmotorsco.com/assets/img/stores/',
    ImageBaseUrl: 'https://panel.mahanmotorsco.com/assets/img/stores/',
    ImageBaseUrlProduct: 'https://panel.mahanmotorsco.com/assets/img/products/',
    SettingBaseUrlProduct: 'https://panel.mahanmotorsco.com/assets/img/settings/',
    SettingBaseUrlPanel: 'https://panel.mahanmotorsco.com/assets/img/settings/',
    BaseUrl: 'https://mahanmotorsco.com',
    Domain: 'mahanmotorsco.com',

    ProductSubUrl: '/assets/img/products/',
    CategorySubUrl: '/assets/img/categories/category_logo/',


    // ImageBaners: 'http://panel.kabirphone.ir',
    // ImageBaseUrlPanel: 'http://panel.kabirphone.ir/assets/img/stores/',
    // ImageBaseUrl: 'http://panel.kabirphone.ir/assets/img/stores/',
    // ImageBaseUrlProduct: 'http://panel.kabirphone.ir/assets/img/products/',
    // SettingBaseUrlProduct: 'http://kabirphone.ir/assets/img/settings/',
    // SettingBaseUrlPanel: 'http://panel.kabirphone.ir/assets/img/settings/',
    // BaseUrl: 'http://kabirphone.ir',
    // Domain: 'kabirphone.ir',
    // ProductSubUrl: '/assets/img/products/',
    // CategorySubUrl: '/assets/img/categories/category_logo/',



    // ImageBaners: 'http://panel.messaco.ir',
    // ImageBaseUrlPanel: 'http://panel.messaco.ir/assets/img/stores/',
    // ImageBaseUrl: 'http://panel.messaco.ir/assets/img/stores/',
    // ImageBaseUrlProduct: 'http://panel.messaco.ir/assets/img/products/',
    // SettingBaseUrlProduct: 'http://messaco.ir/assets/img/settings/',
    // SettingBaseUrlPanel: 'http://panel.messaco.ir/assets/img/settings/',
    // BaseUrl: 'http://messaco.ir',
    // Domain: 'messaco.ir',
    // ProductSubUrl: '/assets/img/products/',
    // CategorySubUrl: '/assets/img/categories/category_logo/',


    priceFix: (num, sep) => {
        const number = typeof num === 'number' ? Math.round(num).toString() : num || '0',
            separator = typeof sep === 'undefined' ? ',' : sep


        return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + separator)
    },

   splitCardNumber : (number) => {
        const groups = [];
        for (let i = 0; i < number.length; i += 4) {
          groups.push(number.slice(i, i + 4));
        }
        return groups.join('-');
      }
}





