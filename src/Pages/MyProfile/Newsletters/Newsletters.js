import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MyProfileLeftNav from '../../../components/MyProfileLeftNav/MyProfileLeftNav';
import { Row, Col, Card, Form, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Editor } from "@tinymce/tinymce-react";
import './Newsletters.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';





const Newsletters = () => {
    const { t } = useTranslation();
    const editorRef = useRef(null);

    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNav />
                    </Col>
                    <Col lg={10}>
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.NewslettersTitle')}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <Form>
                                            <h3>{t('page.myprofile.myprofilenav.NewslettersTitle')}:</h3>
                                            <Form.Group className="border-bottom form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Sendto')}</Form.Label>
                                                <Form.Select >

                                                    <option value="">
                                                        All Subscribers              </option>
                                                    <option value="8941">
                                                        Weekly 50 (Cagnotte) - (07.06.2023 18:30)
                                                    </option>
                                                    <option value="8947">
                                                        Tournoi de la Fête-Dieu - (08.06.2023 13:30)
                                                    </option>
                                                    <option value="8944">
                                                        It’s Friday - (09.06.2023 19:00)
                                                    </option>
                                                    <option value="9039">
                                                        Weekly 50 (Cagnotte) - (14.06.2023 18:30)
                                                    </option>
                                                    <option value="9045">
                                                        It’s Friday - (16.06.2023 19:00)
                                                    </option>
                                                    <option value="9042">
                                                        Season Finale 50 (Cagnotte) - (21.06.2023 18:30)
                                                    </option>
                                                    <option value="9048">
                                                        It’s Friday - (23.06.2023 19:00)
                                                    </option>
                                                    <option value="6616">
                                                        MEGASTACK 100K DAY 1B - (07.01.2023 18:00 - 08.01.2023)
                                                    </option>
                                                    <option value="6689">
                                                        Weekly Turbo - (13.01.2023 19:30)
                                                    </option>
                                                    <option value="6692">
                                                        Deepstack 150 - (14.01.2023 18:00)
                                                    </option>
                                                    <option value="6713">
                                                        Weekly Turbo - (20.01.2023 19:30)
                                                    </option>
                                                    <option value="6716">
                                                        Deepstack 150 - (21.01.2023 18:30)
                                                    </option>
                                                    <option value="6750">
                                                        Weekly Turbo - (27.01.2023 19:30)
                                                    </option>
                                                    <option value="6747">
                                                        Deepstack 150 - (28.01.2023 18:30)
                                                    </option>
                                                    <option value="6785">
                                                        MEGASTACK 100K DAY 1A - (03.02.2023 19:00 - 05.02.2023)
                                                    </option>
                                                    <option value="6788">
                                                        MEGASTACK 100K DAY 1B - (04.02.2023 18:00 - 04.02.2023)
                                                    </option>
                                                    <option value="6840">
                                                        Weekly Turbo - (10.02.2023 19:30)
                                                    </option>
                                                    <option value="6843">
                                                        Deepstack 150 - (11.02.2023 18:30)
                                                    </option>
                                                    <option value="6888">
                                                        Weekly Turbo - (17.02.2023 19:30)
                                                    </option>
                                                    <option value="6891">
                                                        Deepstack 150 - (18.02.2023 18:30)
                                                    </option>
                                                    <option value="6894">
                                                        Weekly Turbo - (24.02.2023 19:30)
                                                    </option>
                                                    <option value="6897">
                                                        Deepstack 150 - (25.02.2023 18:30)
                                                    </option>
                                                    <option value="7060">
                                                        MEGASTACK 100K DAY 1A - (03.03.2023 19:00 - 05.03.2023)
                                                    </option>
                                                    <option value="7063">
                                                        MEGASTACK 100K DAY 1B - (04.03.2023 18:00 - 05.03.2023)
                                                    </option>
                                                    <option value="7106">
                                                        Weekly Turbo - (10.03.2023 19:30)
                                                    </option>
                                                    <option value="7109">
                                                        Deepstack 150 - (11.03.2023 18:30)
                                                    </option>
                                                    <option value="7512">
                                                        Weekly Turbo - (17.03.2023 19:30)
                                                    </option>
                                                    <option value="7515">
                                                        Bounty prog. 150 - (18.03.2023 18:30)
                                                    </option>
                                                    <option value="7784">
                                                        Weekly Turbo - (24.03.2023 19:30)
                                                    </option>
                                                    <option value="7787">
                                                        Deepstack 150 - (25.03.2023 18:30)
                                                    </option>
                                                    <option value="7830">
                                                        Weekly Turbo - (31.03.2023 19:30)
                                                    </option>
                                                    <option value="7833">
                                                        Deepstack 150 - (01.04.2023 18:30)
                                                    </option>
                                                    <option value="7957">
                                                        Weekly Super Turbo (Lire détails) - (11.04.2023 19:00)
                                                    </option>
                                                    <option value="7960">
                                                        Weekly Turbo - (14.04.2023 19:30)
                                                    </option>
                                                    <option value="7963">
                                                        Deepstack 150 - (15.04.2023 18:30)
                                                    </option>
                                                    <option value="8040">
                                                        Tuesday Super Turbo (lire détails) - (18.04.2023 19:00)
                                                    </option>
                                                    <option value="8043">
                                                        Weekly Classic - (21.04.2023 19:30)
                                                    </option>
                                                    <option value="8046">
                                                        Progressive Bounty - (22.04.2023 18:30)
                                                    </option>
                                                    <option value="8246">
                                                        Tuesday Turbo (lire description) - (25.04.2023 19:00)
                                                    </option>
                                                    <option value="8252">
                                                        Weekly Classic - (28.04.2023 19:30)
                                                    </option>
                                                    <option value="8249">
                                                        Deepstack 150 - (29.04.2023 18:30)
                                                    </option>
                                                    <option value="8384">
                                                        Tuesday super Turbo - (02.05.2023 19:00)
                                                    </option>
                                                    <option value="8387">
                                                        Megastack 100K DAY 1A - (05.05.2023 19:00 - 07.05.2023)
                                                    </option>
                                                    <option value="8390">
                                                        Megastack 100K DAY 1B - (06.05.2023 19:00 - 07.05.2023)
                                                    </option>
                                                    <option value="8518">
                                                        Tuesday super Turbo - (09.05.2023 19:00)
                                                    </option>
                                                    <option value="8521">
                                                        Weekly Classic - (12.05.2023 19:30)
                                                    </option>
                                                    <option value="8524">
                                                        Deepstack 150 - (13.05.2023 18:30)
                                                    </option>
                                                    <option value="8630">
                                                        Bounty 150 - (17.05.2023 19:00)
                                                    </option>
                                                    <option value="8633">
                                                        Weekly Classic - (19.05.2023 19:30)
                                                    </option>
                                                    <option value="8637">
                                                        Superstack 200 (lire description) - (20.05.2023 18:30)
                                                    </option>
                                                    <option value="8755">
                                                        Tuesday super Turbo - (23.05.2023 19:00)
                                                    </option>
                                                    <option value="8793">
                                                        Weekly Classic - (26.05.2023 19:30)
                                                    </option>
                                                    <option value="8903">
                                                        Tuesday super Turbo - (30.05.2023 19:00)
                                                    </option>
                                                    <option value="8906">
                                                        MEGASTACK 100K DAY 1A - (02.06.2023 19:00 - 04.06.2023)
                                                    </option>
                                                    <option value="8933">
                                                        MEGASTACK 100K DAY 1B - (03.06.2023 19:00 - 04.06.2023)
                                                    </option>
                                                    <option value="9054">
                                                        Tuesday super Turbo - (06.06.2023 19:00)
                                                    </option>
                                                    <option value="9060">
                                                        Deepstack 150 (dimanche 17h!) - (11.06.2023 17:00)
                                                    </option>
                                                    <option value="3850">
                                                        Turbo Satellite MINI HIGH ROLLER RE-BUY - (14.02.2022 19:00)
                                                    </option>
                                                    <option value="4485">
                                                        Turbo Satellite MINI HIGH ROLLER - (17.02.2022 19:00)
                                                    </option>
                                                    <option value="3935">
                                                        MINI HIGH ROLLER  STACK 150k - (26.02.2022 14:00)
                                                    </option>
                                                    <option value="6278">
                                                        simplicity ..50k reentry - (10.11.2022 19:30)
                                                    </option>
                                                    <option value="5443">
                                                        CASH OUT  RE-ENTRY LEVEL 5 - (20.12.2022 19:30)
                                                    </option>
                                                    <option value="6686">
                                                        NEW PLO5 - (19.02.2023 18:00)
                                                    </option>
                                                    <option value="4290">
                                                        Super Deep Stack 150K - (30.04.2023 17:00)
                                                    </option>
                                                    <option value="8527">
                                                        Gringo Bounty Re-entry - (09.05.2023 10:00)
                                                    </option>
                                                    <option value="3806">
                                                        Satellite Main Event 440+60  SPS - (17.05.2023 19:30)
                                                    </option>
                                                    <option value="3762">
                                                        BIG STACK 100k RE-E - (18.05.2023 19:30)
                                                    </option>
                                                    <option value="8863">
                                                        Super Deep Stack 150K bounty Re-e - (04.06.2023 19:00)
                                                    </option>
                                                    <option value="6284">
                                                        simplicity ..50k reentry - (06.06.2023 19:30)
                                                    </option>
                                                    <option value="4488">
                                                        Friday Rebuy Add-on 25k/40k - (09.06.2023 19:30)
                                                    </option>
                                                    <option value="6303">
                                                        BIG STACK 100K  Re- - (11.06.2023 18:30)
                                                    </option>
                                                    <option value="3978">
                                                        ReOpening MTT - (10.12.2021 19:00)
                                                    </option>
                                                    <option value="3987">
                                                        BigOne - (11.12.2021 19:00)
                                                    </option>
                                                    <option value="3999">
                                                        ComboR (no Ante) - (12.12.2021 16:30)
                                                    </option>
                                                    <option value="4049">
                                                        Sat to GladiatoR (Annulé … À demain) - (16.12.2021 19:30)
                                                    </option>
                                                    <option value="4043">
                                                        GladiatoR (FreezeOut) - (17.12.2021 19:00)
                                                    </option>
                                                    <option value="4073">
                                                        KO Bounty - (18.12.2021 19:00)
                                                    </option>
                                                    <option value="4058">
                                                        Combo ReBuy+Add-On (no Ante) - (19.12.2021 16:30)
                                                    </option>
                                                    <option value="4091">
                                                        La Single Sit &amp; Go - (22.12.2021 19:30)
                                                    </option>
                                                    <option value="4112">
                                                        Xmas Incredible 100 - (26.12.2021 16:30)
                                                    </option>
                                                    <option value="4094">
                                                        La Single Sit &amp; Go - (28.12.2021 19:30)
                                                    </option>
                                                    <option value="4097">
                                                        La Single Sit &amp; Go - (29.12.2021 19:30)
                                                    </option>
                                                    <option value="4100">
                                                        La Single Sit &amp; Go - (30.12.2021 19:30)
                                                    </option>
                                                    <option value="4103">
                                                        Bounty Hunter Sit &amp; Go - (04.01.2022 19:30)
                                                    </option>
                                                    <option value="4106">
                                                        Classic Sit &amp; Go - (05.01.2022 19:30)
                                                    </option>
                                                    <option value="4109">
                                                        Expresso Sit &amp; Go - (06.01.2022 19:30)
                                                    </option>
                                                    <option value="4130">
                                                        GladiatoR ReleaseD BBA - (07.01.2022 19:00)
                                                    </option>
                                                    <option value="4142">
                                                        Double Bullet 30K - (08.01.2022 19:00)
                                                    </option>
                                                    <option value="4136">
                                                        Combo ReBuy + Add-On - (09.01.2022 16:30)
                                                    </option>
                                                    <option value="4280">
                                                        A lire ... Adhésion &amp; Early Bird - (11.01.2022 00:00)
                                                    </option>
                                                    <option value="4254">
                                                        Bounty Hunter Sit &amp; Go - (11.01.2022 19:30)
                                                    </option>
                                                    <option value="4215">
                                                        Classic Sit &amp; Go - (12.01.2022 19:30)
                                                    </option>
                                                    <option value="4364">
                                                        Low Cost Sit &amp; Go - (12.01.2022 19:30)
                                                    </option>
                                                    <option value="4221">
                                                        Expresso Sit &amp; Go - (13.01.2022 19:30)
                                                    </option>
                                                    <option value="4206">
                                                        KO Bounty Fifty Fifty - (14.01.2022 19:00)
                                                    </option>
                                                    <option value="4203">
                                                        Incredible 100K - (15.01.2022 19:00)
                                                    </option>
                                                    <option value="4299">
                                                        Incredible 100 RealeseD - (15.01.2022 19:00)
                                                    </option>
                                                    <option value="4260">
                                                        Bounty Hunter Sit &amp; Go - (18.01.2022 19:30)
                                                    </option>
                                                    <option value="4311">
                                                        WarmUp Sit &amp; Go - (19.01.2022 19:30)
                                                    </option>
                                                    <option value="4197">
                                                        Low Cost Sit &amp; Go - (19.01.2022 20:00)
                                                    </option>
                                                    <option value="4236">
                                                        Expresso Sit &amp; Go - (20.01.2022 19:30)
                                                    </option>
                                                    <option value="4314">
                                                        WarmUp Sit &amp; Go - (20.01.2022 19:30)
                                                    </option>
                                                    <option value="4529">
                                                        Combo ReBuy + Add-On - (20.01.2022 19:30 - 27.02.2022)
                                                    </option>
                                                    <option value="4562">
                                                        Combo ReBuy + Add-On - (20.01.2022 19:30 - 13.03.2022)
                                                    </option>
                                                    <option value="4245">
                                                        Double Bullet 30K - (21.01.2022 19:00)
                                                    </option>
                                                    <option value="4242">
                                                        KO Bounty - (22.01.2022 19:00)
                                                    </option>
                                                    <option value="4263">
                                                        Expresso Sit &amp; Go - (23.01.2022 16:30)
                                                    </option>
                                                    <option value="4257">
                                                        Classic Sit &amp; Go - (25.01.2022 19:30)
                                                    </option>
                                                    <option value="4339">
                                                        Bounty Hunter Sit &amp; Go - (25.01.2022 19:30)
                                                    </option>
                                                    <option value="4266">
                                                        Classic Sit &amp; Go - (26.01.2022 19:30)
                                                    </option>
                                                    <option value="4167">
                                                        GladiatoR ReleaseD - (28.01.2022 19:00)
                                                    </option>
                                                    <option value="4302">
                                                        Incredible 100 ReleaseD - (29.01.2022 19:00)
                                                    </option>
                                                    <option value="4367">
                                                        Classic Sit &amp; Go - (02.02.2022 19:30)
                                                    </option>
                                                    <option value="4200">
                                                        Low Cost Sit &amp; Go - (02.02.2022 20:30)
                                                    </option>
                                                    <option value="4351">
                                                        WarmUp Sit &amp; Go - (03.02.2022 19:30)
                                                    </option>
                                                    <option value="4373">
                                                        KO Bounty - (05.02.2022 19:00)
                                                    </option>
                                                    <option value="4357">
                                                        Expresso Longo Sit &amp; Go - (06.02.2022 16:30)
                                                    </option>
                                                    <option value="4345">
                                                        Bounty Hunter Sit &amp; Go - (08.02.2022 19:30)
                                                    </option>
                                                    <option value="4370">
                                                        Classic Sit &amp; Go - (09.02.2022 19:30)
                                                    </option>
                                                    <option value="4354">
                                                        WarmUp Sit &amp; Go - (10.02.2022 19:30)
                                                    </option>
                                                    <option value="4422">
                                                        Double Bullet 30K - (11.02.2022 19:00)
                                                    </option>
                                                    <option value="4425">
                                                        KO Bounty Fifty Fifty - (12.02.2022 19:00)
                                                    </option>
                                                    <option value="4691">
                                                        Heaven 30K - (19.02.2022 19:00)
                                                    </option>
                                                    <option value="4694">
                                                        Heaven 30K - (19.02.2022 19:00)
                                                    </option>
                                                    <option value="4239">
                                                        Combo ReBuy + Add-On - (20.02.2022 16:30)
                                                    </option>
                                                    <option value="4416">
                                                        Gladiator - (25.02.2022 19:00)
                                                    </option>
                                                    <option value="4419">
                                                        Gladiator - (04.03.2022 19:00)
                                                    </option>
                                                    <option value="4550">
                                                        Heaven Bounty 100 - (05.03.2022 19:00)
                                                    </option>
                                                    <option value="4556">
                                                        Heaven 100 K - (11.03.2022 19:00)
                                                    </option>
                                                    <option value="4685">
                                                        Gladiator - (18.03.2022 19:00)
                                                    </option>
                                                    <option value="4652">
                                                        Gladiator - (25.03.2022 19:00)
                                                    </option>
                                                    <option value="4725">
                                                        Heaven Bounty 30 K - (26.03.2022 19:00)
                                                    </option>
                                                    <option value="4670">
                                                        Heaven 100 K - (02.04.2022 19:00)
                                                    </option>
                                                    <option value="4779">
                                                        Heaven Bounty Progressif 30 K - (03.04.2022 15:00)
                                                    </option>
                                                    <option value="4676">
                                                        Gladiator - (08.04.2022 19:00)
                                                    </option>
                                                    <option value="4679">
                                                        Heaven 30K - (09.04.2022 19:00)
                                                    </option>
                                                    <option value="4803">
                                                        Heaven Bounty Progressif 30 K - (10.04.2022 15:00)
                                                    </option>
                                                    <option value="6037">
                                                        Heaven Bounty Progressif 30 K - (10.04.2022 19:00)
                                                    </option>
                                                    <option value="4754">
                                                        Le Saint-Heaven - (15.04.2022 15:15)
                                                    </option>
                                                    <option value="4760">
                                                        Heaven 100 K Spécial Pâques - (17.04.2022 14:00)
                                                    </option>
                                                    <option value="4812">
                                                        Heaven 100 K - (22.04.2022 19:00)
                                                    </option>
                                                    <option value="4818">
                                                        Heaven Bounty Progressif 30 K - (24.04.2022 15:00)
                                                    </option>
                                                    <option value="4822">
                                                        Heaven 30K - (29.04.2022 19:00)
                                                    </option>
                                                    <option value="4828">
                                                        Heaven Bounty Progressif 30 K - (01.05.2022 15:00)
                                                    </option>
                                                    <option value="4885">
                                                        Gladiator - (06.05.2022 19:00)
                                                    </option>
                                                    <option value="4897">
                                                        Heaven 30K - (07.05.2022 19:00)
                                                    </option>
                                                    <option value="4900">
                                                        Heaven 100 K - (13.05.2022 19:00)
                                                    </option>
                                                    <option value="5043">
                                                        Big one 100 K - (03.06.2022 19:00)
                                                    </option>
                                                    <option value="5017">
                                                        Gladiator - (04.06.2022 19:00)
                                                    </option>
                                                    <option value="5046">
                                                        Heaven Bounty Progressif 30 K - (05.06.2022 15:00)
                                                    </option>
                                                    <option value="5446">
                                                        Viking Night - (24.06.2022 19:00)
                                                    </option>
                                                    <option value="5452">
                                                        Spartacus - (25.06.2022 17:00)
                                                    </option>
                                                    <option value="5455">
                                                        L'Arène - (26.06.2022 14:00)
                                                    </option>
                                                    <option value="5491">
                                                        Gladiateur - (01.07.2022 19:00)
                                                    </option>
                                                    <option value="5494">
                                                        Circus Maximus 100K - (02.07.2022 17:00)
                                                    </option>
                                                    <option value="5497">
                                                        L'Arène - (03.07.2022 15:00)
                                                    </option>
                                                    <option value="5457">
                                                        Ligue du mardi - (05.07.2022 19:00)
                                                    </option>
                                                    <option value="5503">
                                                        L'Imperium - (08.07.2022 19:00)
                                                    </option>
                                                    <option value="5500">
                                                        Viking Night - (09.07.2022 17:00)
                                                    </option>
                                                    <option value="5506">
                                                        L'Arène - (10.07.2022 15:00)
                                                    </option>
                                                    <option value="5586">
                                                        Spartacus 50K - (15.07.2022 19:00)
                                                    </option>
                                                    <option value="5589">
                                                        Circus Maximum 100K - (16.07.2022 17:00)
                                                    </option>
                                                    <option value="5616">
                                                        Viking 30K - (22.07.2022 19:00)
                                                    </option>
                                                    <option value="5619">
                                                        Gladiateur 50K - (23.07.2022 17:00)
                                                    </option>
                                                    <option value="5622">
                                                        L'Arène 20K - (23.07.2022 20:00)
                                                    </option>
                                                    <option value="5509">
                                                        Swiss Series Omaha - (31.07.2022 17:00)
                                                    </option>
                                                    <option value="5631">
                                                        Colosseum 30K - (05.08.2022 19:00)
                                                    </option>
                                                    <option value="5634">
                                                        Spartacus 50K - (06.08.2022 17:00)
                                                    </option>
                                                    <option value="5655">
                                                        Viking 30K - (12.08.2022 19:00)
                                                    </option>
                                                    <option value="5658">
                                                        Gladiateur 50K - (13.08.2022 17:00)
                                                    </option>
                                                    <option value="5673">
                                                        Imperium 50K - (19.08.2022 19:00)
                                                    </option>
                                                    <option value="5694">
                                                        Mystery Bounty Killing Caesar - (20.08.2022 17:00)
                                                    </option>
                                                    <option value="5756">
                                                        L'Arène Rebuy-Addon - (21.08.2022 15:00)
                                                    </option>
                                                    <option value="5679">
                                                        Centurion Day 1A - (25.08.2022 19:00 - 27.08.2022)
                                                    </option>
                                                    <option value="5682">
                                                        Centurion Day 1B - (26.08.2022 19:00 - 27.08.2022)
                                                    </option>
                                                    <option value="5676">
                                                        Circus Maximus 100K - (27.08.2022 17:00)
                                                    </option>
                                                    <option value="5813">
                                                        Viking Night - (02.09.2022 19:00)
                                                    </option>
                                                    <option value="5816">
                                                        Gladiateur 50K - (03.09.2022 17:00)
                                                    </option>
                                                    <option value="5819">
                                                        Circus Maximus 100K - (09.09.2022 19:00)
                                                    </option>
                                                    <option value="5937">
                                                        Juste Une Seconde Chance - (16.09.2022 22:00)
                                                    </option>
                                                    <option value="5831">
                                                        Gladiateur Maximus 100K - (17.09.2022 17:00)
                                                    </option>
                                                    <option value="6393">
                                                        Gladiateur 50K - (17.09.2022 17:00)
                                                    </option>
                                                    <option value="5837">
                                                        Mystery Bounty Killing Caesar - (23.09.2022 19:00)
                                                    </option>
                                                    <option value="5947">
                                                        Megastack Imperium 70K - (23.09.2022 19:00)
                                                    </option>
                                                    <option value="6049">
                                                        Mystery Bounty Killing Caesar - (23.09.2022 19:00)
                                                    </option>
                                                    <option value="6052">
                                                        Mystery Bounty Killing Caesar - (23.09.2022 19:00)
                                                    </option>
                                                    <option value="5843">
                                                        Circus Maximus 100K - (24.09.2022 17:00)
                                                    </option>
                                                    <option value="5849">
                                                        Viking Night 50k - (30.09.2022 19:00)
                                                    </option>
                                                    <option value="6031">
                                                        Viking Night 50K - (30.09.2022 19:00)
                                                    </option>
                                                    <option value="5971">
                                                        CIRCUS Maximus - (01.10.2022 17:00)
                                                    </option>
                                                    <option value="5852">
                                                        Omaha Spartans 8-Max - (01.10.2022 19:00)
                                                    </option>
                                                    <option value="5997">
                                                        CIRCUS 50 K - (07.10.2022 19:00)
                                                    </option>
                                                    <option value="5976">
                                                        Oktoberfest des gladiateurs - (08.10.2022 17:00)
                                                    </option>
                                                    <option value="6040">
                                                        Heaven Bounty 30 K - (14.10.2022 19:00)
                                                    </option>
                                                    <option value="6028">
                                                        Circus Maximus 100K - (15.10.2022 17:00)
                                                    </option>
                                                    <option value="6034">
                                                        Viking Night 50K - (21.10.2022 19:00)
                                                    </option>
                                                    <option value="6055">
                                                        Mystery Bounty Killing Caesar - (22.10.2022 17:00)
                                                    </option>
                                                    <option value="6144">
                                                        Circus Maximus 100K - (22.10.2022 17:00)
                                                    </option>
                                                    <option value="6046">
                                                        Viking Night - (28.10.2022 19:00)
                                                    </option>
                                                    <option value="6043">
                                                        Gladiateur 50K - (29.10.2022 17:00)
                                                    </option>
                                                    <option value="6188">
                                                        Heaven 100 K - (29.10.2022 18:00)
                                                    </option>
                                                    <option value="6203">
                                                        Viking Night 50k - (04.11.2022 19:00)
                                                    </option>
                                                    <option value="5822">
                                                        Spartacus 100K - (05.11.2022 17:00)
                                                    </option>
                                                    <option value="6227">
                                                        Viking 50k - (11.11.2022 19:00)
                                                    </option>
                                                    <option value="6230">
                                                        Circus Maximus 100K - (12.11.2022 17:00)
                                                    </option>
                                                    <option value="6306">
                                                        Viking Night 50k - (18.11.2022 19:00)
                                                    </option>
                                                    <option value="6239">
                                                        Heaven Bounty progressif 30 K - (19.11.2022 17:00)
                                                    </option>
                                                    <option value="6243">
                                                        Viking Night 50k - (25.11.2022 19:00)
                                                    </option>
                                                    <option value="6236">
                                                        Circus 50K - (26.11.2022 17:00)
                                                    </option>
                                                    <option value="6334">
                                                        Viking Night 50k - (02.12.2022 19:00)
                                                    </option>
                                                    <option value="6337">
                                                        Circus Maximus 100K - (03.12.2022 17:00)
                                                    </option>
                                                    <option value="6384">
                                                        Viking Night 50k - (09.12.2022 19:00)
                                                    </option>
                                                    <option value="6399">
                                                        Spartacus 100K - (10.12.2022 17:00)
                                                    </option>
                                                    <option value="6484">
                                                        Challenge WSOPC Marrakech - (13.12.2022 19:00)
                                                    </option>
                                                    <option value="6387">
                                                        Viking Night 50k - (16.12.2022 19:00)
                                                    </option>
                                                    <option value="6454">
                                                        Circus Maximus 100K - (17.12.2022 17:00)
                                                    </option>
                                                    <option value="6390">
                                                        Viking de Noël 50k - (23.12.2022 19:00)
                                                    </option>
                                                    <option value="6526">
                                                        Viking Night 50k - (06.01.2023 19:00)
                                                    </option>
                                                    <option value="4088">
                                                        Single Sit &amp; Go - (07.01.2023 18:30)
                                                    </option>
                                                    <option value="6679">
                                                        JEUDI Sit &amp; GO 200+20 - (12.01.2023 19:00)
                                                    </option>
                                                    <option value="6533">
                                                        Viking Night 50k - (13.01.2023 19:00)
                                                    </option>
                                                    <option value="6530">
                                                        Gladiateur 50k - (14.01.2023 17:00)
                                                    </option>
                                                    <option value="6707">
                                                        Viking Night 50k - (20.01.2023 19:00)
                                                    </option>
                                                    <option value="6710">
                                                        Combo ReBuy + Add-On - (21.01.2023 18:00)
                                                    </option>
                                                    <option value="6758">
                                                        Viking 50k - Pas d'Ante jusqu'au niveau 7 - (27.01.2023 19:00)
                                                    </option>
                                                    <option value="6755">
                                                        Viking Night 50k - Pas d'Ante jusqu'au niveau 7 - (27.01.2023 19:00)
                                                    </option>
                                                    <option value="6781">
                                                        Viking – Pas d’ante jusqu’au niveau 7 - (03.02.2023 19:00)
                                                    </option>
                                                    <option value="6790">
                                                        Imperium 6 MAX - 1 Re-Entry ou 1 Add-on - (04.02.2023 17:00)
                                                    </option>
                                                    <option value="6878">
                                                        Progressive Knockout - (10.02.2023 19:00)
                                                    </option>
                                                    <option value="6918">
                                                        Viking – Pas d’ante jusqu’au niveau 7 - (17.02.2023 18:59)
                                                    </option>
                                                    <option value="6986">
                                                        Progressive Knockout - (18.02.2023 14:08)
                                                    </option>
                                                    <option value="6924">
                                                        Imperium 6 MAX – 1 Re-Entry ou 1 Add-on - (18.02.2023 15:00)
                                                    </option>
                                                    <option value="6983">
                                                        Viking – Pas d’ante jusqu’au niveau 7 - (24.02.2023 19:00)
                                                    </option>
                                                    <option value="7020">
                                                        Frisky Friday (ex Viking) - (03.03.2023 19:00)
                                                    </option>
                                                    <option value="7026">
                                                        DeepStack 100K - (04.03.2023 17:00)
                                                    </option>
                                                    <option value="7035">
                                                        Frisky Friday (ex Viking) - (10.03.2023 19:00)
                                                    </option>
                                                    <option value="7029">
                                                        BountyKO - (11.03.2023 17:00)
                                                    </option>
                                                    <option value="7069">
                                                        Frisky Friday - (17.03.2023 19:00)
                                                    </option>
                                                    <option value="7443">
                                                        DeepStack 100 UpDated - (18.03.2023 17:00)
                                                    </option>
                                                    <option value="7509">
                                                        3 Bullets - ANNULE - (19.03.2023 17:00)
                                                    </option>
                                                    <option value="7538">
                                                        Frisky Friday - (24.03.2023 19:00)
                                                    </option>
                                                    <option value="7571">
                                                        Frisky Friday - (31.03.2023 19:00)
                                                    </option>
                                                    <option value="7619">
                                                        Easter MainEvent Day 1A - (06.04.2023 19:00)
                                                    </option>
                                                    <option value="7598">
                                                        Frisky Bunny - Easter Festival - (06.04.2023 20:00)
                                                    </option>
                                                    <option value="7622">
                                                        Easter MainEvent Day 1B - (07.04.2023 17:00)
                                                    </option>
                                                    <option value="7601">
                                                        Easter Bells - Easter Festival - (07.04.2023 19:00)
                                                    </option>
                                                    <option value="7625">
                                                        Easter MainEvent Final Day + TF - (08.04.2023 17:00)
                                                    </option>
                                                    <option value="7604">
                                                        Double Bunny - Easter Festival - (08.04.2023 19:00)
                                                    </option>
                                                    <option value="7887">
                                                        ! Choose ur' Stack - ANNUL - (09.04.2023 18:00)
                                                    </option>
                                                    <option value="7607">
                                                        Eggshell Tilt - Easter Festival - (10.04.2023 16:00)
                                                    </option>
                                                    <option value="7610">
                                                        Omaha PLO - Easter Festival - (10.04.2023 18:00)
                                                    </option>
                                                    <option value="7953">
                                                        Deep Stack - (15.04.2023 14:30)
                                                    </option>
                                                    <option value="7985">
                                                        Frisky Friday - (21.04.2023 19:00)
                                                    </option>
                                                    <option value="8010">
                                                        Deep Stack - (22.04.2023 14:30)
                                                    </option>
                                                    <option value="8064">
                                                        Frisky Friday - (28.04.2023 19:00)
                                                    </option>
                                                    <option value="8175">
                                                        Frisky Friday Plus - (05.05.2023 19:00)
                                                    </option>
                                                    <option value="8282">
                                                        Deep Stack FreezeOut - (06.05.2023 14:30)
                                                    </option>
                                                    <option value="8276">
                                                        Frisky Friday Plus - (12.05.2023 19:00)
                                                    </option>
                                                    <option value="8504">
                                                        Frisky Friday Plus - (19.05.2023 19:00)
                                                    </option>
                                                    <option value="8513">
                                                        Deep Stack Plus - (27.05.2023 14:30)
                                                    </option>
                                                    <option value="8773">
                                                        Frisky - (02.06.2023 19:00)
                                                    </option>
                                                    <option value="8776">
                                                        Frisky - (09.06.2023 19:00)
                                                    </option>
                                                    <option value="8779">
                                                        Deep FreezeOut - (10.06.2023 14:30)
                                                    </option>
                                                    <option value="8510">
                                                        Frisky - (16.06.2023 19:00)
                                                    </option>
                                                    <option value="8901">
                                                        Vintage (niveaux de 30min) - (17.06.2023 14:30)
                                                    </option>
                                                    <option value="8767">
                                                        Deep - (24.06.2023 14:30)
                                                    </option>
                                                    <option value="6776">
                                                        BIG Stack bounty de printemps (avec croupiers) - (18.02.2023 13:30)
                                                    </option>
                                                    <option value="8893">
                                                        S&amp;G du jeudi - (08.06.2023 20:00)
                                                    </option>
                                                    <option value="8896">
                                                        S&amp;G du jeudi - (15.06.2023 20:00)
                                                    </option>
                                                    <option value="9011">
                                                        #Sit&amp;go – NLH – PRC - (09.06.2023 20:00)
                                                    </option>
                                                    <option value="8748">
                                                        #10 – NLH – PRC - (10.06.2023 20:00)
                                                    </option>
                                                    <option value="9005">
                                                        #Sit&amp;go – NLH – PRC - (16.06.2023 20:00)
                                                    </option>
                                                    <option value="9008">
                                                        #Sit&amp;go – NLH – PRC - (23.06.2023 20:00)
                                                    </option>
                                                    <option value="9014">
                                                        #Sit&amp;go – NLH – PRC - (07.07.2023 20:00)
                                                    </option>
                                                    <option value="5474">
                                                        Progressive Bounty Hunter - (03.12.2022 19:00)
                                                    </option>
                                                    <option value="5434">
                                                        The Bounty Hunter - (10.12.2022 19:00)
                                                    </option>
                                                    <option value="6797">
                                                        MIX OMAHA / HOLDEM MASTER - (11.02.2023 19:00)
                                                    </option>
                                                    <option value="5568">
                                                        SUPER BOUNTY HUNTER - (25.03.2023 19:00)
                                                    </option>
                                                    <option value="6794">
                                                        The Deep Stack - (06.05.2023 16:00)
                                                    </option>
                                                    <option value="5471">
                                                        Omaha FullWrap - (21.05.2023 17:00)
                                                    </option>
                                                    <option value="5571">
                                                        SUPER Deep Stack - (09.06.2023 19:00)
                                                    </option>
                                                    <option value="5437">
                                                        Sunday Storm - (11.06.2023 17:00)
                                                    </option>
                                                    <option value="8418">
                                                        Fulledge Sommer Open Day 1A - (16.06.2023 19:00)
                                                    </option>
                                                    <option value="8427">
                                                        Fulledge Summer Open Day 1B - (17.06.2023 19:00)
                                                    </option>
                                                    <option value="8424">
                                                        Fulledge Sommer Open Day2 Finalday - (18.06.2023 16:00)
                                                    </option>
                                                    <option value="6930">
                                                        B'Monday League - (20.02.2023 19:00)
                                                    </option>
                                                    <option value="6903">
                                                        B’DEEP / DAY 1A - (24.02.2023 19:00)
                                                    </option>
                                                    <option value="6906">
                                                        B’DEEP / DAY 1B - (25.02.2023 15:00)
                                                    </option>
                                                    <option value="6999">
                                                        B’ Fast - (26.02.2023 16:00)
                                                    </option>
                                                    <option value="6945">
                                                        B'Monday League - (27.02.2023 19:00)
                                                    </option>
                                                    <option value="6948">
                                                        B’Yourself - (03.03.2023 19:00)
                                                    </option>
                                                    <option value="6951">
                                                        B’ Fast - (05.03.2023 15:00)
                                                    </option>
                                                    <option value="7002">
                                                        B' Monday League - (06.03.2023 19:00)
                                                    </option>
                                                    <option value="7084">
                                                        B' Monday League - (13.03.2023 19:00)
                                                    </option>
                                                    <option value="7449">
                                                        B’Yourself - (17.03.2023 19:00)
                                                    </option>
                                                    <option value="7452">
                                                        B’ Fast - (19.03.2023 15:00)
                                                    </option>
                                                    <option value="7531">
                                                        B’ Monday League - (20.03.2023 19:00)
                                                    </option>
                                                    <option value="7541">
                                                        B’Yourself - (24.03.2023 19:00)
                                                    </option>
                                                    <option value="7081">
                                                        Mystery Bounty - (25.03.2023 14:00)
                                                    </option>
                                                    <option value="7671">
                                                        B’ Monday League - (27.03.2023 19:00)
                                                    </option>
                                                    <option value="7674">
                                                        B’Yourself - (31.03.2023 19:00)
                                                    </option>
                                                    <option value="7677">
                                                        B’ Fast - (02.04.2023 15:00)
                                                    </option>
                                                    <option value="7808">
                                                        B’ Monday League - (03.04.2023 19:00)
                                                    </option>
                                                    <option value="7805">
                                                        B’Monster Stack spécial Pâques - (08.04.2023 14:00)
                                                    </option>
                                                    <option value="7893">
                                                        B’ Monday League - (10.04.2023 19:00)
                                                    </option>
                                                    <option value="7896">
                                                        B’Yourself - (14.04.2023 19:00)
                                                    </option>
                                                    <option value="7899">
                                                        B’ Fast - (16.04.2023 15:00)
                                                    </option>
                                                    <option value="7902">
                                                        B’ Monday League - (17.04.2023 19:00)
                                                    </option>
                                                    <option value="7799">
                                                        B’DEEP / Day 1A - (21.04.2023 19:00)
                                                    </option>
                                                    <option value="7802">
                                                        B’DEEP / Day 1B - (22.04.2023 14:00)
                                                    </option>
                                                    <option value="7979">
                                                        B’ Fast - (23.04.2023 15:00)
                                                    </option>
                                                    <option value="8052">
                                                        B’ Monday League - (24.04.2023 19:00)
                                                    </option>
                                                    <option value="8055">
                                                        B’Yourself - (28.04.2023 19:00)
                                                    </option>
                                                    <option value="8058">
                                                        B’ Fast - (30.04.2023 15:00)
                                                    </option>
                                                    <option value="8085">
                                                        B’ Monday League  Emil on Tour - (01.05.2023 19:00)
                                                    </option>
                                                    <option value="8359">
                                                        B’Yourself - (05.05.2023 19:00)
                                                    </option>
                                                    <option value="8362">
                                                        B’ Fast - (07.05.2023 15:00)
                                                    </option>
                                                    <option value="8365">
                                                        B’ Monday League - (08.05.2023 19:00)
                                                    </option>
                                                    <option value="8368">
                                                        B’Yourself - (12.05.2023 19:00)
                                                    </option>
                                                    <option value="8374">
                                                        B’ Fast - (14.05.2023 15:00)
                                                    </option>
                                                    <option value="8412">
                                                        B’ Monday League - (15.05.2023 19:00)
                                                    </option>
                                                    <option value="8406">
                                                        B’Yourself - (19.05.2023 19:00)
                                                    </option>
                                                    <option value="8371">
                                                        Mystery Bounty - (20.05.2023 14:00)
                                                    </option>
                                                    <option value="8686">
                                                        Side Mystery - (20.05.2023 18:00)
                                                    </option>
                                                    <option value="8544">
                                                        B’ Monday League - (22.05.2023 19:00)
                                                    </option>
                                                    <option value="8547">
                                                        B’Yourself - (26.05.2023 19:00)
                                                    </option>
                                                    <option value="8726">
                                                        B’ Fast - (28.05.2023 15:00)
                                                    </option>
                                                    <option value="8735">
                                                        B’ Monday League - (29.05.2023 19:00)
                                                    </option>
                                                    <option value="8802">
                                                        B’Yourself - (02.06.2023 19:00)
                                                    </option>
                                                    <option value="8732">
                                                        B’DEEP - (03.06.2023 14:00)
                                                    </option>
                                                    <option value="8910">
                                                        Side B'Deep - (03.06.2023 18:30)
                                                    </option>
                                                    <option value="8796">
                                                        Freeroll Packages Rozvadov - (05.06.2023 19:00)
                                                    </option>
                                                    <option value="8808">
                                                        BML Hors championnat - (05.06.2023 19:30)
                                                    </option>
                                                    <option value="8811">
                                                        B’Yourself - (09.06.2023 19:00)
                                                    </option>
                                                    <option value="8814">
                                                        B’ Fast - (11.06.2023 15:00)
                                                    </option>
                                                    <option value="9025">
                                                        B’ Monday League - (12.06.2023 19:00)
                                                    </option>
                                                    <option value="9028">
                                                        B’Yourself - (16.06.2023 19:00)
                                                    </option>
                                                    <option value="9031">
                                                        B’ Fast - (18.06.2023 15:00)
                                                    </option>
                                                    <option value="9034">
                                                        B’ Monday League - (19.06.2023 19:00)
                                                    </option>
                                                    <option value="9017">
                                                        B’Deep / Day 1A - (23.06.2023 19:00)
                                                    </option>
                                                    <option value="9020">
                                                        B’Deep / Day 1B - (24.06.2023 14:00)
                                                    </option>
                                                    <option value="8866">
                                                        Mystery K.O. (Bounty) Day 1A - (09.06.2023 19:00 - 11.06.2023)
                                                    </option>
                                                    <option value="8872">
                                                        Mystery K.O. (Bounty) Day 1 B - (10.06.2023 16:00 - 11.06.2023)
                                                    </option>
                                                    <option value="8875">
                                                        Le Flash (Hyper Turbo) - (14.06.2023 19:00)
                                                    </option>
                                                    <option value="8878">
                                                        Le Sang (Turbo) - (16.06.2023 19:00)
                                                    </option>
                                                    <option value="8881">
                                                        Le Léviathan (Monster Stack) - (18.06.2023 14:30)
                                                    </option>
                                                    <option value="8885">
                                                        Le Sang (Turbo) - (21.06.2023 19:00)
                                                    </option>
                                                    <option value="8922">
                                                        Win The Button - (24.06.2023 18:00)
                                                    </option>
                                                    <option value="8916">
                                                        Dealer Choice, 8 max NLHE Plo 4&amp;5 - (27.06.2023 19:00)
                                                    </option>
                                                    <option value="8888">
                                                        Le Run It Twice - (30.06.2023 19:00)
                                                    </option>
                                                    <option value="7998">
                                                        Tournoi de mardi avec pot de fin&nbsp;d'année - (18.04.2023 19:00)
                                                    </option>
                                                    <option value="8073">
                                                        RPR Deepstack/Reentry - (22.04.2023 17:00)
                                                    </option>
                                                    <option value="8079">
                                                        Tournoi de mardi avec pot de fin d’année - (25.04.2023 19:00)
                                                    </option>
                                                    <option value="8082">
                                                        Tournoi de mardi avec pot de fin d’année - (02.05.2023 19:00)
                                                    </option>
                                                    <option value="8437">
                                                        Tournoi de mardi avec pot de fin d’année - (09.05.2023 19:00)
                                                    </option>
                                                    <option value="8442">
                                                        RPR Deepstack/Reentry - (13.05.2023 17:00)
                                                    </option>
                                                    <option value="8619">
                                                        Tournoi de mardi avec pot de fin d’année - (16.05.2023 19:00)
                                                    </option>
                                                    <option value="8673">
                                                        Tournoi de mardi avec pot de fin d’année - (23.05.2023 19:00)
                                                    </option>
                                                    <option value="8676">
                                                        RPR Deepstack/Reentry - (27.05.2023 17:00)
                                                    </option>
                                                    <option value="8679">
                                                        Tournoi de mardi avec pot de fin d’année - (30.05.2023 19:00)
                                                    </option>
                                                    <option value="8682">
                                                        Tournoi de mardi avec pot de fin d’année - (06.06.2023 19:00)
                                                    </option>
                                                    <option value="9070">
                                                        Tournoi de mardi avec pot de fin d’année - (13.06.2023 19:00)
                                                    </option>
                                                    <option value="9073">
                                                        Tournoi de mardi avec pot de fin d’année - (20.06.2023 19:00)
                                                    </option>
                                                    <option value="9079">
                                                        RPR Deepstack/Reentry - (24.06.2023 17:00)
                                                    </option>
                                                    <option value="9076">
                                                        Tournoi de mardi avec pot de fin d’année - (27.06.2023 19:00)
                                                    </option>
                                                    <option value="8397">
                                                        Short-Handed 6 Max (Annulé) - (28.05.2023 14:30)
                                                    </option>
                                                    <option value="8106">
                                                        Friday Night Poker - (21.04.2023 19:00)
                                                    </option>
                                                    <option value="8211">
                                                        Sunday Fun Poker - (23.04.2023 16:00)
                                                    </option>
                                                    <option value="8223">
                                                        Sunday Fun Poker - (23.04.2023 19:00)
                                                    </option>
                                                    <option value="8217">
                                                        Classic Tuesday - (25.04.2023 19:00)
                                                    </option>
                                                    <option value="8285">
                                                        Friday Night Poker - (28.04.2023 19:00)
                                                    </option>
                                                    <option value="8291">
                                                        100K Freezeout Deepstack - (29.04.2023 18:00)
                                                    </option>
                                                    <option value="8294">
                                                        Saturday Late Night Poker - (29.04.2023 21:00)
                                                    </option>
                                                    <option value="8297">
                                                        Sunday Night Poker - (30.04.2023 19:00)
                                                    </option>
                                                    <option value="8300">
                                                        Omaha shot Clock Tournament - (02.05.2023 19:00)
                                                    </option>
                                                    <option value="8303">
                                                        Classic Tuesday - (02.05.2023 19:00)
                                                    </option>
                                                    <option value="8312">
                                                        The Big Fish - (03.05.2023 19:00)
                                                    </option>
                                                    <option value="8318">
                                                        King Of Freezeout - (04.05.2023 19:00)
                                                    </option>
                                                    <option value="8324">
                                                        Donnstigs Ass - (04.05.2023 19:30)
                                                    </option>
                                                    <option value="8330">
                                                        Friday Night Poker - (05.05.2023 19:00)
                                                    </option>
                                                    <option value="8333">
                                                        100K Freezeout Deepstack - (06.05.2023 18:00)
                                                    </option>
                                                    <option value="8339">
                                                        Saturday Late Night Poker - (06.05.2023 21:00)
                                                    </option>
                                                    <option value="8377">
                                                        Sunday Fun Poker - (07.05.2023 16:00)
                                                    </option>
                                                    <option value="8446">
                                                        Classic Tuesday - (09.05.2023 19:00)
                                                    </option>
                                                    <option value="8449">
                                                        Omaha shot Clock Tournament - (09.05.2023 19:00)
                                                    </option>
                                                    <option value="8452">
                                                        The Big Fish - (10.05.2023 19:00)
                                                    </option>
                                                    <option value="8486">
                                                        King Of Freezeout - (11.05.2023 16:15)
                                                    </option>
                                                    <option value="8489">
                                                        Donnstigs Ass - (11.05.2023 19:30)
                                                    </option>
                                                    <option value="8492">
                                                        Friday Night Poker - (12.05.2023 19:00)
                                                    </option>
                                                    <option value="8495">
                                                        100K Freezeout Deepstack - (13.05.2023 18:00)
                                                    </option>
                                                    <option value="8588">
                                                        Saturday Late Night Poker - (13.05.2023 21:00)
                                                    </option>
                                                    <option value="8570">
                                                        Sunday Fun Poker - (14.05.2023 16:00)
                                                    </option>
                                                    <option value="8573">
                                                        Classic Tuesday - (16.05.2023 19:00)
                                                    </option>
                                                    <option value="8585">
                                                        Omaha shot Clock Tournament - (16.05.2023 19:00)
                                                    </option>
                                                    <option value="8657">
                                                        100K Freezeout Deepstack - (17.05.2023 19:00)
                                                    </option>
                                                    <option value="8660">
                                                        Special Late Night Poker - (17.05.2023 21:00)
                                                    </option>
                                                    <option value="8579">
                                                        King Of Freezeout - (18.05.2023 19:00)
                                                    </option>
                                                    <option value="8582">
                                                        Donnstigs Ass - (18.05.2023 19:30)
                                                    </option>
                                                    <option value="8591">
                                                        Friday Night Poker - (19.05.2023 20:00)
                                                    </option>
                                                    <option value="8663">
                                                        Black Saturday - (20.05.2023 20:00)
                                                    </option>
                                                    <option value="8597">
                                                        Sunday Fun Poker - (21.05.2023 16:00)
                                                    </option>
                                                    <option value="8666">
                                                        Classic Tuesday - (23.05.2023 19:00)
                                                    </option>
                                                    <option value="8669">
                                                        Omaha shot Clock Tournament - (23.05.2023 19:00)
                                                    </option>
                                                    <option value="8692">
                                                        The Big Fish - (24.05.2023 19:00)
                                                    </option>
                                                    <option value="8695">
                                                        The Small Fish - (24.05.2023 19:00)
                                                    </option>
                                                    <option value="8698">
                                                        King Of Freezeout - (25.05.2023 19:00)
                                                    </option>
                                                    <option value="8701">
                                                        Donnstigs Ass - (25.05.2023 19:30)
                                                    </option>
                                                    <option value="8707">
                                                        Friday Night Poker - (26.05.2023 19:00)
                                                    </option>
                                                    <option value="8710">
                                                        100K Freezeout Deepstack - (27.05.2023 18:00)
                                                    </option>
                                                    <option value="8713">
                                                        Saturday Late Night Poker - (27.05.2023 21:00)
                                                    </option>
                                                    <option value="8784">
                                                        100 K Freezeout Sunday Special - (28.05.2023 18:00)
                                                    </option>
                                                    <option value="8821">
                                                        Classic Tuesday - (30.05.2023 19:00)
                                                    </option>
                                                    <option value="8824">
                                                        Omaha shot Clock Tournament - (30.05.2023 21:00)
                                                    </option>
                                                    <option value="8830">
                                                        Mystery Bounty Hold’em - (31.05.2023 19:00)
                                                    </option>
                                                    <option value="8836">
                                                        The Small Fish - (31.05.2023 19:30)
                                                    </option>
                                                    <option value="8839">
                                                        King Of Freezeout - (01.06.2023 19:00)
                                                    </option>
                                                    <option value="8842">
                                                        Donnstigs Ass - (01.06.2023 19:30)
                                                    </option>
                                                    <option value="8845">
                                                        Friday Night Poker - (02.06.2023 19:00)
                                                    </option>
                                                    <option value="8848">
                                                        100K Freezeout Deepstack - (03.06.2023 18:00)
                                                    </option>
                                                    <option value="8851">
                                                        Saturday Late Night Poker - (03.06.2023 19:30)
                                                    </option>
                                                    <option value="8854">
                                                        Sunday Fun Poker - (04.06.2023 16:00)
                                                    </option>
                                                    <option value="8957">
                                                        Classic Tuesday - (06.06.2023 19:00)
                                                    </option>
                                                    <option value="8966">
                                                        Time Poker Tournament PL Omaha - (06.06.2023 19:00)
                                                    </option>
                                                    <option value="8969">
                                                        The Big Fish - (07.06.2023 19:00)
                                                    </option>
                                                    <option value="8972">
                                                        The Small Fish - (07.06.2023 19:30)
                                                    </option>
                                                    <option value="8975">
                                                        King Of Freezeout - (08.06.2023 19:00)
                                                    </option>
                                                    <option value="8978">
                                                        Donnstigs Ass - (08.06.2023 19:30)
                                                    </option>
                                                    <option value="8984">
                                                        Friday Night Poker - (09.06.2023 19:00)
                                                    </option>

                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="form-group" controlId="">
                                                <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Subject')}</Form.Label>
                                                <Form.Control type="text" className='' />
                                            </Form.Group>
                                            <Form.Group className="form-group" controlId="">
                                                <Editor apiKey={process.env.REACT_APP_EDITOR_KEY}onInit={(event, editor) => editorRef.current = editor} />
                                            </Form.Group>
                                            <Row className='mt-2'>
                                                <Col sm={8} className='form-group'>
                                                    <Form.Control type="email" className='d-inline w-auto me-1 mb-3' placeholder="example@mail.com" />
                                                    <Button varient="primary" className='d-inline mb-3'>{t('page.myprofile.myprofilenav.Newsletters.SendTestEmail')}</Button>
                                                </Col>
                                                <Col sm={4} className='text-end'>
                                                    <Button varient="primary">{t('page.myprofile.myprofilenav.Newsletters.Send')}</Button>
                                                </Col>
                                            </Row>

                                        </Form>
                                        <Form className='smtp-setting-form'>
                                            <Row className='mt-5 form-group p-0'>
                                                <Col sm={12} className='mb-3'>

                                                    <h5>{t('page.myprofile.myprofilenav.Newsletters.SMTPsettings')}</h5>
                                                    <Form.Group className="form-group p-0" controlId="">
                                                        <p>{t('page.myprofile.myprofilenav.Newsletters.Ifyouusegmail')} <Link to="/setup-smtp">{t('page.myprofile.myprofilenav.Newsletters.thisinstruction')}</Link>.<br />
                                                            {t('page.myprofile.myprofilenav.Newsletters.Ifyouuseaprofessionalhosting')}<br />
                                                            {t('page.myprofile.myprofilenav.Newsletters.Youcancontactusifyou')}<Link to="/contact"> https://check-raise.ch/contact/</Link></p>
                                                    </Form.Group>

                                                </Col>
                                                <Col md={4} className='mb-3'>
                                                    <Form.Label className='text-md-end'>{t('page.myprofile.myprofilenav.Newsletters.SMTPhost')}</Form.Label>
                                                </Col>
                                                <Col md={6} className='mb-3'>
                                                    <Form.Control type="text" className='' value="check-raise.ch" />
                                                </Col>
                                                <Col md={4} className='mb-3'>
                                                    <Form.Label className='text-md-end'>{t('page.myprofile.myprofilenav.Newsletters.SMTPport')}</Form.Label>
                                                </Col>
                                                <Col md={6} className='mb-3'>
                                                    <Form.Control type="text" className='' value="587" />
                                                </Col>
                                                <Col md={4} className='mb-3'>
                                                    <Form.Label className='text-md-end'>{t('page.myprofile.myprofilenav.Newsletters.SMTPusername')}</Form.Label>
                                                </Col>
                                                <Col md={6} className='mb-3'>
                                                    <Form.Control type="text" className='' value="noreply@check-raise.ch" />
                                                </Col>
                                                <Col md={4} className='mb-3'>
                                                    <Form.Label className='text-md-end'>{t('page.myprofile.myprofilenav.Newsletters.SMTPpassword')}</Form.Label>
                                                </Col>
                                                <Col md={6} className='mb-3'>
                                                    <Form.Control type="password" className='' value="Jerome!69!69!" />
                                                </Col>
                                                <Col md={12} className='text-end'>
                                                    <Button varient="primary">{t('page.myprofile.myprofilenav.Newsletters.Save')}</Button>
                                                </Col>
                                            </Row>
                                        </Form>

                                        <Row className='mt-5'>
                                            <Col sm={12}>
                                                <h3>{t('page.myprofile.myprofilenav.Newsletters.Subscribers')}:</h3>
                                                <Table responsive className='subscribers-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Email</th>
                                                            <th>Is External</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        <tr>
                                                            <td>0860441656a@gmail.com</td>
                                                            <td>External</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>11clemevic@gmail.com</td>
                                                            <td>Internal</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>karinamikitcenko7@gmail.com</td>
                                                            <td>Internal</td>
                                                            <td>Non subscribed</td>
                                                            <td>

                                                            </td>
                                                        </tr>


                                                        <tr>
                                                            <td>2@fripoker.ch</td>
                                                            <td>Internal</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>0860441656a@gmail.com</td>
                                                            <td>External</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>11clemevic@gmail.com</td>
                                                            <td>Internal</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>14@heavenpoker.ch</td>
                                                            <td>External</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>karinamikitcenko7@gmail.com</td>
                                                            <td>Internal</td>
                                                            <td>Non subscribed</td>
                                                            <td>

                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>0860441656a@gmail.com</td>
                                                            <td>External</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>11clemevic@gmail.com</td>
                                                            <td>Internal</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>14@heavenpoker.ch</td>
                                                            <td>External</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>2@fripoker.ch</td>
                                                            <td>Internal</td>
                                                            <td>Subscribed</td>
                                                            <td>
                                                                <Link to="/" className='btn btn-link'>Disable</Link>
                                                            </td>
                                                        </tr>


                                                    </tbody>


                                                </Table>
                                            </Col>
                                        </Row>


                                        <Row className='mt-5 form-group p-0'>
                                            <Col md={12}>
                                                <h3>{t('page.myprofile.myprofilenav.Newsletters.Import/Exportsubscribers')}:</h3>
                                            </Col>
                                            <Col lg={6} className='mt-3'>
                                                <Form className='mb-2'>

                                                    <Form.Label className=''>{t('page.myprofile.myprofilenav.Newsletters.Chooselist')}:</Form.Label>
                                                    <div className='d-flex'>
                                                        <Form.Select className='me-1'>
                                                            <option value="all">{t('page.myprofile.myprofilenav.Newsletters.All')}</option>
                                                            <option value="internal">{t('page.myprofile.myprofilenav.Newsletters.Internal')}</option>
                                                            <option value="external">{t('page.myprofile.myprofilenav.Newsletters.External')}</option>
                                                        </Form.Select>
                                                        <Button varient="primary">{t('page.myprofile.myprofilenav.Newsletters.Export')}</Button>
                                                    </div>
                                                </Form>
                                            </Col>
                                            <Col lg={6} className='mt-3'>
                                                <Form className='mb-2'>
                                                    <Form.Label className="tooltip-import">{t('page.myprofile.myprofilenav.Newsletters.Insertfilewithemails')}:

                                                        <OverlayTrigger
                                                            key="top"
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id="tooltip-top">
                                                                    {t('page.myprofile.myprofilenav.Newsletters.YoushouldselectCSV')}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                                        </OverlayTrigger>
                                                    </Form.Label>
                                                    <Form.Control type="file" className='mb-2' />
                                                    <Button varient="primary">{t('page.myprofile.myprofilenav.Newsletters.Import')}</Button>
                                                </Form>
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col md={12}>
                                                <p>{t('page.myprofile.myprofilenav.Newsletters.Youcanimport')}<br />
                                                    {t('page.myprofile.myprofilenav.Newsletters.Ifplayersalready')}<br />
                                                    {t('page.myprofile.myprofilenav.Newsletters.Youcannotre-register')}<br />
                                                    {t('page.myprofile.myprofilenav.Newsletters.Donotimport')}</p>
                                            </Col>
                                        </Row>
                                        <Row className='mt-5'>
                                            <Col md={12}>
                                                <p>{t('page.myprofile.myprofilenav.Newsletters.MainCheckRaise')}: https://check-raise.ch/newsletters/?</p>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>

                    </Col>

                </Row>


            </div>

        </>
    );
};

export default Newsletters;