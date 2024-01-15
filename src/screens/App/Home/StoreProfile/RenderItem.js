import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	FlatList
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios';
import Material from 'react-native-vector-icons/MaterialIcons';
import ProductItem from '../ProductItem/ProductItem';
import {Beep, on, state as store} from "react-beep";
import i18next from '../../../../services/lang/i18next'
export class RenderItem extends Component {
	state = {
		data: [],
		loading: true
	};

	render() {
		const { item } = this.props
		if (item.CHILD_PRODUCTS&&item.CHILD_PRODUCTS[0]) return (
			<View style={{ width: '100%', padding: 10 }}>
				<View style={{ alignItems: 'flex-end', paddingHorizontal: 5 }}>
					<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5 }}>
						<Text
							style={[
								styles.TextBold,
								{ color: 'black', textAlign: 'center', fontSize: 16 }
							]}
						>
							{item.NAME}
						</Text>
						<TouchableOpacity onPress={() =>
							item.LEAF == 1 ?
								this.props.navigation.push('StoreProducts', {
									item,
									'headerText': item.NAME,
									Route: [store.setting.NAME]
								}) :
								this.props.navigation.push('ProductSubCats', {
									item,
									'headerText': item.NAME,
									Route: [store.setting.NAME]
								})
						}>
							<Text style={[styles.TextRegular, { color: StyleSheet.value('$MainColor') }]}>{i18next.t('show-all')}</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						horizontal
						inverted
						data={item.CHILD_PRODUCTS}
						keyExtractor={(item, index) =>item.NAME + '_' + index}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => {
							return <ProductItem item={item} navigation={this.props.navigation} routes={[store.setting.NAME]}/>
						}}
					/>
				</View>
			</View>
		)
		else{
			return null;
		}
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
