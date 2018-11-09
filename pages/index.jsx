import moment from 'moment';
import React from "react";

import UserMenu from '../components/UserMenu';

const Home = () => (
<React.Fragment>
    <div className="page home">
        <h1>Title</h1>
        <div className="wrapper-width-limit">
            <div className="relative show-for-medium clearfix">
                <div className="grid-x">
                    <div className="cell medium-6">
                    </div>
                    <div className="cell medium-6 align-right ">
                        <UserMenu theme="dark" addTopMargin={true} />
                    </div>
                </div>
            </div>
        </div>

        {/*<ProgressBar bulletsData={ Object.values(this.progressData) } />

        <div className="Homepage_header">
            <div className="Homepage_header-bg"></div>
            <BubbleBackground
                desktopBubbleCount={120}
                tabletBubbleCount={65}
                mobileBubbleCount={35}
            />
            <div className="wrapper-width-limit home-width-limit">

                <section className="Frontpage_section" ref={header => this.header = header}>
                    <div className="Homepage_header-promotext">
                        <img src={`${PUBLIC_PATH}/slokator/coloured_circles.svg`} alt="" className="Homepage_header-promotext_circles" />
                        <p className="smaller-header gray">{banner_aboveHeader}</p>
                        <h1 className="big-header" dangerouslySetInnerHTML={{ __html: banner_Header}}></h1>
                        <p className="promo_thintext typo">{banner_typedTitle}

                            <span className="coloured_green" ref={(el) => { this.el = el}} />


                        </p>

                        <div className="Homepage_header-percent">
                            <p className="promo_thintext">{baner_onLeftPercent}</p>
                            <p className="gradientText">{baner_percentDigit}</p>
                            <p className="promo_thintext">{baner_onRightPercent}</p>
                        </div>

                    </div>
                    <div className="Homepage_header-cta zIndex3">
                        <Button
                            onClick={ e =>  {
                                const tagManagerArgs = {
                                    'event': 'st_click',
                                    'url': routerStore.currentURL,
                                    'referrer': routerStore.prevURL,
                                    'clickText': removePolishSigns(baner_btnLeft),
                                    'clickElement': 'button',
                                    'uid':  UsersStore.clientHash || ''
                                }
                                GTMStore.addClickText( removePolishSigns(baner_btnLeft) );
                                GTMStore.addClickElem('button');
                                GTMStore.pushDataLayer(tagManagerArgs);
                                routerStore.navigate('fundusze')
                                }
                            }
                            theme="secondary"
                            size="large"
                        >{baner_btnLeft}</Button>

                        <Button
                            theme="primary"
                            size="large"
                            onClick={ e =>  {
                                const tagManagerArgs = {
                                    'event': 'st_click',
                                    'url': routerStore.currentURL,
                                    'referrer': routerStore.prevURL,
                                    'clickText': removePolishSigns(baner_btnRight),
                                    'clickElement': 'button',
                                    'uid':  UsersStore.clientHash || ''
                                }
                                GTMStore.addClickText( removePolishSigns(baner_btnRight) );
                                GTMStore.addClickElem('button');
                                GTMStore.pushDataLayer(tagManagerArgs);
                                routerStore.navigate('rejestracja')
                                }
                            }
                        >{baner_btnRight}</Button>

                    </div>
                    <div className="globContainer" ref={ (bg) => {this.bg = bg} } >
                        <img src={ `${PUBLIC_PATH}/home/glob.svg` } alt="" className="Bg__glob" />
                    </div>
                </section>

                <div ref={ sndSection => this.sndSection = sndSection } >

                    <div className="Homepage_header-promotext titles">
                        <p className="smaller-header gray" dangerouslySetInnerHTML={{ __html: banner_2ndSectionAboveHeader }} />
                        <h2 className="big-header" dangerouslySetInnerHTML={{ __html: banner_2ndSectionHeader }} />
                    </div>

                    <div className="Homepage-steps">
                        <div className="grid-x grid-padding-x xphone-up-3 Homepage-steps-container">
                            {itemsInwestowanie.map( (el, index) => {

                                return (

                                    <div className="cell" key={`investSlider-${index}`}>
                                        <ScrollAnimation animateIn="bounceIn" initiallyVisible={true} animateOnce={true} delay={index*500}>
                                            <div className="cell">
                                                <img src={`${PUBLIC_PATH}${el.image}`} alt={el.title} className="homeStep" />
                                                <div className="Homepage-steps_text">
                                                    <p className="steps-title">{el.title}</p>
                                                    <p className="steps-content">{el.content}</p>
                                                </div>
                                            </div>
                                        </ScrollAnimation>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <div className="Homepage_whyus" ref={whyus => this.whyus = whyus}>
            <div className="wrapper-width-limit home-width-limit">
                <div className="Whyus_item_big">
                { this.dlaczegoWarto.map( (el, index) => {

                    var additionalText = el.additionalText ? el.additionalText : '';

                    if (el.ordering === 1) {

                        return (
                            <div className="grid-x bigContainer" key={`whyus${index}`}>
                                <div className="cell phone-3 medium-4 Whyus_bigImage-container">
                                    <ScrollAnimation animateIn="bounceInUp" animateOnce={true}>
                                        <img src={`${PUBLIC_PATH}${el.image}`} className="Whyus_bigImage" />
                                    </ScrollAnimation>
                                </div>
                                <div className="cell phone-9 medium-8 Whyus_content">
                                    <ScrollAnimation animateIn="bounceInDown" animateOnce={true}>
                                        <p className="Whyus_above_title">{additionalText}</p>
                                        <p className="Whyus_title">{el.title}</p>
                                        <p className="Whyus_description" dangerouslySetInnerHTML={{ __html: el.content}}></p>
                                    </ScrollAnimation>
                                </div>
                            </div>
                            )
                        }

                    })}
                </div>

                <div className="Whyus_items">

                    <div className="grid-x grid-padding-x medium-up-2">

                    {this.dlaczegoWarto.map( (el, index) => {

                        if (el.ordering != 1) {
                            var animationType = index%2==1 ? 'bounceInLeft' : 'bounceInRight';

                            return (

                                <div className="cell Whyus_block" key={`whyus${index}`}>
                                    <ScrollAnimation animateIn={animationType} offset={1500} animateOnce={true}>
                                        <div className="grid-x grid-margin-x">
                                            <div className="cell phone-2 medium-3 imgWhyUsSmall">
                                                <img src={`${PUBLIC_PATH}${el.image}`} className="Whyus_smallImage" />
                                            </div>
                                            <div className="cell phone-10 medium-9 Whyus_content">
                                                <p className="Whyus_title">{el.title}</p>
                                                <p className="Whyus_description">{el.content}</p>
                                            </div>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                )
                            }

                        })}
                    </div>

                </div>
            </div>

        </div>

        <div className="Homepage_stats" ref={stats => this.stats = stats}>

            <div className="wrapper-width-limit home-width-limit text-center" ref={ e => this.animacja = e}>
                <ScrollAnimation animateIn="bounceIn"  duration={0.5} initiallyVisible={true} animateOnce={true} offset={1000}>
                    <h2 className="stat-info">{amountTextAbove}</h2>
                    <h1 className="stat-digits">
                        {this.renderCounter &&
                        <div>
                                <CountUp className="count-value"
                                    start={0}
                                    end={amountDigits}
                                    duration={3}
                                    useEasing={true} 
                                    useGrouping={true} 
                                    separator=" "
                                    redraw={true}
                            />
                            <span className="smaller-digit">{amountCurrency}</span>
                        </div> }
                        {!this.renderCounter &&
                            <div>0,00 <span className="smaller-digit">{amountCurrency}</span></div>
                        }
                    </h1>
                    <h2 className="stat-info">{amountTextUnder}</h2>
                </ScrollAnimation>
            </div>

        </div>

        {/* Slider z tabletem i telefonem */}
        {/*<div className="" ref={homeslider => this.homeslider = homeslider}>
            <HomeSlider size="home" slides={this.dlaczegoIQ}/>
        </div>

        {/* Slider kart funduszy */}
        {/*<div className="Homepage__cardSlider" ref={cardslider => this.cardslider = cardslider}>
            <div className="wrapper-width-limit home-width-limit">
                <Html component="h2" className="CardSlider__header" useMarkdown={true} html={mainInvestHeader} />
            </div>
            <HomeCardSlider items={this.fundsList} homeCarousel={true}/>
        </div>

        {/* FAQ */}
        {/*<div className="wrapper-width-limit home-width-limit" ref={faq => this.faq = faq}>
            <div className="Home__faq">

                <h2 className="Home__faq-header">{mainQuestionsHeader} <span className="gray">{mainQuestionsHeaderGray}</span></h2>


                <div className="Home__faq-accordions">

                {this.maszPytania.map( (el, index) => {

                    var nr = index+1;

                    return (


                        <AccordionItem
                            type="HOME"
                            number={nr}
                            active={this.visibleAccordion === nr}
                            onTitleClick={this.openAccordion.bind(this, nr)}
                            title={el.title}
                            key={nr}
                        >
                            <div dangerouslySetInnerHTML={{ __html: el.content}} />
                        </AccordionItem>

                    )

                } )}

                </div>

                <div className="Home__faq-moreInfos">
                    <div className="grid-x grid-margin-x">
                        <div className="cell medium-6">
                            <p className="Home__faq-moreInfos-text">{mainQuestionsText}</p>
                        </div>
                        <div className="cell medium-6 text-right">
                            <Button to="faq" onClick={e=> { GTMStore.addClickText('wiecej'); GTMStore.addClickElem('button') } } rel={ seo.getSeoFollow('faq') }theme="primary" size="large">{mainQuestionsBtn}</Button>
                        </div>
                    </div>
                </div>

            </div>

        </div>


        <Footer type="home" bullets={true} /> */}

    </div>
</React.Fragment>
  )
  
  export default Home;