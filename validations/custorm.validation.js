const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" không đúng định dạng Id');
  }
  return value;
};
const password = (value, helpers) => {
    console.log(value);
  if (value.length < 8) {
    return helpers.message('Mật khẩu phải lớn hơn 8 ký tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-z]/) || !value.match(/[A-Z]/)) {
    return helpers.message('Mật khẩu phải chứa ít nhất 1 ký tự chữ hoa, 1 ký tự chữ thường và 1 số');
  }
  return value;
};

module.exports = {
    password,
    objectId
}
