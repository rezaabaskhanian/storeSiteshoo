import React from 'react'
import {
    ScrollView,
    Text,
    View,
    TextInput,
    Image, TouchableOpacity
} from 'react-native'
// import SvgUri from "react-native-svg-uri";
import {back, bin} from "../../../assest/search/svg";
import StyleSheet from "react-native-extended-stylesheet";
import {Icon} from 'native-base';

const sorts = ['PRICE', 'OFFER_PERCENTAGE', 'OFFER_VALUE', 'VIEWS', 'SELLS_PRODUCT','PRICE_DESC'];

import {useTranslation} from 'react-i18next';
export default function Sort(props) {
    const [sort, setSort] = React.useState(props.data);
    const {t}=useTranslation()
    return (
        <View style={{flex: 1}}>

            <View style={styles.searchBar}>
                <TouchableOpacity onPress={() => props.close()}>
                    {/* <SvgUri width="21" height="21" style={{transform: [{rotate: '180deg'}]}} fill={'#959595'}
                            svgXmlData={back}/> */}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                    {t('sort')}
                </Text>
                <TouchableOpacity onPress={() => setSort('')}>
                    {/* <SvgUri width="21" height="21" fill={'#4c4c4c'}
                            svgXmlData={bin}/> */}
                </TouchableOpacity>
            </View>
            <View style={styles.items}>
                <ScrollView>
                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setSort({value:'PRICE',sort:'DESC'})}>
                        <View style={sort.value==='PRICE'&&sort.sort==='DESC'?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'} name={'check'} style={{color: sort.value==='PRICE'&&sort.sort==='DESC'?'#43b02a':'#dbdbdb', fontSize: 20}}/>
                        </View>

                        <Text style={[{fontSize: 16},styles.font]}>
                            {t('most-expensive')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setSort({value:'PRICE',sort:'ASC'})}>
                        <View style={sort.value==='PRICE'&&sort.sort==='ASC'?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'} name={'check'} style={{color: sort.value==='PRICE'&&sort.sort==='ASC'?'#43b02a':'#dbdbdb', fontSize: 20}}/>
                        </View>

                        <Text style={[{fontSize: 16},styles.font]}>
                            {t('cheapest')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setSort({value:'OFFER_VALUE',sort:'DESC'})}>
                        <View style={sort.value==='OFFER_VALUE'&&sort.sort==='DESC'?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'} name={'check'} style={{color: sort.value==='OFFER_VALUE'&&sort.sort==='DESC'?'#43b02a':'#dbdbdb', fontSize: 20}}/>
                        </View>

                        <Text style={[{fontSize: 16},styles.font]}>
                            {t('maximum-discount-amount')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setSort({value:'OFFER_PERCENTAGE',sort:'DESC'})}>
                        <View style={sort.value==='OFFER_PERCENTAGE'&&sort.sort==='DESC'?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'} name={'check'} style={{color: sort.value==='OFFER_PERCENTAGE'&&sort.sort==='DESC'?'#43b02a':'#dbdbdb', fontSize: 20}}/>
                        </View>

                        <Text style={[{fontSize: 16},styles.font]}>
                            {t('highest-discount-percentage')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setSort({value:'SELLS_PRODUCT',sort:'DESC'})}>
                        <View style={sort.value==='SELLS_PRODUCT'&&sort.sort==='DESC'?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'} name={'check'} style={{color: sort.value==='SELLS_PRODUCT'&&sort.sort==='DESC'?'#43b02a':'#dbdbdb', fontSize: 20}}/>
                        </View>

                        <Text style={[{fontSize: 16},styles.font]}>
                            {t('best-sellers')}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.apply} onPress={()=>props.apply(sort)}>
                <Text style={[{color: 'white', fontSize: 19},styles.font]}>
                   {t('confirm')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        height: 55,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'row-reverse',
        flex: 1
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'IRANYekanRegular'
    },
    items: {
        flex: 7
    },
    eachSortItem: {
        height: 50,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
        fontFamily: 'IRANYekanRegular',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    checkbox: {
        borderColor: '#eee',
        borderWidth: 1,
        width: 29,
        height: 29,
        borderRadius: 50,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxActive: {
        borderColor: '#43b02a',
        borderWidth: 2,
        width: 29,
        height: 29,
        borderRadius: 50,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    apply: {
        flex: 1,
        backgroundColor: '#43b02a',
        alignItems: 'center',
        fontFamily: 'IRANYekanRegular',
        justifyContent: 'center'
    },
    font:{
        fontFamily: 'IRANYekanRegular'
    },
})
