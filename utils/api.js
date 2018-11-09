// import axios from 'axios';
import { toJS } from 'mobx';
import { isProduction, PUBLIC_PATH, DOMAIN_LOCAL, DOMAIN, WALLET_CHART_EXAMPLE_DATA } from '../utils/constants';
import jquery from 'jquery';
import { SessionStorage } from '../stores/SessionStorage';
import { arrayToObject } from '../utils/ArrayUtils';
import { objToQueryString } from '../utils/URLutils';
import { OperationType } from '../models/Operation';
import { strToDate } from '../utils/DateTimeUtils';



var $ = jquery;

// axios.defaults.headers.common['Authorization'] =  'Basic ' + btoa( 'iq:1357' );
class ApiClass{

    axiosInstance;
   
    PREFIX = '/api';
    BASEURL =  PUBLIC_PATH + '/';
    BASEURL_LOCAL = DOMAIN_LOCAL+'/';


    debug = isProduction === false;

    middlewares = [];

    // queryString(params) {
    
    //     if(!params) return '';
    
    
    //     const keys = Object.keys(params);
    //     return keys.length
    //         ? "?" + keys
    //             .map(key => encodeURIComponent(key)
    //                 + "=" + encodeURIComponent(params[key]))
    //             .join("&")
    //         : "";
    // }

    debugMessage(params){
        if( this.debug ){

        }
    }

    invalidateSession(){
        
        return {
            success: false,
            error: {
                code: 9906,
                message: 'Session expired'
            }
        }
    }

    constructor(){
        // this.axiosInstance = axios.create({
        //     baseURL: '/',
        //     timeout: 10000,
        //     responseType: 'json',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'Authorization': 'Basic ' + btoa( 'iq:1357' )
        //         "authorization": "Basic " + btoa('iq:1357')
        //         // 'Authorization': "Basic aXE6MTM1Nw=="
                
        //         // 'X-Custom-Header': 'foobar'
        //     },
        //     withCredentials: true,
        //     // auth: {
        //     //     username: 'iq',
        //     //     password: '1357'
        //     // },
        // });


        // this.axiosInstance = {
        //     get(url){
        //         return $.ajax({
        //             type: "GET",
        //             url: url,
        //             dataType: 'json',
        //             async: false,
        //             headers: {
        //               "Authorization": "Basic " + btoa('iq:1357')
        //             }
        //         }).promise().then(data => {
        //             return { data: data }
        //         });
        //     },
        //     post(url, data){
        //         return $.ajax({
        //             type: "GET",
        //             url: url,
        //             dataType: 'json',
        //             async: false,
        //             headers: {
        //               "Authorization": "Basic " + btoa('iq:1357')
        //             },
        //             data: data
        //         }).promise().then(data => {
        //             return { data: data } 
        //         });
        //     },
        // }


        this.initFetchWrapper();
    }

    catchServerErrors(error){
        window.store.routerStore.navigate('server_error', {});
    }



    initFetchWrapper(){
        var self = this;

        this.axiosInstance = {

            prepHeaders(){
                let username = 'iq';
                let password = '1357';

                let headers = new Headers();


                var sessionHash = SessionStorage.get('sessionHash');

                headers.append('Content-Type', 'text/json');
                // if( !isProduction ){
                    headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));
                    // }

                    if(sessionHash) headers.append('X-Session-Hash', sessionHash);


                
                return headers;
            },
            get(url){

                var headers = this.prepHeaders();

                return fetch(url, {
                        method:'GET',
                        headers: headers,
                        //credentials: 'user:passwd'
                    })
                    .then( response => {

                        return response; 
                    })
                    .then( response => {
                        return response.json().then(data => {
                            return Object.assign({},{
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers,
                                data: data
                            });
                        });
                    })
                    // .then( response => {
                    //     return { data: response }
                    // })
                    .then( data => {
                        
                        self._runMiddlewares( data );
                        return data;
                    })
                    .catch(this.catchServerErrors);
                    
            },
            download(url){

                var headers = this.prepHeaders();

                return fetch(url, {
                        method:'GET',
                        headers: headers,
                        //credentials: 'user:passwd'
                    })
                    .then( response => {
                        // 
                        return response; 
                    })
                    .then( response => response.blob() )
                    .then(blob => {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = "umowa.pdf";
                        a.click();
                    })
                    .catch(this.catchServerErrors);
                    
            },
            post(url, data){

                var headers = this.prepHeaders();

                return fetch(url, {
                        method:'POST',
                        headers: headers,
                        body: JSON.stringify(data)
                        //credentials: 'user:passwd'
                    })
                    .then( response => {
                        //
                        return response; 
                    })
                    .then( response => response.json() )
                    .then( response => {
                        return { data: response }
                    })
                    .then( data => {
                        
                        self._runMiddlewares( data );
                        return data;
                    })
                    .catch(this.catchServerErrors);
                    
            },
            postFormData(url, data){

                var headers = this.prepHeaders();
                headers.delete('Content-Type');
                headers.append('Content-Type', 'multipart/form-data');

                var formData = new FormData();
                formData.append('front', data.front, 'front.jpeg');
                formData.append('back', data.back, 'back.jpeg');
                debugger;

                
                return fetch(url, {
                        method:'POST',
                        headers: headers,
                        body: formData
                    })
                    .then( response => {
                        // 
                        return response; 
                    })
                    .then( response => response.json() )
                    .then( response => {
                        return { data: response }
                    })
                    .catch(this.catchServerErrors);
                    
            },
            put(url, data){

                var headers = this.prepHeaders();
                
                return fetch(url, {
                        method:'PUT',
                        headers: headers,
                        body: JSON.stringify(data)
                        //credentials: 'user:passwd'
                    })
                    .then( response => {
                        // 
                        return response; 
                    })
                    .then( response => response.json() )
                    .then( response => {
                        return { data: response }
                    })
                    .then( data => {
                        self._runMiddlewares( data );
                        return data;
                    })
                    .catch(this.catchServerErrors);
                    
            },
            delete(url, data){

                var headers = this.prepHeaders();
                
                return fetch(url, {
                        method:'delete',
                        headers: headers,
                        body: JSON.stringify(data)
                        //credentials: 'user:passwd'
                    })
                    .then( response => {
                        // 
                        return response; 
                    })
                    .then( response => response.json() )
                    .then( response => {
                        return { data: response }
                    })
                    .then( data => {
                        self._runMiddlewares( data );
                        return data;
                    })
                    .catch(this.catchServerErrors);

            }
        }

    }

    ping(){
        return this.axiosInstance.get(this.PREFIX+'/ping').then(response => {
            //
            return response;
        });
    }

    zz() {
        // routerStore.navigate('home', {});
        // var a = new RouterStore();
        // console.log(this.props);
        // RouterStore.navigate('home', {});
        return this.axiosInstance.get(this.PREFIX+'/zz').then(response=> {
            // console.log(response);
            return response
        })
    }

    /**
     * ZaŁaduj sowniki i podstawowe dane
     * @param {objest} data 
     */
    async preloadAppData(data){

        // var banks = await this.getBanksList();

        try{

          
        var _routes =  this.getRoutes();
        var _dictionaryList =  this.getDictionaryList();
        var _registration =  this.getCategoryData('registration');
        var _mifid =  this.getCategoryData('mifid');
        var _funds =  this.getCategoryData('funds');
        var _cart =  this.getCategoryData('koszyk');
        var _mainpage =  this.getCategoryData('main-page');
        var _cookies =  this.getCategoryData('polityka-prywatnosci');
        var _belkasaver =  this.getCategoryData('belka-saver');
        var _faq =  this.getCategoryData('faq');
        var _metatagi =  this.getMetaTags();
        var _ekranybledow =  this.getCategoryData('ekrany-bledow');
        var _regulamin =  this.getCategoryData('regulamin');
        var _przelewy =  this.getCategoryData('przelewy');
        var _bezpieczenstwo =  this.getCategoryData('bezpieczenstwo');
        var _superlokator =  this.getCategoryData('superlokator');
        var _onas =  this.getCategoryData('o-nas');
        var _login =  this.getCategoryData('login');
        var _stopka =  this.getCategoryData('stopka');
        var _premiaiq =  this.getCategoryData('premia-iq');
        var _portfel =  this.getCategoryData('portfel');
        var _kontakt =  this.getCategoryData('kontakt');
        var _ofunduszach =  this.getCategoryData('o-funduszach');
        var _agreesLead =  this.getAgreesLead();
        var _citizenshipCountry =  this.getCitizenshipDictionary();
        var _pages =  this.getPagesContent();
        var _images =  this.getImages();
        var _lowestBuyMinValue = this.getLowestMinValue();

        var dictionaryList = await _dictionaryList;
        var registration = await _registration;
        var mifid = await _mifid; 
        var funds = await _funds; 
        var koszyk = await _cart;
        var mainpage = await _mainpage; 
        var portfel = await _portfel; 
        var cookies = await _cookies;
        var belkasaver = await _belkasaver; 
        var faq = await _faq;
        var metatagi = await _metatagi;
        var regulamin = await _regulamin;
        var przelewy = await _przelewy;
        var bezpieczenstwo = await _bezpieczenstwo;
        var ekranybledow = await _ekranybledow;
        var superlokator = await _superlokator; 
        var onas = await _onas;
        var login = await _login;
        var stopka = await _stopka;
        var premiaiq = await _premiaiq;
        var kontakt = await _kontakt;
        var ofunduszach = await _ofunduszach;
        var agreesLead = await _agreesLead;
        var citizenshipCountry = await _citizenshipCountry; 
        var images = await _images;
        var pages = await _pages;
        var routes = await _routes;

        var lowestBuyMinValue = await _lowestBuyMinValue;



            
        }catch(e){
            // alert('Internal server error');
            console.error(e);
        }

        if( !dictionaryList.data.success ){
            throw new Error('Cant load main dictionary');
        }

        // debugger;

        var dictionaries = dictionaryList.data.dictionaries;

        


        // {
        //     commonKey: "CONTEXT_CONNECTION_TYPE"
        //     name :"Typ dowiązania contextu do kartotek"
        // }

        var set = [];
        var names = [];
        dictionaries.forEach(d => {
            names.push( d["commonKey"] );
        });

        // debugger;

        var dictionariesSet = await this.getDictionaryContent(names.join(','));
        // tablica slownikow
        var list = [];
       
        if( dictionariesSet.data.success && dictionariesSet.data.dictionaries ){
            list = dictionariesSet.data.dictionaries;
        }else{
            throw Error('Cant load dictionaries')
        }


        
        var obj = {};
        list.forEach( i => {
            // debugger;
            obj[i["commonKey"]] = i;
        });
        list = obj;
        // debugger;

        list.AGREES_LEAD = agreesLead.data;
        list.CITIZENSHIP_COUNTRY = citizenshipCountry;



        return {
            routes,
            dictionaries, list, names, registration, mifid, funds, cookies, belkasaver, regulamin,
            stopka, premiaiq, onas, superlokator, mainpage, images, koszyk, kontakt, portfel, login,
            ofunduszach, faq, metatagi, ekranybledow, lowestBuyMinValue, bezpieczenstwo, pages, przelewy
        }
        
        
    }

    __polandFirst(data){
        var poland = data.items.find(item => item.code === 'PL');

        var arr = [];
        var index = 0;



        if( poland ){
            arr.push(poland);

            index = data.items.indexOf( poland );

            // usun polske i dodaj ja na poczatek
            data.items.splice( index, 1 );

            // przesortuj array alfabetycznie
            data.items = [poland].concat(data.items.sort( (a,b) => a.name < b.name ? -1 : 1));
            /* Uwaga! Łotwa w sortowaniu jest na końcu. Zmień miejsce Łotwy na Luxemburg+1 */
            var luxembourg = data.items.find(item => item.code === 'LU');
            var latvia = data.items.find(item => item.code === 'LV');
            var indexLux = data.items.indexOf( luxembourg );
            var indexLv = data.items.indexOf( latvia );
            // usun łotwę z końca
            data.items.splice( indexLv, 1);
            // dodaj łotwę zaraz po luxemburgu
            data.items.splice( indexLux+1, 0, latvia );
        }


        return data;
    }

    getCitizenshipDictionary(){

        return this.getDictionaryContent('COUNTRY', {
            filter: 'citizenship'
        }).then( data => {
            var dictionary = data.data.dictionaries[0];
            // debugger;
            data.data.dictionaries[0] = this.__polandFirst(dictionary);
            return data;
        });
    }


    registerLead(userData){


        var agrees = userData.getAgreesToSubmit();

        var phone = String(userData.phone).replace(/\+48[ ]?/,'');
        var source, campaign;

        var campParams = window.dataLayer.find(d=>d.event==="STcampParams");
        if( campParams ){

            source = campParams['st.affid'] || '';
            campaign = campParams['st.vmsource'] || '';
        }


        var data =  {
            firstName: userData.firstName,
            mail: userData.mail,
            browserType: userData.browserType,
            phone: `+48${phone}`,
            agrees: agrees,
            mobileUrlTemplate: `${PUBLIC_PATH}/l/{hash}?hm=1`,
            campaign: campaign,
            source: source,
            sourceUrl: document.referrer || '',
        };

        if( !String( document.referrer ).match(/(iqmoney.pl|iqmoney-dev.pl)\/lp\//i) ){
            data.sourceUrl = window.location.href;
        }

        // https://iqmoney.pl/lp/

        // console.log(data);

        var mgm = SessionStorage.getCookie('mgm');
        if( mgm ){
            data.recommendationHash = mgm;
        }


        
        return this.axiosInstance.post(this.PREFIX+'/register/lead',data)
        .then(response => {
            // 
            return response;
        });
    }


    continueOnMobile(mobileHash){


        if( !mobileHash ){
            //console.error(mobileHash);
            throw Error("Mobile hash is undefined");
        }
        
        return this.axiosInstance.get(this.PREFIX+`/register/mobile/${mobileHash}`)
        .then(response => {
            // 
            return response.data;
        });
    }

    continueOnDesktop(leadHash){


        if( !leadHash ){
            // console.error(leadHash);
            throw Error("leadHash hash is undefined");
        }
        
        return this.axiosInstance.post(this.PREFIX+`/register/lead/${leadHash}/continue-desktop`)
        .then(response => {

            return response.data;
        });
    }

    async registerClient(userData, leadHash){

        var status = await this.getLeadStatus(leadHash);

        // debugger;
        var person = userData.preparePersonData();
        var agrees = userData.getAgreesToSubmit();
        // debugger;

        var data = {
            'sequenceNumber': userData.sequenceNumber,
            "nextBrowserType": "DESKTOP",
            "person": person,
            "agrees": agrees
        };


        
        return this.axiosInstance.post(this.PREFIX+`/register/client/${leadHash}`, data)
        .then(response => {

            return response;
        });
    }

    async updateClient(userData, leadHash, params = {}){

        var { sequenceNumber, completed } = userData;
        // var status = await this.getLeadStatus(leadHash);


        // debugger;
        var person = userData.preparePersonData();
        var agrees = userData.getAgreesToSubmit();

        if( params['agrees'] ){
            agrees = agrees.concat( params['agrees'] );
        }

        var data = {
            // "nextBrowserType": "DESKTOP",
            'sequenceNumber': sequenceNumber,
            "person": person,
            "completed": completed,
            "agrees": agrees
        };

        if( userData.getValue('investmentTypeCode') ){
            data.investmentTypeCode = userData.getValue('investmentTypeCode');
        };
        
        return this.axiosInstance.put(this.PREFIX+`/register/client/${leadHash}`, data)
        .then(response => {

            return response;
        });
    }

    /**
     * Wysyłka maila formularz kontaktowy
     *
     * @param {String} name imię i nazwisko
     * @param {String} mail mail klienta
     * @param {String} phone numer telefonu
     * @param {String} message treść wiadomości
     *
     * /contact
     *
     */
    sendContactForm = (name, mail, phone, message, secretKey) => {
        var data = {
            mail: mail,
            name: name,
            phone: phone,
            message: message,
            recaptcha: secretKey
        }

        return this.axiosInstance.post(this.PREFIX+'/contact', data)
        .then(
            response => {

                return response;
            }
        )

    }

    // RESET HASŁA (PRZYPOMNIENIE)

    /**
     * Reset hasła klienta (init)
     *
     * @param {String} login e-mail klienta
     *
     * /password-reset
     */
    passwordResetInit = login => {

        var data = {
            login: login,
            resetUrlTemplate: `${PUBLIC_PATH}/przypomnienie-hasla/reset/{hash}`
        }


        return this.axiosInstance.post(this.PREFIX+'/password-reset', data)
        .then(
            response => {

                return response;
            }
        )
    }

    /**
     * Reset hasła klienta (check)
     *
     * Weryfikacja aktywności zlecenia resetu hasła
     *
     * @param {String} hash hash-z-url
     *
     * /password-reset/{resetHash}
     */
    passwordResetCheck(resetHash) {
        return this.axiosInstance.get(this.PREFIX+'/password-reset/'+resetHash).then(
            response => {

                return response;
            }
        )
    }
    /**
     * Reset hasła klienta (set)
     *
     * Ustawienie nowego hasła i wysłanie SMS
     *
     * @param {String} password haslo usera
     * @param {String} hash hash-z-url
     *
     * /password-reset/{resetHash}
     */
    passwordResetSet(password, resetHash) {
        var data ={
            newPassword: password
        }
        return this.axiosInstance.post(this.PREFIX+'/password-reset/'+resetHash, data)
        .then(
            response => {

                return response
            }
        )
    }
    /**
     * Potwierdzenie kodem SMS zmiany hasła
     * URL confirmation moze byc inny niz zwykle
     *
     * @param {String} code kodSMS
     * @param {String} url adres-url
     */
    passwordSMSConfirm(code, confirmationURL) {
        var data = {
            code: code
        }
        return this.axiosInstance.post(this.PREFIX+confirmationURL, data)
        .then(
            response => {

                return response
            }
        )
    }




    /**
     * Pobierz status leda
     * ead5fdc9bd168707bb1b24ac2046e3b1e5d95139
     * /register/lead/{leadHash}/status
     */
    registerLeadStatusGet(leadHash){

      
        
        return this.axiosInstance.get(this.PREFIX+`/register/lead/${leadHash}/status`)
        .then(response => {

            return response;
        });
    }
    getLeadStatus(leadHash){
        return this.registerLeadStatusGet( leadHash );
    }
    setLeadStatus(leadHash, status){
        return this.registerLeadStatusSet(leadHash, status);
    }
    /**
     * Ustaw status leda
     * /register/lead/{leadHash}/status
     */
    registerLeadStatusSet(leadHash, status){

        var {code, value} = status;
        
        return this.axiosInstance.put(this.PREFIX+`/register/lead/${leadHash}/status`, {
            code, value
        } )
        .then(response => {
            

            var data = response.data;
            return data;
        });
    }

    
    /**
     * GET /register/continue/{continuationHash}
     */
    async getRegisterContinuation(continuationHash){

        
        return this.axiosInstance.get(this.PREFIX+`/register/continue/${continuationHash}` )
        .then(response => {
            
            var data = response.data;
            return data;
        });
    }


    
    /**
     * POST /register/continue
     * Request:
     * ```
    {
        "login": "string",
        "continueUrlTemplate": "https://.../d4r0...h45H"
    }
     * ```
     */
    async createRegisterContinuation(data){

        var { login=null, continueUrlTemplate=null } = data;
        data.continueUrlTemplate = PUBLIC_PATH + "/kontynuacja-rejestracji/{hash}";

      
        return this.axiosInstance.post(this.PREFIX+`/register/continue`, data )
        .then(response => {
            
            var data = response.data;
            return data;
        });
    }




    async getPagesContent(){
        return this.axiosInstance.get(this.PREFIX+`/pages`)
        .then(response => {
            
            return response;
        });

    
    }

    async getSinglePageContent(id){
        return this.axiosInstance.get(this.PREFIX+`/pages/${id}`)
        .then(response => {
            
            return response;
        });

    
    }


    // DICTIONARY
    
    /**
     * /dictionary/main
     */
    getDictionaryList(){

        return this.axiosInstance.get(this.PREFIX+`/dictionary/main`)
        .then(response => {
            
            return response;
        });
    }

    getBanksList(){

        return this.axiosInstance.get(this.PREFIX+`/dictionary/banks`)
        .then(response => {
            
            return response;
        });
    }

    /**
     * /dictionary/main/{commonKey}
     * @param {string} commonKey name | name,name2,name3
     */
    getDictionaryContent(commonKey, params = null){

        return this.axiosInstance.get(this.PREFIX+`/dictionary/main/${commonKey}`, params)
        .then(response => {
            
            return response;
        }).then( data => {
            // debugger;
            if( !data.data || !data.data.dictionaries || !data.data.dictionaries.length ){
                // console.error( data );
                throw Error(`Cant load dictionary content ${commonKey}`);
            }

            data.data.dictionaries.map(dictionary => {
                if( dictionary['commonKey'] === 'COUNTRY' ){
                    // debugger;
                    dictionary = this.__polandFirst(dictionary) ;
                }
            });


            // debugger;
            return data;
        });
    }


    // CHART data
    /**
     * Pobieranie wykresu
     * http://54.38.131.185/api/content
     * @return {Promise}
     */
    getChartData(hash, dateFrom, dateTo) {

        return this.axiosInstance.get(this.PREFIX+`/offer/fund/${hash}/valuations?dateFrom=${dateFrom}&dateTo=${dateTo}`)
        .then(response => {
            
            return response;
        });
    }

    /**
     * Pobranie minimalnej wartości dla firstBuyMinValue
     * potrzebnej do ustalenia kropek w filtrowaniu
     */
    getLowestMinValue() {

        return this.axiosInstance.get(this.PREFIX+`/offer/fund?take=100000&onlyMinValue=1`)
        .then(response => {
            if(response.data.success) {

                return response.data.min

            }

        })

    }


    // CMS

    /**
     * Lista kategorii tekstowych
     * http://54.38.131.185/api/content
     * @return {Promise}
     */
    getCategories(){

        return this.axiosInstance.get(this.PREFIX+`/content`)
        .then(response => {
            
            return response;
        });
    }

    /**
     * Lista kategorii tekstowych
     * http://54.38.131.185/api/content/registration
     * @param {string} category_name nazwa kategorii
     * @return {Promise}
     */
    getCategory(category_name){

        return this.axiosInstance.get(this.PREFIX+`/content/${category_name}`)
        .then(response => {
            
            return response;
        });
    }
    getCategoryData(category_name){

        return this.getCategory( category_name ).then( response => {
            var data = response.data;

            var asObject = {};
            // debugger;
            
            if( data ){
                if( !data || !data.forEach ){
                    throw Error( `nie mogę załadować kategorii ${category_name} ` );
                }

                data.forEach( el => {
                    asObject[el.name] = el.value;
                });

            }else{
                debugger;
                console.error(data);
            }


            return asObject;
        });
    }



    // OCR
    // https://iqm.core/register/lead/{leadHash}/document
    // {
    //     "front": {
    //     "content": "0KGgoAAA ... AoLQ9TA==",
    //     "mime-type": "image/jpeg",
    //     "size": 352,
    //     "file-hash": "a982aba5ea105969780a8bc7fafafcdc"
    //     },
    //     "back": {
    //     "content": "0KGgoAAA ... AoLQ9TA==",
    //     "mime-type": "image/png",
    //     "size": 420,
    //     "file-hash": "a982aba5ea105969780a8bc7fafafcdc"
    //     },
    //     "client-context": null,
    //     "response-callback": "string"
    //     }

    /**
     * Upload ocr files
     */
    registerLeadDocument( leadHash, data ){
         
   
        // return this.axiosInstance.postFormData(this.PREFIX+`/register/lead/${leadHash}/document`, data, {
        return this.axiosInstance.post(this.PREFIX+`/register/lead/${leadHash}/document/upload`, data, {
            timeout: 160 * 1000
        })
        .then(response => {
            
            return response.data;
        });


    }
    runOcr( leadHash ){
         
   
        return this.axiosInstance.post(this.PREFIX+`/register/lead/${leadHash}/document`)
        .then(response => {

            return response.data;
        });


    }

    getLeadDocument(leadHash){
            
        
        return this.axiosInstance.get(this.PREFIX+`/register/lead/${leadHash}/document`)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * Subskrypcja newslettera
     *
     * @param {String} mail e-mail
     */
    subscribeNewsletter = mail => {
        var data = {
            email: mail
        }
        return this.axiosInstance.post(this.PREFIX+'/newsletter/subscribe', data)
        .then(response => {

            return response;
        });
    }

    /**
     * Usunięcie subskrypcji newslettera
     *
     * @param {String} mail e-mail
     */
    unSubscribeNewsletter = mail => {
        var data = {
            email: mail
        }
        return this.axiosInstance.post(this.PREFIX+'/newsletter/unsubscribe', data)
        .then(response => {

            return response;
        });
    }

    

    /**
     * Pobranie listy zgód.
     * Lista zgód wymaganych w procesie rejestracji klienta.
     * 
     * [{ 
     *   code: "LEAD_INF-HANDLOWA"
     *   description: "Wyrażam zgodę na otrzymywanie od IQ Money Sp. z o.o. informacji handlowej za pomocą środków komunikacji elektronicznej"
     *   hash: "37e4a6d8dd0033bd9534be4067d1b09f"
     *   title: "Informacja handlowa"
     * }]
     */
    getAgreesLead(){
           
        return this.axiosInstance.get(this.PREFIX+`/dictionary/agrees/lead`)
        .then(response => {
            
            return response;
        });
    }

    

    /**
     * Pobranie listy zgód dla klienta.
     * Zgody potrzebne w procesie procesowania zamówienia gdy klientowi brakuj jkieś dane.
     */
    getAgreesForClient(){
           
        return this.axiosInstance.get(this.PREFIX+`/dictionary/agrees/client`)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * /dictionary/address/{postCode}
     */
    getAddres(postalCode){

        if( !postalCode ){
            throw new Error('postalCode is empty')
        }

        return this.axiosInstance.get(this.PREFIX+`/dictionary/address/${postalCode}`)
        .then(response => {
            
            return response;
        });
    }


    /** 
     * API FUNDUSZY
     */


    /**
     * Pobranie listy funduszy
     * 
     * /offer/tfi
     */
    offerTfi(){

        return this.axiosInstance.get(this.PREFIX+`/offer/tfi`)
        .then(response => {
            
            return response;
        });
    }
    /**
     * Pobierz listę funduszy
     */
    offerFund(data){

        // console.log(this);
        // debugger;
        // console.log(queryString);
        return this.axiosInstance.get(this.PREFIX+`/offer/fund`+ objToQueryString( data ) )
        .then(response => {
            
            return response.data;
        });
    }
    /**
     * Pobierz listę funduszy
     */
    offerFundBySlug(slug){

        return this.axiosInstance.get(this.PREFIX+`/offer/fund/${slug}`)
        .then(response => {
            
            return response.data;
        });
    }
    offerFundByHash(hash){

        return this.axiosInstance.get(this.PREFIX+`/offer/fund/byHash/${hash}`)
        .then(response => {
            
            return response.data;
        });
    }





    // ============= KOSZYK ================

    /**
     * Pobranie koszyka leada
     * 
     * /register/lead/{leadHash}/cart
     * 
     * @param {string} leadHash
     */
    getLeadCart(leadHash){

        return this.axiosInstance.get(this.PREFIX+`/register/lead/${leadHash}/cart`)
        .then(response => {
            
            return response.data;
        });
    }


    // _createCart(prefix, hash, data){

    //     if( !prefix ){
    //         throw Error("Prefix is undefined");
    //     }
        
    //     return this.axiosInstance.get(this.PREFIX+` /${prefix}/lead/${leadHash}/cart`)
    //     .then(response => {
    //         
    //         return response.data;
    //     });
    // }

    /**
     * Utworzenie koszyka leada
     * 
     * /register/lead/{leadHash}/cart
     * 
     * 
     * @param {string} leadHash 
     * @param {object} data 
     */
    createLeadCart(leadHash, data){
        /*
        var exampleData = {
            "funds": [
                {
                "itemHash": "39b4...f12d",
                "operation": "string",
                "amount": 1234.56
                }
            ],
            "deposits": [
                {
                "itemHash": "46b4...f96d",
                "operation": "string",
                "amount": 1234.56
                }
            ]
        };
        */

        return this.axiosInstance.post(this.PREFIX+`/register/lead/${leadHash}/cart`, data)
        .then(response => {
            
            return response.data;
        });
    }
       
    /**
     * Utworzenie koszyka klienta
     * 
     * /client/${clientHash}/cart
     * 
     * 
     * @param {string} clientHash 
     * @param {object} data 
     */
    async createClientCart(clientHash, data){

        if( !clientHash ){
            return  this.invalidateSession();
        }
        /*
        var exampleData = {
            "funds": [
                {
                "itemHash": "39b4...f12d",
                "operation": "string",
                "amount": 1234.56
                }
            ],
            "deposits": [
                {
                "itemHash": "46b4...f96d",
                "operation": "string",
                "amount": 1234.56
                }
            ]
        };
        */

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/cart`, data)
        .then(response => {
            
            return response.data;
        });
    }
       
       
    /**
     * Pobranie koszyka klienta
     * Response:
     * ```
        {
            "funds": [
                {
                "itemHash": "39b4...f12d",
                "operation": "string",
                "amount": 1234.56
                }
            ],
            "deposits": [
                {
                "itemHash": "46b4...f96d",
                "operation": "string",
                "amount": 1234.56
                }
            ]
        }
     * ```
     * 
     * /client/${clientHash}/cart
     * 
     * @param {string} clientHash 
     */
    async getClientCart(clientHash){
        // debugger;
        if( !clientHash ){
            return Promise.reject( this.invalidateSession() );
        }
        /*
        var exampleData = {
            "funds": [
                {
                "itemHash": "39b4...f12d",
                "operation": "string",
                "amount": 1234.56
                }
            ],
            "deposits": [
                {
                "itemHash": "46b4...f96d",
                "operation": "string",
                "amount": 1234.56
                }
            ]
        };
        */

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/cart`)
        .then(response => {
            
            // this._runMiddlewares( response.data );

            return response.data;
        });
    }
       
    /**
     * Pobranie koszyka IQ
     * GET /client/{clientHash}/iqcart
     * Response:
     * ```
{
  "success": true,
  "funds": [
    {
      "hash": "a047...6061",
      "sourceItemHash": "b308...24d9",
      "destinationItemHash": "a05b...73ba",
      "operation": "buy",
      "amount": 1234.56
    }
  ]
}
     * ```
     * 
     * 
     * @param {string} clientHash 
     */
    async getIQCart(clientHash){
        
        if( !clientHash ){
            return  this.invalidateSession();
        }
       
        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/iqcart`)
        .then(response => {
            
            return response.data;
        });
    }


    async confirmIQCart(clientHash, confirmationData){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/iqcart`, confirmationData)
        .then(response => {
            
            return response.data;
        });
    }


    /**
     * https://iqm.core/client/{clientHash}/cart/fund/{entryHash}
     * @param {string} clientHash 
     * @param {string} cartItem 
     */
    async updateFundInClientCart(clientHash, cartItem){
        var { itemHash, amount, cycleAmount, operation, hash } = cartItem;
        
        return this.axiosInstance.put(this.PREFIX+`/client/${clientHash}/cart/fund/${hash}`, { itemHash, amount, cycleAmount, operation })
        .then(response => {
            
            return response.data;
        });
    }
    /**
     * https://iqm.core/client/{clientHash}/cart/fund/{entryHash}
     * @param {string} clientHash 
     * @param {string} entryHash 
     */
    async removeFundFromClientCart(clientHash, entryHash){
        
        return this.axiosInstance.delete(this.PREFIX+`/client/${clientHash}/cart/fund/${entryHash}`)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * /client/{clientHash}/cart/fund
     * 
     * @param {object} data 
     * ```
        {
        "success": true,
        "fund": {
            "hash": "ccf0...4ee6",
            "operation": "buy",
            "amount": 1234.56,
            "cycleAmount": 1234.56,
            "itemHash": "d747...cb76",
            "itemUrl": "/offer/fund/b984...8aaf"
        },
        "url": "/client/abba...6924/cart/fund/baab...5972"
        }
     * ```
     * 
     * @param {string} clientHash 
     */
    async addFundToClientCart(clientHash, data){
        
        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/cart/fund`, data)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * Wczytanie plików - jako type podaj nazwę z api
     *
     * /files/:type
     *
     * @param {string} type
     */
    getFileList(type) {
        return this.axiosInstance.get(this.PREFIX+`/files/${type}`)
            .then(response => {

                return response.data
            })
    }

    /**
     * Wczytywanie FAQ
     *
     * @param {string} queryString
     *
     * tags[]=Inwestycje
     * question=sampleText
     *
     */
    getFAQ(queryString='') {
        return this.axiosInstance.get(this.PREFIX+'/faq'+queryString)
            .then(response => {
                return response
            })
    }

    /**
     * Wczytywanie obrazków
     *
     * @param {string} name
     */
    getImages() {
        return this.axiosInstance.get(this.PREFIX+`/images`)
            .then(response => {
                // debugger;
               return arrayToObject( response.data.items, 'name' );

            });
    }

    /**
     * Wczytywanie metatagów
     *
     */
    getMetaTags() {
        return this.axiosInstance.get(this.PREFIX+'/meta-tags')
            .then(response => {

                return arrayToObject( response.data.items, 'name' );

            });
    }

    /**
     * Wczytywanie elementów powtarzalnych
     *
     * /sliders/:name
     *
     * jeśli name jest undefined wtedy pobiera wszystkie elementy powtarzalne
     *
     * @param {string} name
     */
    getRepeatedFields(name) {
        var name = name ? name : '';
        return this.axiosInstance.get(this.PREFIX+`/sliders/${name}`)
            .then(response => {

                return response.data
            })

    }

    /**
     * Sprawdzanie poprawnosci linku MGM
     *
     * @param {string} mgmLink
     */
    checkMgmLink(mgmLink) {
        return this.axiosInstance.get(this.PREFIX+`/register/recommendation/superlokator/${mgmLink}`)
            .then(response => {

               return response.data

            });
    }

    /**
     * Zwraca szczegóły superlokatora
     * http://54.38.58.193:2900/client/{clientHash}/promotions/superlokator
     *
     * @param {string} clientHash
     */
    async getPromotionsSuperlocator(clientHash) {
         
        if( !clientHash ){
            return  this.invalidateSession();
        }
        
        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/promotions/superlokator`)
            .then(response => {
                
               return response.data

            });
    }

    
    /**
     * Update koszyka klienta
     * 
     * /client/${clientHash}/cart
     * 
     * 
     * @param {string} clientHash
     * @param {object} data 
     */
    updateClientCart(clientHash, data){
     

        return this.axiosInstance.put(this.PREFIX+`/client/${clientHash}/cart`, data)
        .then(response => {
            
            return response.data;
        });
    }


    /**
     * Czyszczenie koszyka klienta
     * 
     * /client/${clientHash}/cart
     * 
     * 
     * @param {string} clientHash
     */
    deleteClientCart(clientHash){

        return this.axiosInstance.delete(this.PREFIX+`/client/${clientHash}/cart`)
        .then(response => {
            
            return response.data;
        });
    }
       
       



    // CLIENT API


    
    clientSignIn(login, password){

        return this.axiosInstance.post(this.PREFIX+`/client/signin`, { login, password })
        .then(response => {
            
            return response.data;
        });
    }
       
    /**
     * PUT /client/{clientHash}/password
     */
    clientPasswordChange(clientHash, data){
        return this.axiosInstance.put(this.PREFIX+`/client/${clientHash}/password`, data)
        .then(response => {
            
            return response.data;
        });
    }
       
    /**
     * Pobranie listy rachunków do konta
     * GET /client/{clientHash}/person/{personHash}/account
     * Response:
     * ``` 
        {
        "hash": "e6a3...5936",
        "accountNo": "650837084002280651877374525599",
        "ownerName": "Adam",
        "ownerSurname": "Abacki",
        "bankHash": "2ea0...2e68"
        }
     * ```
     */
    getClientPersonAccount(clientHash, personHash){
        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/person/${personHash}/account`)
        .then(response => {

            return response.data;
        });
    }

    /**
     * Miniatury logo banku
     * Zwraca szczegóły wszystkich miniatur logo banku na podstawie identyfikatora banku
     *
     * @param {string} {bankHash}
     */

    getDictionaryOfBankImages(bankHash) {
        return this.axiosInstance.get(this.PREFIX+`/dictionary/banks/${bankHash}/thumbnails`)
        .then(response => {

            return response.data;
        });
    }

    /**
     *Pobanie miniatury logo banku
     *Pobranie pliku miniatury logo banku o wskazanym identyfikatorze. Uwaga Akcja nie jest typową akcją API. Odpowiedź nie jest kodowana jako JSON, ale jako plik w postaci binarnej.
     */
    getBankImage(bankHash, thumbnailHash) {
        return PUBLIC_PATH + `/api/dictionary/banks/${bankHash}/thumbnails/${thumbnailHash}`
    }


    /**
     * POST /password-reset
     * @param {string} email
     * @returns {Promise}
     */
    resetPassword(email){
        
        return this.axiosInstance.post(this.PREFIX+`/password-reset`, {
            "login": email,
            "resetUrlTemplate": "/reset/{hash}"
        })
        .then(response => {
            
            return response.data;
        });
    }
    
       

    
    /**
     * DELETE https://iqm.core/client/{clientHash}/signout
     * @param {clientHash} clientHash 
     */
    clientSignOut(clientHash){

        

        return this.axiosInstance.delete(this.PREFIX+`/client/${clientHash}/signout`)
        .then(response => {
            
            return response.data;
        });
    }






    /**
     * pobierz dane klienta
     * GET /client/{clientHash}
     * Response:
     * ```
{
  "success": true,
  "invalidLoginTries": 0,
  "lastValidLogin": "2018-05-30 14:02:37.082864",
  "lastInvalidLogin": "2018-05-30 14:02:37.082864",
  "isVerified": true,
  "isPsdm": true,
  "name": "Jan",
  "surname": "Kowalski"
}
     * ```
     * @param {string} clientHash 
     */
    getClient(clientHash){

        if( !clientHash ){
            return Promise.reject({
                success:false,
                error:{ message:'Klient niezalogowany' } 
            });
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}`)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * Pobiera kartotekę klienta
     * GET /client/{clientHash}/person/{personHash}
     */
    getClientFile(clientHash, personHash){

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/person/${personHash}`)
        .then(response => {
            
            return response.data;
        });
    }


    /**
     * Pobierz adres z kartoteki osoby
     * @param {string} clientHash 
     * @param {string} personHash 
     * @param {string} personAddressHash 
     */
    getClientAddress(clientHash, personHash, personAddressHash){

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/person/${personHash}/address/${personAddressHash}`)
        .then(response => {
            
            return response.data;
        });
    }

    /**
     * Pobierz adres z kartoteki osoby
     * @param {string} clientHash 
     * @param {string} personHash 
     * @param {string} personDocumentHash 
     */
    getClientDocument(clientHash, personHash, personDocumentHash){

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/person/${personHash}/document/${personDocumentHash}`)
        .then(response => {
            
            return response.data;
        });
    }


    

    async getFullClient(clientHash){
        var mainPerson;
        var client = await this.getClient(clientHash);

        if( !client.success ){
            return Promise.reject(client);
        }
        // debugger;
        mainPerson = client.personList && client.personList.length > 0 && client.personList.find(p=> p.connectionType.code === "person-main" );

        if( !mainPerson ){
            return Promise.reject({
                success: false,
                error:{
                    code: 4012,
                    message:'Nie znaleziono kartoteki głównej klienta'
                }
            });
        }

        var mainPersonHash = mainPerson.hash;
        

        var file = await this.getClientFile(clientHash, mainPersonHash);

        if( !file.success ){
            return Promise.reject(file);
        }

        // var file = await this.getClientFile(clientHash);

        //Pobierz adresy
        var addressHashes = file.addressList.map( address => address.hash );
        var addressesPromises = addressHashes.map( hash => this.getClientAddress(clientHash, mainPersonHash, hash) );
        var adresses = await Promise.all(addressesPromises);

        file.addressList = file.addressList.map( (address,i) => {
            return Object.assign({}, address, adresses[i] );
        });

        
        
        //Pobierz dokumenty
        var documentsHashes = file.documentList.map( doc => doc.hash );
        var documentsPromises = documentsHashes.map( hash => this.getClientDocument(clientHash, mainPersonHash, hash) );
        var documents = await Promise.all(documentsPromises);

        file.documentList = file.documentList.map( (document,i) => {
            return Object.assign({}, document, documents[i] );
        });

        
        

        return {
            success: true,
            client: client,
            file: file,
            mainPerson: mainPerson,
            adresses: adresses,
            documents: documents
        }
    }




    
    /**
     * MIFID
     * ```
        {
        "answers": [
            {
            "question": "q1",
            "answer": true
            }
        ],
        "version": 1,
        "refusal": false
        }
     * ```
     * Response:
     * ```
        {
        "hash": "d4r0...h45H",
        "scoring": 1,
        "validUntil": "2019-05-17 17:38:48",
        "refusal": false,
        "success": true
        }
     * ```
     * POST /client/{clientHash}/mifid
     * @param {string} clientHash
     * @param {Object} data { answers: [{"question":name, "answer": data}] }
     */
    async clientMifidSave(clientHash, data){
        
        if( !clientHash ){
            return this._requireClientHash(clientHash);
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/mifid`, data)
        .then(response => {
            this.debugMessage( response );


            return response.data;
        });
    }

    
    /**
     * Pobierz aktualny MIFID:
     * GET /client/{clientHash}/current-mifid
     * ```
     * {
        "success": true,
        "hash": "05d6...8095",
        "scoring": 1,
        "validUntil": "2021-05-17 17:38:48",
        "filledDate": "2018-05-17 17:38:48",
        "refusal": false
        }
     * ```
     * @param {string} clientHash
     */
    async clientCurrentMifid(clientHash){

        if( !clientHash ){
            return this._requireClientHash(clientHash);
        }
        

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/current-mifid`)
        .then(response => {
            this.debugMessage( response );

            if( !response.data.success ){
                return Promise.reject( response.data );
            }

            return response.data;
        });


        
    }



    // WERYFIKACJA PLATNOSCI
    

    /**
     * Usługa zwraca listę elementów - dostępnych metod płatności za pośrednictwem usługodawcy - Bluemedia
     * GET /dictionary/payways/bluemedia
     * ```
     * {
        "success": true,
        "payways": [
            {
            "name": "Przelew PKOBP",
            "hash": "638f...65f8",
            "iconUrl": "https://.../19.png",
            "type": {
                "code": "quick",
                "value": 2,
                "name": "Szybki Przelew"
            }
            }
        ]
        }
     * ```
     */
    async dictionaryPaywayBlumedia(){

        return this.axiosInstance.get(this.PREFIX+`/dictionary/payways/bluemedia`)
        .then(response => {
            this.debugMessage( response );

            if( !response.data.success ){
                return Promise.reject( response.data );
            }

            return response.data;
        });
    }




    async dictionaryPaywayKir(){

        return this.axiosInstance.get(this.PREFIX+`/dictionary/payways/kir`)
        .then(response => {
            this.debugMessage( response );

            if( !response.data.success ){
                return Promise.reject( response.data );
            }

            return response.data;
        });
    }

    /**
     * Weryfikacja metodą 'Pay By Link'
     * Inicjalizuje weryfikację klienta przy pomocy przelewu na symboliczną kwotę. Uderzenie powoduje rozpoczęcie procesu w serwisie zewnętrznym i zwrócenie kodu służącego do przekierowania klienta do systemu płatności.
     * Resource wymaga podania poprawnego hash kanału płatności z BlueMedia.
     * POST /client/{clientHash}/verify-pbl
     * Request:
     * ```
        {
        "paywayHash": "b04a...9f52",
        "responseCallback": "/payment/status",
        "clientContext": "clientContext"
        }
     * ```
     * 
     * Response:
     * ```
        {
        "success": true,
        "paymentCode": "<!-- FORM --><form><!-- ... --></form><!-- END FORM -->",
        "orderId": "hBVCgz9qnc0TuYSaCTBmlJIScaKxjx6p",
        "hash": "3a7a...3785",
        "clientContext": "..."
        }
     * ```
     * @param {string} clientHash
     */
    async clientVeriyPbl(clientHash, data){
        
        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/verify-pbl`, data)
        .then(response => {
            this.debugMessage( response );

            if( !response.data.success ){
                return Promise.reject( response.data );
            }

            return response.data;
        });
    }

    /**
     * Weryfikacja metodą 'Fast transfer'
     * Inicjalizuje weryfikację klienta przy pomocy przelewu na symboliczną kwotę. Uderzenie powoduje rozpoczęcie procesu w serwisie zewnętrznym i zwrócenie kodu służącego do przekierowania klienta do systemu płatności.
     * Resource wymaga podania poprawnego hash kanału płatności z BlueMedia.
     * /client/{clientHash}/verify-ft
     * ```
   {
  "success": true,
  "payment": null
}

     * ```
     * @param {string} clientHash
     */
    async clientVeriyFastTransfer(clientHash, data){
        
        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/verify-ft`, data)
        .then(response => {
            this.debugMessage( response );

            if( !response.data.success ){
                return Promise.reject( response.data );
            }

            return response.data;
        });
    }

    /**
     * Pobiera odpowiedź z BlueMedia o szybkim przelewie Quick
     *
     * @param {string} clientHash
     */
    async fastPaymentStatus(clientHash) {

        return this.axiosInstance.get(this.PREFIX+`/payment/user/status/${clientHash}`)
        .then(response => {
            return response.data
        })

    }

    /**
     * Pobiera odpowiedź Bluemedia po orderId z powyższych metod .
     * Jeśli odpowiedzi jeszcze nie ma, będzie error z code: 1
     * /payment/status/:orderId
     * Response: 

     * @param {string} orderId
     */
    async paymentStatus(orderId, data){

        return this.axiosInstance.get(this.PREFIX+`/payment/status/${orderId}`)
        .then(response => {
            this.debugMessage( response );
            var clientContext;

            // if( !response.data.success ){
            //     return Promise.reject( response.data );
            // }
            var item = response.data.item;
            if( item && item['clientContext'] ){
                var clientContext = JSON.parse(item['clientContext']);
                response.data.item.clientContext = clientContext;
            }
            

            return response.data;
        });
    }

    /**
     * Tworzenie nowej płatności dla operacji
     * Akcja tworzenia nowej płatności dla dostarczonej operacji. Z założenia powinna być wykorzystana, 
     * jeśli uprzednio zainicjowana płatność nie powiodła się z jakiś przyczyn (przedawnienie, odrzucenie), 
     * a klient chce spróbować wykonać płatność za operację ponownie.
     * Uwaga: Wykorzystanie tej akcji w opisanym powyżej przypadku jest niezwykle ważne, ponieważ próba ponownego 
     *        zainicjowania płatności zawsze zakońćzy się błędem.
     * POST /client/{clientHash}/payment
     * Request:
     * ```
        {
            "operationHash": "d4r0...h45H",
            "fundHash": "d4r0...h45H",
            "amount": 1234.56
        }
     * ```
     * 
     * Response: 
     * ```
        {
            "payment": {
                "hash": "d4r0...h45H",
                "amount": 1234.56,
                "idTransaction": "u2YuuBrUGt",
                "statusCode": "new",
                "title": "IQ money 2018-06-06 j1s56weQ90",
                "accountNo": "097409026459104453705255435123",
                "accountName": "Altus Akcji A",
                "creationTime": "2018-06-20T23:55:10"
            },
            "success": true
        }
     * ```
     * @param {string} data.clientHash
     * @param {string} data.operationHash
     * @param {string} data.fundHash
     * @param {string} data.amount
     */
    async createNewPayment(data = {}){
        var {
            clientHash,
            operationHash,
            fundHash,
            amount
        } = data;

        
        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/payment`, data)
        .then(response => {
            this.debugMessage( response );
          

            return response.data;
        });
    }

  

    

    /**
     * GET /client/{clientHash}/payment/{paymentHash}/offline
     * Response:
     * ```
        {
        "success": true,
        "title": "IQ money 2018-06-15 Adasd",
        "accountNo": "701160516031870112582096413030",
        "accountName": "Altus TFI",
        "accountAddress": "02-200 Warszawa Marszałkowska 105 lok. 30",
        "amount": 1000.1
        }
     * ```
     * 
     */
    async getPaymentOfflineInfo(clientHash, paymentHash){
        
        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/payment/${paymentHash}/offline`)
        .then(response => {
            this.debugMessage( response );
           
            

            return response.data;
        });
    }



    /**
     * Inicjalizacja płatności 
     * Inicjalizuje wskazaną płatność u operatora płatności, czyli defacto uruchamia proces płatności dla klienta.
     * Proces jest dość silnie sterowany zdarzeniami. Nie ma wpływu na to, kiedy klient dokładnie płatność wykona 
     * i w jakim czasie płatność zostanie zanotowana przez operatora. W związku z tym klient API musi oczekiwać na powiadomienia 
     * o zmianie statusu płatności, tak samo jak core oczekuje na takie powiadomienia od operatora płatności. 
     * 
     * Powiadomienia o statusie płatności są przekazywane do front na adres wskazany przy inicjalizacji płatności w jednym z parametrów 
     * (zgodnie z konwencją responseCallback). Odpowiedź jest przekazywana poprzez żądanie metodą POST, a w jego treści przekazywanej w formacie 
     * 
     * /client/{clientHash}/payment/{paymentHash}
     * Response: 
    
     * @param {string} clientHash
     * @param {string} paymentHash
     * @param {string} operationHash
     * @param {string} paywayHash
     */
    async initOperationPaymentOnline( params ){
        var { 
            clientHash,
            paymentHash,
            operationHash,
            paywayHash,
            operation_type
        } = params;

        

        // {
        //     "operationHash": "b899...253c",
        //     "paywayHash": "417a...c1d8",
        //     "returnUrl": "https://iqm.pl/payment/success",
        //     "rejectUrl": "https://iqm.pl/payment/reject",
        //     "responseCallback": "/payment/status",
        //     "clientContext": "test"
        // }

     


        // debugger;


            var payload = Object.assign({},{
                "operationHash": operationHash,
                "paywayHash": paywayHash,
                "returnUrl": `${this.BASEURL_LOCAL}platnosc/success/${paymentHash}`,
                "rejectUrl": `${this.BASEURL_LOCAL}platnosc/error/${paymentHash}`,
                "responseCallback": "/api/payment/status",
                "clientContext": JSON.stringify({
                    clientHash,
                    paymentHash,
                    paywayHash, 
                    operationHash
                    // sessionHash: SessionStorage.sessionHash,
                })
            });


            return this.axiosInstance.put(this.PREFIX+`/client/${clientHash}/payment/${paymentHash}`, payload)
            .then(response => {
                this.debugMessage( response );

                if(!response){
                    return {
                        success: true
                    }
                }
    
                // debugger;
                
                var clientContext;
    
              
                var item = response.data.item;
                if( item && item['clientContext'] ){
                    var clientContext = JSON.parse(item['clientContext']);
                    response.data.item.clientContext = clientContext; 
                }
                
    
                return response.data;
            });
        


    }

    /**
     * Inicjalizacja płatności 
     * Inicjalizuje wskazaną płatność u operatora płatności, czyli defacto uruchamia proces płatności dla klienta. 
     * Proces jest dość silnie sterowany zdarzeniami. Nie ma wpływu na to, kiedy klient dokładnie płatność wykona 
     * i w jakim czasie płatność zostanie zanotowana przez operatora. W związku z tym klient API musi oczekiwać na powiadomienia 
     * o zmianie statusu płatności, tak samo jak core oczekuje na takie powiadomienia od operatora płatności.
     * 
     * Powiadomienia o statusie płatności są przekazywane do front na adres wskazany przy inicjalizacji płatności w jednym z parametrów
     * (zgodnie z konwencją responseCallback). Odpowiedź jest przekazywana poprzez żądanie metodą POST, a w jego treści przekazywanej w formacie 
     * 
     * /client/{clientHash}/payment/{paymentHash}
     * Response: 
    
     * @param {string} clientHash
     * @param {string} paymentHash
     * @param {string} operationHash
     * @param {string} paywayHash
     */
    async initOperationPaymentOffline( params ){
        var { 
            clientHash,
            paymentHash,
            operationHash,
            paywayHash,
            operation_type
        } = params;

        // {
        //     "operationHash": "b899...253c",
        //     "paywayHash": "417a...c1d8",
        //     "returnUrl": "https://iqm.pl/payment/success",
        //     "rejectUrl": "https://iqm.pl/payment/reject",
        //     "responseCallback": "/payment/status",
        //     "clientContext": "test"
        // }

     

            var operation = params.operation;
            
            var {
                accountName,
                accountNo,
                amount,
                idTransaction,
                statusCode,
                title,

            } = operation.lastPayment;

            var offlinePaymentInfo = operation.offlinePaymentInfo;




            var payload = {
                "operationHash": operation.hash,
                "amount": operation.amount,
                "accountNo": offlinePaymentInfo.accountNo,
                "accountName": offlinePaymentInfo.accountName,
                "title": offlinePaymentInfo.title
            }

            

            // debugger;

            return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/payment/${paymentHash}/offline`, payload)
            .then(response => {
                this.debugMessage( response );
    
                // debugger;
                
                var clientContext;
    
              
                var item = response.data.item;
                if( item && item['clientContext'] ){
                    var clientContext = JSON.parse(item['clientContext']);
                    response.data.item.clientContext = clientContext; 
                }
                
    
                return response.data;
            });
       

    }

    /**
     * Inicjalizacja płatności 
     * Inicjalizuje wskazaną płatność u operatora płatności, czyli defacto uruchamia proces płatności dla klienta. 
     * Proces jest dość silnie sterowany zdarzeniami. Nie ma wpływu na to, kiedy klient dokładnie płatność wykona 
     * i w jakim czasie płatność zostanie zanotowana przez operatora. W związku z tym klient API musi oczekiwać na powiadomienia 
     * o zmianie statusu płatności, tak samo jak core oczekuje na takie powiadomienia od operatora płatności. 
     * 
     * Powiadomienia o statusie płatności są przekazywane do front na adres wskazany przy inicjalizacji płatności w jednym z parametrów 
     * (zgodnie z konwencją responseCallback). Odpowiedź jest przekazywana poprzez żądanie metodą POST, a w jego treści przekazywanej w formacie 
     * 
     * /client/{clientHash}/payment/{paymentHash}
     * Response: 
    
     * @param {string} clientHash
     * @param {string} paymentHash
     * @param {string} operationHash
     * @param {string} paywayHash
     */
    async initOperationPayment( params ){
        var { 
            clientHash,
            paymentHash,
            operationHash,
            paywayHash,
            operation_type
        } = params;

        // {
        //     "operationHash": "b899...253c",
        //     "paywayHash": "417a...c1d8",
        //     "returnUrl": "https://iqm.pl/payment/success",
        //     "rejectUrl": "https://iqm.pl/payment/reject",
        //     "responseCallback": "/payment/status",
        //     "clientContext": "test"
        // }

     


        // debugger;

        if( operation_type === OperationType.ONLINE ){

           return this.initOperationPaymentOnline(params);
        }

        if( operation_type === OperationType.OFFLINE ){
            var operation = params.operation;
            
            return this.initOperationPaymentOffline(params);
        }


    }

    /**
     * Geet payment info
     * GET /client/{clientHash}/payment/{paymentHash}
     * @param {*} clientHash 
     * @param {*} paymentHash 
     */
    async getPaymentInfo(clientHash, paymentHash ){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        // debugger;

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/payment/${paymentHash}`)
        .then(response => {
            this.debugMessage( response );



            return response.data;
        });
    }


    
    /**
     * Dostarcza informacji o wszystkich nieukończonych operacjach klienta. Dla operacji, które powiązane są 
     * z płatnością zwracane są od razu szczegóły płatności. Dane płatności są zgodne z obiektami 
     * zwracanymi przy potwierdzeniu koszyka IQ lub przy pobieraniu bezpośrednio danych płatności.
     * Korzystając z tego zasobu można przedstawić klientowi operacje, których nie opłacił. Będą to te, 
     * które są na statusie 'new' z przypiętą płatnością na statusie innym niż 'success'. 
     * 
     * Część operacji wymaga potwierdzenia przy pomocy SMS. Będą to operacje na liście na statusie new, a bez płatności.
     * GET /client/${clientHash}/operations-pending
     * @param {string} clientHash 
     */
    async getOperationsPending(clientHash){


        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/operations-pending`)
        .then(response => {
            this.debugMessage( response );



            return response.data;
        });
    }

    /**
     * Potwierdzenie operacji SMS
     * POST /client/{clientHash}/operations-confirm
     */
    async confirmOperationBySMS(clientHash, data) {

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/operations-confirm`, data)
        .then(response=> {
            console.log(response.data);
            return response.data
        })

    }


    /**
     * Lista operacji klienta
     * GET /client/{clientHash}/wallet/fund-operation
     */
    async getClientWalletFundOperations(clientHash){
        
        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/fund-operation`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }

    /**
     * Lista operacji klienta
     * GET /client/{clientHash}/wallet/fund-operation/{fundOperationHash}
     */
    async getClientWalletSingleFundOperation(clientHash, operationHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/fund-operation/${operationHash}`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }

    /**
     * Lista funduszy w portfelu
     * GET /{clientHash}/wallet/fund-register
     */
    async getClientWalletFundRegister(clientHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/fund-register`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }
    /**
     * Lista funduszy w portfelu
     * GET /client/{clientHash}/wallet/fund-register/{fundRegisterHash}
     */
    async getClientWalletFundRegisterByHash(clientHash, fundRegisterHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/fund-register/${fundRegisterHash}`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }
    /**
     * Lista funduszy w portfelu
     * GET /client/{clientHash}/wallet/valuations
     */
    async getClientWalletValuations(clientHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/valuations`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }
    /**
     * Lista funduszy w portfelu
     * POST /client/{clientHash}/wallet/fund-register/{fundRegisterHash}/cycle-operation
     */
    async clientFundRegisterCycleOperation(clientHash, fundRegisterHash, data){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/wallet/fund-register/${fundRegisterHash}/cycle-operation`, data)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }
    /**
     * Lista funduszy w portfelu
     * POST /client/{clientHash}/wallet/fund-register/{fundRegisterHash}/cycle-operation
     */
    async clientFundRegisterCycleOperationDelete(clientHash, fundRegisterHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }

        return this.axiosInstance.delete(this.PREFIX+`/client/${clientHash}/wallet/fund-register/${fundRegisterHash}/cycle-operation`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }



    /**
     * Zwraca wartości dla wykresów danego rejestru
     * GET  /client/{clientHash}/wallet/fund-register/{fundRegisterHash}/valuations
     * @param {string} clientHash
     * @param {string} fundRegisterHash
     */
    async getClientWalletFundRegisterValuations(clientHash, fundRegisterHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }
        
        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/wallet/fund-register/${fundRegisterHash}/valuations`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    
    }


    /**
     * Lista funduszy w portfelu
     * GET /{clientHash}/wallet/fund-register
     */
    async getClientWallet(clientHash){

        if( !clientHash ){
            return  this.invalidateSession();
        }
        
        var data = {
            funds: [],
            totalAmount: 0,
            totalBonusIq: 0,
            totalProfit:0,
            chart: {
                dateFrom: null,
                dateTo: null,
                valuations: []
            }

        };

        

        var responseFunds = await this.getClientWalletFundRegister(clientHash);
        var responseValuations = await this.getClientWalletValuations(clientHash);

        
        if( responseValuations.success  ){
            // responseValuations = WALLET_CHART_EXAMPLE_DATA; 
            // data.chart.valuations = responseValuations.valuations;
            data.chart.valuations = responseValuations.valuations;
            // data.chart.valuations = WALLET_CHART_EXAMPLE_DATA;
            // .map( (v,i) => Object.assign(v,{
            //     wPercent: Math.round( 25 - (Math.random() * 50) ),
            // }) );   
            data.chart.dateFrom = ( responseValuations.dateFrom );
            data.chart.dateTo = ( responseValuations.dateTo );
        }
       

        if( responseFunds.success ){
            var promisesArray = responseFunds.list.map( item => {
                return this.offerFundByHash(item.fundHash);
            });
    
            var fundsResults = await Promise.all(promisesArray);
            
            if( responseFunds.success ){
                data.funds = responseFunds.list;
                data.funds.forEach( (f,i) => {
                     f.product =  fundsResults[i].fund;
                     return f;
                });
    
                data.totalAmount = responseFunds.totalAmount;
                data.totalProfit = responseFunds.totalProfit;
                data.totalBonusIq = responseFunds.totalBonusIQ;
                data.success = true;
    
    
            }
            
            return data;
        }else{
            return responseFunds;
        }

       
    }





    



    /**
     * SESSION
     */


    /**
     * Create session data
     * Response:
     * ```
     * {
        "success": true,
        "item": {
            "userIp": "109.173.220.156",
            "userAgent": "Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/66.0.3359.181 Safari\/537.36",
            "data": {
                "time": 1528104335636
            },
            "hash": "f220179b70145e43827bc9d2adcb1f14cb347cbd"
        }
    }
     * ```
     * @param {string} orderId
     */
    createFrontSession(data){

       

        var json = JSON.stringify( json );

        return this.axiosInstance.post(this.PREFIX+`/session`, data)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    }


    /**
     * Save session data
     * @param {string} orderId
     */
    updateFrontSession(sessionHash, data){

        var data = Object.assign({ data:{}}, data );

      

        return this.axiosInstance.put(this.PREFIX+`/session/${sessionHash}`, data)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    }
    /**
     * Get session data
     * @param {string} orderId
     */
    getFrontSessionBySessionHash(sessionHash){

        return this.axiosInstance.get(this.PREFIX+`/session/${sessionHash}`)
        .then(response => {
            this.debugMessage( response );
            if( response.status === 200 ){
                return response.data;
            }else{
                return Promise.reject(response);
            }
        });
    }
    /**
     * Get session data
     * @param {string} orderId
     */
    getFrontSessionByLeadHash(leadHash){

        return this.axiosInstance.get(this.PREFIX+`/session/lead/${leadHash}`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    }

    /**
     * Delete session data
     * @param {string} sessionHash
     */
    deleteFrontSession(sessionHash){

        return this.axiosInstance.delete(this.PREFIX+`/session/${sessionHash}`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
    }



    /**
     * Zapis flagi PSDM
     * POST /client/{clientHash}/psdm
     * ```
     {
        "success": true,
        "confirmationHash": "9bfc...7ee4",
        "confirmationUrl": "/client/55ad...7365/confirmation/782a...dbda"
     }
     * ```
     * 
     */
     clientPsdm(clientHash){

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/psdm`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
     }

     /**
      * POST /client/{clientHash}/confirmation/{confirmationHash}
      * POST /confirmation/{confirmationHash}
      */
     clientConfirmation(clientHash, confirmationHash, data){

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/confirmation/${confirmationHash}`, data)
        .then(response => {
            // this.debugMessage( response );
            return response.data;
        });
     }
     /**
      * POST /confirmation/{confirmationHash}
      */
     confirmation(confirmationHash, data){

        return this.axiosInstance.post(this.PREFIX+`/confirmation/${confirmationHash}`, data)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
     }

     /**
      * Pobiera fundusz superlokatora
      */
     getSuperlocator(){
        

        return this.axiosInstance.get(this.PREFIX+`/offer/superlokator`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
     }







     /**
      * DISCLAIMERS / AGREES
      */

      
     
     /**
      * Pobranie listy zgód klienta
      * GET /client/{clientHash}/agrees
      */
     getClientAgrees(clientHash){

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/agrees`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
     }
     
     /**
      * Pobranie listy kontraktów
      * GET /client/{clientHash}/contracts
      */
     getClientContracts(clientHash){

        return this.axiosInstance.get(this.PREFIX+`/client/${clientHash}/contracts`)
        .then(response => {
            this.debugMessage( response );
           return response.data;
        });
     }
     /**
      * Pobranie listy kontraktów
      * GET /client/{clientHash}/contract/{contractHash}
      */
     getClientContract(clientHash, contractHash){

        return this.axiosInstance.download(this.PREFIX+`/client/${clientHash}/contract/${contractHash}`)
        .then(response => {
            return response;
        });
     }


     /**
      * Zapisanie zgody klienta:
      * 
      * Request:
      * ```
        {
            "code": "MARKETING",
            "value": true,
            "title": "Zgoda na kontakt marketingowy",
            "description": "Wyrażam zgodę na kontakt w celach marketingowych (...)",
            "timeGrant": "2018-01-01T10:20:30Z",
            "dateFrom": "2018-01-01",
            "dateTo": "2018-12-31"
          }
      * ```
      * Reaponse: 
      * ```

      * ```
      * 
      */
     saveClientAgree(clientHash, data){

        return this.axiosInstance.post(this.PREFIX+`/client/${clientHash}/agree`, data)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });
     }



     getRoutes(){
         
        return this.axiosInstance.get(this.PREFIX+`/routes`)
        .then(response => {
            this.debugMessage( response );
            return response.data;
        });

        
     }





    // Helpers
    _requireClientHash(clientHash){
       
        return {
            success: false,
            error:{ message:"Hash is empty" }
        }
        
    }

    addMiddleware( middleware ){
        this.middlewares.push( middleware );
    }

    _runMiddlewares(data){
        this.middlewares.forEach(middleware => {
            if( typeof middleware === 'function' ){
                middleware(data)
            }
        });
    }


}




var Api = new ApiClass();

window.API = Api;

export { Api,ApiClass }