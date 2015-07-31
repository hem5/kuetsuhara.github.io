var self = this;


function qrCreate(){

	var ipAddress = $('#socketServerIP').val();
	var portNumber = $('#socketServerPort').val();

	var jsonText = 	'{"ip":"' +
									ipAddress +
									'","port":' +
									portNumber +
									'}'
	console.log(jsonText)
	$('#qrcodeCanvas').empty();


	$('#qrcodeCanvas').qrcode({
		text	: jsonText
	});
}

function connect(){
	// 入力されたpepperのIPアドレスを取得
	var pepperIp = $("#pepperIP").val();

	// 接続が成功したら、各種プロキシを作成して代入しておく
    var setupIns_ = function(){
    	self.qims.service("ALTextToSpeech").done(function(ins){
    		self.alTextToSpeech = ins;
        });
        self.qims.service("ALAnimatedSpeech").done(function(ins){
    		self.alAnimatedSpeech = ins;
        });
        self.qims.service("ALMotion").done(function(ins){
        	self.alMotion = ins;
        });
        self.qims.service("ALBehaviorManager").done(function(ins){
        	self.alBehavior = ins;
        });
    	self.qims.service("ALAutonomousLife").done(function(ins){
    		self.alAutonomousLife = ins;
        });
        self.qims.service("ALAudioDevice").done(function(ins){
            self.alAudioDevice = ins;
            self.alAudioDevice.getOutputVolume().done(function(val){
		    self.showAudioVolume(val);
		    });
        });
        self.qims.service("ALMemory").done(function(ins){
    		self.alMemory = ins;

    		// メモリ監視
    		qimessagingMemorySubscribe();
        });
		self.qims.service("ALFaceDetection").done(function(ins){
			self.alFaceDetection = ins;
		});
		self.qims.service("ALTabletService").done(function(ins) {
			self.alTabletService = ins;
		});
		self.qims.service("ALVideoDevice").done(function(ins) {
			self.alVideoDevice = ins;
		});
		self.qims.service("ALBasicAwareness").done(function(ins) {
			self.alBasicAwareness = ins;
		});
    }

	// pepperへの接続を開始する
	self.qims = new QiSession(pepperIp);
	self.qims.socket()
		// 接続成功したら
		.on('connect', function() {
   	 		self.qims.service("ALTextToSpeech")
   	 			.done(function (tts) {
   	 	        	//tts.say("接続、成功しました");
				});

			// 接続成功したら各種セットアップを行う
			setupIns_();

			// 接続成功表示切り替え
			$(".connectedState > .connected > .connectedText").text("接続成功");
			$(".connectedState > .connected > .glyphicon").removeClass("glyphicon-remove");
			$(".connectedState > .connected > .glyphicon").addClass("glyphicon-signal");
			$(".connectedState > .connected").css("color","Blue");
	    })
     	// 接続失敗したら
        .on('disconnect', function () {
        	//self.nowState("切断");
		});
}


function showAudioVolume(val){
	console.log(val);
	// あとからページに表示させる
	$("#pepperVolume").val(val);
}

function changeAudioVolume(){
	var volume = $("#pepperVolume").val();
	volume = Number(volume);
	console.log(Number(volume));
	self.alAudioDevice.setOutputVolume(volume);
	self.hello();

}


// 動作確認用Hello
function hello(){
	console.log("hello");
	this.alAnimatedSpeech.say("はろー");

}

// おしゃべり
function say(){
	console.log("say");
	var value = $("#sayText").val();
	this.alTextToSpeech.say(value);
}

// 動きながらおしゃべり
function animatedSay(){
	console.log("say");
	var value = $("#animatedSayText").val();
	this.alAnimatedSpeech.say(value);
}


// 移動
function move(to){
	if (self.alMotion){
		console.log("move to");
		switch (to){
			case 0:
				self.alMotion.moveTo(0, 0, 0.5).fail(function(err){console.log(err);});
				break;

			case 1:
				self.alMotion.moveTo(0, 0, -0.5).fail(function(err){console.log(err);});
				break;

			case 2:
				self.alMotion.moveTo(0.3, 0, 0).fail(function(err){console.log(err);});
				break;

			case 3:
				self.alMotion.moveTo(-0.3, 0, 0).fail(function(err){console.log(err);});
				break;
			case 4:
				self.alMotion.moveTo(0, 0, 0).fail(function(err){console.log(err);});
				break;

		}
	}
}

// ビヘイビアアクション
function action(num){
	switch (num){
		case 0:
			self.alBehavior.stopAllBehaviors();
			break;
		case 1:
			self.alBehavior.runBehavior("animation-5ffd19/HighTouch");
			break;
		case 2:
			self.alBehavior.runBehavior("pepper_self_introduction_waist_sample/.");
			break;
		case 3:
			self.alBehavior.runBehavior("pepper_tongue_twister_sample/.");
			break;
		case 4:
			self.alBehavior.runBehavior("animations/Stand/Emotions/Positive/Laugh_1");
			break;
		case 5:
			self.alBehavior.runBehavior("animations/Stand/Emotions/Negative/Sad_1");
			break;
		case 6:
			self.alBehavior.runBehavior("animations/Stand/Gestures/ComeOn_1");
			break;
		case 7:
			self.alBehavior.runBehavior("pepper_anim_sample/d-110-owata");
			break;
		case 8:
			self.alBehavior.runBehavior("pepper_anim_sample/d-110-glad-3");
			break;
		case 9:
			self.alBehavior.runBehavior("animations/Stand/Gestures/Angry_1");
			break;

	}
}

function autonomousSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("solitary");

	}else
	{
		console.log("OFF");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("disabled");
	}
}

function sleepSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alMotion.wakeUp();

	}else
	{
		console.log("OFF");
		self.alMotion.rest();
	}
}


function qimessagingMemoryEvent(){
	console.log("push!");
	self.alMemory.raiseEvent("PepperQiMessaging/Hey", "1");
}

function qimessagingMemorySubscribe(){
	console.log("subscriber!");
	self.alMemory.subscriber("PepperQiMessaging/Reco").done(function(subscriber) {
		subscriber.signal.connect(toTabletHandler);
	});
	self.alMemory.subscriber("ALMotion/MoveFailed").done(function(subscriber) {
		subscriber.signal.connect(function() {
			console.log("ALMotion/MoveFailed");
			console.log(arguments);
		});
	});
}


function toTabletHandler(value) {
	console.log("PepperQiMessaging/Recoイベント発生: " + value);
	$(".memory").text(value);
}

function learnFace() {
	var faceLabel = "faceLabel";
	self.alFaceDetection.learnFace(faceLabel)
		.done(function(data) {
			// 成功
			console.log("success : " + data);

		})
		.fail(function() {
			// 失敗
			console.log("fail");

		});
}

function recognizeFace() {
	self.alMemory.subscriber("FaceDetected")
		.done(function(subscriber) {
			subscriber.signal.connect(
				function(value) {
					if(value && value.length > 2 && value[1] > 0){
						var ary = value[1];
						var timeFilteredResult = ary[ary.length - 1];
						// get the ALValue returned by the time filtered recognition:
						//    - [] when nothing new.
						//    - [4] when a face has been detected but not recognized during the first 8s.
						//    - [2, [faceName]] when one face has been recognized.
						//    - [3, [faceName1, faceName2, ...]] when several faces have been recognized.
						if (timeFilteredResult.length === 0) {
							// nothing new
							console.log("nothing new");
						}
						else if (timeFilteredResult[0] === 4) {
							// onDetectWithoutReco
							console.log("detectd but no recognized");
							// TODO: 顔をカメラのほうを向けさせて、learnFace を実行する
						}
						else if (timeFilteredResult[0] === 2 || timeFilteredResult[0] === 3) {
							var faces = timeFilteredResult[1];
							console.log("faces : "+JSON.stringify(faces));
						}
					}
				}
			);
		});
}

function peopleList() {
	self.alMemory.subscriber("PeoplePerception/PeopleList")
		.done(function(subscriber) {
			subscriber.signal.connect(
				function(value) {
					console.log(value);
					debugger;
				}
			);
		});
}

function enableRecognizeFace() {
	self.alFaceDetection.setRecognitionEnabled(true)
		.done(function() {
			console.log("set recognition enabled : success");
		})
		.fail(function() {
			console.log("set recognition enabled : fail");
		});
}

function getLearnedFacesList() {
	self.alFaceDetection.getLearnedFacesList()
		.done(function(data) {
			console.log("getLearnedFacesList data : "+data);
		})
		.fail(function() {
			console.log("getLearnedFacesList failed.");
		});
}

function isTrackingEnabled() {
	self.alFaceDetection.isTrackingEnabled()
		.done(function(data) {
			console.log("isTrackingEnabled data : "+data);
		})
		.fail(function() {
			console.log("getLearnedFacesList failed.");
		});
}

function showInputTextDialog() {
	self.alTabletService.showInputTextDialog("hoge", "OK", "Cancel")
		.done(function() {
			console.log("showInputTextDialog.done : "+arguments);
		})
		.fail(function() {
			console.log("showInputTextDialog.fail : "+arguments);
		});
	self.alTabletService.onInputText.connect(function(validation, input) {
		console.log("validation : "+validation + ", input : " + input);
	});
}

function hideOnTablet() {
	console.log("alTabletService.hide do");
	self.alTabletService.hide()
		.done(function() {
			console.log("alTabletService.hide.done : "+arguments);
		})
		.fail(function() {
			console.log("alTabletService.hide.fail : "+arguments);
		});
}

function setTabletLanguageAsJa() {
	console.log("alTabletService.setTabletLanguageAsJa do");
	self.alTabletService.setTabletLanguage("ja")
		.done(function() {
			console.log("alTabletService.setTabletLanguageAsJa.done : "+arguments);
		})
		.fail(function() {
			console.log("alTabletService.setTabletLanguageAsJa.fail : "+arguments);
		});
}


SHORYAKU=true;
var TABLE={
	'none':'あいうえお','k':'かきくけこ','g':'がぎぐげご','s':'さxすせそ','z':'ざじずぜぞ','t':'たxxてと',
	'd':'だぢづでど','n':'なにぬねの','h':'はひxへほ','b':'ばびぶべぼ','p':'ぱぴぷぺぽ','m':'まみむめも',
	'y':'やxゆxよ','r':'らりるれろ','w':'わゐxゑを'
};
var CONSONANT={};
for (var key in TABLE) {
	var ary = TABLE[key].split('');
	for (var i = 0, len = ary.length; i < len ; ++i) {
		if (ary[i] === 'x') continue;
		CONSONANT[ary[i]] = key;
	}
}
CONSONANT['し']='sh';
CONSONANT['ち']='ch';
function isConsonant(s){ return /[cskgsztdnhbpmyrw]/.test(s); };
function isVowel(s){ return /[aiueo]/.test(s); };
function convToYAYUYO(str){ return 'ゃゅょ'.charAt('auo'.indexOf(str)); }
function romeToHiragana(str){
	var res='';
	if(SHORYAKU) str=str.replace(/(.)\^/g,function(_,a){
		//ここを変えることで「おうさか」府、「とおきょお」都問題をいじれる
		return a+a;//おおさか
		//return a+'u';//とうきょう
	});
	for(var i=0,_i=str.length;i<_i;i++){
		var possibleConsonant = str.charAt(i);
		if(isConsonant(possibleConsonant)){
			var consonant = possibleConsonant;
			var firstChar = str.charAt(i);
			var secondChar = str.charAt(i+1);
			var thirdChar = str.charAt(i+2);
			if(consonant==='m' && (secondChar==='b'||secondChar==='m'||secondChar==='p') || consonant==='n'&&isConsonant(secondChar)){
				//namba or kanno
				return res+'ん'+romeToHiragana(str.slice(i+1));
			}else if(firstChar===secondChar) {
				//促音
				return res+'っ'+romeToHiragana(str.slice(i+1));
			}else if(firstChar==='t'&&secondChar==='c'&&thirdChar==='h'){
				//特殊な促音
				res+='っち';
				res+=convToYAYUYO(str.charAt(i+3));
				return res+romeToHiragana(str.slice(i+4));
			}else if(secondChar==='y'){
				//kyotoのkyo部分
				res+=TABLE[firstChar].charAt(1);
				res+=convToYAYUYO(thirdChar);
				i+=2;
			}else{
				//普通の子音+母音
				var comp = str.slice(i,i+2);
				if(comp==='sh'||comp==='ch'){
					var vowel = str.charAt(i+2);
					if('auo'.indexOf(vowel)!==-1){
						res+=comp==='sh'?'し':'ち';
						res+=convToYAYUYO(vowel);
					}else{
						//sheは考慮しない
						res+=comp==='sh'?'し':'ち';
					}
					i+=2;
				}else{
					if(isVowel(str.charAt(i+1))){
						res+=TABLE[str.charAt(i)].charAt('aiueo'.indexOf(str.charAt(i+1)));
						i+=1;
					}else{
						throw 'unexpected '+str.slice(i);
					}
				}
			}
		}else if(isVowel(str.charAt(i))){
			res+='あいうえお'.charAt('aiueo'.indexOf(str.charAt(i)));
		}
		//撥音
	}
	return res;
};

function getImageRemote() {
	var handleBase = "camera0_0";
	var handle = handleBase + "_0";
	var video = self.alVideoDevice;
	var rawImageData;
	(function(){
		console.log("get subscriber");
		var d = $.Deferred();
		video.getSubscribers().done(function(list) {
			if (list.indexOf(handle) === -1) {
				video.subscribeCamera(handleBase, 0, 2, 11, 5).done(function(result) {
					handle = result;
					d.resolve();
				})
					.fail(function(){
						console.log(arguments);
						d.reject();
					});
			} else {
				d.resolve();
			}
		})
			.fail(function(){
				console.log(arguments);
				d.reject();
			});
		return d.promise();
	})().then(function(){
		console.log("get remote image data");
		var d = $.Deferred();
		video.getImageRemote(handle)
			.done(function(data){
				rawImageData = data;
				d.resolve();
			})
			.fail(function(){
				console.log(arguments);
				d.reject();
			});
		return d.promise();
	}).then(function() {
		console.log("draw image");
		var rawCharData = window.atob(rawImageData[6]);
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		var imageData = ctx.getImageData(0,0,640, 480);
		var idx = 0;
		for(var i = 0, len = imageData.data.length; i < len; ++i)
			( i % 4 !== 3 ) ? imageData.data[i] = rawCharData.charCodeAt(idx++) : imageData.data[i] = 255;
		ctx.putImageData(imageData, 0, 0);

		//var image = document.getElementById("image");
		//image.style.backgroundImage = "url(data:image/rgb;base64,"+rawImageData[6]+")";
	});
}

function onHumanTracked(personId) {
	console.log("onHumanTracked personId : "+personId);
	if (!self.hasOwnProperty("personIdList")){
		self.personIdList = [];
	}
	if (personId > 0 && self.personIdList.indexOf(personId) === -1) {
		self.personIdList.push(personId);
		//self.alAnimatedSpeech.say("こんにちわ")
		self.alTextToSpeech.say("こんにちわ")
			.done(function(){
				console.log(arguments);
			})
			.fail(function(msg){
				console.log(msg);
			});
	}
}

function startBasicAwareness() {
	console.log("start basic awareness");
	(function(){
		var d = $.Deferred();
		if (!self.hasOwnProperty("humanTrackdSubscriber")) {
			console.log("listen HumanTracked");
			self.alMemory.subscriber("ALBasicAwareness/HumanTracked")
				.done(function(subscriber){
					self.humanTrackedSubscriber = subscriber;
					subscriber.signal.connect(onHumanTracked);
					d.resolve();
				});
		} else {
			d.resolve();
		}
		return d.promise();
	})()
		.then(function(){
			var d = $.Deferred();
			console.log("check status.");
			self.alBasicAwareness.isAwarenessRunning()
				.done(function(result){
					if (result) {
						console.log("basic awareness is already running");
						d.reject();
					} else {
						d.resolve();
					}
				})
				.fail(function(msg) {
					console.log(msg);
					d.reject();
				});
			return d.promise();
		})
		.then(function() {
			var d = $.Deferred();
			console.log("basic awareness start.");
			self.alBasicAwareness.startAwareness()
				.done(function(){
					d.resolve();
				})
				.fail(function(msg) {
					console.log(msg);
					d.reject();
				});
			return d.promise();
		});
}

function stopBasicAwareness() {
	console.log("stop basic awareness");
	self.alBasicAwareness.stopAwareness()
		.done(function(){
			console.log("stopped");
		})
		.fail(function(msg) {
			console.log(msg);
		});
}

function disableStimulusDetection() {
	console.log("disableStimulusDetection");
	self.alBasicAwareness.setStimulusDetectionEnabled('Sound', false)
		.done(function(){

		})
		.fail(function(msg) {console.log(msg);});
	self.alBasicAwareness.setStimulusDetectionEnabled('Movement', false)
		.done(function(){

		})
		.fail(function(msg) {console.log(msg);});
	self.alBasicAwareness.setStimulusDetectionEnabled('People', false)
		.done(function(){

		})
		.fail(function(msg) {console.log(msg);});
	self.alMotion.setBreathEnabled('Body', false)
		.done(function() {

		})
		.fail(function(msg) {console.log(msg);});
}