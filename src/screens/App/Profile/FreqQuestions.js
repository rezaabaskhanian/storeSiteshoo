import React from 'react'
import { FlatList, Text, View, Dimensions, TouchableWithoutFeedback, ScrollView, ActivityIndicator } from 'react-native'
import {state as store} from "react-beep";

import Material from 'react-native-vector-icons/MaterialIcons'
import StyleSheet from 'react-native-extended-stylesheet'

const { width } = Dimensions.get('window')
import { withTranslation } from 'react-i18next';
 class FreqQuestions extends React.Component {

	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >{t('frequently-asked-questions')}</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView>
					{/* <Text style={styles.textRegular}>
					در اینجا بسیاری از مسائلی که ممکن است هنگام خرید برای شما پیش بیاید در قالب پرسش و پاسخ مطرح می شود. اگر پاسخ سوال شما خارج از این موارد بود، حامیان {store.setting.NAME} مفتخریم که در خدمت شما هستیم. {store.setting.PHONE}
					</Text> */}
					<FlatList
						data={store.setting.QUESTIONS}
						renderItem={({ item, index }) => (
							<View style={{ flex: 1, padding: 10 }}>
								<Text style = {styles.textBold}>
									{item.QUESTION}
								</Text>
								<Text style={styles.textRegular}>
									{item.ANSWER}
								</Text>
							</View>
						)}
					/>
				</ScrollView>
			</View>
		)
	}

}

export default withTranslation()(FreqQuestions) 

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee'
	},
	textBold: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		fontSize: 15,
		marginTop: 10,
		color: 'black'
		// fontWeight: 'bold',
	},
	textRegular: {
		// fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular'
	},

})
