const moment = require("moment");

module.exports = {
  truncate: function(string, length){
    if (string.length > length && string.length > 0) {
      let newString = string + " ";
      newString = string.substr(0, length);
      newString = string.substr(0, newString.lastIndexOf(" "));
      newString = (newString.length > 0) ? newString : string.substr(0, length);
      return newString + "...";
    }
    return string;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function(date, format){
    return moment(date).format(format);
  }
}
