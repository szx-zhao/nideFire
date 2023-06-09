const Base = require('./base.js');
// 控制器模块的认证控制器，主要包含两个方法：loginByWeixinAction和logoutAction

module.exports = class extends Base {
  /**
   * loginByWeixinAction方法用于微信登录授权，首先获取用户的code和userInfo，
   * 然后调用weixin服务的login方法进行登录验证，
   * 如果验证通过，则根据用户的openid查找是否已经注册，
   * 如果没有注册，则进行注册，注册成功后返回用户信息和生成的token。
   * 如果已经注册，则直接返回用户信息和生成的token。
  */
  async loginByWeixinAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const clientIp = this.ctx.ip;

    // 解释用户数据
    const { errno, errmsg, data: userInfo } = await this.service('weixin', 'api').login(code, fullUserInfo);
    if (errno !== 0) {
      return this.fail(errno, errmsg);
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('user').where({ weixin_openid: userInfo.openId }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('user').add({
        username: '微信用户' + think.uuid(6),
        password: '',
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        mobile: '',
        weixin_openid: userInfo.openId,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName
      });
    }

    // 授权模块的控制器中，查询用户信息
    /**
     * ThinkJS框架中的ORM（对象关系映射）功能，通过调用this.model('user')来获取到用户模型，
     * 然后使用.field()方法指定需要查询的字段，
     * .where()方法指定查询条件，最后使用.find()方法执行查询操作。
     * 这里查询了用户的id、用户名、昵称、性别、头像和生日等信息，查询条件是id等于传入的userId。查询结果会被赋值给newUserInfo变量。 
     * 
     * 在ThinkJS中，每个模型都对应着一个数据表，而用户模型对应的数据表就是名为"user"的表。
     * 因此，当调用this.model('user')时，它会自动连接到名为"user"的数据表，然后可以使用模型提供的方法来进行增删改查等操作。
    */


    const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

    // 更新登录信息
    await this.model('user').where({ id: userId }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: userId });

    if (think.isEmpty(sessionKey)) {
      return this.fail('生成 token 失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }

  async logoutAction() {

    //ogoutAction方法用于退出登录，直接返回成功信息。 

    return this.success();
  }
};
