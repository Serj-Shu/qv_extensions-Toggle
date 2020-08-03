/*
* Extension: Toggle 
* Version: 1.0 
*/ 
var toggleCondition = 0; //1 - ON, 0 - OFF 

var conditionsArray = [];

Qva.AddExtension('Toggle', function() { var extURL = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only&name='; 

var files = []; files.push(extURL + 'Extensions/Toggle/jquery-3.1.1.min.js'); //using jQuery 
var config = {}; config.extension = this; // extension parameters 

    Qv.LoadExtensionScripts(files, function() { 
        var ConditionFromVariable;                   
        var mydoc = Qv.GetCurrentDocument();
        mydoc.GetAllVariables(function(vars) {
             
            var colorBG = config.extension.Layout.Text0.text; //background color 
            var colorON = config.extension.Layout.Text1.text; //color ON 
            var colorOFF = config.extension.Layout.Text2.text; //color OFF 
            var colorBorder = config.extension.Layout.Text3.text; //frame color 
            var toggleWidth = config.extension.Layout.Text4.text; //frame width 
            var switchWidth = '18px'; //toggle width
            var toggleHeight = config.extension.Layout.Text5.text; //toggle height 
            var toggleBorderRadius = config.extension.Layout.Text6.text; //rounded corners 
            var saVariable = config.extension.Layout.Text7.text; //variable with switched value
            var saValueOFF = config.extension.Layout.Text8.text; //OFF-value
            var saValueON = config.extension.Layout.Text9.text; //ON-value
            var UniqueId = config.extension.Layout.ObjectId.replace("\\", "_"); 
            
            var extFrame = config.extension.Element; //main frame 
            var positionOFF = '3px'; //position when switched off
            var positionON = (parseInt(toggleWidth) - parseInt(switchWidth) - 3) + 'px'; //position when switched on
            var toggleMove = [positionOFF, positionON]; var toggleColor = [colorOFF, colorON]; 
            var idToggleFrame = 'toggleFrame_' + UniqueId // Unique ID for each toggle
            
            if (typeof $('#' + idToggleFrame) != 'undefined') $('#' + idToggleFrame).remove(); //prevent multiple framing 
            
            if(vars != undefined) {
                for (var i = 0; i < vars.length; i++) { //look through all variables for the one                                                   
                    var obj = vars[i];
                    var name = obj.name;
                    var value = obj.value;
                    if (name == config.extension.Layout.Text7.text) ConditionFromVariable = value; //found one
                }
            }
            
            (ConditionFromVariable == saValueOFF) ? toggleCondition = 0 : toggleCondition = 1
            conditionsArray.push(UniqueId + '|' + toggleCondition) //array with all toggles and current conditions
            
            
            var toggleFrame = $('<div></div>'); //toggle frame 
                toggleFrame.attr('id', idToggleFrame); 
                toggleFrame.css({ 
                    width: toggleWidth, 
                    height: toggleHeight, 
                    'background-color': toggleColor[toggleCondition], 
                    border: '1px solid ' + colorBorder, 
                    'border-radius': toggleBorderRadius 
                }); 
                toggleFrame.on('click', toggleSwitch) 
                toggleFrame.appendTo(extFrame); 

            var idToggleSelf = 'toggleSelf_' + UniqueId // setting an unique id
            var toggleSelf = $('<div></div>'); //toggle itself (moveable part) 
                toggleSelf.attr('id', idToggleSelf); 
                toggleSelf.css({ 
                    position: 'relative', 
                    'box-sizing': 'border-box', 
                    width: switchWidth, 
                    height: '75%', 
                    left: toggleMove[toggleCondition], 
                    top: '50%', //offset toggle top point down by the half of the frame height 
                    transform: 'translate(0%, -50%)', //rise toggle top point up by the half of it height 
                    'background-color': colorBG, 
                    //border: '1px solid black', //border if needed 
                    'border-radius': toggleBorderRadius 
                }); 
                toggleSelf.appendTo(toggleFrame); 
            
            function toggleSwitch() { 
                        
            for(i=0; i<conditionsArray.length; i++) {
                    var togName = conditionsArray[i].split('|')[0];
                    var togValue = conditionsArray[i].split('|')[1];                                                                  
                    if (togName == UniqueId) {                                                
                        toggleCondition = togValue;
                        reverseCondition = (toggleCondition == 1) ? 0 : 1
                        conditionsArray[i] = togName + '|' + reverseCondition;
                    }
                }                                                               
                        
                toggleCondition == 0 ? toggleCondition = 1 : toggleCondition = 0 // toggle is moving until condition is changing
                
                if (toggleCondition == 0) {           // catch different value in case of current condition
                    setVar(saVariable, saValueOFF)
                }
                else {
                    setVar(saVariable, saValueON)
                }
                $('#'+idToggleSelf).css({ 
                    transition: '0.4s ease', // toggle speed and moving style 
                    left: toggleMove[toggleCondition] 
                }) 
                $('#'+idToggleFrame).css({ 
                    transition: '0.4s ease', // color animation style 
                    'background-color': toggleColor[toggleCondition] 
                }) 
            }
            
            function setVar (cfg, varValue){ //main function for variable setting             
                var qvDoc = Qv.GetCurrentDocument();
                qvDoc.SetVariable(saVariable, varValue);                                                                
            }                                                                        
        });                               
    }); 
});
