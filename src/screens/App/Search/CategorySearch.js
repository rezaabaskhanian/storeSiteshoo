import React from 'react'
import {View, Text, TouchableWithoutFeedback, Dimensions, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import FastImage from "react-native-fast-image";
import {config} from "../../../App";
import StyleSheet from "react-native-extended-stylesheet";
import {on} from "react-beep";
import Material from "react-native-vector-icons/MaterialIcons";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
const { width } = Dimensions.get('window')
import {useTranslation} from 'react-i18next';
export default function CategorySearch(props){
    const _listEmptyComponent = () => {
        const {t}=useTranslation()
        return (
            <View style={{flex: 1,
                alignItems: 'center',
                justifyContent: 'center'}}>
                <Text style={{fontFamily: 'IRANYekanRegular',}}>{t('category-not-found')}</Text>
            </View>
        )
    };
    const loading=props.loading

    return (
        <ScrollView style={{ flex: 1 }}>
            {loading?<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1,marginTop:50 }}>
                <ActivityIndicator size="large"/>
            </View>:<View>
                {
                    props.data && props.data.length > 0 ?
                    <>
                        <FlatList
                            data={props.data}
                            keyExtractor={(_, index) => 'products' + index}
                            ListEmptyComponent={_listEmptyComponent}
                            renderItem={({ item, index }) => (
                                <TouchableWithoutFeedback
                                    onPress={() => props.navigation.navigation.navigate('Stores', { item: item })}
                                >

                                    <View style={{
                                        backgroundColor: 'white',
                                        flexDirection: 'row-reverse',
                                        height: 100,
                                        width: width - 20,
                                        margin: 5,
                                        borderRadius: 5,
                                        elevation: 1
                                    }}>
                                        <FastImage
                                            source={item.IMAGE != null ? { uri: config.BaseUrl + item.IMAGE } : require('../../../assest/no_data.png')}
                                            resizeMode='contain' style={{ height: '100%', width: 120 }} />
                                        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }}>
                                            <Text style={[styles.TextBold, { color: 'black', textAlign: 'right', fontSize: 12 }]}>{item.NAME}</Text>
                                            <Text style={[styles.TextBold, { color: 'gray', textAlign: 'right', fontSize: 12 }]}>{item.SUBTITLE}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            <Material name='keyboard-arrow-left' color='black' size={24} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        />
                    </>:<View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }} >
                            <FastImage source={require('../../../assest/no_data.png')} resizeMode='contain' style={{ width, height: 170 }} />
                            <Text style={styles.notFound}>{t('category-not-found')}</Text>

                        </View>
                }
            </View>}

        </ScrollView>
    )
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
    image: {},
    button: {
        borderRadius: 17,
        width: 80,
        height: 30,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notFound:{
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold',
        fontSize: 18,
        marginTop:hp('2%')
    }
})
