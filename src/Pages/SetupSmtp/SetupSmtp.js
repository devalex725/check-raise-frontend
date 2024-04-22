import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { useTranslation } from 'react-i18next';



const SetupSmtp = () => {
    const { t } = useTranslation();
    return (
        <>
            <main>
                <div className='wrapper setup-smtp'>
                    <Container>
                        <Row>
                            <Col>
                                <h1>{t('page.SetupSmtp.HowtosetupGoogleSMTP')}</h1>

                                <h2 className="h1">{t('page.SetupSmtp.Step1')}</h2>

                                <p>{t('page.SetupSmtp.Goto')}<a href="http://myaccount.google.com" rel="noopener nofollow"> myaccount.google.com </a>{t('page.SetupSmtp.ifnotsignedin')}.</p>

                                <Image src={require('../../assets/images/1.png')} fluid />

                                <h2 className="h1">{t('page.SetupSmtp.Step2')}</h2>

                                <p>{t('page.SetupSmtp.Firstyou')}.</p>

                                <p>{t('page.SetupSmtp.Clickon')}<b>{t('page.SetupSmtp.Securitytab')}</b> {t('page.SetupSmtp.ontheleft-hand')} <b>{t('page.SetupSmtp.Security')}</b> {t('page.SetupSmtp.pageand')} <b>{t('page.SetupSmtp.Signing')}</b> {t('page.SetupSmtp.clickonVerification')}.</p>

                                <Image src={require('../../assets/images/2.png')} fluid />
                                <p>{t('page.SetupSmtp.Clickon1')} <b>{t('page.SetupSmtp.GetStarted')}</b>{t('page.SetupSmtp.andonthenext')}  <b>{t('page.SetupSmtp.Next')}.</b></p>
                                <Image src={require('../../assets/images/3.png')} fluid />

                                <p>{t('page.SetupSmtp.Nowyouhavetosetup')}<b>{t('page.SetupSmtp.Textmessage')}</b> {t('page.SetupSmtp.andhit')} <b>{t('page.SetupSmtp.Next')}.</b></p>
                                <Image src={require('../../assets/images/4.png')} fluid />

                                <p>{t('page.SetupSmtp.Googlewillsendyouatextmessage')} <b>{t('page.SetupSmtp.Next')}.</b><br />
                                    {t('page.SetupSmtp.onthenextpage')} <b>{t('page.SetupSmtp.2-StepVerification')}</b>. {t('page.SetupSmtp.Nowclickthebackarrow')}  <b>{t('page.SetupSmtp.Securitypage')}</b>.</p>

                                <h2 className="h1">{t('page.SetupSmtp.Step3Setup')}</h2>

                                <p>{t('page.SetupSmtp.Withinthesection')} <b>{t('page.SetupSmtp.SigningintoGoogle')}</b>, {t('page.SetupSmtp.youwillnoticeanewoption')} <b>{t('page.SetupSmtp.Apppasswords')}</b>.</p>
                                <Image src={require('../../assets/images/5.png')} fluid />
                                <p> {t('page.SetupSmtp.ClickonApppasswordsandverify')}.</p>
                                <Image src={require('../../assets/images/6.png')} fluid />
                                <p>{t('page.SetupSmtp.Nowselect')}<b>{t('page.SetupSmtp.Mail')}</b>{t('page.SetupSmtp.from')}  <b>{t('page.SetupSmtp.Selectapp')}</b> {t('page.SetupSmtp.and')} <b>{t('page.SetupSmtp.Other')}</b> {t('page.SetupSmtp.from')}  <b>{t('page.SetupSmtp.Selectdevice')}</b> {t('page.SetupSmtp.andprovideitaname')} <b>{t('page.SetupSmtp.Generate')}</b>.</p>
                                <Image src={require('../../assets/images/7.png')} fluid />
                                <p>{t('page.SetupSmtp.Nowyouhavesuccessfully')}.</p>
                                <p>{t('page.SetupSmtp.Remember')}, <b>{t('page.SetupSmtp.dontshareitwithanyone')}.</b></p>
                                <p><em>{t('page.SetupSmtp.Apppasswordsareasecurity')}.</em></p>
                                <p><em>– {t('page.SetupSmtp.Important')}</em></p>
                                <Image src={require('../../assets/images/8.png')} fluid />
                                <p>{t('page.SetupSmtp.Youhavesuccessfullygenerated')}.</p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </main>

        </>
    );
};

export default SetupSmtp;