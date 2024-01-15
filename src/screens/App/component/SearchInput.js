import React from 'react'
import { StyleSheet } from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown';

class SearchInput extends React.Component {
	state = {
		search: false,
		inputText: '',
		country: 'uk'
	}
	render() {
		const {
			onValueChange,
			data,
			selectedValue
		} = this.props

		return (
			<SearchableDropdown
				onItemSelect={(item) => {
					onValueChange(item)
				}}
				containerStyle={{ padding: 5 }}
				onRemoveItem={(item, index) => {
					const items = selectedValue.filter((sitem) => sitem.ID !== item.ID);
				}}
				itemStyle={{
					padding: 10,
					marginTop: 2,
					backgroundColor: '#ddd',
					borderColor: '#bbb',
					borderWidth: 1,
					borderRadius: 5,
				}}
				itemTextStyle={{ color: '#222' }}
				itemsContainerStyle={{ maxHeight: 140 }}
				items={data}
				resetValue={false}
				textInputProps={
					{
						placeholder: "انتخاب محله",
						underlineColorAndroid: "transparent",
						style: {
							height: 50,
							margin: 10,
							borderWidth: 0.5,
							borderColor: 'gray',
							borderRadius: 50,
							flexDirection: 'row-reverse',
							alignItems: 'center'
						},
						onTextChange: text => { }
					}
				}
				listProps={
					{
						nestedScrollEnabled: true,
					}
				}
			/>
		)
	}
}

// export default withKeyboardAwareScrollView(SearchInput)
export default SearchInput

const styles = StyleSheet.create({
	view: {
		height: 50,
		margin: 10,
		borderWidth: 0.5,
		borderColor: 'gray',
		borderRadius: 50
	}
})
