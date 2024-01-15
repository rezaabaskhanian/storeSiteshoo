import React from 'react'
import {
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native'
// import SvgUri from "react-native-svg-uri";
// import {back,bin} from "../../../assest/search/svg";
import StyleSheet from "react-native-extended-stylesheet";
import {Icon } from 'native-base';
import {useTranslation} from 'react-i18next';
export default function Filter(props) {
    const [filter, setFilter] = React.useState(props.data);

    function clickCategory(id) {
        let cats=[...filter.categories];
        if(filter.categories.indexOf(id)>-1){
            cats.splice(cats.indexOf(id),1);
            setFilter({...filter,categories: cats})
        }else{
            cats.push(id);
            setFilter({...filter,categories: cats})
        }
    }
    const {t}=useTranslation()
    return (
        <View style={{flex: 1}}>
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={()=>props.close()}>
                    {/* <SvgUri width="21" height="21" style={{transform: [{rotate: '180deg'}]}} fill={'#959595'}
                            svgXmlData={back}/> */}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                    {t('filter')}
                </Text>
                <TouchableOpacity onPress={()=>setFilter({categories:[],offer:false})}>
                    {/* <SvgUri width="21" height="21" fill={'#4c4c4c'}
                            svgXmlData={bin}/> */}
                              <Icon type={'MaterialIcons'}  name={'check'} style={{color:filter.offer?'#43b02a':'#dbdbdb',fontSize:20}}/>
                </TouchableOpacity>

            </View>

            <View style={styles.items}>
                <ScrollView>
                    <TouchableOpacity style={styles.eachSortItem} onPress={()=>setFilter({...filter,offer:!filter.offer})}>
                        <View style={filter.offer?styles.checkboxActive:styles.checkbox}>
                            <Icon type={'MaterialIcons'}  name={'check'} style={{color:filter.offer?'#43b02a':'#dbdbdb',fontSize:20}}/>
                        </View>

                        <Text style={[{fontSize:16},styles.font]}>
                         {t('discounted-items-only')}
                        </Text>
                    </TouchableOpacity>
                    {props.categories.map((item,index)=>{
                        return(
                            <TouchableOpacity key={item.ID} style={styles.eachSortItem} onPress={()=>clickCategory(item.ID)}>
                                <View style={filter.categories.indexOf(item.ID)>-1?styles.checkboxActive:styles.checkbox}>
                                    <Icon type={'MaterialIcons'}  name={'check'} style={{color:filter.categories.indexOf(item.ID)>-1?'#43b02a':'#dbdbdb',fontSize:20}}/>
                                </View>

                                <Text style={[{fontSize:16},styles.font]}>
                                    {item.NAME}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <TouchableOpacity onPress={()=>props.apply(filter)} style={styles.apply}>
                <Text style={[{color:'white',fontSize:19},styles.font]}>
                 {t('confirm')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        height: 55,
        backgroundColor: '#e7e7e7',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'row-reverse',
        flex:1
    },
    sectionTitle:{
        fontSize:24,
        fontFamily: 'IRANYekanRegular'
    },
    items:{
        flex: 7
    },
    eachSortItem:{
        height: 50,
        borderBottomColor:'#eee',
        borderBottomWidth:1,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    checkbox:{
        borderColor:'#eee',
        borderWidth:1,
        width:29,
        height:29,
        borderRadius:50,
        marginLeft:10,
        alignItems:'center',
        justifyContent:'center'
    },
    checkboxActive:{
        borderColor:'#43b02a',
        borderWidth:2,
        width:29,
        height:29,
        borderRadius:50,
        marginLeft:10,
        alignItems:'center',
        justifyContent:'center'
    },
    apply:{
        flex:1,
        backgroundColor:'#43b02a',
        alignItems:'center',
        justifyContent: 'center'
    },
    font:{
        fontFamily: 'IRANYekanRegular'
    },
})
