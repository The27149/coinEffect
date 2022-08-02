
import Coin from "./Coin";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinBox extends cc.Component {

    @property({ type: cc.Prefab })
    coinPre: cc.Prefab = null;

    @property({ tooltip: '生成金币的时间间隔 ms' })
    interval: number = 60;

    @property({ tooltip: '水平加速度，向右为正' })
    g_x: number = 100;

    @property({ tooltip: '重力加速度，向上为正' })
    g_y: number = -1300;

    //初始速度范围
    @property({ tooltip: '最小初始速度 px/s' })
    speed_min: number = 1000;

    @property({ tooltip: '最大初始速度 px/s' })
    speed_max: number = 1300;

    //初始角度范围 0 - 360
    @property({ tooltip: '最小入射角度 与x轴的逆时针夹角' })
    angle_min: number = 110;

    @property({ tooltip: '最大入射角度 与x轴的逆时针夹角' })
    angle_max: number = 160;

    @property(cc.Boolean)
    isOpenCollider: boolean = false;

    //金币对象池
    coinPool: cc.NodePool = null;

    coinConfig: any = null;
    coinSpriteFrames: cc.SpriteFrame[] = null;

    onLoad() {
        if (this.isOpenCollider) {
            let collisionMgr = cc.director.getCollisionManager();
            collisionMgr.enabled = true;
        }
        this.coinPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; i++) {
            let coin = this.createCoin();
            this.coinPool.put(coin);
        }
    }

    setCoinAniConfig(config: any): void {
        this.coinConfig = config;
    }

    private addCoinAnimation(coin: cc.Node, spriteFrames: cc.SpriteFrame[]): void {
        let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 60);
        clip.name = "Animation";
        clip.speed = 0.2;
        clip.wrapMode = cc.WrapMode.Loop;
        let animation = coin.addComponent(cc.Animation);
        animation.defaultClip = clip;
        animation.addClip(clip);
        animation.playOnLoad = true;
        animation.play("Animation");

    }

    private createCoin(): cc.Node {
        if (!this.coinConfig) {
            let coin = cc.instantiate(this.coinPre);
            return coin;
        } else {
            let coin = new cc.Node();
            let url = this.coinConfig.imageUrl;
            let sprite = coin.addComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SIMPLE;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            coin.addComponent(Coin);
            if (this.coinSpriteFrames) {
                this.addCoinAnimation(coin, this.coinSpriteFrames);
                return coin;
            }
            // if (url) {
            //     if (typeof url == "string") {
            //         game.ResLoader.getInstance().loadRes(url, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            //             if (!err) {
            //                 let spriteFrames = atlas.getSpriteFrames();
            //                 if (!this.coinSpriteFrames) {
            //                     this.coinSpriteFrames = spriteFrames;
            //                 }
            //                 this.addCoinAnimation(coin, spriteFrames);
            //             }
            //         }, this.coinConfig.bundle, "coinAnimation");

            //     } else {
            //         game.ResLoader.getInstance().loadRes(url, cc.SpriteFrame, (err: Error, spriteFrames: cc.SpriteFrame[]) => {
            //             if (!err) {
            //                 if (!this.coinSpriteFrames) {
            //                     this.coinSpriteFrames = spriteFrames;
            //                 }
            //                 this.addCoinAnimation(coin, spriteFrames);
            //             }
            //         }, this.coinConfig.bundle, "coinAnimation");
            //     }
            //     return coin;
            // }
        }

    }

    start() {
        this.play();
        // this.scheduleOnce(() => {
        //     this.stop();
        // }, 5)
    }

    /**
     * 播放金币特效
     */
    play() {
        this.node.active = true;
        let t = this.interval / 1000;
        this.schedule(this.createCoins, t);

    }

    /**
     * 停止金币特效
     */
    stop() {
        this.unschedule(this.createCoin);
        for (let coin of this.node.children) {
            this.coinPool.put(coin);
        }
        this.node.active = false;
    }

    private createCoins() {
        let coin: cc.Node = null;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get();
        } else {
            coin = this.createCoin();
        }
        coin.parent = this.node;
        let option = {};
        option['coinPool'] = this.coinPool;
        option['initSpeed'] = this.getRandom(this.speed_min, this.speed_max);
        option['initAngle'] = this.getRandom(this.angle_min, this.angle_max) * Math.PI / 180;
        option['g_x'] = this.g_x;
        option['g_y'] = this.g_y;
        option['rotation'] = this.getRandom(0, 360);

        coin.getComponent(Coin).init(option);
    }

    private getRandom(min: number, max: number): number {
        let v = Math.random() * (max - min) + min;
        return v;
    }

}
