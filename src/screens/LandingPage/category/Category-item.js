import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, AsyncStorage} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {config} from "../../../App";
import FastImage from "react-native-fast-image";
import Axios from "axios";
import {Toast} from "native-base";
import {NavigationActions, StackActions} from "react-navigation";
import {set} from "react-native-reanimated";

export default function CategoryItem(props) {
    // const [data, setData] = React.useState(false);
    //
    // React.useEffect(async () => {
    //     AsyncStorage.getItem('token').then(token => {
    //         if (token) {
    //             setData(true)
    //         }
    //     });
    // }, [])
    return (
        <View style={styles.main}>
            <TouchableOpacity onPress={() => {
                if(props.token && props.token===true){
                    props.navigation.navigate('Stores', {ID: props.data.ID})

                }else{
                    props.navigation.navigate('Auth')

                }
            }}>
                <View style={styles.item}>
                    {/*<FastImage*/}
                    {/*    style={styles.img}*/}
                    {/*    source={{uri: config.BaseUrl + '/assets/img/categories/' + props.data.IMAGE}}*/}
                    {/*    resizeMode='stretch'*/}
                    {/*/>*/}
                    <FastImage source={{uri: config.BaseUrl + '/assets/img/category_logo/' + props.data.IMAGE}}
                               style={styles.img}
                    />
                </View>

                <Text style={styles.type}>
                    {props.data.NAME}
                </Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    main: {
        alignItems: 'center',
        marginLeft: wp('1%'),
        paddingRight:wp('1%')
    },
    item: {
        elevation: 8,
        width: wp('28%'),
        height: hp('17%'),
        backgroundColor: '#fff',
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('1%'),
    },
    img: {
        width: wp('28%'),
        height: hp('17%'),
        borderRadius: wp('4%'),
        resizeMode:'contain'
    },
    type: {
        color: '#53b63e',
        fontFamily: 'IRANYekanRegular',
        marginTop: hp('2%'),
        fontSize: hp('2%'),
        textAlign:'center'
    }
});
