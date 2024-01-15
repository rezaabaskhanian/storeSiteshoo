import React from 'react'
import { ScrollView, Text, View, Dimensions, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { state as store } from "react-beep";
import { config } from "../../../App";
import axios from "axios";

const { width } = Dimensions.get('window')

const topImage = require('../../../assest/super_market01.jpg')
import { withTranslation } from 'react-i18next';
 class AboutUs extends React.Component {
	state = {
		image: ''
	}
	componentDidMount() {
		axios.get(`landing/get_image_slider/${store.storeId}/2`).then(({ data }) => {
			// axios.get(`landing/get_image_slider/${store.storeId}/2`).then(({ data }) => {
			console.warn(data[0].IMAGE, 'tehrannn')

			this.setState({ image: data[0].IMAGE })
		})
	}
	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, alignSelf: 'center', textAlign: 'center', position: 'absolute' }} >{t('about-us')}</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView>
					<Image source={{ uri: config.SettingBaseUrlPanel + this.state.image }} style={{ height: 290, width: '100%', resizeMode: 'contain' }} />
					<View style={{ padding: 15, textAlign: 'center' }}>
						<Text style={[styles.textRegular, { marginTop: 4, textAlign: 'center' }]}>{store.setting.ABOUT_US}</Text>
						<Text style={[styles.textRegular, { marginTop: 4, textAlign: 'center' }]}>Phone number: {store.allSetting['SUPPORT_NUMBER_1']}</Text>
						<Text style={[styles.textRegular, { marginTop: 4, textAlign: 'center' }]}>Address: {store.setting.ADDRESS}</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

}

export default  withTranslation()(AboutUs)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee'
	},
	textBold: {
		// fontFamily: '$IRANYekanBold',
		fontSize: 15,
		marginTop: 10,
		color: 'black',
		fontWeight: '$WeightBold',
	},
	textRegular: {
		flex: 1,
		// fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular',
		marginTop: 8
	},

})
