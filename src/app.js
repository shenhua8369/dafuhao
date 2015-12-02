
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.MainScene_json);
        this.root = mainscene.node;
        this.addChild(mainscene.node);

        //var layer = new ChooseLayer();
        //this.addChild(layer);

        this.setInfo();
        this.setBuilds();
        return true;
    },
    setInfo:function(){
        var Panel_user = ccui.helper.seekWidgetByName(this.root,"Panel_user");
        var img = Panel_user.getChildByName("Image_head");
        var userName = Panel_user.getChildByName("Text_name");
        var rank = Panel_user.getChildByName("Text_rank");
        userName.setString("姓名："+Global.ownerName);
        rank.setString("排名："+ Global.rank);

        var Panel_assets = ccui.helper.seekWidgetByName(this.root,"Panel_assets");
        var assetsNum = Panel_assets.getChildByName("Text_num");
        assetsNum.setString("资产：" + Global.assets);

        var Panel_diamond = ccui.helper.seekWidgetByName(this.root,"Panel_diamond");
        var diamondNum = Panel_diamond.getChildByName("Text_num");
        diamondNum.setString(Global.diamond);

        var Panel_cash = ccui.helper.seekWidgetByName(this.root,"Panel_cash");
        var cashNum = Panel_cash.getChildByName("Text_num");
        cashNum.setString(Global.cash);

        var Panel_threat = ccui.helper.seekWidgetByName(this.root,"Panel_threat");
        var threatNum = Panel_threat.getChildByName("Text_num");
        threatNum.setString(Global.threat);


    },
    setBuilds:function(){
        var buildView = ccui.helper.seekWidgetByName(this.root,"PageView_build");
        var _buildItm = ccui.helper.seekWidgetByName(this.root,"Panel_build");
        var arr = Global.buildArr;
        for(var i = 0;i<arr.length;i++){
            var data = arr[i];
            var buildItem = _buildItm.clone();
            var info = ccui.helper.seekWidgetByName(this.root,"Panel_buildInfo");
            var level = info.getChildByName("Text_level");
            var name = info.getChildByName("Text_name");
            var profit = info.getChildByName("Text_profit");
            var total = info.getChildByName("Text_total");
            var threat = info.getChildByName("Text_threat");

            level.setString("LV:" + data["level"]);
            name.setString(data["name"]);
            profit.setString("利润："+data["profit"]+"/分钟");
            total.setString("最大收入：" + data["total"]);
            threat.setString("威胁值：" + data["threat"]);

            buildView.addPage(buildItem);
        }

        var buildItem = _buildItm.clone();
        buildView.addPage(buildItem);
    },
    setBtns:function(){

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

