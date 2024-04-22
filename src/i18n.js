import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DateTime, DayNumbers } from "luxon";
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: "en",
        
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });
i18n.services.formatter.add('DATE_LONG', (value, lng, _options) => {
    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
        }
        if(lng === "fr")
        {
            return DateTime.fromJSDate(new Date(value)).setLocale(lng).toLocaleString({ weekday: "short", day: '2-digit', month: '2-digit', year: 'numeric' }).slice(0, 2).slice(0,1).toUpperCase()+ DateTime.fromJSDate(new Date(value)).setLocale(lng).toLocaleString({ weekday: "short", day: '2-digit', month: '2-digit', year: 'numeric' }).slice(1, 2).slice(0,2).toLocaleLowerCase()
        }
        return DateTime.fromJSDate(new Date(value)).setLocale(lng).toLocaleString({ weekday: "short", day: '2-digit', month: '2-digit', year: 'numeric' }).slice(0, 2)
   
    // DateTime.fromJSDate(new Date(value)).setLocale(lng).toFormat("EEE''  dd.MM.yyyy hh:mm'").slice(0, 2)
    // 
    
})

export default i18n;