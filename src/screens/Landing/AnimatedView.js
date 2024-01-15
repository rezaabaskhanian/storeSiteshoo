import React, { Component } from 'react'
import { Text, View, Dimensions, Animated, Easing } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'

import FastImage from 'react-native-fast-image'

import ScrollingBackground from './ScrollingBackground'
import { config } from "../../App";

const { width } = Dimensions.get('window')
import { state as store } from "react-beep";

export default class AnimatedView extends Component {
	state = {
		actice: 1,
		time: 45,
		animation: new Animated.Value(1),
		textWidth: new Animated.Value(0)
	}

	componentDidMount() {
		this.setTo1(600, () => this.setTextToShow(() => this.setTo0(150, () => this.setTo1(150, () => { }))))
	}

	setTextToShow = (callBack) => {
		Animated.timing(this.state.textWidth, {
			duration: 600,
			toValue: Dimensions.get('window').width * 0.7,
			useNativeDriver: true ,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(callBack)
	}

	setTo0 = (duration, callBack) => {
		Animated.timing(this.state.animation, {
			duration: duration,
			toValue: 0.1,
			useNativeDriver: true ,
			easing: Easing.linear,
			useNativeDriver: true,
			
		}).start(callBack)
	}

	setTo1 = (duration, callBack) => {
		Animated.timing(this.state.animation, {
			duration: duration,
			toValue: 1,
			useNativeDriver: true ,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(callBack)
	}

	render() {
		return (
			<View>
				<Animated.Image
					style={{
						opacity: this.state.animation,
						width: 300, height: 150, marginTop: 130, zIndex: 3, alignSelf: 'center'
					}}

					source={store.setting ? { uri: config.ImageBaners + '/assets/img/settings/' + store.setting.LOGO } : require('../../assest/logo.png')}
					resizeMode='contain'
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		color: 'white',
		fontSize: 24,
		width: '100%',
		textAlign: 'center',
		position: 'absolute'
	},
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		textAlign: 'center'
	},
	TextLight: {
		fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
		textAlign: 'center'
	},
	TextRegular: {
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular',
		textAlign: 'center'
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
