cc.Node.prototype.jumpTo = function(targetPos, height, duration, callback) {
    this.new_tween_postion = cc.v2();
    //跳高
    this.startPosY = 0;
    this.jump_y = 0;
    this.jump_state = undefined;
    const y_tween = cc.tween().call(()=>{
        this.startPosY = this.position.y;
        this.jump_y = 0;
        this.jump_state = 0;
    }).to(duration/2,{jump_y:height},{
        easing:'quadOut',
    }).call(()=>{
        this.jump_y = 0;
        this.jump_state = 1;
    }).call(()=>{
        this.startPosY = this.position.y;
    }).to(duration/2, {jump_y:height}, {
        easing:'quadIn'
    }).call(()=>{
        this.jump_y = 0;
        this.jump_state = undefined;
    }).union();

    // 修正y 落点
    this.jump_offset_y = 0;
    this.offsetY = 0;
    const offset_y_tween = cc.tween().call(()=>{
        this.offsetY = targetPos.y - this.position.y;
        this.jump_offset_y = 0;
    }).to(duration, {jump_offset_y: 0.5}, {easing:'quadOut'})
    .call(()=>{
        this.jump_offset_y = 0;
        this.offsetY = 0;
    });





    //跳远
    this.jump_x = this.position.x;
    const x_tween = cc.tween().to(duration,{jump_x:targetPos.x});

    return cc.tween(this).parallel(y_tween,offset_y_tween,x_tween);
};