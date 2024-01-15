import React,{useState,useEffect} from 'react'
import { ScrollView, Text, View,  Dimensions, TouchableWithoutFeedback } from 'react-native'

import Material from 'react-native-vector-icons/MaterialIcons'
import { Textarea, Input, Toast } from 'native-base'
import {Picker} from '@react-native-picker/picker';

import StyleSheet from 'react-native-extended-stylesheet'
import Axios from "axios";


import { useTranslation } from 'react-i18next';
 
 const ContactUs = (props) => {
	const { t, i18n } = useTranslation();
	useEffect(() => {
	  
		Axios.get('catalogs').then(({ data }) => {
		
			setCategories(data)
		})
	 
	}, [])



	const [categories,setCategories]=useState([])
	const [info,setInfo]=useState({subject:'',content:'',selectedCat: 0})

	const save=()=> {
		console.log(this.state)
		let body = {
			CATALOG_ID: info.selectedCat,
			CONTENT: info.content,
			SUBJECT: info.subject
		}
		Axios.post('tickets/createTicket', body).then(res => {
			
			props.navigation.goBack()

			return Toast.show({
				text: 'Your message has been received.',
				type: 'success',
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
	}
	
	
   return (
	<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} > {t('contactus')}</Text>
					<TouchableWithoutFeedback
						onPress={() => props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView contentContainerStyle={{ padding: 8 }}>
					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
						{t('subject')}
					</Text>
					<View
						style={styles.SectionStyle}
					>
						<Picker
							style={{ height: 50, width: 150 }}
							selectedValue={info.selectedCat}
							onValueChange={(e) => setInfo({...info,selectedCat:e})}
						>
							{categories.map((item, index) => (
								<Picker.Item
									key={index}
									value={item.ID}
									label={item.NAME}
								/>
							))
							}
						</Picker>
					</View>

					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
						{t('title')}
					</Text>
					<View
						style={styles.SectionStyle}
					>
						<Input
							onChangeText={e => setInfo({...data,subject:e})}
							default={info.subject}
						/>
					</View>
					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
					  {t('detail-message')}
					</Text>
					<View
						style={styles.SectionStyle}
					>
						<Textarea
							style={{
								fontFamily: 'IRANSansMobile(FaNum)',
								width: '100%',
								borderRadius: 10,
								fontSize: 15,
								paddingRight: 15,
								color: '#333',
								textAlign: 'right',
							}}
							onChangeText={(e) => setInfo({...data,content:e})}
						/>
					</View>



					<TouchableWithoutFeedback onPress={() => save()}>
						<View style={styles.button}>
							<Text style={[styles.textBold, { color: 'white', marginTop: 0 }]}>{t('send')}</Text>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</View>
   )
 }
 
 export default ContactUs

//  class ContactUs extends React.Component {

// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			subject: '',
// 			content: '',
// 			selectedCat: 0,
// 			categories: []
// 		}
// 	}

// 	componentDidMount() {
// 		Axios.get('catalogs').then(({ data }) => {
		
// 			if (data) {
// 				this.setState({ categories: data })
// 			}
// 		})
// 	}
// 	save() {
// 		console.log(this.state)
// 		let body = {
// 			CATALOG_ID: this.state.selectedCat,
// 			CONTENT: this.state.content,
// 			SUBJECT: this.state.subject
// 		}
// 		Axios.post('tickets/createTicket', body).then(res => {
			
// 			this.props.navigation.goBack()

// 			return Toast.show({
// 				text: 'Your message has been received.',
// 				type: 'success',
// 				buttonText: 'Ok',
// 				buttonStyle: {
// 					borderColor: 'white',
// 					borderWidth: 1,
// 					margin: 5,
// 					borderRadius: 7
// 				},
// 				textStyle: { ...styles.TextRegular, fontSize: 14 }
// 			})
// 		})
// 	}

// 	render() {
// 		const {t} =this.props
// 		return (
// 			<View style={styles.container}>
// 				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} > {t('contactus')}</Text>
// 					<TouchableWithoutFeedback
// 						onPress={() => this.props.navigation.goBack()}
// 						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 					>
// 						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
// 					</TouchableWithoutFeedback>
// 				</View>
// 				<ScrollView contentContainerStyle={{ padding: 8 }}>
// 					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
// 						{t('subject')}
// 					</Text>
// 					<View
// 						style={styles.SectionStyle}
// 					>
// 						<Picker
// 							style={{ height: 50, width: 150 }}
// 							selectedValue={this.state.selectedCat}
// 							onValueChange={(selectedCat) => this.setState({ selectedCat })}
// 						>
// 							{this.state.categories.map((item, index) => (
// 								<Picker.Item
// 									key={index}
// 									value={item.ID}
// 									label={item.NAME}
// 								/>
// 							))
// 							}
// 						</Picker>
// 					</View>

// 					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
// 						{t('title')}
// 					</Text>
// 					<View
// 						style={styles.SectionStyle}
// 					>
// 						<Input
// 							onChangeText={subject => this.setState({ subject })}
// 							default={this.state.subject}
// 						/>
// 					</View>
// 					<Text style={{ ...styles.textRegular, color: 'gray', alignSelf: 'flex-end', fontSize: 10, marginTop: 10, }}>
// 					  {t('detail-message')}
// 					</Text>
// 					<View
// 						style={styles.SectionStyle}
// 					>
// 						<Textarea
// 							style={{
// 								fontFamily: 'IRANSansMobile(FaNum)',
// 								width: '100%',
// 								borderRadius: 10,
// 								fontSize: 15,
// 								paddingRight: 15,
// 								color: '#333',
// 								textAlign: 'right',
// 							}}
// 							onChangeText={(content) => this.setState({ content })}
// 						/>
// 					</View>



// 					<TouchableWithoutFeedback onPress={() => this.save()}>
// 						<View style={styles.button}>
// 							<Text style={[styles.textBold, { color: 'white', marginTop: 0 }]}>{t('send')}</Text>
// 						</View>
// 					</TouchableWithoutFeedback>
// 				</ScrollView>
// 			</View>
// 		)
// 	}

// }

// export default withTranslation()(ContactUs)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee'
	},
	textBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		fontSize: 15,
		marginTop: 10,
		color: 'black'
		// fontWeight: 'bold',
	},
	textRegular: {
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular',
	},

	SectionStyle: {
		flexDirection: 'row-reverse',
		height: 50, width: '100%',
		borderWidth: 1, borderColor: '#D8D8D8',
		borderRadius: 4,
		fontSize: 15,
		// marginTop: 10,
		paddingRight: 40,
		alignItems: 'center'
	},
	button: {
		width: '70%', alignSelf: 'center', alignItems: 'center',
		justifyContent: 'center', borderRadius: 50, elevation: 4,
		backgroundColor: '$MainColor', marginTop: 8, padding: 4
	}
})
