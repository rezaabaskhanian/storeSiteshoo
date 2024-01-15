import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  Text,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import { debounce } from 'underscore'

const { width } = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'
import { withTranslation } from 'react-i18next';
const StoreItem = (props) => {
  return (
    <TouchableWithoutFeedback
      // onPress={() => props.navigation.push('StoreProfile', { item: props })}
      onPress={() => props.navigation.push('Home', { item: props })}
    >

      <View style={{
        backgroundColor: 'white',
        flexDirection: 'row-reverse',
        height: 100,
        width: width - 20,
        margin: 5,
        borderRadius: 5,
        elevation: 1
      }}>
        <FastImage
          source={props.LOGO != null ? { uri: config.ImageBaseUrl + props.LOGO } : require('../../../assest/no_data.png')}
          resizeMode='contain' style={{ height: '100%', width: 120 }} />

        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }}>
          <Text style={[styles.TextBold, { color: 'black', textAlign: 'right', fontSize: 12 }]}>{props.NAME}</Text>
          <Text style={[styles.TextBold, { color: 'gray', textAlign: 'right', fontSize: 12 }]}>{props.SUBTITLE}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          <Material name='keyboard-arrow-left' color='black' size={24} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const CatItem = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => props.navigation.push('Stores', { item: props })}
    >

      <View style={{
        backgroundColor: 'white',
        flexDirection: 'row-reverse',
        height: 100,
        width: width - 20,
        margin: 5,
        borderRadius: 5,
        elevation: 1
      }}>
        <FastImage
          source={props.IMAGE != null ? { uri: config.BaseUrl + props.IMAGE } : require('../../../assest/no_data.png')}
          resizeMode='contain' style={{ height: '100%', width: 120 }} />
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }}>
          <Text style={[styles.TextBold, { color: 'black', textAlign: 'right', fontSize: 12 }]}>{props.NAME}</Text>
          <Text style={[styles.TextBold, { color: 'gray', textAlign: 'right', fontSize: 12 }]}>{props.SUBTITLE}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          <Material name='keyboard-arrow-left' color='black' size={24} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const ProductItem = (props) => {
  return (
    <TouchableWithoutFeedback onPress={() => props.navigation.push('ProductProfile', { item: props })}>
      <View style={{
        height: 100,
        width: width - 20,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 5,
        flexDirection: 'row-reverse',
        elevation: 1
      }}>
        <FastImage
          source={props.IMAGE != null ? { uri: config.ImageBaseUrlProduct + props.IMAGE } : require('../../../assest/no_data.png')}
          resizeMode='contain' style={{ height: '100%', width: 100 }} />
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }}>
          <Text style={[styles.TextBold, { color: 'black', textAlign: 'right', fontSize: 12 }]}>{props.NAME}</Text>
          <Text style={[styles.TextBold, { color: 'gray', textAlign: 'right', fontSize: 12 }]}>{props.BRAND_NAME}</Text>
          <Text style={[styles.TextBold, {
            color: 'gray',
            textAlign: 'right',
            fontSize: 12
          }]}>{t('store')} {props.STORE_NAME}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          <Text style={[styles.TextBold, {
            color: 'gray',
            textAlign: 'center',
            fontSize: 12
          }]}>{config.priceFix(props.PRICE)} $</Text>
        </View>

      </View>
    </TouchableWithoutFeedback>
  )
}

 class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      loading: false,
      text: ''
    };
    this.onChangeTextDelayed = debounce(this.search, 2000)

  }

  onChangeText(text) {
    //    alert(text)
  }

  search = (text) => {
    this.setState({ text: text })
    Axios.get(config.BaseUrl + '/api/stores/filter/Search?q=' + text).then(({ data }) => {
      this.setState({ data })
    }).catch(err => {
      console.log(err, err.response)
    })
  }

  render() {
    const { t } = this.props;
    if (this.state.loading)
      return (
        <View style={styles.container}>
          <Appbar.Header style={{ backgroundColor: 'white' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>{t('search')}</Text>
            </View>
          </Appbar.Header>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator />
          </View>
        </View>
      )
    return (
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>{t('search')}</Text>
          </View>
        </Appbar.Header>
        <View style={{
          flexDirection: 'row-reverse',
          borderWidth: 0.5,
          margin: 5,
          backgroundColor: 'white',
          borderColor: 'gray',
          alignItems: 'center'
        }}>
          <TextInput onChangeText={this.onChangeTextDelayed}
            style={{ flex: 1, ...styles.TextRegular, paddingHorizontal: 10 }}
            placeholder='Product name, store or category' />
          <Material size={25} style={{ marginHorizontal: 10 }} name={t('search')} />
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View>
            {
              this.state.data.Product && this.state.data.Product.length > 0 &&
              <>
                <Text style={{ ...styles.TextBold }}>{t('product')}</Text>
                <FlatList
                  data={this.state.data.Product}
                  keyExtractor={(_, index) => 'products' + index}
                  renderItem={({ item, index }) => (
                    <ProductItem key={String(index)} {...this.props} {...item} />
                  )}
                />
              </>
            }
            {/* {
							this.state.data.Product && this.state.data.Product.length > 0  && this.state.data.Product.map( (item , index)=>{
								return <ProductItem key={String(index)} {...this.props} {...item} />
							})
						} */}
          </View>
          <View>
            {
              this.state.data.Store && this.state.data.Store.length > 0 &&
              <>
                <Text style={{ ...styles.TextBold }}>Store</Text>
                <FlatList
                  data={this.state.data.Store}
                  keyExtractor={(_, index) => 'products' + index}
                  renderItem={({ item, index }) => (
                    <StoreItem key={String(index)} {...this.props} {...item} />
                  )}
                />
              </>
            }
            {/* {this.state.data.Store && this.state.data.Store.length >0 && <Text style={{...styles.TextBold}}> فروشگاه </Text>}
						{
							this.state.data.Store && this.state.data.Store.length > 0 && this.state.data.Store.map( (item , index)=>{
								return <StoreItem key={String(index)} {...this.props} {...item} />
							})
						} */}
          </View>
          <View>
            {
              this.state.data.StoreCategory && this.state.data.StoreCategory.length > 0 &&
              <>
                <Text style={{ ...styles.TextBold }}>categories</Text>
                <FlatList
                  data={this.state.data.StoreCategory}
                  keyExtractor={(_, index) => 'products' + index}
                  renderItem={({ item, index }) => (
                    <CatItem key={String(index)} {...this.props} {...item} />
                  )}
                />
              </>
            }
            {/* {this.state.data.StoreCategory && this.state.data.StoreCategory.length > 0  && <Text style={{...styles.TextBold}}> دسته بندی ها </Text>}
						{
							this.state.data.StoreCategory && this.state.data.StoreCategory.length > 0&& this.state.data.StoreCategory.map( (item , index)=>{
								return <CatItem key={String(index)} {...this.props} {...item} />
							})
						} */}
          </View>
        </ScrollView>
      </View>
    )
  }
}
export default withTranslation()(App)

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
    fontFamily: '$IRANYekanRegular',
    fontWeight: '$WeightRegular'
  },
  image: {},
  button: {
    borderRadius: 17,
    width: 80,
    height: 30,
    backgroundColor: '$MainColor',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
