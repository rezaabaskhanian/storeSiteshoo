/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react';
import { Platform, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

var moment = require('moment-jalaali')
const { width } = Dimensions.get('window')

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' })

import Material from 'react-native-vector-icons/MaterialIcons';
import Axios from 'axios';
import { config } from '../../../App';
import { NavigationEvents } from 'react-navigation'
import color from 'color'
import { Tab, Tabs } from 'native-base';
import BackHeader from '../component/BackHeader';


class RenderTurn extends PureComponent {
	render() {
		const { item } = this.props;
		return (

			<View style={{ backgroundColor: 'white' }} >
				<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
					<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 14 }} >اطلاعات فاکتور</Text>
				</View>

				<View style={{ paddingHorizontal: 30, paddingVertical: 10, justifyContent: 'space-between' }} >
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,1)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >شماره فاکتور :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{item.ORDER_ID}</Text>
					</View>

					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,1)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >تاریخ  :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{item.ORDER_DATE}</Text>
					</View>
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,0.5)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >هزینه ارسال  :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{config.priceFix(item.CORIER_VALUE)} تومان</Text>
					</View>
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,0.5)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >مجموع تخفیف  :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{config.priceFix(item.SUMOF_OFFER_STORE_PORTION)} تومان </Text>
					</View>
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,0.5)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >مبلغ کل :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{config.priceFix(item.TOTAL_PAYMENT)} تومان</Text>
					</View>
				</View>

			</View>
		)
	}
}

class RenderAcc extends PureComponent {

	render() {
		const { item } = this.props;
		return (
			<View style={{ backgroundColor: 'white' }} >
				<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
					<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 14 }} >اطلاعات سفارش</Text>
				</View>
				<View style={{ paddingHorizontal: 30, paddingVertical: 10, justifyContent: 'space-between' }} >
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,1)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >شماره فاکتور :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{item.TIRNOVER_ID}</Text>
					</View>

					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,1)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >تاریخ ثبت :</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{item.TRUNOVER_DATE_TIME} </Text>
					</View>
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, backgroundColor: 'rgba(222,222,222,0.5)', margin: 1 }} >
						<Text style={{ ...styles.TextBold, color: 'gray', fontSize: 12, width: 120 }} >مقدار ترکنش 	:</Text>
						<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 12 }} >{config.priceFix(item.TOTAL_VALUE)} تومان</Text>
					</View>


				</View>

			</View>
		)
	}
}

export default class App extends Component {
	state = {
		turnover: [],
		account: [],
		loading: true
	}

	async componentDidMount() {
		try {
			let turn = await Axios.get('payment/newPayment/0/0/1');
			let acc = await Axios.get('turnover/newTurnover/156914/0/0/3')
			console.log(acc.data, 'turnturn')
			this.setState({ loading: false, turnover: turn.data, account: acc.data })
		} catch (error) {
			this.setState({ loading: false })
		}

	}

	render() {
		if (this.state.loading)
			return (
				<View style={styles.container}>
					<BackHeader headerText='مدیریت مالی' />
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
						<ActivityIndicator />
					</View>
				</View>
			)
		return (
			<View style={styles.container}>
				<NavigationEvents
					onWillFocus={() => { }}
				/>
				<BackHeader headerText='مدیریت مالی' />

				<Tabs prerenderingSiblingsNumber={1} locked initialPage={0} style={{ marginTop: 10, backgroundColor: 'transparent', elevation: 0, alignItems: 'center' }} contentProps={{ nestedScrollEnabled: true }} tabContainerStyle={{ backgroundColor: StyleSheet.value('$MainColor'), width: 220, elevation: 0, borderRadius: 24, transform: [{ scaleX: -1 }] }} tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}>
					<Tab heading={'حسابداری'} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>
						{
							this.state.turnover.length == 0 ?
								<View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }} >
									<FastImage source={require('../../../assest/no_data.png')} resizeMode='contain' style={{ width, height: 200 }} />
								</View> :
								// <RenderTurn {...this.props} data={this.state.turnover} />
								<FlatList
									keyExtractor={(item, index) => index.toString()}
									data={this.state.turnover}
									style={{ marginTop: 10 }}
									contentContainerStyle={{ alignItems: 'center' }}
									renderItem={({ item }) => <RenderTurn {...this.props} item={item} />}
								/>
						}
					</Tab>
					<Tab heading={'گردش حساب'} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>
						{
							this.state.account.length == 0 ?
								<View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }} >
									<FastImage source={require('../../../assest/no_data.png')} resizeMode='contain' style={{ width, height: 200 }} />
								</View> :
								// 	<RenderAcc {...this.props} data={this.state.account} />
								<FlatList
									keyExtractor={(item, index) => index.toString()}
									data={this.state.account}
									style={{ marginTop: 10 }}
									contentContainerStyle={{ alignItems: 'center' }}
									renderItem={({ item }) => <RenderAcc {...this.props} item={item} />}
								/>
						}
					</Tab>
				</Tabs>

			</View>
		);
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
	button: {
		borderRadius: 17,
		width: 80,
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
