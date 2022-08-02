

const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    //y轴碰撞阻尼
    private damping_y: number = 0.7;

    //水平加速度
    private g_x: number = 0;

    //重力加速度
    private g_y: number = 0;

    //缩放范围
    // scale_min: number = 0.8;
    // scale_max: number = 1;

    //初始x速度
    private initSpeed_x: number = 0;

    //初始y速度
    private initSpeed_y: number = 0;

    private speed_x: number = 0;
    private speed_y: number = 0;

    //运动时间
    private t: number = 0;

    //父节点全局坐标
    private parentWorldPos: cc.Vec2 = null;

    //节点池
    private coinPool: cc.NodePool = null;

    //根结点
    private rootNode: cc.Node = null;

    init(option: any) {
        this.coinPool = option.coinPool;

        this.initSpeed_x = option.initSpeed * Math.cos(option.initAngle);
        this.initSpeed_y = option.initSpeed * Math.sin(option.initAngle);
        this.g_x = option.g_x;
        this.g_y = option.g_y;

        this.t = 0;
        this.node.setPosition(0, 0);
        this.node.angle = option.rotation;

    }

    onLoad() {
        this.rootNode = cc.Canvas.instance.node;
    }

    onEnable() {
        this.speed_x = this.initSpeed_x;
        this.speed_y = this.initSpeed_y;
        this.parentWorldPos = this.node.parent.convertToWorldSpaceAR(cc.v2(0, 0));
    }

    update(dt) {


        if (this.speed_x * this.initSpeed_x < 0) {
            this.speed_x = 0;
        } else {
            this.speed_x += this.g_x * dt;
            this.node.x += this.speed_x * dt;
        }

        this.speed_y += this.g_y * dt;
        this.node.y += this.speed_y * dt;




        // this.t += dt;
        // let temp = 0.5 * this.t * this.t;
        // let x = this.initSpeed_x * this.t + this.g_x * temp;
        // let y = this.initSpeed_y * this.t + this.g_y * temp;
        // this.node.setPosition(x, y);

        let x_min = -this.parentWorldPos.x,
            x_max = this.rootNode.width + x_min,
            y_min = -this.parentWorldPos.y;
        let conditions = [this.node.y < y_min, this.node.x < x_min, this.node.x > x_max];
        if (conditions.indexOf(true) >= 0) {
            this.coinPool.put(this.node);
        }
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        console.log('-----碰撞产生');
        this.speed_y = -this.speed_y * this.damping_y;


    }




}
