import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ProductItem from "./Product-item";
import CategoryItem from "../category/Category-item";

export default function Product(props) {
    return (
        <View>
            <View style={styles.sectionTitle}>
                <Text style={styles.title}>
                    {props.title}
                </Text>
            </View>

            {props.data.length > 0 ? <View style={styles.row}>
                    <FlatList
                        horizontal
                        inverted
                        data={props.data}
                        keyExtractor={(item, index) =>
                            item.NAME + '_' + index
                        }
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => {
                            return <ProductItem token={props.token} navigation={props.navigation} data={item}/>

                        }}
                    />
                </View>
                : null}
        </View>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        paddingRight: wp('5%'),
        paddingLeft: wp('5%'),
    },
    title: {
        color: '#7C7C7C',
        fontFamily: 'IRANYekanRegular',
        fontSize: hp('3%'),
    },
    more: {
        color: '#53b63e',
    },
    row: {
        alignItems: 'flex-end',
        paddingRight: wp('5%'),
        paddingLeft: wp('5%'),
        flexDirection: 'row-reverse',
        marginTop: hp('1.5%')
    }
});
