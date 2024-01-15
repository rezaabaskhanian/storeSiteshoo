import React, { Component, useEffect, useState } from 'react'
import { Platform, View, StatusBar, Text, I18nManager, TouchableOpacity, AsyncStorage } from 'react-native'
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import Axios from 'axios'
import Material from 'react-native-vector-icons/MaterialIcons'
import * as SearchScreens from '../../screens/App/Search'
import { on } from 'react-beep'

import TabBarComponent from "../../component/tabBarComponent.component";
import { BeepProp } from '../../store/BeepProp'
import { Beep, state as store } from 'react-beep'

import { config } from '../../App'
import HomeStack from '../homeStack/HomeStack'
import ProfileStack from  '../profileStack/ProfileStack'
import CartStack from '../cartStack/CartStack'
import NooteStack from '../nootStack/NootStack'
import i18next from '../../services/lang/i18next'

import CustomTabBar from './CustomTabbar'; // Import your custom tab bar component
import { withTranslation } from 'react-i18next';
const url = {
    BaseUrl: 'https://superfood-original.com',
}

class Tests extends React.Component {
    state = {
        ref: null,
        testTabs: ''
    };
    constructor() {
        super()
     
    }

   
    componentDidMount() {
        this.getModules()
    }
    getModules = async () => {

        try {
            let getWallet = Axios.get(url.BaseUrl + '/api/features/get_modules')
            let cheque = getWallet.data.getModules.filter((item) => item.ID == '2008')
            console.log(cheque, 'cheque[0].ID')
           
        } catch (e) {
            console.log(e)
        }

    }
    render() {
        return (
            <View style={{}}>
              
            </View>
        )
    }
}

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







//   const getModules = async () => {
//             let getWallet =await Axios.get(url.BaseUrl + '/api/features/get_modules')
           
//             let cart = await getWallet.data.getModules.find((item) => item.ID ==2088)
//             console.log(cart,'cart')
//             if(cart !==undefined){
//                 AsyncStorage.setItem('InfoBase', ture)
//                 return true
//             }else{
//                 return false
//             }

//     }

const routes = () => {

 
    

    let routes = {

        Search: {
            screen: SearchScreens.Search,
            navigationOptions: {
                tabBarLabel: i18next.t('search'),
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="search" color={tintColor} size={focused ? 22 : 20} />
                )
            }
        },
          Shopping: {
            screen: CartStack,
            navigationOptions: {
                tabBarLabel: i18next.t('cart'),
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
                tabBarLabel: i18next.t('home'),
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="home" color={tintColor} size={focused ? 22 : 20} />
                )
            }
        },
        Profile: {
            screen: ProfileStack ,
            navigationOptions: {
                tabBarLabel:i18next.t('profile'),
                tabBarIcon: ({ focused, tintColor }) => (
                    <Material name="person" color={tintColor} size={focused ? 22 : 20} />
                )
            }

        },
        
    }

    // getModules().then(data=>{
    //     data==false ?
    // // if (condition) {
    //     routes["NootStack"] = {
    //         screen: NooteStack,
    //         navigationOptions: {
    //             tabBarLabel: 'سبد خرید بعدی',
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
    //     :
    //     null 
    // })
    // }
    return routes;
}


// export default  Tabs = createBottomTabNavigator(routes(),


//     {
//     initialRouteName: 'Home',
         // animationEnabled: true,
         // lazy: true,
        
//         tabBarComponent: TabBarComponent,

        // tabBarOptions: () => {
        //     return {
        //         activeTintColor: '#43B02A',
        //         labelStyle:
        //             Platform.OS === 'android' ?
        //                 {
        //                     fontFamily: 'IRANYekanRegular'
        //                 }
        //                 : {
        //                     fontFamily: 'IRANYekanMobile(FaNum)',
        //                     fontWeight: 'normal'
        //                 }
        //     }
        // }
//     }


// )




const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Shopping:CartStack,
    // Tab:{screen :TabStack  ,path:''},
    Profile:{screen :ProfileStack ,path:''},
    Search:SearchScreens.Search,
   

  },
  {
    tabBarComponent: CustomTabBar, // Use your custom tab bar component

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
);

export default TabNavigator;


 
