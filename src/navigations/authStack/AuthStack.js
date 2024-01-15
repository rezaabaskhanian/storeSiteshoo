
import React, { Component, useEffect, useState } from 'react'
import { Platform, View, StatusBar, Text, I18nManager, TouchableOpacity, AsyncStorage } from 'react-native'
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import LandingStack from '../landingStack/LandingStack'
// import TabStack from '../tabStack/TabStack'
import { AuthScreen } from '../../screens'


export default  Auth = createStackNavigator(
    {
        Landing: LandingStack,
        // Tab:TabStack,
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