
var convertMapPoints = require('convertMapPoints'),
    win = Ti.UI.createWindow({backgroundColor:"#ffffff"}),
    pop = new createPopView(),
    popView = pop.view,
    popLabel = pop.label,
    defaultLatitude = 37,
    defaultLongitude = -122,
    selectedPin = null;

var mapView = Titanium.Map.createView({
    top:0,
    left:0,
    width:"50%",
    height:"50%",
    mapType: Titanium.Map.STANDARD_TYPE,
    animate:true,
    region:{latitude:defaultLatitude, longitude:defaultLongitude, latitudeDelta:0.1, longitudeDelta:0.1},
    regionFit:true,
    userLocation: false,
    annotations: createPins(5)
}); 

var mapView2 = Titanium.Map.createView({
    bottom:0,
    right:0,
    width:"50%",
    height:"50%",
    mapType: Titanium.Map.STANDARD_TYPE,
    animate:true,
    region:{latitude:defaultLatitude, longitude:defaultLongitude, latitudeDelta:0.1, longitudeDelta:0.1},
    regionFit:true,
    userLocation: false,
    annotations: createPins(5)
}); 

win.add(mapView);
win.add(mapView2);
win.add(popView);

mapView.addEventListener('click', mapClick);

mapView.addEventListener('regionchanged', movePopView);

mapView2.addEventListener('click', mapClick);

mapView2.addEventListener('regionchanged', movePopView);

win.open();

function createPins(count){
    
    var pins = [];
    
    for (var i = 0, l = count; i<l; i++){
        
        var pin = Titanium.Map.createAnnotation({
            latitude:defaultLatitude,
            longitude:defaultLongitude,
            title:"Map Pin "+ i,
            animate:true,
            image: 'map-pin.png',
            pinImage: 'map-pin.png',
            selectedPinImage:'map-pin-selected.png',
        });
        
        pins.push(pin);
        
        defaultLatitude+=Math.random()*0.10
        defaultLongitude+=Math.random()*0.10
    }
    
    return pins;
}

function mapClick(evt) {
   
    if(evt.clicksource === 'pin' && evt.annotation != selectedPin){
        evt.source.deselectAnnotation(evt.annotation); 
        showPopView(evt);
        evt.annotation.setImage(evt.annotation.selectedPinImage);
        if(selectedPin){
            selectedPin.setImage(selectedPin.pinImage);
            selectedPin = evt.annotation;
        } else {
            selectedPin = evt.annotation;
        }
    } else {
        evt.source.deselectAnnotation(evt.annotation); 
    }
    
     
};


function createPopView(params){
    
    var params = params || {};

    var contentView = Ti.UI.createView({
        top:0,
        width:params.width?params.width:200,
        height:params.height?params.height:200,
        backgroundColor:"#000000",
        borderRadius:20,
        opacity:params.opacity?params.opacity:0.8
    });
    
    var arrowView = Ti.UI.createView({
        bottom:0,
        height:20,
        width:20,
        backgroundImage:"/arrow.png",
        opacity:params.opacity?params.opacity:0.8
    });
    
    var closeBtn = Ti.UI.createButton({
        backgroundImage:"/close.png",
        top:5,
        right:5,
        height:30,
        width:30
    });
   
    this.label = Ti.UI.createLabel({
        top:20,
        left:35,
        right:35,
        color:"#ffffff",
        height:Ti.UI.SIZE,
        font:{fontSize:20},
        minimumFontSize:8
    })
    
    this.view = Ti.UI.createView({
        height:contentView.height+arrowView.height,
        width:contentView.width,
        visible:false,
        opacity:0.0
    });
    
    this.view.add(contentView, arrowView, closeBtn, this.label);
    
    closeBtn.addEventListener('click', closePopView);
    
}

function closePopView(evt){
    
    popView.hide();
    selectedPin.setImage(selectedPin.pinImage);
    selectedPin = null;

}

function movePopView(evt){
    evt.source.setRegion(evt)
    if(selectedPin){
        var point = convertMapPoints({
            map:evt.source,
            annotation:selectedPin,
            view:win
        });
        popView.center ={x:point.x, y:(point.y-(popView.height/2)-20)};
    }
}

function showPopView(evt){
    
    var point = convertMapPoints({
        map:evt.source,
        annotation:evt.annotation?evt.annotation:selectedPin,
        view:win
    });
    popLabel.text = evt.annotation.title;
    popView.center ={x:point.x, y:(point.y-(popView.height/2)-20)};
    popView.show();
    popView.animate({opacity:1.0, duration:250});
    
}