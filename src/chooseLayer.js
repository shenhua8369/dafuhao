/**
 * Created by liuqiang on 15/11/30.
 */
var ChooseLayer = cc.Layer.extend({

    label:null,
    winSize:null,
    ctor:function(){
        this._super();

        this.ids = {};
        this.unused_sprites = [];

        this.winSize = cc.winSize;

        this.label = new cc.LabelTTF("x:0,y:0");
        this.addChild(this.label);

        //this.touchEvent();


        this.sprite = new cc.Sprite("res/Default/ImageFile.png");
        this.sprite.x = this.winSize.width/2;
        this.sprite.y = this.winSize.height/2;
        this.sprite.scale = 4;
        this.addChild(this.sprite);

        this.mouserEvent();
        this.scheduleUpdate();

    },
    touchEvent:function(){
        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded,
                onTouchCancelled: this.onTouchCancelled
            }, this);
        } else {
            cc.log("TOUCH-ONE-BY-ONE test is not supported on desktop");
        }
    },
    new_id:function( id, pos) {
        var s = this.unused_sprites.pop();
        this.ids[ id ] = s;
        s.x = pos.x;
        s.y = pos.y;
    },
    update_id:function(id, pos) {
        var s = this.ids[ id ];
        s.x = pos.x;
        s.y = pos.y;
    },
    release_id:function(id, pos) {
        var s = this.ids[ id ];
        this.ids[ id ] = null;
        this.unused_sprites.push( s );
        s.x = 0;
        s.y = 0;
    },
    onTouchBegan:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchBegan at: " + pos.x + " " + pos.y + " Id:" + id );
        if( pos.x < winSize.width/2) {
            event.getCurrentTarget().new_id(id,pos);
            return true;
        }
        return false;
    },
    onTouchMoved:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchMoved at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().update_id(id,pos);
    },
    onTouchEnded:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchEnded at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().release_id(id,pos);
    },
    onTouchCancelled:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchCancelled at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().update_id(id,pos);
    },

    startPos:null,
    currPos:null,
    endPos:null,
    distance:null,
    isClick:false,
    oldPos:null,
    nowPos:null,
    oldTime:null,
    nowTime:null,
    speed:0,
    nowAngle:0,
    mouserEvent:function(){
        var self = this;
        if( 'mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    if(event.getButton() === cc.EventMouse.BUTTON_RIGHT)
                        cc.log("onRightMouseDown at: " + pos.x + " " + pos.y );
                    else if(event.getButton() === cc.EventMouse.BUTTON_LEFT)
                        cc.log("onLeftMouseDown at: " + pos.x + " " + pos.y );
                    //target.sprite.x = pos.x;
                    //target.sprite.y = pos.y;
                    self.startPos = pos;
                    self.isClick = true;
                    self.nowAngle = self.sprite.getRotation();
                },
                onMouseMove: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    //cc.log("onMouseMove at: " + pos.x + " " + pos.y );
                    //target.sprite.x = pos.x;
                    //target.sprite.y = pos.y;
                    if(self.isClick){
                        self.nowPos = pos;
                        self.nowTime = new Date().getTime();
                        if(self.oldPos){
                            self.speed = (self.nowPos.x - self.oldPos.x)/(self.nowTime - self.oldTime);
                            cc.log("speed",self.speed);
                        }
                        self.oldPos = self.nowPos;
                        self.oldTime = self.nowTime;

                        self.distance = self.nowPos.x - self.startPos.x;
                        self.rotateImg();
                    }



                    //if(self.isClick){
                    //    //self.currPos = pos;
                    //    self.distance = self.currPos.x - self.startPos.x;
                    //    self.rotateImg();
                    //}
                    //else{
                    //    self.distance = 0
                    //}
                },
                onMouseUp: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    //target.sprite.x = pos.x;
                    //target.sprite.y = pos.y;
                    self.isClick = false;
                    self.oldPos = null;
                    self.oldTime = null;
                    //self.speed = 0;
                    self.distance = 0;
                    self.rotateImgEnd();
                    self.rotateEnd = true;
                    //self.endPos = pos;
                    cc.log("onMouseUp at: " + pos.x + " " + pos.y );
                }
            }, this);
        } else {
            cc.log("MOUSE Not supported");
        }
    },
    rotateImg:function(){
        var distance = this.distance;
        var sprite = this.sprite;

        cc.log("当前角度：",sprite.getRotation());
        var angle = 180*distance/640 + this.nowAngle;

        sprite.setRotation(angle);
    },
    rotateImgEnd:function(){
        //var sprite = this.sprite;
        //var time = this.speed*0.01;
        this.angleSpeed = this.speed*3;
        //var action = new cc.RotateBy(time,angle);
        //sprite.runAction(action);
        this.speed = 0;

    },
    angleSpeed:0,
    rotateEnd:false,
    update:function(dt){
        if(this.rotateEnd == true){
            var sprite = this.sprite;
            sprite.setRotation(sprite.getRotation() + this.angleSpeed);
            if(this.angleSpeed>0){
                this.angleSpeed-=2;
            }else if(this.angleSpeed <0){
                this.angleSpeed+=2;
            }
            if(this.angleSpeed>-1&&this.angleSpeed<1){
                this.angleSpeed = 0;
                this.rotateEnd = false;
            }
        }

    }

})