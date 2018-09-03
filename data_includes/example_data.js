// This tells Ibex you will send the results early
var manualSendResults = true;
var showProgressBar = true;
var shuffleSequence = seq("consent","instructions","prepractice",startsWith("Practice"),"balance","scaleinstr","distract",randomize("experiment-first"),randomize("experiment"),
                            "feedback","send","confirmation");
// rshuffle(startsWith("experiment")),rshuffle(startsWith("experiment"))
PennController.ResetPrefix(null);


// keyButton = function(id, text, wait){
//     let btn = newButton("btn"+id, text)
//             .print();
//     let selector = newSelector("sel"+id)
//                         .settings.add( getButton("btn"+id) )
//                         .settings.keys( " " );
//     if (wait)
//         selector = selector
//                         .wait( wait );
//     return [
//         btn
//         ,
//         selector
//     ];
// }

var items = [

    // ["setcounter", "__SetCounter__", { } ] // DO I NEED THIS?
    // ,    
    ["consent", "PennController", PennController(
        newHtml("consent", "SonaConsent.html")
            .settings.log()
            .print()
        ,
        // keyButton("consentBtn", "I consent to take this experiment",
        //     getHtml("consent").test.complete()
        //         .failure(
        //             getHtml("consent").warn(),
        //             getSelector("selconsentBtn").unselect()
        //         )
        // )
        newButton("consent btn", "I consent to take this experiment")
            .print()
            .wait( getHtml("consent").test.complete().failure( getHtml("consent").warn() ) )
    )]
    ,
    ["instructions", "PennController", PennController(
        newHtml("instructions form", "TaskInstructionsUnmarked.html")
            .print()
        ,
        newButton("continue btn", "Click for more instructions.")
            .print()
            .wait()
//            .wait( getHtml("instructions form").test.complete().failure(getHtml("instructions form").warn()) )
    )]
    ,
    ["prepractice", "PennController", PennController(
        newHtml("prepractice form", "NaturalnessInstructions.html")
            .print()
        ,
        newButton("continue to expt", "Continue.")
            .print()
            .wait( getHtml("prepractice form").test.complete().failure(getHtml("prepractice form").warn()) )
    )]
    ,
    ["balance", "PennController", PennController(
        newHtml("balance form", "Balance.html")
            .print()
        ,
        newButton("continue btn", "Continue.")
            .print()
            .wait( getHtml("balance form").test.complete().failure(getHtml("balance form").warn()) )
    )]
    ,  
    ["scaleinstr", "PennController", PennController(
        newHtml("scale form", "Scale.html")
            .print()
        ,
        newButton("continue btn", "Continue.")  
            .print()
            .wait( getHtml("scale form").test.complete().failure(getHtml("scale form").warn()) )
    )]
    ,     
    ["distract", "PennController", PennController(
        newHtml("distract form", "DistractionsOff.html")
            .print()
        ,
        newButton("continue btn", "Continue.")
            .print()
            .wait( getHtml("distract form").test.complete().failure(getHtml("distract form").warn()) )
    )]
    ,
    ["feedback", "PennController", PennController(
        newHtml("feedback form", "ProlificFeedback.html")
            .settings.log()
            .print()
        ,
        newButton("continue to confirm", "Click here to confirm your participation!")
            .settings.bold()
            .print()
            .wait()                
    )]
     ,
    ["send", "__SendResults__", {}]   
    ,
    ["confirmation", "PennController", PennController(
        newHtml("confirmation form", "ProlificConfirmation.html")
            .print()
          ,
          newButton("continue final", "Click to confirm that your answers went through.") // To debriefing, on Sona.
              .wait()                        
    )]
   // ,    // Sona only
   //  ["debriefing", "PennController", PennController(
   //     newHtml("confirmation form", "IbexDebriefing.html")
   //          .print()
   //      ,
   //      newButton("continue to confirm", "Click to confirm that your answers went through.")
   //          .settings.bold()
   //          .print()
   //         .wait()
   //  )]                     
   //  , // Sona only
   //  ["final", "PennController", PennController(
   //       newText("final message", "The results were successfully sent to the server. Thanks!")
   //           .settings.bold()  
   //           .settings.center()
   //           .print()            
   //   )]
    
];

PennController.GetTable( "datasource-however.csv" ).setLabel("Expt");

PennController.FeedItems( PennController.GetTable( "datasource-however.csv" ).filter("ExptType","Practice"),
    (item) => PennController(
        newFunction("isGood", function(){ return item.Expt=="Practice-good"; })
        ,
        newFunction("isIntermed", function(){ return item.Expt=="Practice-intermed"; })
        ,
        newCanvas("stimbox", 730, 120)
            .settings.add(25,25,
                newText("context",
                    "Imagine that you're at the gym, and you happen to overhear the following bit of someone's conversation:")
                    .settings.size(700, 30)
            )    
            .settings.add(25,70,
                newText("stimuli", item.StimUnmarked)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 4000)
            .start()
            .wait()
        ,
        newText("instructionsText", "")
            .settings.center()
            .settings.bold()
        ,
        getFunction("isGood")
            .test.is(true)
            .success( getText("instructionsText").settings.text("It's probably quite easy to imagine when you would use this sentence. People typically give it a high score:") )
            .failure(
                getFunction("isIntermed")
                    .test.is(true)
                    .success( getText("instructionsText").settings.text("It may not be so clear when or if you'd use this sentence. People typically give it an intermediate score:") )
                    .failure( getText("instructionsText").settings.text("Regardless of the situation, you'd probably not use this sentence. People typically give it a low score:") )
            )
        ,            
        getText("instructionsText")
            .print()
        ,
         newTimer("transfer", 4000)
            .start()
            .wait()         
        ,                   
        newScale("answer", 9)
            .settings.disable()
        ,            
        getFunction("isGood")
            .test.is(true)
            .success( getScale("answer").settings.default(8) )
            .failure(
                getFunction("isIntermed")
                    .test.is(true)
                    .success( getScale("answer").settings.default(4) )
                    .failure( getScale("answer").settings.default(0) )
            )
        ,    
        newCanvas("ansbox", 730, 120)
            .settings.add(25,25, newText("background", "To me, this sentence sounds").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "Completely unnatural").settings.bold() )
            .settings.add(180,70, getScale("answer").settings.size(200, 0) )
            .settings.add(415,75, newText("labeRight", "Completely natural").settings.bold() )
            .print()
        ,        
        newButton("validate", "Next question.")
            .settings.center()    
            .print()    
            .wait()
    )
);

PennController.FeedItems( PennController.GetTable( "datasource-however.csv" ).filter("Expt","experiment-first"),
    (item) => PennController(
        newTimer("blank", 1000)
            .start()
            .wait()
        ,    
        newTooltip("instructions", "Press Space to continue")
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
        newCanvas("stimbox", 730, 120)
            .settings.add(25,25,
                newText("context",
                    "Imagine that you're at the gym, and you happen to overhear the following bit of someone's conversation:")
                    .settings.size(700, 30)
            )   
            .settings.add(25,70,
                newText("stimuli", item.StimUnmarked)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 2000)
            .start()
            .wait()
        ,   
        newScale("answer", 9)
            .settings.log()
        ,
        newCanvas("answerbox", 730, 120)
            .settings.add(25,25, newText("background", "To me, this sentence sounds:").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "Completely unnatural").settings.bold() )
            .settings.add(180,70, getScale("answer").settings.size(200, 0) )
            .settings.add(415,75, newText("labeRight", "Completely natural").settings.bold() )
            .print()   
        ,
        newText("warning","Please select a response.")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Next question.")
            .settings.center() 
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                          )
                 )        

    ).log("Expt", item.Expt)
    .log("ExptType", item.ExptType)
    .log("ItemName", item.ItemName)
    .log("Tense", item.Tense)
    .log("polarity", item.polarity)
    .log("EmbPred", item.EmbPred)
    .log("lemma", item.lemma)
    .log("SpActAdverb", item.SpActAdverb)
    .log("Group", item.Group)
    .log("Item", item.Item)
    .log("NoExpt", item.NoExpt)
    .log("EmbCondition", item.EmbCondition)
    .log("StimUnmarked", item.StimUnmarked)
    .log("mcpred", item.mcpred)
//    .log("StimArgfront", item.StimArgfront)
//    .log("StimAdjunct", item.StimAdjunct)
//    .log("StimSpActAdv", item.StimSpActAdv)
);

PennController.FeedItems( PennController.GetTable( "datasource-however.csv" ).filter("Expt","experiment"),
    (item) => PennController(
        newTimer("blank", 1000)
            .start()
            .wait()
        ,    
        newTooltip("instructions", "Press Space to continue")
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
        newCanvas("stimbox", 730, 120)
            .settings.add(25,25,
                newText("context",
                    "Imagine that you're at the gym, and you happen to overhear the following bit of someone's conversation:")
                    .settings.size(700, 30)
            )   
            .settings.add(25,70,
                newText("stimuli", item.StimUnmarked)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 2000)
            .start()
            .wait()
        ,   
        newScale("answer", 9)
            .settings.log()
        ,
        newCanvas("answerbox", 730, 120)
            .settings.add(25,25, newText("background", "To me, this sentence sounds:").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "Completely unnatural").settings.bold() )
            .settings.add(180,70, getScale("answer").settings.size(200, 0) )
            .settings.add(415,75, newText("labeRight", "Completely natural").settings.bold() )
            .print()   
        ,
        newText("warning","Please select a response.")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Next question.")
            .settings.center() 
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                          )
                 )        

    ).log("Expt", item.Expt)
    .log("ExptType", item.ExptType)
    .log("ItemName", item.ItemName)
    .log("Tense", item.Tense)
    .log("polarity", item.polarity)
    .log("EmbPred", item.EmbPred)
    .log("lemma", item.lemma)
    .log("SpActAdverb", item.SpActAdverb)
    .log("Group", item.Group)
    .log("Item", item.Item)
    .log("NoExpt", item.NoExpt)
    .log("EmbCondition", item.EmbCondition)
    .log("StimUnmarked", item.StimUnmarked)
    .log("mcpred", item.mcpred)
//    .log("StimArgfront", item.StimArgfront)
//    .log("StimAdjunct", item.StimAdjunct)
//    .log("StimSpActAdv", item.StimSpActAdv)
);





