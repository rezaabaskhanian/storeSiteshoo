/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, PureComponent} from 'react'
import {
    Text,
    View,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Animated,
    ScrollView
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import FastImage from 'react-native-fast-image'

const {width} = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import {config} from '../../../App'
import {NavigationEvents} from 'react-navigation'
import {Tab, Tabs, Toast} from 'native-base'
import BackHeader from '../component/BackHeader';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
const AnimatedMaterial = Animated.createAnimatedComponent(Material)

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = 60
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

class RenderItem extends PureComponent {
    render() {
        const {item} = this.props
        return (
            <TouchableWithoutFeedback
                // onPress={() => this.props.navigation.push('StoreProfile', {item, catId: this.props.categoryId})}
                onPress={() => this.props.navigation.push('Home', {item, catId: this.props.categoryId})}
            >

                <View style={{
                    height: 100,
                    width: width - 20,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    margin: 5,
                    borderRadius: 5,
                    flexDirection: 'row-reverse',
                    elevation: 3
                }}>
                    {
                        item.IMAGE && item.IMAGE.length && item.IMAGE.length !== 0 ?
                            <FastImage source={{uri: config.ImageBaseUrl + item.IMAGE}} resizeMode='contain'
                                       style={{height: '100%', width: 100}}/>
                            :
                            <FastImage source={require('../../../assest/no_data.png')} resizeMode='contain'
                                       style={{height: '100%', width: 100}}/>

                    }
                    <View style={{justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 10}}>
                        <Text style={[styles.TextBold, {
                            color: 'black',
                            textAlign: 'right',
                            fontSize: 12
                        }]}>{item.NAME}</Text>
                        <Text style={[styles.TextBold, {
                            color: 'gray',
                            textAlign: 'right',
                            fontSize: 10
                        }]}>{item.DESCRIPTION}</Text>
                        <View style={{flexDirection: 'row-reverse', alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Material name='room' style={{marginHorizontal: 5}}/>
                            <Text style={[styles.TextBold, {
                                color: 'gray',
                                textAlign: 'right',
                                fontSize: 8
                            }]}>{item.STORE_ADDRESS}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        {/*<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }} >*/}
                        {/*	<Material name='av-timer' style={{ marginHorizontal: 5 }} />*/}
                        {/*	<Text style={[styles.TextBold, { color: 'gray', textAlign: 'center', fontSize: 12 }]} >۳۰ دقیقه</Text>*/}
                        {/*</View>*/}

                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center'}}>
                            <Material name='navigation' style={{marginHorizontal: 5}}/>
                            <Text style={[styles.TextBold, {
                                color: 'gray',
                                textAlign: 'center',
                                fontSize: 10
                            }]}>{this.props.distance ? `${this.props.distance} کیلومتر` : 'محاسبه نشده'}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

class RenderNearItem extends PureComponent {
    render() {
        const {item} = this.props

        return (
            <TouchableWithoutFeedback
                // onPress={() => this.props.navigation.push('StoreProfile', {item, catId: this.props.categoryId})}
                onPress={() => this.props.navigation.push('Home', {item, catId: this.props.categoryId})}
            >

                <View style={{
                    height: 100,
                    width: width - 20,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    margin: 5,
                    borderRadius: 5,
                    flexDirection: 'row-reverse',
                    elevation: 3
                }}>
                    {
                        item.IMAGE && item.IMAGE.length && item.IMAGE.length !== 0 ?
                            <FastImage source={{uri: config.ImageBaseUrl + item.IMAGE}} resizeMode='contain'
                                       style={{height: '100%', width: 100}}/>
                            :
                            <FastImage source={require('../../../assest/no_data.png')} resizeMode='contain'
                                       style={{height: '100%', width: 100}}/>

                    }
                    <View style={{justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20}}>
                        <Text style={[styles.TextBold, {
                            color: 'black',
                            textAlign: 'left',
                            fontSize: 12
                        }]}>{item.NAME}</Text>
                        <Text style={[styles.TextBold, {
                            color: 'gray',
                            textAlign: 'left',
                            fontSize: 10
                        }]}>{item.DESCRIPTION}</Text>
                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center'}}>
                            <Material name='room' style={{marginHorizontal: 5}}/>
                            <Text style={[styles.TextBold, {
                                color: 'gray',
                                textAlign: 'left',
                                fontSize: 10
                            }]}>{item.ADDRESS}</Text>
                        </View>

                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center'}}>
                            <Material name='navigation' style={{marginHorizontal: 5}}/>
                            <Text style={[styles.TextBold, {
                                color: 'gray',
                                textAlign: 'center',
                                fontSize: 12
                            }]}>{item.DIST ? `${item.DIST} کیلومتر` : 'محاسبه نشده'}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default class App extends Component {

    state = {
        data: [],
        near: [],
        destinations: {},
        selectedAddress: {},
        canSeeNearMe: true,
        categoryInfo: {
            NAME: '',
            SUBTITLE: '',
            BANER: null,
        },
        loading: true,
        scrollY: new Animated.Value(0),

    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            let ID = this.props.navigation.getParam('ID', 1)
            this.setState({loading: true})
            let cats = await Axios.get(`categories/${ID || 1}/storesApp`)
            let catInfo = await Axios.get(`categories/${ID || 1}`)
            let near = await Axios.get(`categories/${ID || 1}/stores/nearby`)
            let address = await Axios.get('users/address')
            let canSeeNearMe = true;
            if (address.data.length === 0) {
                canSeeNearMe = false
            }
            let destinations = {}
            if (cats.data && cats.data.distance) {
                for (let item of cats.data.distance) {
                    if (item) {
                        destinations[item.STORE_ID] = item.DISTANCE
                    }
                }
            }
            this.setState({
                selectedAddress: address.data.find((item) => item.SELECTED === 1),
                data: cats.data.getByCategory,
                destinations: destinations,
                categoryInfo: catInfo.data,
                loading: false,
                canSeeNearMe: canSeeNearMe,
                near: near.data
            })
        } catch (error) {
            console.log(error.response)
            if (error.response.status > 499) {
                Toast.show({
                    text: 'مشکلی از سمته سرور وجود دارد لطفا دوباره امتحان کنید !',
                    type: 'danger',
                    buttonText: 'تایید',
                    buttonStyle: {borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7}
                })

            }
            this.setState({loading: false})

        }
    }

    render() {
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
        if (this.state.loading)
            return (
                <View style={styles.container}>
                    <BackHeader headerText='لیست فروشگاه'/>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <ActivityIndicator/>
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={async () => {
                        try {
                            this.setState({loading: true})
                            let address = await Axios.get('users/address')
                            this.setState({
                                selectedAddress: address.data.find((item) => item.SELECTED === 1),
                                loading: false
                            })
                        } catch (error) {
                            this.setState({loading: false})

                        }
                    }}
                />
                <ScrollView
                    onScrollEndDrag={e => {
                        if (e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE / 2)
                            this.ScrollView.scrollTo({y: 0})
                        if (
                            e.nativeEvent.contentOffset.y >= HEADER_SCROLL_DISTANCE / 2 &&
                            e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE
                        )
                            this.ScrollView.scrollTo({y: HEADER_SCROLL_DISTANCE})
                    }}
                    ref={ref => (this.ScrollView = ref)}
                    scrollEventThrottle={1}
                    onScroll={Animated.event([
                        {nativeEvent: {contentOffset: {y: this.state.scrollY}}}
                    ])}
                    style={{flex: 1}}
                    contentContainerStyle={{
                        paddingTop: HEADER_MAX_HEIGHT,
                        paddingBottom: 10
                    }}
                >
                    {this.state.canSeeNearMe ?
                        <Tabs prerenderingSiblingsNumber={1} initialPage={0}
                              style={{
                                  marginTop: 10,
                                  backgroundColor: 'transparent',
                                  elevation: 0,
                                  alignItems: 'center'
                              }}
                              contentProps={{nestedScrollEnabled: true}} tabContainerStyle={{
                            backgroundColor: StyleSheet.value('$MainColor'),
                            width: 200,
                            elevation: 0,
                            borderRadius: 24,
                            transform: [{scaleX: -1}]
                        }} tabBarUnderlineStyle={{backgroundColor: 'transparent'}}>
                            <Tab heading={'همه'} tabStyle={{
                                backgroundColor: 'transparent',
                                width: 80,
                                borderRadius: 24,
                                margin: 5,
                                transform: [{scaleX: -1}]
                            }} activeTabStyle={{
                                backgroundColor: 'white',
                                margin: 5,
                                borderRadius: 17,
                                transform: [{scaleX: -1}]
                            }} textStyle={{...styles.TextRegular, color: 'white'}}
                                 activeTextStyle={{...styles.TextBold, color: StyleSheet.value('$MainColor')}}>
                                {
                                    this.state.data.length === 0 ?
                                        <View style={{
                                            width: '100%',
                                            height: '100%',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            marginTop: 10
                                        }}>
                                            <FastImage source={require('../../../assest/no_data.png')}
                                                       resizeMode='contain'
                                                       style={{width, height: 200}}/>
                                        </View> :

                                        <FlatList
                                            keyExtractor={(item, index) => index.toString()}
                                            data={this.state.data}
                                            style={{marginTop: 10}}
                                            contentContainerStyle={{alignItems: 'center'}}
                                            renderItem={({item}) => <RenderItem {...this.props} item={item}
                                                                                distance={this.state.destinations[item.ID]}
                                                                                categoryId={this.props.navigation.getParam('ID', 1)}/>}
                                        />
                                }
                            </Tab>
                            <Tab heading={'اطراف من'} tabStyle={{
                                backgroundColor: 'transparent',
                                width: 80,
                                borderRadius: 24,
                                margin: 5,
                                transform: [{scaleX: -1}]
                            }} activeTabStyle={{
                                backgroundColor: 'white',
                                margin: 5,
                                borderRadius: 17,
                                transform: [{scaleX: -1}]
                            }} textStyle={{...styles.TextRegular, color: 'white'}}
                                 activeTextStyle={{...styles.TextBold, color: StyleSheet.value('$MainColor')}}>
                                {
                                    this.state.near.length === 0 ?
                                        <View style={{
                                            width: '100%',
                                            height: '100%',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            marginTop: 10
                                        }}>
                                            <FastImage source={require('../../../assest/no_data.png')}
                                                       resizeMode='contain'
                                                       style={{width, height: 200}}/>
                                        </View> :

                                        <FlatList
                                            keyExtractor={(item, index) => index.toString()}
                                            data={this.state.near}
                                            style={{marginTop: 10}}
                                            contentContainerStyle={{alignItems: 'center'}}
                                            renderItem={({item}) => <RenderNearItem {...this.props} item={item}/>}
                                        />
                                }
                            </Tab>
                        </Tabs> :
                        this.state.data.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                marginTop: 10
                            }}>
                                <FastImage source={require('../../../assest/no_data.png')} resizeMode='contain'
                                           style={{width, height: 200}}/>
                            </View> :

                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.data}
                                style={{marginTop: 10}}
                                contentContainerStyle={{alignItems: 'center'}}
                                renderItem={({item}) => <RenderItem {...this.props} item={item}
                                                                    distance={this.state.destinations[item.ID]}
                                                                    categoryId={this.props.navigation.getParam('ID', 1)}/>}
                            />
                    }
                </ScrollView>
                <Animated.View
                    style={[
                        styles.header,
                        {height: headerHeight, backgroundColor: 'black'}
                    ]}
                >
                    <AnimatedFastImage
                        source={{uri: config.BaseUrl + '/assets/img/categories/category_banner/' + this.state.categoryInfo.BANER}}
                        resizeMode="cover"
                        style={{
                            width,
                            height: headerHeight,
                            position: 'absolute',
                            opacity: 0.3
                        }}
                    />
                    <Animated.View
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
                            fontSize: 18,
                            position: 'absolute',
                            textAlign: 'center',
                            alignSelf: 'center',
                            top: NAMETOP,
                            transform: [{scale: NAMESCALE}]
                        }}
                    >
                        {this.state.categoryInfo.NAME}
                    </Animated.Text>
                    <Animated.View
                        style={{
                            flexDirection: 'row-reverse',
                            top: TIMETOP,
                            position: 'absolute',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}
                    >
                        <Text
                            style={{
                                ...styles.TextRegular,
                                color: 'white',
                                fontSize: 11,
                                textAlign: 'center',
                            }}
                        >
                            {this.state.categoryInfo.SUBTITLE}
                        </Text>
                    </Animated.View>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.goBack()}
                        hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                    >
                        <AnimatedMaterial
                            name="arrow-forward"
                            style={{alignSelf: 'flex-end', margin: 15, color: backcolor}}
                            size={25}
                        />
                    </TouchableWithoutFeedback>
                </Animated.View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        elevation: 2
    },
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
