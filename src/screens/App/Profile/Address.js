import React, { Component } from 'react'
import { Text, View, FlatList, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { ActivityIndicator } from 'react-native-paper'
import MapView, { Marker } from 'react-native-maps'
const { width } = Dimensions.get('window')
import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import BackHeader from '../component/BackHeader'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'
import { withTranslation } from 'react-i18next';
class RenderItem extends Component {
	state={
		loading: false,
		lat:this.props.lat,
		lng:this.props.lng,
	}
	shouldComponentUpdate(nextProps, nextState, nextContext): boolean {
		if(nextProps.lat!==this.state.lat){
			this.setState({lat:nextProps.lat,lng:nextProps.lng})
			return true
		}
		return true
	}

	render() {
		const { item } = this.props

		return (
			<View style={{ backgroundColor: 'white', minHeight: 185, width: width - 20, margin: 5, borderRadius: 5, elevation: 2 }} >
				{
					item.LOCATION ?
						<MapView
							cacheEnabled={true}
							pitchEnabled={false}
							rotateEnabled={false}
							scrollEnabled={false}
							zoomEnabled={false}
							showsCompass={false}
							style={{ width: '100%', height: 140 }}
							initialCamera={{
								center: { latitude: this.state.lat, longitude: this.state.lng },
								zoom: 15,
								pitch: 1,
								heading: 1
							}}
						>

							<Marker opacity={0.7} coordinate={{ latitude: item.LOCATION[0], longitude: item.LOCATION[1] }} />
						</MapView>
						:
						<View style={{ width: '100%', height: 140 }} >
						</View>
				}
				<View style={{backgroundColor:'#999' ,padding:2, paddingHorizontal:15, position:'absolute' , right:10 , bottom:60 , borderRadius:20, justifyContent:'center'}}>
					<Text style={{ ...styles.TextBold, color: 'white', fontSize: 15, textAlign: 'center' }} >{item.NAME}</Text>
				</View>
				<View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 10, flexDirection: 'row-reverse', flex: 1 }} >
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 15, textAlign: 'left' }} >{item.ADDRESS}</Text>
					<View style={{ flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-end' }} >
						<TouchableWithoutFeedback
							onPress={() => Alert.alert('Delete address', 'Are you sure to delete the desired address?!‌', [
								{
									text: 'Ok',
									onPress: () => {
										try {
											this.props.delete(this.props.index)
											Axios.delete('users/address/' + item.ID)
										} catch (error) {
											console.log(error)
										}
									}
								},
								{
									text: 'cancel'
								}
							])}
						>
							<View style={{ padding: 5 }} >
								<Material name='delete' size={20} />
							</View>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback
							onPress={() => this.props.navigation.navigate('AddDetailAddress', {
								item
							})}
						>
							<View style={{ padding: 5 }} >
								<Material name='edit' size={20} />
							</View>
						</TouchableWithoutFeedback>
					</View>
				</View>
				<TouchableWithoutFeedback
					onPress={async () => {
						try {
							await this.setState({
								loading : true
							})
							Axios.put('users/address/' + item.ID, {
								SELECTED: 1
							}).then(({data})=>{
								if(data){

									this.setState({
										loading : false
									})
									console.log('omad')
									item.SELECTED=1;
									this.props.updateOne(item)
								}else{
									this.setState({
										loading : false
									})
									console.log('omad')
									item.SELECTED=1;
									this.props.updateOne(item)
								}

							})
						} catch (error) {
							console.warn(error)

							this.setState({
								loading : false
							})
						}
					}}
				>
					<View
						style={{position:'absolute', padding:10 }}
					>
						{
							this.state.loading ?
								<ActivityIndicator /> :
								item.SELECTED ?
									<Material name='star' size={25} color='green' />
									:
									<Material name='star-border' size={25} />

						}
					</View>
				</TouchableWithoutFeedback>
			</View>
		)
	}
}

 class App extends Beep(BeepProp, Component) {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			data: []
		}
	}

	async componentDidMount() {
		try {
			let address = await Axios.get('users/address')
			store.address=address.data
			this.setState({loading: false,data:store.address })
		} catch (error) {
			this.setState({ loading: false })
		}
	}


	async componentWillReceiveProps(nextProps){
		let self=this;
		if(nextProps.navigation.state.params['update']){
			this.setState({loading: true })
			let address = await Axios.get('users/address')
			store.address=address.data
			setTimeout(function () {
				self.setState({loading: false,data:store.address })
			},100)
		}
	}

	delete = (index) => {
		this.setState({loading:false})
		let data = store.address
		data.splice(index, 1)
		store.address=data

		this.setState({data:data,loading:false})
	}
	update = async () => {
		try {
			await this.setState({ loading: true })
			let address = await Axios.get('users/address')
			this.setState({loading: false,data:address.data })
			store.address=address.data
		} catch (error) {
			console.log(error)
			this.setState({ loading: false })

		}
	}
	updateOne = async (item) => {
		try {
			let addreses=this.state.data;
			for(let sub of addreses){
				if(sub.ID!==item.ID){
					sub.SELECTED=0
				}else{
					sub.SELECTED=1;
				}
			}
			console.log(JSON.stringify(addreses,null,5))
			this.setState({data:addreses })
			store.address=addreses
		} catch (error) {
			console.log(error)
			this.setState({ loading: false })

		}
	}

	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<NavigationEvents
					onWillFocus={this.update}
				/>
				<BackHeader headerText ={t('manage-address')}/>

				<FlatList
					keyExtractor={(item, index) => item.ID.toString()}
					data={this.state.data}
					contentContainerStyle={{ alignItems: 'center' }}
					renderItem={({ item, index }) => <RenderItem delete={this.delete} update={this.update} updateOne={this.updateOne} {...this.props}
																											 lat={item.LOCATION[0]} lng={item.LOCATION[1]} index={index} item={item} />}
				/>
				<TouchableWithoutFeedback
					onPress={() => {
						console.log('omad');
						this.props.navigation.navigate('AddDetailAddress')
					}}
				>
					<View style={{ padding: 5, height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20, right: 20, backgroundColor: StyleSheet.value('$MainColor') }} >
						<Material name='add' color='white' size={30} />
					</View>
				</TouchableWithoutFeedback>
			</View>
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
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
