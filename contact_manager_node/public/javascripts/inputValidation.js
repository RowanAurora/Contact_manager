export class InputValidation {
  constructor(displayer) {
    this.displayer = displayer;
  }

  contactValidate(obj) {
    return (this.validateName(obj.full_name)
        && this.validateEmail(obj.email)
        && this.validatePhoneNumber(obj.phone_number));
  }

  specificValidationCheck(obj) {
    if (!this.validateName(obj.full_name)) {
      this.displayer.incorrect('#full_name');
    }
    if (!this.validateEmail(obj.email)) this.displayer.incorrect('#email');
    if (!this.validatePhoneNumber(obj.phone_number)) this.displayer.incorrect('#phone_number');
  }

  validateName(name) {
    return /^[a-zA-Z'\- ]+$/gi.test(name);
  }

  validateEmail(email) {
    return /^[a-z0-9]+(?:[.-_]?[a-z0-9]+)*@([a-z]+\.)+[a-z]+$/i.test(email);
  }

  validatePhoneNumber(number) {
    return /^[(]?[0-9]{3}[)]?[ ,-]?[0-9]{3}[ ,-]?[0-9]{4}$/.test(number);
  }

  validateTag(tag) {
    return /^[a-zA-Z0-9']+$/gi.test(tag);
  }
}