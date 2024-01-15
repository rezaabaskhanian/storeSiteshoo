import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Modal, ActivityIndicator
} from 'react-native'
import { Item, Input, Icon } from 'native-base';
import StyleSheet from "react-native-extended-stylesheet";
// import SvgUri from 'react-native-svg-uri'
// import { sortSvg, filterSvg } from "../../../assest/search/svg";
// import ResultTabbar from './result.tabbar'
import { debounce } from 'underscore'
import axios from "axios";
import { config } from "../../../App";
import Sort from "./sort";
import Filter from "./filter";
import { state as store } from 'react-beep'
import { Appbar } from "react-native-paper";
import ProductItem from "./ProductItem";
import {useTranslation} from 'react-i18next';


export default function SearchView(props) {
    const [searchText, setSearchText] = React.useState('');
    const [showFilter, setShowFilter] = React.useState(false);
    const [showSort, setShowSort] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState({ categories: [] });
    const [stores, setStores] = React.useState([]);
    const [products, setProducts] = React.useState({});
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [sort, setSort] = React.useState({ value: '', sort: '' });
    const [categories, setCategories] = React.useState([]);


    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    React.useEffect(() => {
        axios.get('categories').then(res => {
            if (res && res.data) {
                setCategories(res.data)
            }
        });
        if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.text) {
            setSearchText(props.navigation.state.params.text);
            search(props.navigation.state.params.text);
        }

        return () => {
            console.log("This will be logged on unmount");
        }
    }, []);

    const onChangeTextDelayed = debounce((text) => {
        search(text)
    }, 3500);
    const onChangeText = (text) => {
        setSearchText(text);
        onChangeTextDelayed(text)
    };

    const search = (text) => {
        // source.cancel('Operation canceled by the user.');

        if (text.length > 1) {
            setLoading(true);
            // setSearchText(text);
            let body = {
                CATEGORY_ID: [],

                //STORE_ID: store.storeId,
                STORE_ID: store.storeId,
                OFFER: "",
                orderby: "",
                sort: ""
            };
            if (filter.categories.length > 0) {
                body["CATEGORY_ID"] = filter.categories
            }
            if (filter.offer) {
                body["OFFER"] = "1"
            }
            if (sort.value) {
                body["orderby"] = sort.value
            }
            if (sort.sort) {
                body["sort"] = sort.sort
            }
            let text1 = text.split(' ').join('%25');

            axios.get(config.BaseUrl + '/api/stores/filter/Search?q=' + text1, {
                // axios.get(config.BaseUrl + '/api/stores/filter/SearchApk?q=' + text1, {
                cancelToken: source.token
            }).then((res) => {
                setStores(res.data.Store);
                console.log(res.data, 'res.data')
                setCategoriesData(res.data.StoreCategory);

                /////////////

            }).catch(err => {
                setLoading(false)

            });


            console.log(body, 'body')
            axios.post(config.BaseUrl + '/api/products/filterProduct?q=' + text1, body, {
                cancelToken: source.token
            }).then((res) => {
                console.log(res.data, 'filterProduct')
                let productStore = {};

                for (let item of res.data) {
                    if (item.STORE_ID === store.storeId) {

                        if (productStore[item.STORE_ID]) {
                            productStore[item.STORE_ID].products.push(item);
                        } else {
                            productStore[item.STORE_ID] = {};
                            productStore[item.STORE_ID].storeName = item.STORE_NAME;
                            productStore[item.STORE_ID].products = [];
                            productStore[item.STORE_ID].products.push(item);
                        }
                    }
                }

                setProducts(productStore[store.storeId]);

                { console.log(products, 'products') }
                console.log(JSON.stringify(productStore), 'console');
                setTimeout(() => {
                    setLoading(false)
                }, 1500)

            }).catch(err => {
                setLoading(false)
            });
        }

    };



    function changeFilter(data) {
        console.log(data,'beforeFilter')
        setFilter(data);
        setLoading(true)
        console.log(searchText,'searchText')
        // if (searchText) {
            let body = {
                CATEGORY_ID: [],
                //STORE_ID: store.storeId,
                STORE_ID: store.storeId,
                OFFER: "",
                orderby: "",
                sort: ""
            };
            if (data.categories.length > 0) {
                body["CATEGORY_ID"] = data.categories
            }
            if (data.offer) {
                body["offer"] = "1"
            }
            if (sort.value) {
                body["orderby"] = sort.value
            }
            if (sort.sort) {
                body["sort"] = sort.sort
            }
            store.products = [];
            let text = searchText.split(' ').join('%25');
            
            // console.log(`landing/get_setting/${store.storeId}`)
            

            axios.post(config.BaseUrl + '/api/products/filterProduct?q=' + text, body, {
                cancelToken: source.token
            }).then(({ data }) => {
                console.log(data, 'data');
                let productStore = {};
                setLoading(false)

                for (let item of data) {
                    if (item.STORE_ID === store.storeId) {

                        if (productStore[item.STORE_ID]) {
                            productStore[item.STORE_ID].products.push(item);
                        } else {
                            productStore[item.STORE_ID] = {};
                            productStore[item.STORE_ID].storeName = item.STORE_NAME;
                            productStore[item.STORE_ID].products = [];
                            productStore[item.STORE_ID].products.push(item);
                        }
                    }
                }
                setProducts(productStore[store.storeId]);
            });
        // } else
            // setLoading(false)

    }

    function changeSort(data) {
        setSort(data);
        setLoading(true)
        // if (searchText) {
            let body = {
                CATEGORY_ID: [],
                //STORE_ID: store.storeId,
                STORE_ID: store.storeId,
                OFFER: "",
                orderby: "",
                sort: ""
            };
            if (filter.categories.length > 0) {
                body["CATEGORY_ID"] = filter.categories
            }
            if (filter.offer) {
                body["offer"] = "1"
            }
            if (data.value) {
                body["orderby"] = data.value
            }
            if (data.sort) {
                body["sort"] = data.sort
            }
            store.products = [];
            let text = searchText.split(' ').join('%25');
            axios.post(config.BaseUrl + '/api/products/filterProduct?q=' + text, body, {
                cancelToken: source.token
            }).then(({ data }) => {
                let productStore = {};
                setLoading(false);

                for (let item of data) {
                    if (item.STORE_ID === store.storeId) {
                        if (productStore[item.STORE_ID]) {
                            productStore[item.STORE_ID].products.push(item);
                        } else {
                            productStore[item.STORE_ID] = {};
                            productStore[item.STORE_ID].storeName = item.STORE_NAME;
                            productStore[item.STORE_ID].products = [];
                            productStore[item.STORE_ID].products.push(item);
                        }
                    }
                }
                setProducts(productStore[store.storeId]);
            });
        // }
    }
    const {t}=useTranslation()
    return (
        <View>

            <View style={styles.searchBar}>
                <Item rounded style={styles.searchBox}>
                    <Icon active name='search' style={{ color: '#959595' }} />
                    <Input style={{ fontFamily: 'IRANYekanRegular' }} placeholder={t('search')} value={searchText} onChangeText={(text) => onChangeText(text)} />
                </Item>
            </View>
            <View style={styles.filterRow}>
                <View style={styles.eachCol}>
                    <TouchableOpacity style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center'
                    }} onPress={() => setShowSort(true)}>
                        {/* <SvgUri width="26" height="26" fill={'rgba(39,60,26,0.82)'}
                            svgXmlData={sortSvg} /> */}
                        <View style={{ marginRight: 7 }}>
                            <Text style={{ fontFamily: 'IRANYekanRegular', color: 'rgba(39,60,26,0.82)' }}>{t('sort')}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={styles.eachCol}>
                    <TouchableOpacity style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center'
                    }} onPress={() => setShowFilter(true)}>

                        {/* <SvgUri width="26" height="26" fill={'rgba(39,60,26,0.82)'}
                            svgXmlData={filterSvg} /> */}
                        <View style={{ marginRight: 7 }}>
                            <Text style={{ fontFamily: 'IRANYekanRegular', color: 'rgba(39,60,26,0.82)' }}>{t('filter')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ height: '100%', }}>

                <ProductItem navigation={props.navigation} loading={loading}
                    data={products} />
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={showFilter}
                onRequestClose={() => {
                    setShowFilter(false)
                }}>
                <Filter close={() => setShowFilter(false)} categories={categories} data={filter}
                    apply={(data) => {
                        setShowFilter(false);
                        changeFilter(data)
                    }} />
            </Modal>
            <Modal
                animationType="slide"
                transparent={false}
                visible={showSort}
                onRequestClose={() => {
                    setShowSort(false)
                }}>
                <Sort close={() => setShowSort(false)} data={sort}
                    apply={(data) => {
                        setShowSort(false)
                        changeSort(data)
                    }} />
            </Modal>
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
        flexDirection: 'row-reverse'
    },
    searchBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        width: '100%',
        padding: 5,
    },
    chips: {
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15,
        paddingLeft: 15,
    },
    eachChips: {
        color: '#43b02a',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#dbdbdb',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    filterRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderBottomWidth: 1,
        // borderBottomColor: '#dbdbdb',
        height: 55,
        flexDirection: 'row-reverse',
        paddingRight: 15,
        paddingLeft: 15,
        width: '100%',
        backgroundColor: 'rgba(221,255,193,0.82)'
    },
    eachCol: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: '50%'
    },
    activeSort: {
        color: '#43b02a',
    },
    main: {},
    eachProduct: {
        elevation: 5,
        borderRadius: 10,
        width: '91.5%',
        height: 90,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        position: 'relative'
    },
    productImg: {
        width: 80,
        height: 90,
        resizeMode: "contain"
    },
    price: {
        position: 'absolute',
        right: 0,
        bottom: 15,
        backgroundColor: '#ddd',
        padding: 3
    },
    eachStore: {
        elevation: 5,
        borderRadius: 10,
        width: '91.5%',
        height: 90,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        position: 'relative'
    }
})
