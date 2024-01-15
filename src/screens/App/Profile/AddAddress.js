import { Icon, Input, Toast } from 'native-base'
import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableWithoutFeedback,
    AsyncStorage,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Linking, Modal,
    ActivityIndicator
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import MapView from 'react-native-maps'
import Material from 'react-native-vector-icons/MaterialIcons'
import BackHeader from '../component/BackHeader'
import Geolocation from '@react-native-community/geolocation';
import Axios from "axios";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Autocomplete from 'react-native-searchable-dropdown';
import color from "color";
import { withTranslation } from 'react-i18next';

import SearchInput from '../component/SearchInput'
 class App extends Component {
    state = {
        lazy:false,
        item: {},
        itemDetail: {},
        ADDRESS: '',
        array: [],
        showAddressDetail: false,
        detail: "",
        region: {
            latitude: 36.3082732,
            longitude: 59.5757846,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        },
        modalVisible: false,
        edit: false,
        ID: ''
    };
    map = null;

    onRegionChange(region) {
        this.setState({ region })
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.navigation.state.params) {
                const state = this.props.navigation.state.params.data;
                if (state.edit && state.item) {
                    this.setState({
                        ID: state.item.ID,
                        itemDetail: state.item,
                        edit: true,
                        ADDRESS: state.ADDRESS,
                        latitude: parseFloat(state.item.X),
                        longitude: parseFloat(state.item.Y),
                        latitudeDelta: parseFloat(0.01),
                        longitudeDelta: parseFloat(0.01)

                    })
                    const currentLocation = {
                        latitude: parseFloat(state.item.X),
                        longitude: parseFloat(state.item.Y),
                        latitudeDelta: parseFloat(0.01),
                        longitudeDelta: parseFloat(0.01)
                    }
                    this.map.animateToRegion(currentLocation)

                }
                setTimeout(() => {

                    this.searchMap()
                }, 1500);
            } else {
                this.getCurrent()
            }
        }, 500)
    }

    getCurrent() {
        Geolocation.getCurrentPosition(
            position => {
                const currentLocation = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: parseFloat(this.state.region.latitudeDelta),
                    longitudeDelta: parseFloat(this.state.region.longitudeDelta)
                }
                this.map.animateToRegion(currentLocation)
            },
            error => {
                if (error.message === 'No location provider available.') {
                    Toast.show({
                        text: 'Please enable gps',
                        type: 'warning'
                    })
                }
                console.warn('err', error.message)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }



    searchMap() {
        const state = this.props.navigation.state.params.data;
        console.log(state)

        // else if (text !== this.state.selected && !this.state.error) {
        let search = '';
        if (state.selectedProvinceTitle) {
            search += state.selectedProvinceTitle + ', '
        }
        if (state.selectedCityTitle) {
            search += state.selectedCityTitle + ', '
        }
        if (state.AREA1) {
            search += state.AREA1.name
        }
        Axios.get('/stores/filter/locations?q=' + search).then(({ data }) => {
            console.log(data, 'data')
            if (data) {
                this.setState({
                    error: true,
                    // array: data,
                    region: {
                        latitude: data.location.y,
                        longitude: data.location.x,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }
                })

                Axios.get('/stores/filter/aroundlocations?term=' + search + '&lat=' + this.state.region.latitude + '&lng=' + this.state.region.longitude).then(({ data }) => {
                    // console.log(data, 'ddddddddddddd')
                    console.log('/stores/filter/aroundlocations?term=' + search + '&lat=' + this.state.region.latitude + '&lng=' + this.state.region.longitude, 'datttttaaa')
                    const newData = data.items.map(({ title: name, ...rest }) => ({ name, ...rest }));
                    // console.log(newData, 'ghghghg')
                    // console.log(JSON.stringify(data, null, 5));
                    // console.log(data, 'areaaaaaaa');


                    this.setState({ array: newData })
                    // if (data) {

                    //     this.setState({
                    //         error: true,
                    //         array: data
                    //     })
                    // }
                }).catch(err => {
                    console.warn(err.config)
                })
            }
        }).catch(err => {
            console.warn(err.config)
        })
    }

    customFilter(text) {
        const state = this.props.navigation.state.params.data;

        if (text) {

            let search = '';
            if (state.selectedProvinceTitle) {
                search += state.selectedProvinceTitle + ', '
            }
            if (state.selectedCityTitle) {
                search += state.selectedCityTitle + ', '
            }
            if (text) {
                search += text
            }

            Axios.get('/stores/filter/locations?q=' + search).then(({ data }) => {
                console.log(search, 'dataaaaaaaa')
                if (data) {
                    this.setState({
                        error: true,
                        // array: data,
                        region: {
                            latitude: data.location.y,
                            longitude: data.location.x,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        }
                    })


                    setTimeout(() => {
                        Axios.get('/stores/filter/aroundlocations?term=' + search + '&lat=' + this.state.region.latitude + '&lng=' + this.state.region.longitude).then(({ data }) => {
                            console.log(data, 'data')
                            console.log('/stores/filter/aroundlocations?term=' + search + '&lat=' + this.state.region.latitude + '&lng=' + this.state.region.longitude, 'datttttaaa')
                            // if (data) {
                            const newData = data.items.map(({ title: name, ...rest }) => ({ name, ...rest }));
                            console.log(newData, 'ghghghg')
                            this.setState({
                                error: true,
                                array: newData,
                                // region: {
                                //     latitude: data.location.y,
                                //     longitude: data.location.x,
                                //     latitudeDelta: 0.01,
                                //     longitudeDelta: 0.01
                                // }
                            })

                            // }
                        }).catch(err => {
                            console.warn(err.config)
                        })
                    }, 2000)

                }
            })
        }

    }

    showError(text) {
        return Toast.show({
            text: text,
            type: 'danger',
            buttonText: 'Ok',
            buttonStyle: {
                borderColor: 'white',
                borderWidth: 1,
                margin: 5,
                borderRadius: 7
            },
            textStyle: { ...styles.TextRegular, fontSize: 14 }
        })
    }

    render() {
        const {t} =this.props
        let text = this.state.edit ? t('edit-address') : t('add-address')
            
        return (
            <View style={styles.container}>
                <BackHeader headerText={text} />
                <View style={{ flex: 10, justifyContent: 'center' }}>
                    <Autocomplete
                        // data={this.state.region}
                        items={this.state.array}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        placeholderColor='#2e2e2e'
                        onItemSelect={(item) => {
                            this.customFilter(item.address)
                            this.setState({
                                ADDRESS: item.address,
                            })
                        }}

                        // displayKey="title"
                        // value={this.state.ADDRESS}
                        onTextChange={text => {
                            this.setState({ ADDRESS: text })
                            console.log(text, 'onTextChange')
                            this.customFilter(text)

                        }}
                        placeholder={t('location-search')}

                    // onSelect={async value => {
                    //     await this.setState({
                    //         latitude: parseFloat(value.lat),
                    //         longitude: parseFloat(value.lng),
                    //         ADDRESS: value.title,
                    //         latitudeDelta: parseFloat(0.01),
                    //         longitudeDelta: parseFloat(0.01)
                    //     });

                    //     const currentLocation = {
                    //         latitude: parseFloat(value.lat),
                    //         longitude: parseFloat(value.lng),
                    //         latitudeDelta: parseFloat(0.01),
                    //         longitudeDelta: parseFloat(0.01)
                    //     };

                    //     this.map.animateToRegion(currentLocation);
                    //     console.warn('value', this.state.ADDRESS)
                    // }}
                    />
                    <MapView
                        style={{ flex: 1 }}
                        region={this.state.region}
                        ref={ref => this.map = ref}
                        showsMyLocationButton={true}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        onRegionChangeComplete={reg => this.onRegionChange(reg)}
                        initialRegion={this.state.region}
                    />

                    <Material name='location-on' size={40} color='red'
                        style={{ position: 'absolute', alignSelf: 'center' }} />

                    <TouchableWithoutFeedback
                        onPress={async () => {
                            const state = this.props.navigation.state.params.data;

                            try {
                                await this.setState({ lazy: true });
                                if (this.state.edit) {
                                    AsyncStorage.getItem('profile').then(async (data) => {
                                        Axios.put('users/address/' + this.state.ID, {
                                            UR_ID: data.ROLE_ID,
                                            COUNTRY_DIVISION_ID: state.COUNTRY_DIVISION_ID,
                                            NAME: state.NAME,
                                            ADDRESS: this.state.ADDRESS,
                                            AREA: state.AREA,
                                            LOCATION: [this.state.region.latitude, this.state.region.longitude]
                                        }).then(async ({ data }) => {
                                            this.setState({ lazy: false });
                                            this.props.navigation.navigate('Address', { update: true });
                                            Toast.show({
                                                text: t('address-edit-success'),
                                                type: 'success',
                                                position: 'top'
                                            })
                                        }).catch(err => {
                                            this.setState({ lazy: false })
                                            Toast.show({
                                                text: `خطا در ثبت اطلاعات (code:${err.response.status})`,
                                                type: 'warning',
                                                position: 'top'
                                            })
                                        })


                                    })
                                } else {
                                    this.setState({ showAddressDetail: true })
                                }

                            } catch (error) {
                                Toast.show({
                                    text: error.response.data.message,
                                    type: 'danger',
                                    buttonText: 'Ok',
                                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                                })
                                this.setState({ lazy: false })

                            }
                        }}
                    >
                        <View style={{
                            ...styles.continue,
                            position: 'absolute',
                            alignSelf: 'center',
                            bottom: 20,
                            justifyContent: 'center'
                        }}>
                            <Material name='location-on' color='white' size={20} style={{ marginLeft: 10, }} />
                            <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>{t('add-address')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.getCurrent()}
                    >
                        <View style={{
                            position: 'absolute',
                            bottom: 65,
                            alignItems: 'center',
                            justifyContent: 'center',
                            right: 20,
                            padding: 10,
                            height: 50,
                            width: 50,
                            backgroundColor: 'white',
                            borderRadius: 25,
                            elevation: 3
                        }}>
                            <Material size={25} name='location-on' color={StyleSheet.value('$MainColor')} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showAddressDetail}
                    onRequestClose={() => {
                        this.setState({ showAddressDetail: false })
                    }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: color('gray').alpha(0.8).darken(0.2) }} >
                        <View style={{ backgroundColor: 'white', height: 250, borderTopLeftRadius: 17, borderTopRightRadius: 17, alignItems: 'center' }} >
                            <View>
                                <TouchableOpacity style={{ margin: 10, position: 'absolute', left: -60 }} onPress={() => {
                                    this.setState({ showAddressDetail: false })
                                }}>
                                    <Icon
                                        style={{ color: StyleSheet.value('$MainColor') }}
                                        name="cancel"
                                        size={18}
                                        type="MaterialIcons"
                                    />

                                </TouchableOpacity>
                                <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, margin: 10 }} > {t('enter-address-details')} </Text>
                            </View>
                            <Input
                                placeholder={t('detail-address')}
                                value={this.state.detail}
                                multiline
                                onChangeText={(detail) => this.setState({ detail })}
                                style={[styles.TextLight, { padding: 10, textAlignVertical: 'top', flex: 0.2, borderRadius: 17, borderWidth: 0.5, borderColor: 'gray', width: '90%', ...styles.TextRegular }]}
                            />

                            <TouchableOpacity
                            disabled={this.state.lazy}
                                onPress={async () => {
                                    const state = this.props.navigation.state.params.data;

                                    try {
                                        if (!this.state.detail) {
                                            await this.setState({ showAddressDetail: false })
                                            return this.showError('جزییات آدرس الزامی است')
                                        }
                                        await this.setState({ lazy: true });
                                        if (this.state.edit) {
                                            AsyncStorage.getItem('profile').then(async (data) => {
                                                Axios.put('users/address/' + this.state.ID, {
                                                    UR_ID: data.ROLE_ID,
                                                    COUNTRY_DIVISION_ID: state.COUNTRY_DIVISION_ID,
                                                    NAME: state.NAME,
                                                    ADDRESS: this.state.ADDRESS,
                                                    AREA: state.AREA,
                                                    LOCATION: [this.state.region.latitude, this.state.region.longitude]
                                                }).then(async ({ data }) => {
                                                    this.setState({ lazy: false });
                                                    this.props.navigation.navigate('Address', { update: true });
                                                    Toast.show({
                                                        text: t('address-edit-success'),
                                                        type: 'success',
                                                        position: 'top'
                                                    })
                                                }).catch(err => {
                                                    this.setState({ lazy: false })
                                                    Toast.show({
                                                        text: t('error-in-information')`(code:${err.response.status})`,
                                                        type: 'warning',
                                                        position: 'top'
                                                    })
                                                })


                                            })
                                        }
                                        else {
                                            AsyncStorage.getItem('profile').then(async (data) => {
                                                Axios.post('users/address', {
                                                    COUNTRY_DIVISION_ID: state.COUNTRY_DIVISION_ID,
                                                    NAME: state.NAME,
                                                    ADDRESS: this.state.ADDRESS + ' ' + this.state.detail,
                                                    AREA: state.AREA,
                                                    LOCATION: [this.state.region.latitude, this.state.region.longitude]
                                                }).then(async ({ data }) => {
                                                    this.setState({ lazy: false })

                                                    Toast.show({
                                                        text: t('address-edit-success'),
                                                        type: 'success',
                                                        position: 'top'
                                                    })
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate('Address', { update: true })
                                                    }, 1000);

                                                }).catch(err => {
                                                    this.setState({ lazy: false })
                                                    Toast.show({
                                                        text: t('error-in-information')`(code:${err.response.status})`,
                                                        type: 'warning',
                                                        position: 'top'
                                                    })
                                                })


                                            })
                                        }

                                    } catch (error) {
                                        Toast.show({
                                            text: error.response.data.message,
                                            type: 'danger',
                                            buttonText: 'Ok',
                                            buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                                        })
                                        this.setState({ lazy: false })

                                    }
                                }}
                            >
                                <View style={{ ...styles.button, margin: 20, alignSelf: 'center', width: 170, justifyContent: 'center' }} >
                                {
                                    this.state.lazy ?
                                    <ActivityIndicator size="small" color="white" />
                                    :

                                    <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >{t('add-address')}</Text>
                                }
                                  
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
        // fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        // fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    button: {
        borderRadius: 17,
        width: 80,
        height: 50,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
    },
    continue: {
        backgroundColor: '$MainColor',
        width: wp('95%'),
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        borderRadius: wp('2%'),
        padding: 8
    },
    search: {
        backgroundColor: '#381e70',
        padding: 13,
        borderRadius: 6,
        justifyContent: 'center'
    }
})
