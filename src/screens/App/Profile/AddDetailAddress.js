import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    
    Platform,
    AsyncStorage,
    Dimensions
  
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import { Button, Appbar, ActivityIndicator } from 'react-native-paper'
import color from 'color'
import MapView, { Marker } from 'react-native-maps'
import Axios from 'axios'
import { Toast, Item, Content, Container ,CheckBox} from 'native-base'
import Geolocation from '@react-native-community/geolocation';
// import {Picker} from 'native-base'
import SearchInput from '../component/SearchInput'
import BackHeader from '../component/BackHeader'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'
import { Autocomplete } from "react-native-autocomplete-input";
import { debounce } from "underscore";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";


const {width, height} = Dimensions.get('window')
import { withTranslation } from 'react-i18next';
 class App extends Beep(BeepProp, Component) {
    
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            loading: true,
            ADDRESS: '',
            NAME: '',
            DETAIL:'',
            selectedLat: 0,
            selectedLng: 0,
            lazy: false,
            provinces: [],
            cities: [],
            areas: [],
            selectedProvince: -1,
            selectedCity: -1,
            selectedProvinceTitle: '',
            selectedCityTitle: '',
            selectedArea: -1,
            error: false,
            edit: false,
            item: {},
            selected: '',
            array: [],
    
            search: false,
            inputText: '',
            region: {
                latitude: 36.3082732,
                longitude: 59.5757846,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            },
        }
    }

   
    onRegionChange(region) {
        this.setState({ region })
        console.log(region,'region')
    }


  
    getCurrent() {
        Geolocation.getCurrentPosition(
            position => {
                const currentLocation = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: parseFloat(0.001),
                    longitudeDelta: parseFloat(0.001)
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


    editAddress =(t)=>{
        this.setState({ lazy: true })

        setTimeout(() => {

            //  AsyncStorage.getItem('profile').then(async (data) => {
                
                Axios.put('users/address/' + this.state.item.ID, {
                    UR_ID: this.state.item.ROLE_ID,
                    // COUNTRY_DIVISION_ID: this.state.selectedProvince,
                    PROVINCE_ID :this.state.selectedProvince,
                    COUNTRY_DIVISION_ID: this.state.selectedCity, 
                    NAME: this.state.NAME,
                    ADDRESS: this.state.DETAIL,
                    AREA: '',
                    LOCATION: [parseFloat(this.state.region.latitude), parseFloat(this.state.region.longitude)]
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
                        text: t('error-in-information') `(code:${err.response.status})`,
                        type: 'warning',
                        position: 'top'
                    })
                })


            //  })
             
         }, 2000);
    }

    sendLocation = (t) => {
        const route = this.props.navigation.state
       
             setTimeout(() => {

                // AsyncStorage.getItem('profile').then(async (data) => {
                   
                    Axios.post('users/address', {
                        COUNTRY_DIVISION_ID: this.state.selectedCity,
                        PROVINCE_ID :this.state.selectedProvince,
                        // COUNTRY_DIVISION_ID: this.state.selectedProvince,
                        NAME: this.state.NAME,
                        ADDRESS: this.state.DETAIL, 
                        AREA: '',
                        LOCATION: [parseFloat(this.state.region.latitude), parseFloat(this.state.region.longitude)]
                    }).then(async ({ data }) => {
                     
                        this.setState({ lazy: false })

                        Toast.show({
                            text: t('address-registere-success'),
                            type: 'success',
                            position: 'top'
                        })
                        // setTimeout(() => {
                        //     this.props.navigation.navigate('Address', { update: true })
                        // }, 1000);
                        setTimeout(() => {
                            console.log(route.params.route=='addDetail')
                            
                            route.params.route=='addDetail' ?
                            this.props.navigation.navigate('CartDetail')
                            :
                            this.props.navigation.navigate('Address', { update: true })
                        }, 1000);

                    }).catch(err => {
                        this.setState({ lazy: false })
                        Toast.show({
                            text: `Error in data registration (code:${err.response.status})`,
                            type: 'warning',
                            position: 'top'
                        })
                    })


                // })
                 
             }, 2000);
                // this.map.animateToRegion(currentLocation)
            }

    componentDidMount() {
        this.getCurrent()

        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.item) {
            const { item, region } = this.props.navigation.state.params;


            Axios.get('/provinces').then(({ data }) => {
                if (item) {
                    console.log(item,'item')
                    let stateData = {
                        ADDRESS: item.ADDRESS,
                        edit: true,
                        selectedProvince: item.PROVINCE_ID,
                        selectedCity: item.TOWNSHIP_ID,
                        selectedCityTitle: item.TOWNSHIP_NAME,
                        
                        selectedProvinceItem: data.find((sub) => {
                            return sub.ID === item.PROVINCE_ID
                        }),
                        selectedArea: item.AREA,
                        item: item,
                        NAME: item.NAME,
                        DETAIL:item.ADDRESS
                    }
                    Axios.get(`/provinces/${item.PROVINCE_ID}/cities`).then(({ data }) => {
                        this.setState({ cities: data });
                        stateData['selectedProvinceTitle'] = stateData.selectedProvinceItem.PROVINCE_NAME;
                        stateData['selectedCityItem'] = data.find((sub) => {
                            return sub.ID === parseInt(item.TOWNSHIP_ID)
                        })
                        Axios.get(`/provinces/${item.PROVINCE_ID}/cities/${item.TOWNSHIP_ID}/areas`).then(({ data }) => {
                            this.setState({ areas: data });
                            stateData['selectedArea'] = data.find((sub) => {
                                return sub.ID === parseInt(item.COUNTRY_DIVISION_ID)
                            })
                            this.setState(stateData)

                        }).catch(err => {
                            console.warn('[Areas]', err.response)
                        })

                    }).catch(err => {
                        console.warn(err)
                    })
                    this.setState();
                    this.getCities(item.PROVINCE_ID)
                }
                this.setState({
                    provinces: data
                })
            }).catch(err => {
                console.warn(err.config)
            })
        } else {
            Axios.get('/provinces').then(({ data }) => {
                this.setState({
                    provinces: data
                })
            }).catch(err => {
                console.warn(err.config)
            })
        }

    }

    getCities(id) {
        Axios.get(`/provinces/${id}/cities`).then(({ data }) => {
            this.setState({ cities: data })
            this.getAreas(data[0].ID);
        }).catch(err => {
            console.warn(err)
        })
    }

    getAreas(id) {

        Axios.get(`/provinces/${this.state.selectedArea}/cities/${id}/areas`).then(({ data }) => {
            const newData = data.map(({ NEIGHBOURHOOD: name, ...rest }) => ({ name, ...rest }));
            // console.log(newData, 'newwwwwww')
            // console.log(JSON.stringify(data, null, 5));
            // console.log(data, 'areaaaaaaa');
            this.setState({ areas: newData })
        }).catch(err => {
            console.warn('[Areas]', err.response)
        })
    }

    onChangeTextDelayed = debounce((text) => this.search(text), 2000);


    onFocus(text) {
        this.setState({ ADDRESS: text })
        this.onChangeTextDelayed(text);
        console.log(this.onChangeTextDelayed(text));

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
            <ScrollView style={styles.container}>
                <BackHeader headerText={text} />
                {/* <View style={{ backgroundColor: '#ffbcc2', width: '100%', padding: 15 }}>
                    <Text style={[styles.TextLight, { textAlign: 'center', fontSize: 14, color: 'red' }]}>لطفا آدرس خود
                        را بصورت دقیق در کادر وارد نمایید.</Text>
                </View> */}

                {/* <View style={styles.ViewsCheck}>
 
 <CheckBox
 checked={this.state.checked}
 onPress={()=>{
        this.setState({checked:!this.state.checked})
 }}
  color={StyleSheet.value('$MainColor')} />
  <Text style={{ marginRight:25, fontSize: 20, color:'black' }}>
     موقعیت فعلی
  </Text>
  </View> */}

  <View style={[styles.views,{marginHorizontal:20,}]}>
                        <View style={{
                            height: 50,
                            marginVertical: 5,
                            width: '90%',
                            borderColor: 'gray',
                            justifyContent: 'center',
                           
                        }}>
                            <TextInput
                                placeholder='َآدرس ُ خونه ُ ...'
                                value={this.state.NAME}
                                onChangeText={(NAME) => this.setState({ NAME })}
                                style={[styles.TextLight, { flex: 1, padding: 10, textAlignVertical: 'top' }]}
                            />
                        </View>

                        
                      
                    </View>
                    <View style={[styles.views,{marginHorizontal:20,}]}>
                    <View style={{
                            height: 50,
                            marginVertical: 5,
                            width: '90%',
                            borderColor: 'gray',
                            justifyContent: 'center',
                           
                        }}>
                            <TextInput
                                placeholder={t('detail-address')}
                                value={this.state.DETAIL}
                                onChangeText={(DETAIL) => this.setState({ DETAIL })}
                                style={[styles.TextLight, { flex: 1, padding: 10, textAlignVertical: 'top' }]}
                            />
                        </View>
                        </View>
                        <View style={[styles.views,{marginHorizontal:20,}]}>
                        <Picker
                            style={{ height: 50, width: 150 }}

                            onValueChange={val => {
                                this.setState({
                                    selectedProvince: val.ID,
                                    selectedProvinceItem: val,
                                    selectedProvinceTitle: val.PROVINCE_NAME
                                })
                                val.ID >= 0 && this.getCities(val.ID)

                            }}
                            selectedValue={this.state.selectedProvinceItem}
                        >
                            <Picker.Item key={String(-1)} value={-1} label={t('state')} />
                            {
                                this.state.provinces.map(item => (
                                    <Picker.Item key={String(item.ID)} value={item} label={item.PROVINCE_NAME} />
                                ))
                            }
                        </Picker>
                    </View>

                    <View style={[styles.views,{marginHorizontal:20,}]}>
                      <Picker
                          style={{ height: 50, width: 150 }}

                          onValueChange={val => {
                              this.setState({
                                  selectedCity: val.ID,
                                  selectedCityItem: val,
                                  selectedCityTitle: val.TOWNSHIP_NAME

                              })
                              val.ID >= 0 && this.getAreas(val.ID)
                          }}
                          selectedValue={this.state.selectedCityItem}
                      >
                          <Picker.Item key={String(-1)} value={-1} label={t('city')} />

                          {
                              this.state.cities.map(item => (
                                  <Picker.Item key={String(item.ID)} value={item} label={item.TOWNSHIP_NAME} />
                              ))
                          }
                      </Picker>
                  </View>
                  

  {/* {this.state.checked ? */}
  
         <MapView
                //      style={{ position:'absolute', flex: 0.5, width: '100%', height: '100%' }}
                //      initialRegion={{
                //        latitude: 37.78825,
                //        longitude: -122.4324,
                //        latitudeDelta: 0.0922,
                //        longitudeDelta: 0.0421,
                //      }}
                //    />
        

                     
                style={{  flex: 1, minHeight: height * 0.5,marginHorizontal:25 }}
                     ref={ref => this.map = ref}
                     region={this.state.region}
                    
                    showsMyLocationButton={true}
                      zoomEnabled={true}
                      showsUserLocation={true}
                      onRegionChangeComplete={reg => this.onRegionChange(reg)}
                    initialRegion={this.state.region}
                    
                        >
                             
                       <Marker 
                       opacity={0.7} coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }} >
                           
                           </Marker> 
                      </MapView>
                     
                      {/* <TouchableOpacity onPress={() => this.getCurrent()} style={{justifyContent:'center',alignItems:'center',width:40,height:40,borderRadius:5,backgroundColor:'gray' ,position:'absolute',right:5,bottom:100}}>
                       
                      <Material name='location-on' color='white' size={20} />
                            

                   </TouchableOpacity> */}
                      {/* : */}

                {/* <ScrollView style={{ padding: 10, flex: 1 }} keyboardShouldPersistTaps='handler'> */}
                
                      {/* <View style={styles.views}>
                        <Picker
                            style={{ height: 50, width: 150 }}

                            onValueChange={val => {
                                this.setState({
                                    selectedProvince: val.ID,
                                    selectedProvinceItem: val,
                                    selectedProvinceTitle: val.PROVINCE_NAME
                                })
                                val.ID >= 0 && this.getCities(val.ID)

                            }}
                            selectedValue={this.state.selectedProvinceItem}
                        >
                            <Picker.Item key={String(-1)} value={-1} label='استان' />
                            {
                                this.state.provinces.map(item => (
                                    <Picker.Item key={String(item.ID)} value={item} label={item.PROVINCE_NAME} />
                                ))
                            }
                        </Picker>
                    </View> */}
                      {/* <View style={styles.views}>
                      <Picker
                          style={{ height: 50, width: 150 }}

                          onValueChange={val => {
                              this.setState({
                                  selectedCity: val.ID,
                                  selectedCityItem: val,
                                  selectedCityTitle: val.TOWNSHIP_NAME

                              })
                              val.ID >= 0 && this.getAreas(val.ID)
                          }}
                          selectedValue={this.state.selectedCityItem}
                      >
                          <Picker.Item key={String(-1)} value={-1} label='شهر' />

                          {
                              this.state.cities.map(item => (
                                  <Picker.Item key={String(item.ID)} value={item} label={item.TOWNSHIP_NAME} />
                              ))
                          }
                      </Picker>
                  </View> */}
                  {/* <SearchInput
                        data={this.state.areas}
                        onValueChange={val => {
                            console.warn(val)
                            this.setState({
                                selectedArea: val,
                            })
                        }}
                        selectedValue={this.state.selectedArea}
                    /> */}
                
{/* 
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {this.state.error ? this._listOptions() : null}
                    </View> */}


                {/* </ScrollView> */}
    
                <TouchableOpacity
                    disabled={this.state.lazy}

                    onPress={async () => {
                         

                        if (!this.state.NAME) {
                            return this.showError(t('address-necessary'))
                        }


                        else if (!this.state.DETAIL) {
                            return this.showError(t('detail-address-necessary'))
                        }
                      
                       
                        else if (!this.state.selectedProvinceItem) {
                            return this.showError(t('select-state-necessary'))
                        }
                        // else if (this.state.checked) {
                        //     return  this.getCurrent()
                        //   }
                        
                       else if (!this.state.selectedCityItem) {
                            return this.showError(t('select-city-necessary'))
                        }
                    //     // if ( !this.state.selectedArea > 0) {
                    //    else  if (this.state.selectedArea == -1) {
                    //         return this.showError('انتخاب محله  الزامی است')
                    //     }
                         this.setState({ lazy: true })

                    this.state.edit ? this.editAddress(t) : this.sendLocation(t)
                        
                        
                               
                          
                        // this.props.navigation.navigate('AddAddress', {
                        //     data: {
                        //         COUNTRY_DIVISION_ID: this.state.selectedArea.COUNTRY_DIVISION_ID,
                        //         NAME: this.state.NAME,
                        //         ADDRESS: this.state.ADDRESS,
                        //         AREA: this.state.selectedArea.AREA,
                        //         AREA1: this.state.selectedArea,
                        //         selectedProvinceTitle: this.state.selectedProvinceTitle,
                        //         selectedCityTitle: this.state.selectedCityTitle,
                        //         edit: this.state.edit,
                        //         item: this.state.item
                        //     }
                        // });
                    
                        // await this.setState({ lazy: false })
                    }}
                >
                    <View style={{ ...styles.continue, alignSelf: 'center', bottom: 5 }}>

                        <Material name='location-on' color='white' size={20}
                            style={{ marginLeft: 10 }} />
                        {
                            this.state.lazy ?
                                <ActivityIndicator color='white' />
                                :
                                <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>{t('address-confirm')}</Text>
                        }
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default withTranslation()(App) 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //  justifyContent: 'center',
        //backgroundColor: '$BackgroundColor',
        backgroundColor: 'white',
    },
    views: {
        height: 50,
        margin: 10,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 50,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    ViewsCheck: {
        marginVertical: 20,
        flexDirection: 'row-reverse',
        alignItems:'center'
      
        
    },
    TextLight: {
        // fontFamily: '$IRANYekanLight',
        fontWeight: '$WeightLight',
    },
    TextBold: {
        // fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold',
    },
    TextRegular: {
        // fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightRegular',
    },
    button: {
        borderRadius: 17,
        width: '50%',
        height: 40,
        backgroundColor: '$MainColor',
        marginTop: 5,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },

    autocomplete: {
        // position:"relative",
        height: 90,

        backgroundColor: "#ffffff",
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 20,
        zIndex: 999999999
    },
    autocompleteText: {
        zIndex: 999999999,
        // fontFamily: '$IRANYekanRegular',
        flex: 1,
        padding: 10,
        fontSize: 14
    },
    continue: {
        backgroundColor: '$MainColor',
        width: wp('95%'),
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        borderRadius: wp('2%'),
        padding: 8
    }

})
