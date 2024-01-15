/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react'
import { Platform, Text, View, Animated, Dimensions, ActivityIndicator, ScrollView, TouchableWithoutFeedback, FlatList } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'



class RenderItem extends PureComponent {
	state = {
		routes: [...this.props.navigation.getParam('Route', []), 'دسته بندی ها']
	}
	render() {
		const { item, index } = this.props
		return (

			<TouchableWithoutFeedback
				onPress={() => {
					// item.PRODUCT_PARENT_ID == 58 ?
					// 	this.props.navigation.push('StoreCategory', { ID: item.PRODUCT_ID, NAME: item.NAME })
					// 	:
					item.LEAF === 1 ?
						this.props.navigation.push('StoreProducts', {
							item,
							Route: this.state.routes
						}) :
						this.props.navigation.push('ProductSubCats', {
							item,
							PRODUCT_ID: item.PRODUCT_ID,
							headerText: item.NAME,
							Route: this.state.routes
						})
				}} >


				<View style={
					[
						{ backgroundColor: 'white', height: 100, flex: 1, margin: 5, borderRadius: 5, elevation: 2 },
						index % 2 === 0 ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
					]
				}>


					<FastImage
						// source={{ uri: config.BaseUrl + '/assets/img/categories/category_logo/' + item.LOGO }}
						source={item.CATEGORY_LOGO !== null ? { uri: config.ImageBaners + config.CategorySubUrl + item.CATEGORY_LOGO }
							: { uri: config.ImageBaners + '/assets/img/category_logo/general-category-logo.png' }}
						resizeMode='cover'
						style={[{ height: 100, width: 100 }, ]}
					/>
					<View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }} >
						<Text style={[styles.TextBold, { color: 'black', textAlign: 'center', fontSize: 12 }]} >
							{item.NAME}
						</Text>
						<Text style={[styles.TextRegular, { color: 'black', textAlign: 'center', fontSize: 12 }]} >
							{item.DESCRIPTION}
						</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

export default class App extends Component {

	state = {
		scrollY: new Animated.Value(0),
		data: [],
		loading: true,
		like: false,
		count: 0
	}

	componentDidMount() {
		this.fetchMainCategories()
	}

	fetchMainCategories = async () => {
		try {
			let cats = await Axios.get(`stores/${this.props.navigation.state.params.ID}/StoreCategories`)
			this.setState({ data: cats.data, loading: false })
		} catch (error) {
			console.log(error, error.response)
			this.setState({ loading: false })
		}
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
						<ActivityIndicator />
					</View>
				</View>
			)
		}
		return (
			<View style={styles.container}>
				<View style={[styles.header, { height: 60, justifyContent: 'center', backgroundColor: 'white' }]} >
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: 'black' }} size={30} />
					</TouchableWithoutFeedback>
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >{this.props.navigation.state.params.NAME}</Text>
				</View>
				<FlatList
					data={this.state.data}
					renderItem={({ item, index }) => <RenderItem {...this.props} item={item} index={index} />}
				/>
			</View>
		)
	}
}
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
	header: {
		top: 0,
		left: 0,
		right: 0,
		overflow: 'hidden',
		elevation: 2
	},
})
