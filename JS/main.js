let GLOBAL_DATA;
let READ_DATA = 0;
let top_timeline;
let matrix;
let timeline;
let menu;
let overview;
let top_overview;
main();
function paint(){
    calcRate_Avai(GLOBAL_DATA.data);
	
    timeline = new mainTimeline();
    overview = new mainOverview();
    top_timeline = new mainTop_Timeline();
    top_overview = new mainTop_Overview();
    menu = new mainMenu();
    console.log("when", top_timeline)
    matrix = new mainMatrices();
}
function delay(callback){
	if(READ_DATA == 1){ 
	    callback();  
	    return;  
	}  
    else{setTimeout(function(){delay(callback)}, 100)}
}
function main() {
    GLOBAL_DATA = new dataManager();
    delay(paint)

}
