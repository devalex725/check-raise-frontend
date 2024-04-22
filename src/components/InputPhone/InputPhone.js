import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
const InputPhoneComponent = ({ fn, phonecode, phoneCountry }) => {
  return (
    <div>
      <PhoneInput
        country={phoneCountry}
        onChange={fn}
        value={phonecode}
        dropdownStyle={{ color: "#000000" }}
        keyboardType="phone-pad"
        inputStyle={{
          backgroundColor: "#1A1A1A",
          height: 55,
          borderColor: "white",
          color: "white",
        }}
        placeholder="Select a country"
        //  disableCountryCode={true}
      />
    </div>
  );
};
export default InputPhoneComponent;
