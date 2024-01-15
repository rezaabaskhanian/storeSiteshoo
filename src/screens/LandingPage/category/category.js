import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CategoryItem from "./Category-item";


export default function Category(props) {
return(
    <View style={{top:hp('-5%')}}>
        <View style={styles.sectionTitle}>
            <Text style={styles.title}>
                دسته بندی
            </Text>

            {/*<Text style={styles.more}>*/}
            {/*    بیشتر*/}
            {/*</Text>*/}
        </View>

        <View style={styles.row}>
            <FlatList
                horizontal
                inverted
                data={props.data}
                keyExtractor={(item, index) =>
                    item.NAME + '_' + index
                }
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <CategoryItem token={props.token} navigation={props.navigation} data={item}/>

                }}
            />
        </View>
    </View>
)
}

const styles = StyleSheet.create({
    sectionTitle:{
        justifyContent:'space-between',
        flexDirection:'row-reverse',
        paddingRight:wp('5%'),
        paddingLeft:wp('5%'),
    },
    title:{
        color:'#7C7C7C',
        fontFamily: 'IRANYekanRegular',
        fontSize:hp('3%'),
    },
    more:{
        color:'#53b63e',
    },
    row:{
        alignItems:'flex-end',
        paddingRight:wp('5%'),
        paddingLeft:wp('5%'),
        flexDirection: 'row-reverse',
        marginTop:hp('1.5%')
    }
});
