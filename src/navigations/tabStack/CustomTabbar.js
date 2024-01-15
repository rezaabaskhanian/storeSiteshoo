import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import Material from 'react-native-vector-icons/MaterialIcons'
import { BeepProp } from '../../store/BeepProp'
import { Beep, state as store ,on} from 'react-beep'

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
              // position: 'absolute',
              top: 1,
              left: 10,
              margin: -1,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FF0000',
              textAlign: 'center',
              fontSize: 11
          }}>{parseInt(store.cart_count)}</Text>
      )

  }
}
class CustomTabBar extends React.Component {
  renderTabBarButton = (route, index) => {
    const { navigation, t } = this.props;
    const { routes } = navigation.state;
    const isFocused = navigation.state.index === index;

    const onPress = () => {
    //   const event = navigation.emit({
    //     type: 'tabPress',
    //     target: route.key,
    //   });

      if (!isFocused) {
        navigation.navigate(route.routeName);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
       {
    route.routeName =='Home' ?
    [
        <Material name="home" color={isFocused ? '#43B02A' : 'black'} size={isFocused ? 22 : 20} />,
    <Text style={{fontSize:isFocused ?16 : 12, color: isFocused ? '#43B02A' : 'gray' ,fontFamily: 'IRANYekanRegular'}}>
{t('home')}
</Text>
    ]
: route.routeName =='Profile' ?
[
    <Material name="person" color={isFocused ? '#43B02A' : 'black'} size={isFocused ? 22 : 20} />,
<Text style={{fontSize:isFocused ?16 : 12, color: isFocused ? '#43B02A' : 'black' ,fontFamily: 'IRANYekanRegular' }}>
{t('profile')}
</Text>
]
 : route.routeName =='Shopping' ?
 [
  <NotiTabBarIcon/>,
    <Material name="shopping-basket" color={isFocused ? '#43B02A' : 'black'} size={isFocused ? 22 : 18} />,
   
 <Text style={{fontSize:isFocused ? 16 :12, color: isFocused ? '#43B02A' : 'black',fontFamily: 'IRANYekanRegular' }}>
    {t('cart')}
 </Text>
 ]
 : 
[
    <Material name="search" color={isFocused ? '#43B02A' : 'black'} size={isFocused ? 22 : 20} />,
    <Text style={{fontSize:isFocused ? 16 : 12, color: isFocused ? '#43B02A' : 'black' ,fontFamily: 'IRANYekanRegular'}}>
    {t('search')}
    </Text>
]


   }  
 
        
       
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const { routes } = navigation.state;

    return (
      <View style={{ flexDirection: 'row' }}>
        {routes.map(this.renderTabBarButton)}
      </View>
    );
  }
}

export default withTranslation()(CustomTabBar);