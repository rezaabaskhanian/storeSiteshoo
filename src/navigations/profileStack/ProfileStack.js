
import React, { Component, useEffect, useState } from 'react'
import { Platform, View, StatusBar, Text, I18nManager, TouchableOpacity, AsyncStorage } from 'react-native'
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'

import AuthStack from '../authStack/AuthStack'
import LandingStack from '../landingStack/LandingStack'
import * as ProfileScreens from '../../screens/App/Profile'

export default  ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreens.Profile,
        Auth: AuthStack   ,
        Landing:LandingStack,
        Address: ProfileScreens.Address,
        EditAddress: ProfileScreens.EditAddress,
        DetailAddress: ProfileScreens.DetailAddress,
        OrderHistory: ProfileScreens.OrderHistory,
        HomeBox: ProfileScreens.HomeBox,
       
        OrderDetail:{screen :ProfileScreens.OrderDetail ,path:'orderDetails'} ,
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
        ShareToFriends: ProfileScreens.ShareToFriends,
        Wheel_Luck:ProfileScreens.WheelLuck

    },
    {
        initialRouteName: 'Profile',
        headerMode: 'none',
        path: 'profile',
    }
)