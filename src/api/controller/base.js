module.exports = class extends think.Controller {
//控制器的基础控制器类


  async __before() {

    // 根据token值获取用户id，用于处理用户请求前的一些操作。
    this.ctx.state.token = this.ctx.header['x-nideshop-token'] || '';
    const tokenSerivce = think.service('token', 'api');
    this.ctx.state.userId = await tokenSerivce.getUserId(this.ctx.state.token);

  //在请求前，它会根据请求头中的token值获取用户id，并将其存储在上下文对象中。
  //然后，它会检查当前控制器和操作是否为公开的，如果不是，则验证用户是否已登录。

    const publicController = this.config('publicController');
    const publicAction = this.config('publicAction');
    // 如果为非公开，则验证用户是否登录
    const controllerAction = this.ctx.controller + '/' + this.ctx.action;
    if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
      if (this.ctx.state.userId <= 0) {

        //如果用户未登录，则返回一个401错误。
        return this.fail(401, '请先登录');
      }
    }
  }

  /**
   * 获取时间戳，还提供了获取时间戳和当前登录用户id的方法
   * @returns {Number}
   */
  getTime() {
    return parseInt(Date.now() / 1000);
  }

  /**
   * 获取当前登录用户的id
   * @returns {*}
   */
  getLoginUserId() {
    return this.ctx.state.userId;
  }
};
