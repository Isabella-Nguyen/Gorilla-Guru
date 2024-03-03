//Initialize fabric canvas
var canvas = new fabric.Canvas('whiteboard');

var onSolidRect = function () {
         var rect = new fabric.Rect({ 
                         top: 100,
                         left: 100,
                         width: 60,
                         height: 70,
                         fill: '',
                         selection: false,
                         fill: '#f55', 
                         });
        canvas.add(rect);
         }

var removeSelected = function(){
	var obj = canvas.getActiveObject();
	if(obj)
		canvas.remove(obj);
}

//Create mesibo users and obtain credentials at mesibo.com/console
var demo_users = [ 
        {
                'token' : 'xxx'
                , 'uid' : 0
        },

        {
                'token' : 'xxx'
                , 'uid' : 0
        },
] 

var uIndex = prompt('Select user: 0, 1', 0);
var selected_user = demo_users[uIndex];

//Initialize mesibo
const MESIBO_APP_ID = 'xxx';
const MESIBO_ACCESS_TOKEN = selected_user.token;
const MESIBO_USER_UID = selected_user.uid; 
const MESIBO_GROUP_ID = 0; //Create a group and add members(demo_users)
const TYPE_CANVAS_MESSAGE = 7;

function MesiboListener() {
}

MesiboListener.prototype.Mesibo_OnConnectionStatus = function(status, value) {
          console.log("TestNotify.prototype.Mesibo_OnConnectionStatus: " + status);
}

MesiboListener.prototype.Mesibo_OnMessageStatus = function(m) {
         console.log("TestNotify.prototype.Mesibo_OnMessageStatus: from " 
                         + m.peer + " status: " + m.status);
}
var api = new Mesibo();
api.setAppName(MESIBO_APP_ID);
api.setListener(new MesiboListener());
api.setCredentials(MESIBO_ACCESS_TOKEN);
api.start();

function sendObjectToGroup(pObject){
         var m = {};
         m.id = api.random();
         m.groupid = MESIBO_GROUP_ID;
         m.flag = MESIBO_FLAG_DEFAULT;
         m.type = TYPE_CANVAS_MESSAGE;
         m.message = JSON.stringify(pObject); 
         api.sendMessage(m, m.id, m.message);
}

function getObjectFromId(ctx, id){
         var currentObjects = ctx.getObjects();
         for (var i = currentObjects.length - 1; i >= 0; i-- ) {
                 if(currentObjects[i].id == id)
                         return currentObjects[i];
         }
        return null;
}

function Board_OnSync(_canvas, obj){
        var existing = getObjectFromId(_canvas, obj.id);
        console.log(existing);  
	
	if(obj.removed){
		if(existing){
			canvas.remove(existing);
		}
		return;
	 }

	if(existing){
                 existing.set(obj); 
                }
	else{
		if(obj.type === 'rect'){
			_canvas.add(new fabric.Rect(obj));
		}
	}
	_canvas.renderAll();
}

MesiboListener.prototype.Mesibo_OnMessage = function (m) { 
	if(m && m.type === TYPE_CANVAS_MESSAGE && m.groupid && m.message){
		var syncObj = JSON.parse(m.message);
		Board_OnSync(canvas, syncObj);
		return;
	}
}

canvas.on('object:added', function(options) {
	if (options.target) {
		var obj = options.target; 
		if(obj.type == 'rect'){
			console.log('You added a rectangle!');
		}
		if(!obj.id){
			// If object created by you, initially id will be undefined
			// Set the id and sync object
			obj.set('id', Date.now() + '-' + MESIBO_USER_UID);
			obj.toJSON = (function(toJSON) {
				return function() {
					return fabric.util.object.extend(toJSON.call(this), {
						id: this.id,
					});
				};
			})(obj.toJSON);
			sendObjectToGroup(obj);
		}
	} 
});

canvas.on('object:removed', function(options) {
	if (options.target) {
		var obj = options.target;	         
		if(obj.removed)
			return; //Object already removed

		obj.set('removed', true);
		obj.toJSON = (function(toJSON) {
			return function() {
				return    fabric.util.object.extend(toJSON.call(this), {
					id: this.id,
					uid: this.uid,
					removed: this.removed 
				});
			};
		})(obj.toJSON);

		sendObjectToGroup(obj);   
	}
});