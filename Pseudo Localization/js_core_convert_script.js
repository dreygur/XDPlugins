function convert(string) {
    /////////////////////////////////////////////////
    //////////////////// DEN STRING HIER SOLLTE ICH KOMPLTT UMSCHREIBEN!!!!!!!!!!!!!
    ///////////////////////////////////////////
    //////////HIER DARF NUR EIN STRING REINGELADEN WERDEN UND KEIN OBJECT!!!!!!!!!!!
    var result = '',
        // int_distortion = document.getElementById('distortion').value,
        int_distortion = "4",
        array_convertion_goal =  ["0", "ã", "Ӑ", "ѣ", "Ɓ", "č", "Č", "đ", "Đ", "ę", "Ę", "ƒ", "Ŧ","ģ", "Ġ", "ĥ", "Ħ", "ĩ", "İ", "į", "Ĵ", "ķ", "Ķ","ĺ", "ӎ", "ŇŃ","ń", "ō", "ҏ", "ǭ", "ŕ", "ś", "ť", "ũ", "ų", "ŵ", "Χ", "ų", "ž"],
        array_convertion_start = ["0", "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F","g", "G", "h", "H", "i", "I", "j", "J", "k", "K","l", "m", "M","n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
        array_convertion_extend = ["why not", "lets try", "sam fisher", "dave rocks"],
        array_original = '',
        array_ignore_for_convert = [" ", " ", ".","[", "]", "-", ":", "+", "#", "_", "*", "~", "´", "^", "°", "!", "\"", "'", "§", "$", "%", "&", "/", "(", ")", "=", "{", "}", "\\", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        int = 0,
        int_double_rand = 0,
        new_strg = '';

    array_original = string.split('')

    for (var val in array_original) {
        val = array_original[val];
        // console.log(val);
        int = array_convertion_start.indexOf(val);
        // if(val !== " ") {
        if(array_ignore_for_convert.indexOf(val) < 0) {

            if(int > 0) {
                val = array_convertion_goal[int];
            }
            int_double_rand = Math.floor((Math.random() * int_distortion) + 1);
            // alert(int_double_rand);
            if(int_double_rand == "1" && int_distortion != "1") {
                val = val + val;
            }
            // if(int_double_rand == "1" && int_distortion != "1") {
            //     val = val + val;
            // } 
        } else {

            // alert();
        }     
        
        result = result + val;
    }
    console.log(result);

    // int_rand = Math.floor((Math.random() * 3) + 1);
    // target_area.innerHTML = '['+result+array_convertion_extend[int_rand]+']';
    
    // console.log(result.indexOf('['));
    // console.log(result.length - 1 )
    // console.log(result.indexOf(']'))

    // if(result.indexOf(']') >= result.length) {
    //TODO: müsste dann nochmal 
    if(result.indexOf('[') == 0) {
        return result.trim();
    } else {
        return '['+result.trim()+']';
    }
    // alert(str_original);
};

function convert1234(string) {
    console.log('lets seeeeeeeeeeeeeeeeee')
};
module.exports = convert;
