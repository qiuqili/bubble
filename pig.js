window.addEventListener('load', interactive);//window is not createjs structure.so only can use addEventListener

function interactive() {
// 	var scaling = "fit"; // fit scales to fit the browser window while keeping the aspect ratio
// var width = 1300;
// var height = 1000;
// var frame = new zim.Frame(scaling, width, height);

	var stage=new createjs.Stage("myCanvas");//which canvas?pass the ionformation as parameter
	stage.enableMouseOver(10); //store a stage class.also a function  ,check the stage 10 times per second
	var stageW=stage.canvas.width;
	var stageH=stage.canvas.height;

	createjs.MotionGuidePlugin.install();
	

	var imagePath="img/";
	var manifest=[{id:"pig",src:"pig.png"},{id:"bubble",src:"bubble.png"},{id:"branch",src:"branch.png"},{id:"yea",src:"2.png"},{id:"pop",src:"pu.wav",data:2},{id:"fly",src:"red.mp3",data:1},{id:"burst",src:"balloon.wav",data:1}];
	var preload=new createjs.LoadQueue(false,imagePath);
	preload.installPlugin(createjs.Sound);
	preload.loadManifest(manifest);
	
	preload.on("complete",startApp);

	


	function startApp (){


		var girl=new createjs.Bitmap("img/pig.png");
		girl.regX = girl.getBounds().width / 2;
		girl.regY = girl.getBounds().height / 2;
		girl.x = stageW / 2;
		girl.y = stageH-girl.getBounds().height+180;
		
	 	stage.addChild(girl); 
		zim.drag(girl);
		var girlBubble = false;//girl not inside the bubble



		var bubble;
		var posX;
		var posY;
		var bubbles = [];
		for(i=0;i<5;i++){
			bubble=new createjs.Bitmap("img/bubble.png");
		 	stage.addChild(bubble); 
			zim.drag(bubble);
			bubble.regX = bubble.getBounds().width / 2;
			bubble.regY = bubble.getBounds().height / 2;
			bubble.scaleX=0.4;
			bubble.scaleY=0.4;
			bubble.name = "bubble" + i;
			bubble.x= Math.random()*1000;
			bubble.y= Math.random()*800;
			bubbles.push(bubble);
			bubble.path = [bubble.x,bubble.y];
			for (var p = 2; p < 18; p++) {
				bubble.path[p] = Math.random()*stageW;
			}
			bubble.path.push(100);
			bubble.path.push(100);
			bubble.path.push(bubble.x);
			bubble.path.push(bubble.y);
			bubble.animation = createjs.Tween.get(bubble, {loop:true}).to({guide:{path: bubble.path}}, 200000);
			bubble.on("mousedown", function(e){
				createjs.Tween.removeTweens(e.target);
				

			});
			bubble.on("pressup", function(e){
				e.target.path = [e.target.x,e.target.y];
				for (var p = 2; p < 18; p++) {
					e.target.path[p] = Math.random()*stageW;
				}
				createjs.Tween.get(e.target).to({guide:{path:e.target.path}}, 200000);
			});
			bubble.on("dblclick", function(e){
				if (girlBubble){
					stage.removeChild(bubbles[0]);
					bubbles = [];
					
					createjs.Tween.get(girl).to({y: stageH-girl.getBounds().height+180}, 2000, createjs.Ease.bounceOut);
					createjs.Sound.stop("fly");
					createjs.Sound.play("pop");
				}
			});
		}

		var branches = [];
 		for(i=0;i<2;i++){
		var branch=new createjs.Bitmap("img/branches.png");
	 	stage.addChild(branch); 
	 	branches.push(branch)
	}
	branches[0].x=-100;
	branches[1].y=1000;
	branches[1].x=1050;
	branches[1].rotation=180;		
	
    		
    	createjs.Ticker.on("tick", function(){
    		for (var u = 0; u < bubbles.length; u++) {
	    		if (bubbles[u].scaleX >=2 && zim.hitTestCircle(bubbles[u], girl)) {
					girlBubble = true;
				} else {
					for (var b = 0; b < bubbles.length; b++) {
						if (bubbles[b].name != bubbles[u].name) {
							if (zim.hitTestCircle(bubbles[u], bubbles[b])) {
								bubbles[u].scaleX = bubbles[u].scaleX + bubbles[b].scaleX;
								bubbles[u].scaleY = bubbles[u].scaleY + bubbles[b].scaleY;
								
								bubbles[u].x = (bubbles[u].x + bubbles[b].x) / 2;
								bubbles[u].y = (bubbles[u].y + bubbles[b].y) / 2;
								stage.removeChild(bubbles[b]);
								bubbles.splice(b,1);
								bubbles[u].getBounds();
								createjs.Sound.play("pop");
							}
						}
					}
				}
			}
    		if (girlBubble && bubbles[0]) { //girl follow the bubble
    				
    				girl.x = bubbles[0].x;
    				girl.y = bubbles[0].y;
    				createjs.Sound.play("fly");

    				


    		}
    		for (var i = 0; i < branches.length; i++){ //branches hit the bubble
	    		if (girlBubble && zim.hitTestCircle(branches[i],bubbles[0])) {

	    			stage.removeChild(bubbles[0]);
					bubbles = [];
					
					createjs.Tween.get(girl).to({y: stageH-girl.getBounds().height+180}, 2000, createjs.Ease.bounceOut);
					createjs.Sound.stop("fly");
					createjs.Sound.play("pop");
	    		}
			}

			

    		stage.update();
    	});
	


	}




 }
