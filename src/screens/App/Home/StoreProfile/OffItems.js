import React, { PureComponent } from 'react'
import { Text, View, ImageBackground, ScrollView, FlatList } from 'react-native'
import StyleSheet, { value } from 'react-native-extended-stylesheet'
import FastImage from 'react-native-fast-image'
import { config } from '../../../../App'

export default class OffItems extends React.Component {
	state = {
		data: this.props.data,
	}
	shouldComponentUpdate(nextProps, nextState){
		return false
	}
	renderItem = ({ item, key }) => {
		return (
			<ItemOfOffer data={item} key = {key}/>
		)
	}
	keyExtractor = (item, index) => item.ID.toString()
	render() {
		console.log(this.props.data)
		return (
			// <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
			// 	{
			// 		this.state.data.map((value) => this.renderItem({item: value, key: value.ID}))
			// 	}
			// </ScrollView>
			<FlatList
				data={this.state.data}
				horizontal
				inverted
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				showsHorizontalScrollIndicator = {false}
				// windowSize={10}
				// onEndReachedThreshold={0.05}
			/>
		)
	}
}

class ItemOfOffer extends React.Component {
	shouldComponentUpdate() {
		return false
	}
	render() {
		const props = this.props.data

		return (
			// <View
			// 	style={{
			// 		width: 200,
			// 		height: 100,
			// 		backgroundColor: 'white',
			// 		margin: 5,
			// 		borderRadius: 7,
			// 		elevation: 2,
			// 		flexDirection: 'row-reverse',
			// 		justifyContent: 'space-between',
			// 		alignItems: 'center'
			// 	}}
			// >
			<ImageBackground
				source = {require('../../../../assest/offerBG.jpg')}
				style={{
					width: 200,
					height: 100,
					// backgroundColor: 'white',
					margin: 5,
					elevation: 4,
					flexDirection: 'row-reverse',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
				imageStyle = {{
					borderRadius: 7,
				}}
			>
				<View style={{ flex: 1, height: '100%', padding: 10 }}>
					<Text
						style={{
							...styles.TextBold,
							textAlign: 'left',
							fontSize: 12
						}}
					>
						{props.offer.NAME}
					</Text>
					<Text style={{ ...styles.TextRegular, fontSize: 10 }}>
						{props.offer.DETAILS}
					</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						padding: 10
					}}
				>
					<FastImage
						resizeMode="cover"
						source={props.offer.OFFER_IMAGE ? { uri: config.BaseUrl + props.offer.OFFER_IMAGE } : require('../../../../assest/no_data.png')}
						style={{ height: 50, width: 50 }}
					/>
				</View>
			</ImageBackground>
			// </View>
		)
	}
}

// const ItemOfOffer = (props) => (
// 	<View
// 		style={{
// 			width: 200,
// 			height: 100,
// 			backgroundColor: 'white',
// 			margin: 5,
// 			borderRadius: 7,
// 			elevation: 2,
// 			flexDirection: 'row-reverse',
// 			justifyContent: 'space-between',
// 			alignItems: 'center'
// 		}}
// 	>
// 		<View style={{ flex: 1, height: '100%', padding: 10 }}>
// 			<Text
// 				style={{
// 					...styles.TextBold,
// 					textAlign: 'left',
// 					fontSize: 12
// 				}}
// 			>
// 				{props.offer.NAME}
// 			</Text>
// 			<Text style={{ ...styles.TextRegular, fontSize: 10 }}>
// 				{props.offer.DETAILS}
// 			</Text>
// 		</View>
// 		<View
// 			style={{
// 				justifyContent: 'center',
// 				alignItems: 'center',
// 				padding: 10
// 			}}
// 		>
// 			<FastImage
// 				resizeMode="cover"
// 				source={props.offer.OFFER_IMAGE ? { uri: config.BaseUrl + props.offer.OFFER_IMAGE } : require('../../../../assest/no_data.png')}
// 				style={{ height: 50, width: 50 }}
// 			/>
// 		</View>
// 	</View>
// )

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
	button: {
		borderRadius: 17,
		padding: 10,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		overflow: 'hidden',
		elevation: 2
	},
	triangle: {
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: 30,
		borderTopWidth: 30,
		borderLeftColor: 'transparent',
		borderTopColor: 'purple',
		transform: [{ rotate: '0deg' }]
	}
})
