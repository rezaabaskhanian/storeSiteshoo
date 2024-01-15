import React, { Component } from 'react'
import {
    AsyncStorage,
    Text,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
    TextInput,
    TouchableOpacity,
    ScrollView,
     RefreshControl
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import StyleSheet from 'react-native-extended-stylesheet'
import { Accordion } from 'native-base'
import { Toast } from 'native-base'
import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'
import moment from 'moment-jalaali'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, Beep, on } from 'react-beep'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation'
import { withTranslation } from 'react-i18next';
class TimingComponent extends Component {

    state = {
        count: 0,
        address: [],
        dateTimeComplete: {},
        loading: true,
        time: '',
        days: [
            {
                id: 2,
                title: 'دو'
            },
            {
                id: 3,
                title: 'سه '
            },
            {
                id: 4,
                title: 'چها'
            },
            {
                id: 5,
                title: 'پنج '
            },
            {
                id: 6,
                title: 'جم'
            },
            {
                id: 0,
                title: 'شن'
            },
            {
                id: 1,
                title: 'یک'
            },
        ],
        // selected_day: new Map(),
        day_times: {},
        selected_day: {},
        selected_time: {},
        times: [],
        totalCourierValue: this.props.totalCourierValue,
        offerCourierValue: this.props.offerCourierValue,
        totalProductValue: this.props.totalProductValue,
        firstOrder: this.props.firstOrder,
        introduce: this.props.introduce,
        offerProductValue: this.props.offerProductValue,
        total: this.props.total,
        offer: this.props.offer,
        offerSum: this.props.offerSum,
        replace: false,
        data: this.props.data,
        // comments: new Map()
        comments: {},
        date: this.props.date,
        sendType: 0,

         ///
        shoppingCart:'',
        radioBtnsData:[],
        checkedBtn: 0,

        dateTime: '',
    };
  radioClick =(id)=>{
   this.setState({
      checkedBtn: id
    })

 }

         getModules = async () => {
            try {
               let getWallet =await Axios.get('features/get_modules')
            let shopping = getWallet.data.getModules.filter((item) => item.ID == '2022')
            this.setState({shoppingCart:shopping})


//for 30 days later
            let timeDate= getWallet.data.getModules.filter((item) => item.ID == '2033')
            this.setState({dateTime:timeDate})
            // console.log(new Date(Date.now()).toLocaleDateString(),'timeDate')

          
            }catch (e) {
              console.log(e)
            }
         
         
    }

    getTransPort=()=>{
        Axios.get('features/get_transporttype').then((data)=>{
          
            this.setState({radioBtnsData:data.data})

        
        })
    }

    async componentDidMount() {

this.getModules()
this.getTransPort()
        // this.getDetails()
        AsyncStorage.getItem('profile').then(profile => JSON.parse(profile)).then(async profile => {
            try {
                // let address =await Axios.get(`users/address/${profile.ID}`)
                let days = [], today = moment().isoWeekday()
                for (let i = 0; i < 7; i++) {
                    days.push(this.state.days[(i + today - 1) % 7])
                }
                let address = await Axios.get('users/address/')
                // console.warn(this.state.data)
                this.state.data.forEach(async element => {
                    let resWork = await Axios.get('stores/' + element.STORE_ID + '/settings/workHours')
                    let workHours = resWork.data[0], day_times = {}
                    workHours.store_hours.forEach((value) => {
                        let firstList = [], backup = [],
                            start = parseInt(value.START_TIME.replace(':', '')),
                            end = parseInt(value.END_TIME.replace(':', ''))
                        for (let i = start; i <= end; i += 100) {
                            backup.push((i / 100).toFixed(2).toString().replace('.', ':'))
                        }

                        if (parseInt(backup[backup.length - 1]) < end) {
                            if (backup.length <= 1) backup.push(value.END_TIME)
                            else backup[backup.length - 1] = value.END_TIME
                        }
                        if ((value.WEEK_DAY - 1) % 7 == today + 1) {
                            let now = moment().hour()
                            for (let i = 0; i < backup.length; i++) {
                                if (parseInt(backup[i].replace(':00', '')) <= now) {
                                    backup[i] = -1
                                }
                            }
                            backup = backup.filter((val) => val != -1)
                        }
                        for (let i = 0; i <= backup.length - 2; i++) {
                            firstList.push(backup[i] + ' to ' + backup[i + 1])
                        }

                        backup = []
                        let secondList = []

                        if (value.START_TIME2 && value.END_TIME2) {
                            let start2 = parseInt(value.START_TIME2.replace(':', '')),
                                end2 = parseInt(value.END_TIME2.replace(':', ''))
                            for (let i = start2; i <= end2; i += 100) {
                                backup.push((i / 100).toFixed(2).toString().replace('.', ':'))
                            }

                            if (parseInt(backup[backup.length - 1]) < end) {
                                if (backup.length <= 1) backup.push(value.END_TIME2)
                                else backup[backup.length - 1] = value.END_TIME2
                            }
                            if ((value.WEEK_DAY - 1) % 7 == today + 1) {
                                let now = moment().hour()
                                for (let i = 0; i < backup.length; i++) {
                                    if (parseInt(backup[i].replace(':00', '')) <= now) {
                                        backup[i] = -1
                                    }
                                }
                                backup = backup.filter((val) => val != -1)
                            }
                            for (let i = 0; i <= backup.length - 2; i++) {
                                secondList.push(backup[i] + ' to ' + backup[i + 1])
                            }
                        }

                        let times = [...firstList, ...secondList]
                        day_times = {
                            ...day_times,
                            [workHours.ID]: day_times[workHours.ID] ? [
                                ...day_times[workHours.ID], {
                                    id: (value.WEEK_DAY - 1) % 7,
                                    isHoliday: times.length == 0 ? 1 : value.HOLIDAY,
                                    times
                                }
                            ] : [{
                                id: (value.WEEK_DAY - 1) % 7,
                                isHoliday: times.length == 0 ? 1 : value.HOLIDAY,
                                times
                            }]
                        }
                    })
                    this.setState((prevState) => ({ day_times: { ...prevState.day_times, ...day_times } }))
                })
                this.setState({
                    address: address.data,
                    loading: false,
                    days,
                })
                // alert(JSON.stringify(address.data,null,5))
            } catch (error) {
                console.log('ERROR in PROFILE: ', error.response)
                this.setState({ loading: false })
            }
        }).catch(error => {
        })
    }

    getComments = () => {
        return this.state.comments
    };
    getSendType = () => {
        return this.state.sendType
    };

    getDateTimes = () => {
        let res = {};
        this.state.data.forEach((item) => {
            let todayIndex = this.state.days.findIndex((value) => {
                return value.id === this.state.selected_day[item.STORE_ID]
            });
            let selected_date = todayIndex === -1 ? -1 : moment().locale('en').add(todayIndex, 'day').format('YYYY-MM-DD')
            let selected_time = this.state.selected_time[item.STORE_ID]

            if (selected_time && selected_date)
                res = {
                    ...res,
                    [item.STORE_ID]: selected_date + ' ' + selected_time.slice(0, selected_time.indexOf(' to ')) + ':00'
                };
            else
                res = {
                    ...res,
                    [item.STORE_ID]: -1
                }
        });
        this.setState({ dateTimeComplete: res });
        return res
    };

    _renderHeader(item, expanded, dateTimeComplete) {
        return (
            <View style={{
                flexDirection: 'row-reverse',
                padding: 10,
                justifyContent: 'space-between',
                margin: 2,
                alignItems: 'center',
                backgroundColor: (dateTimeComplete && dateTimeComplete[item.STORE_ID] && dateTimeComplete[item.STORE_ID] !== -1) ? 'rgb(165,255,123)' : 'rgb(255,197,55)'
            }}>
                <Text style={{ ...styles.TextBold }}>
                    {' '}{item.store.NAME}
                </Text>
                {expanded
                    ? <Material style={{ fontSize: 18 }} name="keyboard-arrow-up" />
                    : <Material style={{ fontSize: 18 }} name="keyboard-arrow-down" />}
            </View>
        )
    }


    render() {
        return (
            <View style={{ width: '90%', alignSelf: 'center' }}>
                {/*<Accordion*/}
                {/*    style={{marginTop: 10, borderWidth: 1, borderColor: '#ddd'}}*/}
                {/*    dataArray={this.state.data}*/}
                {/*    renderHeader={(item, expanded) => this._renderHeader(item, expanded, this.state.dateTimeComplete)}*/}
                {/*    renderContent={item => {*/}
                {/*        */}
                {/*    }}*/}
                {/*/>*/}
              

                {this.state.data && this.state.data.length > 0 && this.state.data.map(item => {
                    let todayIndex = this.state.days.findIndex((value) => value.id === this.state.selected_day[item.STORE_ID])
                    let selected_date = todayIndex == -1 ? '' : todayIndex == 0 ? 'today' : moment().add(todayIndex, 'day').format('jYYYY-jMM-jDD')
                    let total_order = item.order_products.reduce((acc, cur) => cur ? acc + cur.PRICE * cur.COUNT : cur, 0)
                    let cur_price = item.item.CORIER_VALUE;
                    let offerCourierValue = item.OFFER_COURIER_SUM;
                    let offerProductValue = item.OFFER_PRODUCT_SUM;
                    let total_offer = offerCourierValue + offerProductValue;
               
                    let total_price = item.order_products.reduce((acc, cur) => cur ? acc + cur.PRICE_AFTER_OFFER * cur.COUNT : cur, 0) + cur_price 
                    return (
                        <View style={{ backgroundColor: 'white' }}>

                            <View style={{ height: 120, width: '100%', backgroundColor: 'gray' }}>
                           
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgb(255,255,255)'
                                }}>
                                     
                                    

                                    <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}> نحوه سفارش</Text>
                                        
                                    <Text style={[styles.TextRegular, {
                                        color: 'gray',
                                        fontSize: 14
                                    }]}> {this.state.shoppingCart  == [] ?`${config.priceFix(cur_price)} تومان ` : ` بر عهده مشتری `} </Text>

                                    
                                </View>
                                
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgba(235,235,235,1)',
                                    
                                }}>
                                    <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>جمع سفارشات</Text>
                                    <Text style={[styles.TextRegular, {
                                        color: 'gray',
                                        fontSize: 14
                                    }]}> {config.priceFix(total_order)} تومان</Text>
                                </View>

              
                  <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgb(255,255,255)'
                                }}>
                                    <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموعه تخفیفات</Text>
                                    <Text style={[styles.TextRegular, {
                                        color: 'gray',
                                        fontSize: 14
                                    }]}> {config.priceFix(offerCourierValue)}تومان</Text>
                                </View>
                

                              
                                {offerProductValue > 0 &&  <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgba(235,235,235,1)'
                                }}>
                                    <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموع تخفیفات محصولات</Text>
                                    <Text style={[styles.TextRegular, {
                                        color: 'gray',
                                        fontSize: 14
                                    }]}> {config.priceFix(offerProductValue)} تومان</Text>
                                </View>}


                                {total_offer > 0   && <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgb(255,255,255)'
                                }}>
                                    <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>تخفیف کل </Text>
                                    <Text style={[styles.TextRegular, {
                                        color: 'gray',
                                        fontSize: 14
                                    }]}> {config.priceFix(total_offer)} تومان</Text>
                                </View>}

                                <View style={{
                                    flexDirection: 'row-reverse',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgba(221,255,193,0.85)'
                                }}>
                                    <Text style={[styles.TextBold, { color: 'black', fontSize: 14 }]}> مجموع </Text>
                                    <Text style={[styles.TextBold, {
                                        color: 'black',
                                        fontSize: 14
                                    }]}>  { config.priceFix(total_price) } تومان</Text>
                                </View>
                            </View>
                            <View>



               
                                <View style={{
                                    // flexDirection: 'row-reverse',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 18
                                }}>
                                  
                                    <View style={{
                                        height: 50,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}>نحوه ارسال</Text>
                                             
                                    </View>                                   
                                    {//, 'تحویل در محل'
                                          
                                          
                                      this.state.shoppingCart == [] ? 

                                        ['Send by courier'].map((item, index) => {
                                            return (
                                                <View key={index.toString()} style={{
                                                    flexDirection: 'row-reverse',
                                                    alignItems: 'center',
                                                }}>
                                                    <TouchableWithoutFeedback
                                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                                        onPress={() => this.setState({ sendType: index })}
                                                    >
                                                        <View style={{ width: 22, height: 25 }}>
                                                            {
                                                                this.state.sendType === index ?
                                                                    <View style={{
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Material name='check-circle' size={20}
                                                                            color={StyleSheet.value('$MainColor')} />
                                                                    </View> :
                                                                    <Material name='check-circle' size={20}
                                                                        color='rgb(220,220,220)' />
                                                            }
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                    <Text style={[styles.TextRegular, {
                                                        color: 'black',
                                                        fontSize: 12,
                                                    }]}>{item}</Text>

                                                </View>
                                            )
                                        })

                                        :  
                                        // null
                                     
                                        
            this.state.radioBtnsData.map((data) => {
    return (

<View key={data.ID} style={{flexDirection: 'row-reverse',justifyContent: 'space-between',}}>
  <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12 }}>
            {data.TRANSPORT}
            </Text>
 <TouchableOpacity key={data.ID} onPress= { ()=> this.radioClick(data.ID)} >
 
       <View style={{
              height: 24,
              marginTop:5,
              width: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}> 
              {
                data.ID == this.state.checkedBtn ?
                  <View style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#43b02a',
                
                  }} />

                  
                  : null
              }
      </View>
          </TouchableOpacity>
</View>

     
    )
})

                                    }
                                                    
                                </View>

                {

                    // console.log(this.state.dateTime.ID,'this.state.dateTime.ID')
                     this.state.dateTime.length == 0 ? 
                     
                    <>
                     <View style={{
                        height: 50,
                        justifyContent: 'space-between',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        paddingHorizontal: 18
                    }}>
                        <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}>انتخاب روز </Text>
                        <Text style={{
                            ...styles.TextBold,
                            color: StyleSheet.value('$MainColor'),
                            fontSize: 16
                        }}>
                            {selected_date}
                        </Text>
                    </View> 
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {
                                       
                                        this.state.days.map((day, dayIndex) => {
                                            // let checked = this.state.selected_day.get(item.store.ID) == dayIndex
                                            let checked = this.state.selected_day[item.STORE_ID] === day.id
                                            let foundTime = this.state.day_times[item.STORE_ID] ?
                                                this.state.day_times[item.STORE_ID].filter((value) => value.isHoliday == 0).findIndex((value) => value.id == day.id) :
                                                -1
                                            return (
                                                foundTime == -1 ?
                                                    <View style={{
                                                        backgroundColor: 'red',
                                                        opacity: 0.3,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 10,
                                                        width: 40,
                                                        margin: 2
                                                    }}>
                                                        <Text style={[styles.TextRegular, {
                                                            color: checked ? 'white' : 'black',
                                                            fontSize: 12
                                                        }]}>{day.title}</Text>
                                                    </View> :
                                                    <TouchableWithoutFeedback
                                                        key={dayIndex.toString()}
                                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                                        onPress={() => this.setState(
                                                            (prevState) => ({
                                                                selected_time: {
                                                                    ...this.state.selected_time,
                                                                    [item.STORE_ID]: 0
                                                                },
                                                                selected_day: {
                                                                    ...prevState.selected_day,
                                                                    [item.STORE_ID]: day.id
                                                                }
                                                            })
                                                        )}
                                                    >
                                                        <View style={{
                                                            backgroundColor: checked ? StyleSheet.value('$MainColor') : 'rgb(230,230,230)',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: 10,
                                                            width: 40,
                                                            margin: 2
                                                        }}>

                                                            <Text style={[styles.TextRegular, {
                                                                color: checked ? 'white' : 'black',
                                                                fontSize: 12
                                                            }]}>{day.title}</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                            )
                                        })
                                    }
                                </View> 
                                </>
                            :
                            null
                        }
                            </View>
                        
                            <View>
    
                                {
                                  
                                    (!(this.state.day_times[item.STORE_ID] === undefined) &&
                                        !(this.state.selected_day[item.STORE_ID] === undefined) &&
                                        !(this.state.day_times[item.STORE_ID].filter(item => item.id === this.state.selected_day[item.STORE_ID]).length > 0)) &&
                                    <>

                                        <View style={{
                                            height: 50,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            paddingHorizontal: 18
                                        }}>
                                            <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}>انتخاب زمان </Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row-reverse',
                                            width: '90%',
                                            alignSelf: 'center',
                                            marginVertical: 5,
                                            height: 45,
                                            borderWidth: 1,
                                            borderColor: StyleSheet.value('$MainColor'),
                                            borderRadius: 5
                                        }}>
                                            <Picker
                                                onValueChange={(value) => {

                                                    this.setState((prevState) => ({
                                                        selected_time: {
                                                            ...prevState.selected_time,
                                                            [item.STORE_ID]: value
                                                        }
                                                    }))

                                                    //														alert(JSON.stringify(value, null, 5))
                                                    let selected_date1 = todayIndex === -1 ? '' : moment().add(todayIndex, 'day')
                                                    let dateToServer = new Date(selected_date1).toISOString();
                                                    let changeDateToTime = dateToServer.split('T')[1];
                                                    if (value === 0) {
                                                        this.state.day_times[item.STORE_ID].filter((val) => {
                                                            if (this.state.selected_day[item.STORE_ID] === val.id) {
                                                                value = val.times[0]
                                                            }
                                                        })
                                                    }
                                                    var time = value.split(' ')[0];
                                                    if (value.split(' ')[0].split(':')[0] < 10) {
                                                        time = '0' + value.split(' ')[0]
                                                    }
                                                    changeDateToTime = dateToServer.split('T')[0] + 'T' + time + changeDateToTime.slice(5)
                                                    let orderIdList = [];
                                                    let orderObjectList = [];
                                                    let orderId = item.ID;
                                                    for (let item of this.props.data) {
                                                        if (orderId === item.ID) {
                                                            orderObjectList.push({
                                                                ID: item.ID,
                                                                ORDER_DELIVERY_DATE: changeDateToTime
                                                            });
                                                            orderIdList.push(item.ID)
                                                        }
                                                    }
                                                    Axios.put('order/ChangeTimeApp', { ORDER: orderObjectList ,TRANSPORT_ID : this.state.checkedBtn ,TRANSPORT_DESCRIPTION:this.state.comments }).then(res2 => {
                                                        Axios.put('order/getOrderAndCourierValue', { ORDER: orderIdList }).then(res3 => {
                                                            let data = this.props.data;
                                                            for (let item of res3.data) {
                                                                for (let sub of data) {
                                                                    if (item.ID === sub.ID) {
                                                                        sub.item.CORIER_VALUE = item.CORIER_VALUE;
                                                                    }
                                                                }
                                                            }
                                                            this.props.setData(data)
                                                        }).catch(err => {
                                                            console.log(err)
                                                            return Toast.show({
                                                                text: 'There is a problem communicating with the server',
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
                                                        })
                                                    }).catch(err => {
                                                        console.log(2, err)
                                                        return Toast.show({
                                                            text: 'There is a problem communicating with the server',
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
                                                    })
                                                    //														alert(changeDateToTime)
                                                }}
                                                selectedValue={
                                                    this.state.selected_time[item.STORE_ID] ?
                                                        this.state.selected_time[item.STORE_ID] :
                                                        0
                                                }
                                                style={{ width: '100%' }}
                                                mode='dropdown'
                                            >
                                                <Picker.Item label='یک بازه زمانی انتخاب کنید' key={0} value={0} />
                                                
                                                {
                                                  
                                                    this.state.day_times[item.STORE_ID].filter((val) => this.state.selected_day[item.STORE_ID] == val.id)[0].times
                                                        .filter(item =>!item.includes("0:00 ") && todayIndex != 0 ? true : item.split('to')[0].split(':')[0]  > new Date().getHours() )
                                                        .map((value, index) => (
                                                            <Picker.Item label={value} key={index + 1}
                                                                value={value} />
                                                        ))
                                                }
                                            </Picker>
                                        </View>
                                    </>
                                    
                                }

                            </View>
                            <View style={{
                                height: 50,
                                justifyContent: 'space-between',
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                paddingHorizontal: 18
                            }}>
                                <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}>جزییات</Text>
                            </View>
                            <TextInput
                                value={this.state.comments[item.store.ID]}
                                onChangeText={text => {
                                    this.setState(state => ({
                                        comments: {
                                            ...state.comments,
                                            [item.store.ID]: text
                                        }
                                    }))
                                }}
                                placeholder='توضیحات خود را اینجا وارد کنید' style={{
                                    ...styles.TextRegular,
                                    width: '90%',
                                    alignSelf: 'center',
                                    marginVertical: 5,
                                    height: 45,
                                    borderWidth: 1,
                                    borderColor: StyleSheet.value('$MainColor'),
                                    borderRadius: 5
                                }} />

                            {/* <Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 14, paddingHorizontal: 10 }} >{LORM}</Text> */}

                        </View>
                    )
                })}
                <View style={{
                    height: 50,
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',
                    alignItems: 'center'
                }}>
                    <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}> فاکتور</Text>
                </View>
                <View
                    style={{ height: 170, width: '100%', backgroundColor: 'grey', borderColor: 'black', borderWidth: 1 }}>
                   

                    {this.state.shoppingCart  == [] ? 

                    <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgb(255,255,255)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>کل هزینه حمل و نقل</Text>
                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14,
                        }]}> {config.priceFix(this.props.totalCourierValue)} تومان</Text>
                    </View>
                    :null
                    }

                    {this.props.offerCourierValue > 0 && <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgba(235,235,235,1)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموع تخفیف حمل و نقل</Text>

                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.offerCourierValue)} تومان</Text>
                    </View>}


                    <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgb(255,255,255)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>قیمت کل کالاها</Text>

                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.totalProductValue)} تومان</Text>
                    </View>
                    {this.props.offerProductValue > 0 && <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgba(235,235,235,1)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>تخفیف کل محصول</Text>

                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.offerProductValue)} تومان</Text>
                    </View>}

                    {this.state.firstOrder > 0 && <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgba(235,235,235,1)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>تخفیف کلی برای اولین سفارش</Text>

                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.firstOrder)} تومان</Text>
                    </View>}
                    {this.state.introduce > 0 && <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgba(235,235,235,1)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموع تخفیف عودت داده شده </Text>

                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.introduce)} تومان</Text>
                    </View>}
                    {this.props.offerValue > 0 && <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgb(255,255,255)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموع تخفیف فاکتور</Text>
                        <Text style={[styles.TextRegular, {
                            color: 'gray',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.offerValue)} تومان</Text>
                    </View>}

                    <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgb(255,255,255)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]}>مجموع تخفیفات</Text>
                        <Text style={[styles.TextRegular, {
                            color: 'black',
                            fontSize: 14
                        }]}> {config.priceFix(this.props.offer)} تومان</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row-reverse',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        backgroundColor: 'rgba(221,255,193,0.85)'
                    }}>
                        <Text style={[styles.TextRegular, { color: 'black', fontSize: 16 }]}>مجموع</Text>

                        <Text style={[styles.TextBold, {
                            color: 'black',
                            fontSize: 16
                        }]}> {config.priceFix(this.props.total)} تومان</Text>
                    </View>
                </View>

            </View>
        )
    }


}

class App extends Beep(BeepProp, Component) {

    state = {
        orderTime: 0,
        loading: true,
        data: [],
        lazy: false,
        address: [],
        code: '',
        offerValue: 0,
        date: new Date().getTime(),
        totalCourierValue: 0,
        offerCourierValue: 0,
        totalProductValue: 0,
        firstOrder: 0,
        introduce: 0,
        offerProductValue: 0,
        total: 0,
        offer: 0,
        offerSum: {},
        selected: 0,

       
    }


    updateCartCount() {
        Axios.get('order/OrderProductCounter').then((response) => {
            store.cart_count = response.data[0].COUNTER
        }).catch((error) => {
            console.log('add errror', error)
        })
    }




    async confirm() {

        if (this.state.address == '') {
            Toast.show({
                text: 'لطفا یه آدرس ثبت کنید',
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
        else {
            let times = this.TimingComponent.getDateTimes();
            this.setState({ lazy: true });
            let comments = this.TimingComponent.getComments();
            let sendType = this.TimingComponent.getSendType();
            //for selected time
            if(this.state.dateTime ==[]){
                for (let STORE_ID of Object.keys(times)) {
                    if (times[STORE_ID] === -1) {
                        Toast.show({ text: 'لطفا زمان تحویل صحیح را انتخاب کنید.', type: 'danger' })
                        this.setState({ lazy: false });
                        return
                    }
                }
            }
           
            let orderData = [];
            //next one mounth
            const formatDate = (date) => (date.toISOString().split('T')[0]);
            const currentDate = new Date();
            const currentDateInMs = currentDate.valueOf();
            const ThirtyDaysInMs = 1000 * 60 * 60 * 24 * 30;
            const calculatedDate = new Date(currentDateInMs + ThirtyDaysInMs);
            console.log(formatDate(calculatedDate),'calculatedDate')

            for (let order of this.state.data) {
                let products = []
                for (let item of order.order_products) {
                    products.push({
                        'PRODUCT_ID': item.product_store.PRODUCT_ID,
                        'COUNT': item.COUNT,
                        'DESCRIPTION': item.DESCRIPTION,
                    })
                }
                orderData.push({
                    'ID': order.ID,
                    'ORDER_DELIVERY_DATE': this.state.dateTime==[] ?  times[order.STORE_ID]: formatDate(calculatedDate),
                //  'ORDER_DELIVERY_DATE': times[order.STORE_ID],
                    // 'ORDER_DELIVERY_TYPE_ID': sendType + 1,
                    // 'ORDER_DELIVERY_DATE': '2022/03/15' ,
                    // 'ORDER_DELIVERY_TYPE_ID': 1,
                    'PRODUCTS': products,
                    'COMMENT': comments[order.STORE_ID] ? comments[order.STORE_ID] : ' '
                })
            }
            try {
                await Axios.put('order/customerAccept', {
                    'CUSTOMER_ADDR_ID': this.state.address[this.state.selected].ID,
                    'ORDERS': orderData,
                    'OFFER_CODE': (store.code.length > 0) ? store.code : null
                }).then((data) => {
                    // console.log(data, 'saeeid')
                    store.cart_count = 0;
                    store.cart = {}
                })

            } catch (error) {
                this.setState({ lazy: false })
                return Toast.show({
                    text: 'مشکلی در برقراری ارتباط با سرور وجود دارد',
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
            store.cart_count = 0;
            store.cart = {}

            this.setState({ lazy: false })
            Toast.show({
                text: 'سفارشات شما با موفقیت انجام شد',
                type: 'success',
                buttonText: 'Ok',
                buttonStyle: {
                    borderColor: 'white',
                    borderWidth: 1,
                    margin: 5,
                    borderRadius: 7
                },
                textStyle: { ...styles.TextRegular, fontSize: 14 }
            });
            if (this.state.data.length === 1) {
                store.code = '';
                store.offerValue = 0;
                let order = Object.assign({}, this.state.data[0])
                order['ORDER_ID'] = order.ID
                this.props.navigation.navigate('Cart')
                this.props.navigation.navigate('OrderDetail', { item: this.state.data[0] })
            } else {
                store.code = '';
                store.offerValue = 0;
                this.props.navigation.navigate('Cart')
                this.props.navigation.navigate('OrderHistory')

            }
        }
    }

   

    async componentDidMount() {
                  

        try {
            this.setState({ loading: true });
            let rawData = this.props.navigation.getParam('items', []);
            // console.log('rawData', rawData)

            let code = this.props.navigation.getParam('code', '');
            let offerValue = this.props.navigation.getParam('offerValue', 0);
            let offerSum = this.props.navigation.getParam('offerSum', {});
            let address = await Axios.get('users/address/');
            if (address.data.length === 0) {
                Toast.show({
                    text: 'لطفا قبل از ادامه ارسال سفارش آدرس خود را ثبت کنید!',
                    type: 'warning',
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
            await this.setState({
                data: rawData,
                address: address.data,
                loading: false,
                code,
                offerValue: offerValue ? offerValue : 0,
                offerSum: offerSum
            })
            this.getDetails(rawData);
        } catch (error) {
            this.setState({ loading: false })
        }
    }


    async fetchData() {
        let self = this;
        let rawData = self.props.navigation.getParam('items', []);
        let code = self.props.navigation.getParam('code', '');
        let offerValue = self.props.navigation.getParam('offerValue', 0);
        let offerSum = self.props.navigation.getParam('offerSum', {});

        let address = await Axios.get('users/address/');
        // console.warn(address.data)
        let profile = await AsyncStorage.getItem('profile');
        if (address.data.length === 0) {
            Toast.show({
                text: 'لطفا یک آدرس اضافه کنید ',
                type: 'warning',
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
        await self.setState({
            data: rawData,
            address: address.data,
            loading: false,
            code,
            offerValue: offerValue ? offerValue : 0,
            offerSum: offerSum
        })
        this.getDetails(rawData)

    }

    changeAddress(index) {
        this.setState({ selected: index })
        let orderIdList = [];
        for (let item of this.state.data) {
            orderIdList.push(item.ID);
        }

        Axios.put('users/address/' + this.state.address[index].ID, { SELECTED: 1 }).then(res1 => {
            Axios.put('order/ChangeAddress', { ORDER: orderIdList }).then(res2 => {
                Axios.put('order/getOrderAndCourierValue', { ORDER: orderIdList }).then(async res3 => {
                    let data = this.state.data;
                    for (let item of res3.data) {
                        for (let sub of data) {
                            if (item.ID === sub.ID) {
                                sub.item.CORIER_VALUE = item.CORIER_VALUE;
                            }
                        }
                    }
                    await this.setState({
                        data: data,
                        date: new Date().getTime()
                    })
                    this.getDetails(data)
                }).catch(err => {
                    alert(JSON.stringify(err, null, 4))
                })
            }).catch(err => {
                alert(JSON.stringify(err, null, 4))
            })
        }).catch(err => {
            alert(JSON.stringify(err, null, 4))
        })


    }

    getDetails(data) {
        let totalCourierValue = 0;
        let totalProductValue = 0;
        let offerCourierValue = 0;
        let offerProductValue = 0;
        let offerInvoiceValue = 0;
        let total = 0;
        let offer = 0;
        let offerValue = this.state.offerValue ? this.state.offerValue : 0

        let offerSum = this.state.offerSum ? this.state.offerSum : undefined


        for (let item of data) {
            totalCourierValue += item.item.CORIER_VALUE;
            totalProductValue += item.ORDER_VALUE_WITHOUT_COURIER;
            // totalProductValue += item.ORDER_SUM_VA_BEF_OFE_PRO;
            total += (item.ORDER_VALUE_WITHOUT_COURIER + item.item.CORIER_VALUE);
            offerCourierValue += item.OFFER_COURIER_SUM;
            offerInvoiceValue += item.OFFER_INVOICE_SUM;
            offerProductValue += item.OFFER_PRODUCT_SUM;
        }
        offer = offerInvoiceValue + offerValue + offerCourierValue + offerProductValue;
        if (offerSum && offerSum.SUM) {
            offer += offerSum.SUM
            total -= offerSum.SUM
        }
        total -= offerValue;

        this.setState({
            totalCourierValue: totalCourierValue,
            offerCourierValue: offerCourierValue,
            totalProductValue: totalProductValue,
            offerProductValue: offerProductValue,
            firstOrder: offerSum ? offerSum.FIRST_ORDER : 0,
            introduce: offerSum ? offerSum.INTRODUCE : 0,
            total: total,
            offer: offer
        })
    }


    render() {
        const {t} =this.props
        if (this.state.loading)
            return (
                <View style={styles.container}>
                    <View style={[styles.header, { height: 60, justifyContent: 'center', backgroundColor: 'white' }]}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.goBack()}
                            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        >
                            <Material name='arrow-forward'
                                style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }}
                                size={30} />
                        </TouchableWithoutFeedback>
                        <Text style={{
                            ...styles.TextBold,
                            color: 'black',
                            fontSize: 18,
                            textAlign: 'center',
                            alignSelf: 'center',
                            position: 'absolute'
                        }}>{t('cart')}</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        return (
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.container}>
                    <NavigationEvents
                    onDidFocus={() =>
                        this.fetchData()
                 }
                />
                <View
                    style={[
                        styles.header,
                        { height: 60, justifyContent: 'center' }
                    ]}
                >
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.goBack()}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    >
                        <Material
                            name="arrow-forward"
                            style={{
                                alignSelf: 'flex-end',
                                color: StyleSheet.value('$MainColor')
                            }}
                            size={30}
                        />
                    </TouchableWithoutFeedback>
                    <Text
                        style={{
                            ...styles.TextBold,
                            color: 'black',
                            fontSize: 18,
                            textAlign: 'center',
                            alignSelf: 'center',
                            position: 'absolute'
                        }}
                    >
                        {t('cart')}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View
                        style={{
                            width: '100%',
                            alignSelf: 'center',
                            height: 1,
                            backgroundColor: 'gray',

                        }}
                    />
                    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this.fetchData()}
                                refreshing={this.state.loading}
                            />
                        }>
                        <View style={{ width: '90%', alignSelf: 'center' }}>
                            <View style={{
                                height: 50,
                                justifyContent: 'space-between',
                                flexDirection: 'row-reverse',
                                alignItems: 'center'
                            }}>
                                <Text style={{ ...styles.TextBold, color: 'gray', fontSize: 16 }}> {t('choose-address')}</Text>
                            </View>
                            {
                                this.state.loading ? <ActivityIndicator /> :
                                    this.state.address.map((item, index) => {
                                        return (
                                            <View key={index.toString()} style={{
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                padding: 5
                                            }}>
                                                <TouchableWithoutFeedback
                                                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                                    onPress={() => this.changeAddress(index)}
                                                >
                                                    <View style={{ width: 22, height: 25 }}>
                                                        {
                                                            this.state.selected === index ?
                                                                <View style={{
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Material name='check-circle' size={20}
                                                                        color={StyleSheet.value('$MainColor')} />
                                                                </View> :
                                                                <Material name='check-circle' size={20}
                                                                    color='rgb(220,220,220)' />
                                                        }
                                                    </View>
                                                </TouchableWithoutFeedback>
                                                <Text style={[styles.TextRegular, {
                                                    color: 'black',
                                                    fontSize: 12,
                                                    marginHorizontal: 10
                                                }]}>{item.NAME} - {item.ADDRESS}</Text>

                                            </View>
                                        )
                                    })
                            }
                        </View>


                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('AddDetailAddress',{route:'addDetail'})
                        }}
                            style={{
                                backgroundColor: '#e1ffe4',
                                padding: 9,
                                width: wp('90'),
                                marginLeft: wp('5%'),
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={styles.saveAddress}>
                                {t('add-new-address')}
                            </Text>
                        </TouchableOpacity>
                        {/* <Text style={styles.timeSelect}>
                            لطفا از کادرهای زیر زمان ارسال محصولات را انتخاب نمایید !
                        </Text> */}
                        <TimingComponent data={this.state.data} date={this.state.date} setData={(data) => {
                            let tempData = Object.assign([], this.state.data)
                            for (let item of tempData) {
                                for (let sub of data) {
                                    if (item.ID === sub.ID) {
                                        item = sub;
                                    }
                                }
                            }
                            this.setState({ data: tempData })
                            this.getDetails(tempData);
                        }} code={this.state.code} offerValue={this.state.offerValue}
                            ref={(ref) => this.TimingComponent = ref}
                            totalCourierValue={this.state.totalCourierValue}
                            offerCourierValue={this.state.offerCourierValue}
                            totalProductValue={this.state.totalProductValue}
                            offerProductValue={this.state.offerProductValue}
                            firstOrder={this.state.offerSum ? this.state.offerSum.FIRST_ORDER : 0}
                            introduce={this.state.offerSum ? this.state.offerSum.INTRODUCE : 0}
                            total={this.state.total}
                            offer={this.state.offer}
                            offerSum={this.state.offerSum} />
                    </ScrollView>
                </View>

                <TouchableWithoutFeedback
                    disabled={this.state.lazy}
                    onPress={async () => this.confirm()}
                >
                    {this.state.lazy ? (
                        <View
                            style={{
                                ...styles.button,
                                position: 'absolute',
                                bottom: 10,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 'auto',
                                padding: 5
                            }}
                        >
                            <ActivityIndicator color="white" />
                        </View>
                    ) : (
                        <View
                            style={{
                                ...styles.continue,
                                position: 'absolute',
                                bottom: 10,
                                alignSelf: 'center',
                                padding: 8,
                                width: wp('95'),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={[styles.TextBold, { color: 'white', fontSize: 14 }]}>
                    {t('send-order')}
                            </Text>
                        </View>
                    )}
                </TouchableWithoutFeedback>
            </ScrollView>
        )
    }
}

export default  withTranslation()(App)

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
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    saveAddress: {
        color: '#43b02a', textAlign: 'center',
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    button: {
        borderRadius: 17,
        width: 200,
        height: 30,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    continue: {
        backgroundColor: '$MainColor',
        width: wp('95%'),
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        borderRadius: wp('2%'),
        padding: 8
    },
    timeSelect: {
        marginTop: hp('2%'),
        backgroundColor: '#ffafaf',
        padding: wp('2%'),
        width: wp('90%'),
        justifyContent: 'flex-end',
        marginLeft: wp('4.5%'),
         fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular',
        borderRadius: wp('2%')
    }
})
