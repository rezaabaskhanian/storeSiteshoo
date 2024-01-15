import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, TouchableWithoutFeedback, TouchableOpacity, View, Text, AsyncStorage } from 'react-native'

import Axios from 'axios'
import { object } from 'underscore'

const url = {
    BaseUrl: 'https://team-storedanesh.com',
}
class TabBarComponent extends React.Component {
    state = {
        start: 'r',
        click: '1',
        tabs: [],

        routesTab:this.props.navigation.state.routes,
         
       

    }
    constructor(props) {
        super(props);
 
    }
    
    componentDidMount() {
        
        Axios.get(url.BaseUrl + '/api/features/get_modules').then((data) => {
            let cart=  data.data.getModules.find((item) => item.ID ==2088)
            if(cart !==undefined){
                 [
                    AsyncStorage.setItem('InfoBase','true'),
                    this.setState({
                     routesTab:this.state.routesTab.filter(e=>e.key!=='Shopping')
                    })
                 ]
            }
            
        })

    }
    render() {
        const { navigation, renderIcon, inactiveTintColor, getLabelText, activeTintColor } = this.props
       
        const {routes}=navigation.state
       
        return (
            <>
                <SafeAreaView style={{
                    flexDirection: 'row',
                    height: 50,
                    borderTopWidth: 0.7,
                    width: '100%',
                }}>
                    {/* { console.log(routes,this.state.hideCart,'routesroutes')} */}

                    {routes && this.state.routesTab.map((route, index) => {
                        const focused = index === navigation.state.index
                        const tintColor = focused ? '#43B02A' : inactiveTintColor
                        const currentIndex = navigation.state.index;
                        const color = currentIndex === index ? activeTintColor : inactiveTintColor;
                        const label = getLabelText({ route, focused: currentIndex === index, index: index });
                        return (
                            < TouchableWithoutFeedback
                                key={route.key}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    
                                    if (route?.key === 'Cart') {
                                        navigation.navigate('Cart1')
                                        // navigation.navigate('Cart')
                                    } else {
                                        navigation.navigate(route)
                                    }
                                    this.setState({ click: '1' })
                                }}>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {renderIcon({ route, index, focused, tintColor })}
                                    <Text style={{ color, fontFamily: 'IRANYekanRegular', fontSize: 10 }}>{label}</Text>
                                </View>
                                {/* {console.log(routes,'routes')} */}
                            </TouchableWithoutFeedback>
                        )
                    })}
                </SafeAreaView>
            </>
        )
    }
}

export default TabBarComponent;
