class Scaler{
    scaleWidth(masterWidth, percent){
        return (masterWidth * percent);
    }
    scaleHeight(masterHeight, percent){
        return (masterHeight * percent);
    }
    horizontallyCenter(main, secondary){
        return ((main-secondary)/2);;
    }
}
let object = new Scaler();
module.exports = object;