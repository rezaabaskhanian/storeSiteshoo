import * as React from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { Icon, Toast } from 'native-base'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import StyleSheet from 'react-native-extended-stylesheet'
import axios from "axios";
import Material from "react-native-vector-icons/MaterialIcons";
import { state as store } from "react-beep";
import { config } from "../../../App";
import color from "color";

export default function HomeBox(props) {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [cartLoading, setCartLoading] = React.useState(false);
    const [imageModal, setImageModal] = React.useState(false);
    const [image, setImage] = React.useState('');


    const [products, setProducts] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);

    const [productsEdit, setProductsEdit] = React.useState({});
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const [checkedProducts, setCheckedProducts] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [deletedCount, setDeletedCount] = React.useState(0);


    React.useEffect(() => {
        setLoading(true)
        let homeBoxParam = props.navigation.getParam('item')
        axios.get('homebox').then(async res => {
            if (res && res.data) {
                let homeBox = res.data.HomeBoxes;
                let homeBoxesComp = res.data.HomeBoxesComp;
                let i = 0
                for (let item of homeBox) {
                    for (let sub of homeBoxesComp) {
                        if (item.GROUP_ID === sub.GROUP_ID) {
                            item.COMP = sub;
                        }
                    }
                    let productsTemp = await axios.get(`homebox/${item.GROUP_ID}`)
                    item.products = productsTemp.data;
                    if (homeBoxParam && homeBoxParam.PRODUCT_ID && homeBoxParam.PRODUCT_ID === item.COMP.PRODUCT_ID) {
                        setProducts(productsTemp.data);
                        setModalVisible(true);
                    }
                }
                setLoading(false)
                setData(homeBox)
            }
        });
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [])

    function addToCart(item) {
        setCartLoading(true)
        store.cart_count += 1;
        axios.post('order/cart', {
            'PRODUCT_ID': item.COMP.PRODUCT_STORE_ID,
            'COUNT': 1,
            'DESCRIPTION': ''
        }).then((response) => {
            console.warn(JSON.stringify(response.data, null, 5))

            setCartLoading(false)
            Toast.show({
                text: item.COMP.NAME + ' به سبد خرید شما اضافه شد.',
                type: 'success',
                position: 'top'
            });
            store.cart[item.COMP.PRODUCT_ID + 'orderId'] = response.data.ORDER_ID;
            if (store.cart[item.ID]) {
                store.cart[item.ID] += 1;
            } else {
                store.cart[item.ID] = 1;
            }
        }).catch((error) => {
            console.log('add errror', error)
        })
    }

    function savePersonalHomeBox() {
        setCartLoading(true);
        let productsTemp = []
        for (let item of productsEdit.products) {
            if (checkedProducts.indexOf(item.PRODUCT_STORE_ID) > -1) {
                productsTemp.push({ ID: item.PRODUCT_STORE_ID, COUNT: item.COUNT })
            }
        }
        let formData = new FormData();
        formData.append('IMAGE', productsEdit.COMP.IMAGE);
        formData.append('NAME', productsEdit.COMP.NAME);
        formData.append('STORE_ID', productsEdit.COMP.STORE_ID);
        formData.append('PRODUCT_STORE_ID', JSON.stringify(productsTemp));
        axios.post('/homebox/PersonalHomebox', formData).then(({ data }) => {
            setCartLoading(false);
            props.navigation.navigate('Cart')
        }).catch(err => {
            setCartLoading(false);
            console.log('err1', err)
        })
    }

    return (
        <>

            {loading ? <View style={styles.container}>
                <View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]}>
                    <TouchableWithoutFeedback
                        onPress={() => props.navigation.goBack()}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    >
                        <Material name='arrow-forward'
                            style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }}
                            size={30} />
                    </TouchableWithoutFeedback>
                    <Text style={{
                        ...styles.TextBold,
                        color: 'black',
                        fontSize: 18,
                        textAlign: 'center',
                        alignSelf: 'center',
                        position: 'absolute'
                    }}>هوم باکس</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator />
                </View>
            </View> : <>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../../assest/HomeBox2.png')} style={{ width: wp('35%'), height: hp('20%') }}
                            resizeMode={'contain'}
                        />
                    </View>
                    <ScrollView contentContainerStyle={[styles.container, { alignItems: 'center' }]}>
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <View style={styles2.wrapHomeBox2}>
                                    <ImageBackground source={require('./bagPrice-svg.png')} style={styles2.image}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ marginLeft: wp('16%') }}>
                                                <TouchableOpacity onPress={() => {
                                                    setImage(config.ImageBaseUrlProduct + item.COMP.IMAGE)
                                                    setImageModal(true);

                                                }}>
                                                    <Image
                                                        source={item.COMP.IMAGE != null ? { uri: config.ImageBaseUrlProduct + item.COMP.IMAGE } : require('../../../assest/no_data.png')}
                                                        style={styles2.homeBoxImage} />
                                                </TouchableOpacity>


                                                <Text style={styles2.homeBoxName}>
                                                    {item.COMP.NAME}
                                                </Text>
                                            </View>
                                            <View style={{ paddingTop: hp('3%'), marginRight: wp('6%') }}>
                                                <Text style={styles2.off}>
                                                    {config.priceFix(item.SUM_PRICE_AFTER_OFFER)} تومان
                                            </Text>

                                                <Text style={styles2.afterOff}>
                                                    {config.priceFix(item.SUM_PRICE)} تومان
                                            </Text>

                                                <Text style={styles2.count}>
                                                    {item.PERCENTAGE} ٪ تخفیف
                                            </Text>
                                            </View>
                                        </View>
                                    </ImageBackground>

                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: hp('3%'),
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {cartLoading ? <ActivityIndicator /> :
                                            <TouchableOpacity onPress={() => addToCart(item)}>
                                                <Icon name={'cart-plus'} type={'FontAwesome5'}
                                                    style={{ fontSize: wp('7%'), color: '#24DE9D' }} />
                                            </TouchableOpacity>}
                                        <TouchableOpacity onPress={() => {
                                            setProducts(item.products);
                                            setModalVisible(true);
                                        }}>
                                            <Icon name={'clipboard-list'} type={'FontAwesome5'}
                                                style={{ fontSize: wp('7%'), marginLeft: wp('4%'), color: '#24DE9D' }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            ...styles.continue,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            paddingVertical: 5,
                                            marginRight: 10
                                        }} onPress={() => {
                                            setProductsEdit(item);
                                            let itemIds = [];
                                            let counter = 0
                                            for (let sub of item.products) {
                                                itemIds.push(sub.PRODUCT_STORE_ID)
                                            }
                                            setDeletedCount(0)
                                            setTotalCount(item.products.length);
                                            setCheckedProducts(itemIds);
                                            setEditModalVisible(true);
                                        }}>
                                            <Text style={[styles.TextBold, { color: '#24DE9D', fontSize: 14 }]}>خودت
                                            بساز!</Text>
                                            {/*<Icon name={'edit'} type={'FontAwesome5'}*/}
                                            {/*      style={{fontSize: wp('7%'), marginLeft: wp('4%'), color: '#24DE9D'}}/>*/}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: hp('2%'),
                                        marginRight: wp('3%'),
                                        marginLeft: wp('3%')
                                    }}>

                                        {item.products.length > 0 && <FlatList
                                            horizontal
                                            inverted
                                            data={item.products}
                                            keyExtractor={(sub, index) => sub.GROUP_ID + index}
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={(sub, index) => {
                                                sub = sub.item;
                                                return (
                                                    <View style={styles2.eachProduct}>
                                                        <Text style={styles2.eachProductInfo}>
                                                            {sub.COUNT ? sub.COUNT : 0} عدد {sub.NAME}
                                                        </Text>
                                                    </View>
                                                    // <View style={{flexDirection: 'row', paddingVertical: hp(4)}}>
                                                    //     <View style={styles.eachProduct}>
                                                    //         <Text style={styles.product}>
                                                    //             {sub.COUNT ? sub.COUNT : 0} عدد {sub.NAME}
                                                    //         </Text>
                                                    //     </View>
                                                    // </View>
                                                )
                                            }}
                                        />}
                                    </View>

                                </View>

                            }
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
                            }}
                        >
                            <ScrollView
                                contentContainerStyle={[styles.centeredView, { alignItems: 'center' }]}
                                style={styles.centeredView}>

                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>جزییات هوم باکس</Text>
                                    {products.length > 0 && <FlatList
                                        inverted
                                        data={products}
                                        keyExtractor={(sub, index) => sub.GROUP_ID + index}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={(sub, index) => {
                                            sub = sub.item;
                                            return (
                                                <View style={styles.eachDetails}>
                                                    <View>
                                                        <Text style={styles.productName}>
                                                            {sub.COUNT ? sub.COUNT : 0} عدد {sub.NAME}
                                                        </Text>
                                                    </View>
                                                    <View styles={{
                                                        flexDirection: 'row-reverse',
                                                        justifyContent: 'space-between',
                                                        width: wp('90%')
                                                    }}>
                                                        <Text style={styles.price}>{sub.PRICE_AFTER_OFFER}
                                                        تومان</Text>
                                                        <Text style={styles.productAfterPrice}>{sub.PRICE}
                                                        تومان</Text>
                                                    </View>
                                                </View>

                                            )
                                        }}
                                    />}
                                    <TouchableHighlight
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#6e3cab"
                                        }}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>بستن جزییات</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        </Modal>


                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={editModalVisible}
                            onRequestClose={() => {
                                setEditModalVisible(false);
                            }}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                backgroundColor: color('gray').alpha(0.2).darken(0.8)
                            }}>
                                <ScrollView
                                    contentContainerStyle={[styles.centeredView, { alignItems: 'center', height: hp('90%') }]}
                                    style={styles.centeredView}>

                                    <View style={styles.modalView}>
                                        <View>
                                            <Text style={[styles.textStyle, { color: 'black' }]}>می تونی بعضی از محصولات رو
                                            حذف کنی!</Text>

                                            <View style={{
                                                marginTop: hp('2%'),
                                                flexDirection: 'row-reverse',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Text style={[styles.textStyle, { color: 'black' }]}>
                                                    مجموع قیمت :
                                            </Text>

                                                <View style={{ alignItems: 'flex-start' }}>
                                                    <Text style={styles.productAfterPrice}>
                                                        {config.priceFix(productsEdit.SUM_PRICE)} تومان
                                                </Text>

                                                    <Text style={styles.price}>
                                                        {config.priceFix(productsEdit.SUM_PRICE_AFTER_OFFER)} تومان
                                                </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={styles.modalText}>ویرایش هوم باکس</Text>
                                        {productsEdit && productsEdit.products && productsEdit.products.length > 0 &&
                                            <FlatList
                                                inverted
                                                data={productsEdit.products}
                                                keyExtractor={(sub, index) => sub.GROUP_ID + index}
                                                showsHorizontalScrollIndicator={false}
                                                renderItem={(sub, index) => {
                                                    sub = sub.item;
                                                    return (
                                                        <TouchableOpacity
                                                            style={checkedProducts.indexOf(sub.PRODUCT_STORE_ID) > -1 ? styles.eachDetails : styles.eachDetailsUnSelect}
                                                            onPress={() => {
                                                                let temp = Object.assign([], checkedProducts);
                                                                if (temp.indexOf(sub.PRODUCT_STORE_ID) > -1) {
                                                                    if (deletedCount + 1 > totalCount / 2) {
                                                                        Toast.show({
                                                                            text: 'شما فقط قادر به حذف نیمی از مجصولات می باشید',
                                                                            type: 'danger',
                                                                            position: 'bottom'
                                                                        })
                                                                    } else {
                                                                        setDeletedCount(deletedCount + 1);
                                                                        let tempProduct = Object.assign({}, productsEdit);
                                                                        tempProduct.SUM_PRICE_AFTER_OFFER -= (sub.PRICE_AFTER_OFFER * sub.COUNT)
                                                                        tempProduct.SUM_PRICE -= (sub.PRICE * sub.COUNT)
                                                                        setProductsEdit(tempProduct)
                                                                        temp.splice(temp.indexOf(sub.PRODUCT_STORE_ID), 1)
                                                                    }
                                                                } else {
                                                                    setDeletedCount(deletedCount - 1);
                                                                    let tempProduct = Object.assign({}, productsEdit);

                                                                    tempProduct.SUM_PRICE_AFTER_OFFER += (sub.PRICE_AFTER_OFFER * sub.COUNT)
                                                                    tempProduct.SUM_PRICE += (sub.PRICE * sub.COUNT)
                                                                    setProductsEdit(tempProduct)

                                                                    temp.push(sub.PRODUCT_STORE_ID)
                                                                }
                                                                setCheckedProducts(temp);
                                                            }}>
                                                            <View style={{
                                                                flexDirection: 'row-reverse',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <Text style={styles.productName2}>
                                                                    {sub.COUNT ? sub.COUNT : 0} عدد {sub.NAME}
                                                                </Text>
                                                                {/*<View style={{backgroundColor:'#e8e8e8',flexDirection:'row',padding:wp('3%'),borderRadius:wp('2%')}}>*/}
                                                                {/*    <Icon name={'add'} style={{fontSize:wp('5%'),color:'#5f5f5f'}}/>*/}
                                                                {/*    <Text style={{marginLeft:wp('3%'),marginRight:wp('3%'),fontWeight:'bold'}}>۲</Text>*/}
                                                                {/*    <Icon name={'remove'} style={{fontSize:wp('5%'),color:'#5f5f5f'}}/>*/}
                                                                {/*</View>*/}
                                                            </View>
                                                            <View styles={{
                                                                flexDirection: 'row-reverse',
                                                                justifyContent: 'space-between',
                                                                width: wp('90%')
                                                            }}>
                                                                <Text style={styles.price}>{sub.PRICE_AFTER_OFFER}
                                                            تومان</Text>
                                                                <Text style={styles.productAfterPrice}>{sub.PRICE}
                                                            تومان</Text>
                                                            </View>
                                                        </TouchableOpacity>

                                                    )
                                                }}
                                            />}
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', width: wp('78%') }}>
                                            <TouchableHighlight
                                                style={{
                                                    ...styles.openButton,
                                                    backgroundColor: "#6e3cab",
                                                    marginRight: wp('2%')
                                                }}
                                                onPress={() => {
                                                    setEditModalVisible(!editModalVisible);
                                                }}
                                            >
                                                <Text style={styles.textStyle}>بستن جزییات</Text>
                                            </TouchableHighlight>
                                            {cartLoading ? <ActivityIndicator /> :
                                                <TouchableHighlight
                                                    style={{
                                                        ...styles.openButton,
                                                        backgroundColor: "#006603",
                                                        marginLeft: wp('2%')
                                                    }}
                                                    onPress={() => {
                                                        savePersonalHomeBox()
                                                    }}
                                                >
                                                    <Text style={styles.textStyle}>اعمال تغییرات</Text>
                                                </TouchableHighlight>}
                                        </View>

                                    </View>
                                </ScrollView>
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={imageModal}
                            onRequestClose={() => {
                                setImageModal(false);
                            }}
                        >
                            <ScrollView
                                contentContainerStyle={[styles.centeredView, { alignItems: 'center' }]}
                                style={styles.centeredView}>

                                <View style={styles.modalView}>
                                    <Image
                                        source={{ uri: image }}
                                        style={styles2.homeBoxImage2} />
                                    <TouchableHighlight
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#6e3cab"
                                        }}
                                        onPress={() => {
                                            setImageModal(!imageModal);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>بستن</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        </Modal>
                    </ScrollView>
                </>

            }

        </>
    )
}

const styles = StyleSheet.create({
    eachBox: {
        backgroundColor: '#F42F71',
        width: wp('90%'),
        height: hp('33%'),
        borderRadius: wp('5%')
    },
    container: {
        flex: 1,
        backgroundColor: '$BackgroundColor'
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
        borderRadius: wp('5%'),
        padding: wp('1%')
    },
    homeBoxName: {
        color: '#fff',
        fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightBold',
        fontSize: wp('7%'),
        marginBottom: hp('1%')
    },
    homeBoxImage: {
        width: wp('23%'),
        height: hp('11%'),
        borderRadius: wp('5%'),
        marginLeft: wp('2%'),
        resizeMode: 'contain'
    },

    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold',
        fontSize: 12
    },
    product: { fontSize: wp('4%'), fontFamily: '$IRANYekanRegular', fontWeight: '$WeightRegular' },
    offerTitle: { color: '#FF1F1F', fontFamily: '$IRANYekanRegular', fontWeight: '$WeightRegular', fontSize: wp('5%') },
    offer: { color: '#FF1F1F', fontFamily: '$IRANYekanRegular', fontWeight: '$WeightRegular', fontSize: wp('9%') },
    currentPrice: {
        textAlign: 'center',
        fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightBold',
        fontSize: wp('8%'),
        color: '#fff',
    },
    afterPrice: {
        textAlign: 'center',
        fontSize: wp('5%'),
        color: '#fff',
        fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightBold',
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "#000",
    },
    eachProduct: {
        backgroundColor: 'rgba(36,222,157,0.15)',
        borderStyle: 'dashed',
        borderColor: '#24DE9D',
        borderWidth: 2,
        padding: wp('2%'),
        borderRadius: wp('3%'),
        marginRight: wp('2%')
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "flex-end",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 6,
        padding: 10,
        elevation: 2,
        fontFamily: '$IRANYekanRegular',
    },
    textStyle: {
        color: "white",
        fontFamily: '$IRANYekanRegular',
        textAlign: "right"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "right",
        fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightBold',
        fontSize: wp('6%')
    },
    eachDetails: {
        backgroundColor: 'rgba(36,222,157,.17)',
        borderWidth: 2,
        borderColor: '#24de9d',
        borderStyle: 'dashed',
        width: wp('78%'),
        borderRadius: wp('3%'),
        // flexDirection: 'row-reverse',
        // justifyContent: 'space-between',
        padding: wp('3%'),
        marginBottom: hp('1.5%')
    },
    eachDetailsUnSelect: {
        backgroundColor: 'rgba(101,100,100,0.17)',
        borderWidth: 2,
        borderColor: '#c6c6c6',
        borderStyle: 'dashed',
        width: wp('78%'),
        borderRadius: wp('3%'),
        // flexDirection: 'row-reverse',
        // justifyContent: 'space-between',
        padding: wp('3%'),
        marginBottom: hp('1.5%')
    },
    productName: {
        fontFamily: '$IRANYekanRegular',
        fontSize: wp('3%')
    },
    productName2: {
        fontFamily: '$IRANYekanRegular',
        fontSize: wp('3%'),
        width: wp('50%')
    },
    productAfterPrice: {
        fontSize: wp('3%'),
        textDecorationLine: 'line-through',
        color: 'red',
        fontFamily: '$IRANYekanRegular',
    },
    price: {
        fontFamily: '$IRANYekanRegular',
        fontSize: wp('3%')
    },
    continue: {
        borderWidth: 1,
        borderColor: '#004e09',
        backgroundColor: '#fff',
        // width: wp('95%'),
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        borderRadius: wp('2%'),
        padding: 8
    }
});
const styles2 = StyleSheet.create({
    eachProductInfo: {
        fontFamily: '$IRANYekanRegular',
    },
    homeBoxImage2: {
        width: wp('80%'),
        height: hp('40%'),
        borderRadius: wp('5%'),
        marginLeft: wp('2%'),
        resizeMode: 'contain'
    },
    wrapHomeBox: {
        elevation: 8,
        backgroundColor: '#fff',
        height: hp('40%'),
        width: wp('90%'),
        borderRadius: wp('5%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        // padding:wp('3%'),
        // flexDirection:'row',
        // justifyContent:'space-between'
    },
    homeBoxImage: {
        width: wp('24%'),
        height: hp('17%'),
        resizeMode: 'contain',
    },
    homeBoxName: {
        fontSize: wp('3%'),
        fontFamily: '$IRANYekanRegular', textAlign: 'center',
        marginTop: hp('-1%'),
        color: '#fff'
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 70,
        borderTopWidth: 70,
        borderLeftColor: 'transparent',
        borderTopColor: 'purple',
        borderTopRightRadius: wp('5%'),
        transform: [{ rotate: '0deg' }],
        position: 'absolute',
        right: wp('0%'),
        top: wp('0%')
    },
    afterOff: {
        fontSize: wp('3%'),
        fontFamily: '$IRANYekanRegular',
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "red",
        color: '#fff',
    },
    off: {
        fontSize: wp('4%'),
        fontFamily: '$IRANYekanRegular',
        color: '#fff'

    },
    count: {
        fontSize: wp('3.5%'),
        color: '#fff',
        fontFamily: '$IRANYekanRegular',
        marginTop: 30,
        marginRight: wp('1.5%')
    },
    eachProduct: {
        backgroundColor: 'rgba(182,182,182,0.15)',
        borderStyle: 'dashed',
        borderColor: '#686868',
        borderWidth: 2,
        fontFamily: '$IRANYekanRegular',
        padding: wp('2%'),
        borderRadius: wp('3%'),
        marginRight: wp('2%')
    },
    wrapHomeBox2: {
        // elevation: 8,
        // backgroundColor: '#fff',
        // height: hp('40%'),
        // width: wp('90%'),
        // borderRadius: wp('5%'),
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: hp('2%'),
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingBottom: hp('2%'),
        marginBottom: hp('2%')
    },
    image: {
        marginLeft: wp('3%'),
        width: wp('90%'),
        height: wp('40%'),
        resizeMode: 'contain'
    }
});
