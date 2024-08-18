module.exports = class UserDto {
  id;
  email;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.is_activated;
  }
};
