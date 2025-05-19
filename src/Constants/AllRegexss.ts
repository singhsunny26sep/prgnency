export const AllRegexss = {
  f_l_Name: /^[A-Za-z]/,
  userName: /^[a-zA-Z0-9_.-]*$/,
  //f_l_Name: /^([a-zA-Z ' -]*)$/i,
  email: /^[A-Z0-9.!#$'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  passwordRegx:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*)[A-Za-z\d@#$%&'()*+,-./:;<=>?[\]^_`{|}~]{8,}$/,

  mobileFormate: /^\d{10}$/,
  // extentionFormate: /d{3}[- ]?\d{3}[- ]?\d{4}( x\d{4})?|x\d{4}/,
  // extentionFormate: /^[+]([0-9]\d{1,2}$)/,
  extentionFormate: /^[0-9]{1,4}$/,
  amountRegx: /^[1-9]\d*$/,

  name: /^[a-zA-Z_.-0-9]/,
  upiAddress: /^[a-zA-Z0-9.\-]{2,256}@[a-zA-Z]{2,64}$/,
  IFSC: /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/,
  AccountNumber: /^\d{9,18}$/,
  PANNumber: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AdharNumber: /^[2-9]{1}[0-9]{11}$/,
  KycName: /^[A-Za-z\s]*$/,
};
